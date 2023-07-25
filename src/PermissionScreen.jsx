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

  return (
    <div>
      {permissionStatus === 'denied' ? (
        <p>Camera access is denied. Please grant permission to access your camera.</p>
      ) : null}
    </div>
  );
};

export default PermissionScreen;
