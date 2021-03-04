import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Webcam className="Webcam" />
        <canvas className="Canvas" />
      </header>
    </div>
  );
}

export default App;
