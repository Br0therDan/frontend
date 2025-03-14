"use client"
import React from 'react';
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import Toolbar from "@/components/editor/toolbar";
import CustomCodeBlockLowlight from "@/utils/codeBlockIndent";
import { Indent } from "@/utils/indent";

interface TiptapEditorProps {
  onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ onChange }) => {
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const [text, setText] = useState("Hello World!");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
      }),
      Markdown,
      CustomCodeBlockLowlight,
      Indent,
    ],
    content: text,
    onUpdate({ editor }) {
      const content = editor.getHTML();
      setText(content);
      handleEditorChange(content);
    },
  });

  return (
    <div className="p-10">
      <div className="p-10 border border-gray-300">
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
