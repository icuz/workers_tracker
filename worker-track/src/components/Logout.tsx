import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const Logout: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImage(canvas.toDataURL('image/png'));

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleLogout = async () => {
    if (image && location) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('latitude', String(location.lat));
      formData.append('longitude', String(location.lng));

      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        alert('Logged out');
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to log out');
      }
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      {image && <img src={image} alt="Logout" />}
      <br />
      <Button variant="contained" onClick={captureImage}>Capture Logout Image</Button>
      
      
      {location && (
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}

      <Button variant="contained" color="primary" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Logout;