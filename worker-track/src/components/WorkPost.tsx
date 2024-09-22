import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const WorkPost: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (image && description) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('description', description);

      await fetch('/api/work', {
        method: 'POST',
        body: formData
      });
      alert('Work posted successfully');
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
      />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Post Work</Button>
    </div>
  );
};

export default WorkPost;
