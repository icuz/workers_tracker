import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const Attendance: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleSubmitAttendance = async () => {
    if (image && location) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('latitude', String(location.lat));
      formData.append('longitude', String(location.lng));

      await fetch('/api/attendance', {
        method: 'POST',
        body: formData
      });
      alert('Attendance Submitted');
    }
  };

  return (
    <div>
      <h1>Take Attendance</h1>
      {image && <img src={image} alt="Captured" />}
      <br />
      <p>Latitude: {location ? location?.lat : 'loading...'}</p>
      <p>Longitude: {location ? location?.lng : 'loading...'}</p>
      <Button variant="contained" onClick={captureImage} style={{margin: '10px'}}>Capture Image</Button>
      <br />
      <Button variant="contained" onClick={handleSubmitAttendance}>Submit Attendance</Button>
      
    </div>
  );
};

export default Attendance;