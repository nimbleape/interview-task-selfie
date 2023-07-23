import { useState, useEffect, useRef } from 'react';

function App() {
  const [selfieImage, setSelfieImage] = useState(null);
  const [mirror, setMirror] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    startCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play(); // Start playing the video
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  async function takeSelfie() {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Get the selfie image data as a base64 string
    const selfieDataUrl = canvas.toDataURL('image/png');
    setSelfieImage(selfieDataUrl);
  }

  function toggleMirror() {
    setMirror(!mirror);
  }

  return (
    <div>
      <h1>React Selfie App</h1>
      <div style={{ position: 'relative', maxWidth: '640px', margin: 'auto' }}>
        <video ref={videoRef} id="video-preview" autoPlay style={{ transform: mirror ? 'scaleX(-1)' : 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={takeSelfie}>Take Selfie</button>
          <button onClick={toggleMirror}>{mirror ? 'Disable Mirror' : 'Enable Mirror'}</button>
        </div>
      </div>
      {/* Display the captured selfie */}
      {selfieImage && <img src={selfieImage} alt="Selfie" />}
    </div>
  );
}

export default App;