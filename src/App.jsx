import { useState, useEffect, useRef } from 'react';
import './App.css';
import localforage from 'localforage'; // import localforage

function App() {
  const [selfieImage, setSelfieImage] = useState(null);
  const [mirror, setMirror] = useState(false);
  const [previousSelfies, setPreviousSelfies] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
    startCamera();
    loadPreviousSelfies();
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

    // Get the selfie image data as a blob
    canvas.toBlob(async (blob) => {
      const imageURL = URL.createObjectURL(blob);
      setSelfieImage(imageURL);

      // Store the image URL in IndexedDB using localforage
      // Generate a unique key using Date.now()
      const key = `selfie_${Date.now()}`;
      await localforage.setItem(key, imageURL);

      // Load previous selfies from IndexedDB and update the state
      loadPreviousSelfies();
    }, 'image/png');
  }

  function toggleMirror() {
    setMirror(!mirror);
  }

  async function deleteSelfie(key) {
    // Remove the image URL from IndexedDB using localforage
    await localforage.removeItem(key);

    // Load previous selfies from IndexedDB and update the state
    loadPreviousSelfies();
  }

  async function loadPreviousSelfies() {
    const selfieFiles = [];
    const keys = await localforage.keys();

    // Filter the keys to get selfie image keys
    const selfieKeys = keys.filter((key) => key.startsWith('selfie_'));

    // Retrieve the image URLs based on the selfie image keys
    for (const key of selfieKeys) {
      const imageURL = await localforage.getItem(key);
      selfieFiles.push({ key, imageURL }); // Store the image URLs along with their keys
    }

    setPreviousSelfies(selfieFiles);
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
                <img src={selfie.imageURL} alt={`Selfie ${index}`} style={{ width: '150px' }} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button onClick={() => deleteSelfie(selfie.key)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
