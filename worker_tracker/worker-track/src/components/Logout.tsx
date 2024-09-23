import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const Logout: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

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
      setImage(canvas.toDataURL('image/png')); // Base64 encode the image

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleLogout = async () => {
    if (image && location) {
      const data = {
        employee: '66f110667d541be733b694bb', // Example employee ID
        checkOutTime: new Date().toISOString(),
        checkOutImage: image, // Send base64 encoded image
        location: {
          lat: location.lat,
          lng: location.lng
        }
      };

      console.log('Submitting logout data:', data); // Log the payload

      try {
        const response = await fetch('http://localhost:5000/api/attendance/logout', { // Ensure the correct backend URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Response data:', responseData); // Log the response

        alert('Logged out successfully');
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
      <p>Latitude: {loading ? 'loading...' : location?.lat}</p>
      <p>Longitude: {loading ? 'loading...' : location?.lng}</p>
      <Button variant="contained" onClick={captureImage} style={{ margin: '10px' }}>Capture Logout Image</Button>
      <br />
      <Button variant="contained" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Logout;