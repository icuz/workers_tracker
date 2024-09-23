import React, { useState } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';

interface WorkPostProps {
  siteId: string;
}

const WorkPost: React.FC<WorkPostProps> = ({ siteId }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      if (!selectedImage.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (selectedImage.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (image && description) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const data = {
          description,
          image: base64Image
        };

        try {
          const response = await fetch(`http://localhost:5000/api/sites/${siteId}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            throw new Error('Failed to post work');
          }

          alert('Work posted successfully');
          setImage(null);
          setImagePreview(null);
          setDescription('');
        } catch (error) {
          setError('Failed to post work');
        } finally {
          setLoading(false);
        }
      };
    } else {
      setError('Please provide an image and description');
    }
  };

  return (
    <div>
      <h1>Post Work Done</h1>
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
      {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: '10px' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Post Work'}
      </Button>
    </div>
  );
};

export default WorkPost;