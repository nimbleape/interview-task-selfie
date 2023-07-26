import React, { useState, useEffect } from 'react';

const PermissionScreen = ({ onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState('undetermined');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Try accessing the camera to check the permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionStatus('granted');
      onPermissionGranted();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setPermissionStatus('denied');
      } else {
        console.error('Error checking camera permission:', error);
        setPermissionStatus('undetermined');
      }
    }
  };

  const requestPermission = async () => {
    try {
      // Request camera permission by accessing the camera
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionStatus('granted');
      onPermissionGranted();
    } catch (error) {
      console.error('Error requesting camera permission:', error);
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
