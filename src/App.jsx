import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [selfieImage, setSelfieImage] = useState(null);
  const [mirror, setMirror] = useState(false);
  const [previousSelfies, setPreviousSelfies] = useState([]);

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

  function takeSelfie() {
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

    // Store the selfie in the local state
    setPreviousSelfies((prevSelfies) => [...prevSelfies, selfieDataUrl]);
  }

  function toggleMirror() {
    setMirror(!mirror);
  }

  function deleteSelfie(index) {
    setPreviousSelfies((prevSelfies) => {
      const updatedSelfies = [...prevSelfies];
      updatedSelfies.splice(index, 1);
      return updatedSelfies;
    });
  }

  return (
    <div>
      <h1>React Selfie App</h1>
      <div style={{ position: 'relative', maxWidth: '640px', margin: 'auto' }}>
        <video ref={videoRef} id="video-preview" autoPlay style={{ transform: mirror ? 'scaleX(-1)' : 'none' }} />
        <div style={{ position: 'absolute', top: 400, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={takeSelfie}>Take Selfie</button>
          <button onClick={toggleMirror}>{mirror ? 'Disable Mirror' : 'Enable Mirror'}</button>
        </div>
      </div>
      {/* Display the captured selfie */}
      {selfieImage && <img src={selfieImage} alt="Selfie" />}

      {/* List previous selfies */}
      {previousSelfies.length > 0 && (
        <div>
          <h2>Previous Selfies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {previousSelfies.map((selfie, index) => (
              <div key={index} style={{ margin: '5px', position: 'relative' }}>
                <img src={selfie} alt={`Selfie ${index}`} style={{ width: '150px' }} />
                <button onClick={() => deleteSelfie(index)} style={{ position: 'absolute', top: '5px', right: '5px' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
