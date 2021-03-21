import React, { useEffect, useRef } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';

import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const renderCanvasRef = useRef(null);

  const joints = useRef(null);
  const graphicsEngine = useRef(null);
  const posenet = useRef(null);

  useEffect(async () => {
    joints.current = new Joints();
    graphicsEngine.current = new GraphicsEngine(
      renderCanvasRef.current,
      joints.current
    );
    posenet.current = new PoseNet(joints.current, graphicsEngine.current, {
      video: webcamRef.current.video,
      output: canvasRef.current,
    });

    const net = await posenet.current.loadNetwork();

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make detections
      posenet.current.detectPoseInRealTime(video, net);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} className="Webcam" />
        <canvas ref={canvasRef} className="Canvas" />
        <canvas ref={renderCanvasRef} className="RenderCanvas" />
      </header>
    </div>
  );
}

export default App;
