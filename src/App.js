import React, { useEffect, useRef } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';

import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';
import { initializers } from '@tensorflow/tfjs';
import { waitFor } from '@testing-library/dom';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const renderCanvasRef = useRef(null);

  const joints = useRef(null);
  const graphicsEngine = useRef(null);
  const posenet = useRef(null);

  const init = async () => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const net = await posenet.current.loadNetwork();
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      posenet.current.detectPoseInRealTime(video, net);
    } else {
      setTimeout(init, 100);
    }
  };

  useEffect(() => {
    joints.current = new Joints();
    graphicsEngine.current = new GraphicsEngine(
      renderCanvasRef.current,
      joints.current
    );
    posenet.current = new PoseNet(joints.current, graphicsEngine.current, {
      video: webcamRef.current.video,
      output: canvasRef.current,
    });

    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          className="Webcam"
          style={{ width: 640, height: 480 }}
        />
        <canvas
          ref={canvasRef}
          className="Canvas"
          style={{ width: 640, height: 480 }}
        />

        <canvas ref={renderCanvasRef} className="RenderCanvas" />
      </header>
    </div>
  );
}

export default App;
