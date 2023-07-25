import React, { useState, useEffect } from 'react';

const PermissionScreen = ({ onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState('undetermined');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionStatus('granted');
      onPermissionGranted();
    } catch (error) {
      setPermissionStatus('denied');
    }
  };

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionStatus('granted');
      onPermissionGranted();
    } catch (error) {
      console.error('Error accessing the camera:', error);
      setPermissionStatus('denied');
    }
  };

  return (
    <div className="permission-screen">
      {permissionStatus === 'undetermined' ? (
        <div>
          <p>Please grant permission to access your camera to use this app.</p>
          <button onClick={requestPermission}>Grant Camera Permission</button>
        </div>
      ) : permissionStatus === 'denied' ? (
        <div>
          <p>Camera access is denied. Please grant permission to access your camera.</p>
          <button onClick={requestPermission}>Grant Camera Permission</button>
        </div>
      ) : null}
    </div>
  );
};

export default PermissionScreen;
