import React, { useRef, useState, useEffect } from 'react';
import * as ort from 'onnxruntime-web';
import * as tf from '@tensorflow/tfjs';

// --- Model Configuration ---
const MODEL_INPUT_WIDTH = 640;
const MODEL_INPUT_HEIGHT = 640;
const CONFIDENCE_THRESHOLD = 0.25;
const IOU_THRESHOLD = 0.45;

const CLASS_NAMES = ['fresh', 'moldy'];
const CLASS_COLORS = ['#00FF00', '#FF0000']; // Green for fresh, Red for moldy

// --- Flask Server Configuration ---
// **IMPORTANT:** REPLACE THIS with the actual IP address of your Raspberry Pi 5
const FLASK_STREAM_URL = 'http://192.168.2.56:5000/video_feed';
const FRAME_FETCH_INTERVAL = 100; // Time in ms to wait between detection loops

export default function LiveWebcam() {
  const videoRef = useRef(null); 
  const canvasRef = useRef(null);
  const [session, setSession] = useState(null);
  const [modelIsLoading, setModelIsLoading] = useState(true);
  const isDetecting = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false); 

  // --- Model Loading ---
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const modelUrl = '/Model/YOLOv8.onnx';
        const loadedSession = await ort.InferenceSession.create(modelUrl);
        
        setSession(loadedSession);
        setModelIsLoading(false);
        console.log('ONNX Model loaded successfully');
      } catch (err) {
        console.error('Failed to load ONNX model:', err);
      }
    };
    loadModel();
  }, []);

  // --- Detection Loop (Modified for Image Fetching) ---
  useEffect(() => {
    if (!session || !videoRef.current || !canvasRef.current || typeof window === 'undefined') {
      return;
    }

    const videoElement = videoRef.current; // The <img> element
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let detectionLoopTimeoutId;
    
    // Set canvas size to match the <img> element's display size
    const setCanvasSize = () => {
      canvas.width = videoElement.clientWidth;
      canvas.height = videoElement.clientHeight;
    };

    // The core detection function (runs the ONNX model)
    const detectFrame = async () => {
      // 1. Skip if already processing or not streaming/model not loaded
      if (isDetecting.current || !isStreaming || !session) {
        detectionLoopTimeoutId = setTimeout(detectFrame, FRAME_FETCH_INTERVAL);
        return;
      }
      
      isDetecting.current = true;

      try {
        // Pass the <img> element to preProcess
        const inputTensor = await preProcess(videoElement);
  
        const feeds = {};
        feeds[session.inputNames[0]] = inputTensor;
        const results = await session.run(feeds);
        const outputTensor = results[session.outputNames[0]];
  
        const [boxes, scores, classes] = await processOutput(
          outputTensor,
          CONFIDENCE_THRESHOLD,
          IOU_THRESHOLD
        );
        
        // --- DIAGNOSTIC LOGGING ADDED HERE ---
        console.log('--- Detection Status ---');
        console.log(`Canvas Size: ${ctx.canvas.width}x${ctx.canvas.height}`);
        console.log(`Number of detections found: ${boxes.length}`);
        if (boxes.length > 0) {
          // Log the first box's coordinates in drawing format [x, y, w, h] (normalized to 640x640)
          console.log('First box (x, y, w, h) @ 640:', boxes[0]);
          console.log('First box class/score:', CLASS_NAMES[classes[0]], scores[0].toFixed(2));
        }
        console.log('------------------------');
        // ------------------------------------
  
        drawBoundingBoxes(ctx, boxes, scores, classes);
  
        inputTensor.dispose(); // Clean up memory
      } catch (error) {
          console.error("Detection error:", error);
      } finally {
        isDetecting.current = false;
        detectionLoopTimeoutId = setTimeout(detectFrame, FRAME_FETCH_INTERVAL);
      }
    };
    
    // Function to continuously load the new JPEG frame from the server
    const updateFrame = () => {
        videoElement.src = `${FLASK_STREAM_URL}?t=${new Date().getTime()}`;
    };
    
    videoElement.onload = () => {
      if (!isStreaming) {
        setCanvasSize();
        setIsStreaming(true);
        detectionLoopTimeoutId = setTimeout(detectFrame, FRAME_FETCH_INTERVAL);
      }
      updateFrame();
    };
    
    videoElement.onerror = () => {
        console.error('Failed to load image from Flask server. Retrying...');
        setIsStreaming(false);
        detectionLoopTimeoutId = setTimeout(updateFrame, 1000); 
    };
    
    updateFrame();

    window.addEventListener('resize', setCanvasSize);

    return () => {
      clearTimeout(detectionLoopTimeoutId);
      window.removeEventListener('resize', setCanvasSize);
      videoElement.onload = null;
      videoElement.onerror = null;
    };

  }, [session, isStreaming]);

  // --- Render ---
  return (
    <>
      <style>{`
        .monitoring-webcam-container {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background-color: #222;
          aspect-ratio: 16 / 9;
        }
        .monitoring-webcam {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
        .monitoring-webcam-live {
          position: absolute;
          top: 10px;
          left: 10px;
          color: red;
          font-size: 16px;
          font-weight: bold;
          background-color: rgba(0, 0, 0, 0.4);
          padding: 4px 8px;
          border-radius: 5px;
          z-index: 20;
        }
        .monitoring-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }
      `}</style>

      <div className="monitoring-webcam-container">
        <img
          className="monitoring-webcam"
          ref={videoRef}
          src={isStreaming ? FLASK_STREAM_URL : undefined}
          alt="Live Stream from Raspberry Pi"
          crossOrigin="anonymous" 
        />
        
        <canvas
          ref={canvasRef}
          className="monitoring-canvas"
        />
        
        <span className="monitoring-webcam-live">
          {modelIsLoading 
            ? 'LOADING MODEL...' 
            : (isStreaming ? '● LIVE' : 'CONNECTING...')}
        </span>
      </div>
    </>
  );
}

// =======================================================
// === HELPER FUNCTIONS ==================================
// =======================================================

async function preProcess(imageElement) {
  const tensor = tf.tidy(() => {
    const frame = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(frame, [MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH]);
    const normalized = resized.div(255.0);
    return normalized.transpose([2, 0, 1]).expandDims(0);
  });
  const data = await tensor.data();
  tensor.dispose();
  return new ort.Tensor('float32', data, [1, 3, MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH]);
}

async function processOutput(outputTensor, confThreshold, iouThreshold) {
  const boxes = [];
  const scores = [];
  const classIndices = [];
  const data = outputTensor.data;
  const numRows = outputTensor.dims[1]; // 84
  const numCols = outputTensor.dims[2]; // 8400

  for (let i = 0; i < numCols; ++i) {
    const x = data[i + 0 * numCols];
    const y = data[i + 1 * numCols];
    const w = data[i + 2 * numCols];
    const h = data[i + 3 * numCols];
    
    let maxScore = -1;
    let maxClass = -1;
    for (let j = 0; j < numRows - 4; j++) {
      const score = data[i + (j + 4) * numCols];
      if (score > maxScore) {
        maxScore = score;
        maxClass = j;
      }
    }

    if (maxScore > confThreshold) {
      // YOLO format output [cx, cy, w, h] to TF NMS format [y1, x1, y2, x2]
      boxes.push([y - h / 2, x - w / 2, y + h / 2, x + w / 2]);
      scores.push(maxScore);
      classIndices.push(maxClass);
    }
  }
  
  if (boxes.length === 0) return [[], [], []];

  const boxTensor = tf.tensor2d(boxes);
  const scoreTensor = tf.tensor1d(scores);
  const nmsIndices = await tf.image.nonMaxSuppressionAsync(boxTensor, scoreTensor, 100, iouThreshold);
  const finalIndices = nmsIndices.dataSync();
  
  const finalBoxes = [];
  const finalScores = [];
  const finalClasses = [];

  for (const index of finalIndices) {
    const [y1, x1, y2, x2] = boxes[index];
    // Convert back to [x, y, width, height] for drawing
    finalBoxes.push([x1, y1, x2 - x1, y2 - y1]); 
    finalScores.push(scores[index]);
    finalClasses.push(classIndices[index]);
  }

  boxTensor.dispose();
  scoreTensor.dispose();
  nmsIndices.dispose();

  return [finalBoxes, finalScores, finalClasses];
}

/*
 * Draws the bounding boxes on the canvas.
 */
function drawBoundingBoxes(ctx, boxes, scores, classes) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const scaleX = ctx.canvas.width / MODEL_INPUT_WIDTH;
  const scaleY = ctx.canvas.height / MODEL_INPUT_HEIGHT;
  
  ctx.lineWidth = 2;
  ctx.font = '16px sans-serif';

  boxes.forEach((box, i) => {
    const [x, y, width, height] = box;
    
    // Scale the box coordinates
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;

    const classIndex = classes[i];
    const className = CLASS_NAMES[classIndex] || 'Unknown';
    const color = CLASS_COLORS[classIndex] || '#FFFF00';
    const score = Math.round(scores[i] * 100);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

    // Draw the label
    const label = `${className} (${score}%)`;  
    // Adjust label position to be visible
    ctx.fillText(label, scaledX, scaledY > 10 ? scaledY - 5 : 10);
  });
}