"use client"
import TiptapEditor from '@/components/editor/TiptapEditor';
import React, { useState } from 'react';


const NewPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert('Post saved successfully!');
    } else {
      alert('Failed to save post.');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <input
        className="w-full p-2 border border-gray-300 mb-4"
        type="text"
        placeholder="Enter post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TiptapEditor onChange={setContent} />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Post
      </button>
    </div>
  );
};

export default NewPostPage;

// // Example API Route for '/api/posts'
// // File path: /pages/api/posts.js

// export async function POST(req, res) {
//   const { title, content } = await req.json();

//   if (!title || !content) {
//     return res.status(400).json({ error: 'Title and content are required.' });
//   }

//   // Simulate saving to database (example only)
//   return res.status(201).json({ message: 'Post created successfully!' });
// }
