// path: src/components/editor/EmbedModal.tsx

"use client";
import React, { useState } from "react";

interface EmbedModalProps {
  onInsert: (url: string) => void;
  type: "image" | "video";
}

const EmbedModal: React.FC<EmbedModalProps> = ({ onInsert, type }) => {
  const [url, setUrl] = useState("");

  const handleInsert = () => {
    if (url) {
      onInsert(url);
      setUrl("");
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={`Enter ${type} URL`}
        className="w-full p-2 border border-gray-300"
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleInsert}
      >
        Insert {type}
      </button>
    </div>
  );
};

export default EmbedModal;
