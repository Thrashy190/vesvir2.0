import React, { useEffect, useRef } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import * as BABYLON from 'babylonjs';
import Webcam from 'react-webcam';
import { drawKeypoints, drawSkeleton, drawPoint } from './utilities';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const renderCanvasRef = useRef(null);

  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const cameraRef = useRef(null);
  const sphereRef = useRef(null);

  let interval = { id: null, tries: 0 };

  const createScene = (engine) => {
    // Create scene
    const scene = new BABYLON.Scene(engine);

    // Set transparent background for the scene
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);

    // Create camera
    const camera = new BABYLON.FreeCamera(
      'camera1',
      new BABYLON.Vector3(0, 0, -5),
      scene
    );
    cameraRef.current = camera;

    // Create light
    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    // Create a box

    return scene;
  };

  const initBabylon = (canvas) => {
    canvas.width = 640;
    canvas.height = 480;

    // Create Babylon engine
    const engine = new BABYLON.Engine(canvas, true);
    engineRef.current = engine;

    const scene = createScene(engine);
    sceneRef.current = scene;

    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene);
    sphereRef.current = sphere;

    engine.runRenderLoop(() => {
      scene.render();
    });
  };

  // Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    });

    interval.id = setInterval(() => {
      detect(net);

      // Work in progress for moving the sphere

      //   .then((pose) => {
      //   if (pose !== null && sphereRef.current !== null) {
      //     transformModel(pose['keypoints']);
      //   }
      // });
    }, 100);
  };

  const transformModel = (keypoints) => {
    console.log('Renderwidth: ', engineRef.current.getRenderWidth());
    console.log('Renderheight: ', engineRef.current.getRenderHeight());
    const nosePosition = keypoints[0].position;

    sphereRef.current.position.x =
      nosePosition.x - canvasRef.current.width * 0.5;
    sphereRef.current.position.y =
      nosePosition.y - canvasRef.current.height * 0.5;

    console.log('nosePosition: ', nosePosition);
    console.log('Sphere position', sphereRef.current.position);
  };

  const detect = async (net) => {
    // Verify the camera is available
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
      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);

      return pose;
    } else {
      // Tries before stopping trying to access the camera
      interval.tries++;
      if (interval.tries > 10) {
        clearInterval(interval.id);
      }
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose['keypoints'], 0.5, ctx);
    drawSkeleton(pose['keypoints'], 0.5, ctx);

    // Draw a red point on the 0 0 coordinate in the canvas
    drawPoint(ctx, 0, 0, 3, 'red');
    // Draw a green point on the center of the canvas
    drawPoint(ctx, center.y, center.x, 3, 'green');
  };

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} className="Webcam" />
        <canvas ref={canvasRef} className="Canvas" />
        <canvas ref={renderCanvasRef} className="RenderCanvas" />
      </header>
      <button
        onClick={() => initBabylon(renderCanvasRef.current)}
        style={{
          width: '100%',
          height: '5vh',
          margin: 'auto',
          backgroundColor: 'blue',
        }}
      >
        Init Babylon
      </button>
    </div>
  );
}

export default App;
