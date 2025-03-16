// path: src/components/editor/Editor.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";


interface TiptapEditorProps {
  onChange: (content: string) => void;
  initialValue?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  onChange,
  initialValue = "<p>Hello World!</p>",
}) => {
  const [content, setContent] = useState(initialValue);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setContent(html);
      onChange(html);
    },
  });

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white shadow rounded p-2 flex space-x-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-sm font-semibold ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-sm font-semibold ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 text-sm font-semibold ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 text-sm font-semibold ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
          >
            H2
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} className="min-h-[300px] p-4 focus:outline-none" />
    </div>
  );
};

export default TiptapEditor;
