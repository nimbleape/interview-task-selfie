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
      await localforage.setItem(`selfie_${Date.now()}`, imageURL);

      // Load previous selfies from IndexedDB and update the state
      loadPreviousSelfies();
    }, 'image/png');
  }

  function toggleMirror() {
    setMirror(!mirror);
  }

  async function deleteSelfie(index) {
    const imageURL = previousSelfies[index];
    setPreviousSelfies((prevSelfies) => {
      const updatedSelfies = [...prevSelfies];
      updatedSelfies.splice(index, 1);
      return updatedSelfies;
    });

    // Remove the image URL from IndexedDB using localforage
    await localforage.removeItem(imageURL);
  }

  async function loadPreviousSelfies() {
    const selfieFiles = [];
    await localforage.iterate((value, key) => {
      if (key.startsWith('selfie_')) {
        selfieFiles.push(value);
      }
    });
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
