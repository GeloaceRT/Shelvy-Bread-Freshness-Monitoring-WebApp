import React, { useRef, useState, useEffect } from 'react'; 
import Webcam from 'react-webcam';
import * as ort from 'onnxruntime-web'; 
import * as tf from '@tensorflow/tfjs'; 

// --- Model Configuration ---
const MODEL_INPUT_WIDTH = 640;
const MODEL_INPUT_HEIGHT = 640;
const CONFIDENCE_THRESHOLD = 0.25; 
const IOU_THRESHOLD = 0.45;

const CLASS_NAMES = ['fresh', 'moldy'];
const CLASS_COLORS = ['#00FF00', '#FF0000']; // Green for fresh, Red for moldy

export default function LiveWebcam() {
  const webcamRef = useRef(null); 
  const canvasRef = useRef(null); 
  const [session, setSession] = useState(null); 
  const [modelIsLoading, setModelIsLoading] = useState(true); 
  const isDetecting = useRef(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user', 
  };

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

  useEffect(() => {
    if (!session || !webcamRef.current || !canvasRef.current || typeof window === 'undefined') {
      return;
    }

    const video = webcamRef.current.video; 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    };

    let animationFrameId;
    const detectFrame = async () => {
    // 1. ADD THIS LINE
    if (isDetecting.current) {
      animationFrameId = requestAnimationFrame(detectFrame);
      return;
    }
    
    if (!session || video.readyState < 3) {
      animationFrameId = requestAnimationFrame(detectFrame);
      return; 
    }
    
    // 2. ADD THIS LINE
    isDetecting.current = true;

    // --- The rest of your code is perfect ---
    const inputTensor = await preProcess(video);

    const feeds = {};
    feeds[session.inputNames[0]] = inputTensor;
    const results = await session.run(feeds);
    const outputTensor = results[session.outputNames[0]];

    const [boxes, scores, classes] = await processOutput(
      outputTensor, 
      CONFIDENCE_THRESHOLD, 
      IOU_THRESHOLD
    );

    drawBoundingBoxes(ctx, boxes, scores, classes);

    inputTensor.dispose(); 
    
    isDetecting.current = false; 

    animationFrameId = requestAnimationFrame(detectFrame);
  };

    video.addEventListener('loadeddata', () => {
      setCanvasSize(); 
      detectFrame();   // Start the loop
    });

    window.addEventListener('resize', setCanvasSize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };

  }, [session]); 

  return (
    <>
      <style>{`
        .monitoring-webcam-container {
          position: relative;
          width: 100%;
          border-radius: 8px; /* Match card style */
          overflow: hidden; /* Clips the webcam to the border radius */
          background-color: #222; /* Placeholder bg */
          aspect-ratio: 16 / 9; /* Ensure container has aspect ratio */
        }
        .monitoring-webcam {
          width: 100%;
          height: 100%; /* Fill the container */
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
          z-index: 20; /* Above canvas */
        }
        .monitoring-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10; /* On top of video, behind text */
        }
      `}</style>

      <div className="monitoring-webcam-container">
        <Webcam
          audio={false}
          className="monitoring-webcam"
          videoConstraints={videoConstraints}
          ref={webcamRef} 
          muted 
        />
        <canvas
          ref={canvasRef}
          className="monitoring-canvas"
        />
        
        <span className="monitoring-webcam-live">
          {modelIsLoading ? 'LOADING MODEL...' : '● LIVE'} 
        </span>
      </div>
    </>
  );
}

async function preProcess(video) {
  const tensor = tf.tidy(() => {
    const frame = tf.browser.fromPixels(video);
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
    ctx.fillText(label, scaledX, scaledY > 10 ? scaledY - 5 : 10);
  });
}