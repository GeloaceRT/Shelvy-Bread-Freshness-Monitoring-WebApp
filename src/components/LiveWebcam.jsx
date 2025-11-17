import React from 'react';
import Webcam from 'react-webcam';


export default function LiveWebcam() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user', 
  };

  return (
    <>

      <style>{`
        .monitoring-webcam-container {
          position: relative;
          width: 100%;
          border-radius: 8px; /* Match card style */
          overflow: hidden; /* Clips the webcam to the border radius */
          background-color: #222; /* Placeholder bg */
        }
        .monitoring-webcam {
          width: 100%;
          height: auto;
          display: block;
          aspect-ratio: 16 / 9;
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
          z-index: 10;
        }
      `}</style>

      <div className="monitoring-webcam-container">
        <Webcam
          audio={false}
          className="monitoring-webcam"
          videoConstraints={videoConstraints}
        />
        <span className="monitoring-webcam-live">● LIVE</span>
      </div>
    </>
  );
}