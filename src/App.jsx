import { useState } from 'react'
import './App.css'
import React from 'react'

function App() {
  const [selfieImage, setSelfieImage] = useState(null);
  const [count, setCount] = useState(0)

  function manuallyStartCamera() {
    startCamera();
    }
  async function takeSelfie() {
    const videoElement = document.querySelector('#video-preview');
  
    //It's metadata, which includes videoWidth and videoHeight
    await videoElement.play();
    await new Promise((resolve) => (videoElement.onloadedmetadata = resolve));
  
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
    // Get the selfie image data as a base64 string
    const selfieDataUrl = canvas.toDataURL('image/png');
  
    // Update the state with the selfie image
    setSelfieImage(selfieDataUrl);
  }  

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.querySelector('#video-preview');
      videoElement.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }  
  

  return (
    <div>
      <h1>React Selfie App</h1>
      <video id="video-preview" autoPlay></video>
      <button onClick={manuallyStartCamera}>Start Camera</button>
    </div>
  );
}

export default App