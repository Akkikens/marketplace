import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const CreatePost = ({ onPostSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (title && content) {
      onPostSubmit({ title, content, timestamp: new Date() });
      setTitle("");
      setContent("");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h5">Create a New Post</Typography>
      <TextField
        fullWidth
        label="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Post Content"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Publish
      </Button>
    </Box>
  );
};

export default CreatePost;
