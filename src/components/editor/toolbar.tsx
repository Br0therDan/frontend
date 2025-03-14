"use client";
import React, { useCallback } from 'react';
import { Editor } from '@tiptap/react';

type ToolbarProps = {
  editor: Editor;
};

const Toolbar = ({ editor }: ToolbarProps) => {
  const setLink = useCallback(() => {
    const href = prompt("Enter the URL", "https://");
    const text = prompt("Enter the text", "Some Text");

    if (!href || !text) return;

    const { state } = editor;
    const { selection } = state;
    const { from, to } = selection;
    const { $from } = selection;

    const isTextSelected = from < to;
    const nodeAtSelection = $from.node();
    let tr;

    if (
      nodeAtSelection &&
      nodeAtSelection.type.name !== "codeBlock" &&
      isTextSelected
    ) {
      tr = state.tr.deleteSelection();
      tr = state.tr.insertText(text as string);

      const linkMarkType = state.schema.marks.link;
      const linkMark = linkMarkType.create({ href });
      tr = tr.addMark(from, from + (text as string).length, linkMark);

      editor.view.dispatch(tr);
    } else if (nodeAtSelection.type.name !== "codeBlock") {
      editor
        .chain()
        .focus()
        .setMark('link', { href })
        .insertContent(text)
        .run();
    }
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center p-2 border-b border-gray-300">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className={`w-8 h-8 bg-[url('/editor_h1.svg')] bg-center bg-no-repeat ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'bg-white'
          }`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <button
          type="button"
          className={`w-8 h-8 bg-[url('/editor_h2.svg')] bg-center bg-no-repeat ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'bg-white'
          }`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </div>

      <div className="w-px h-6 mx-3 bg-gray-300" />

      <div className="flex items-center space-x-2">
        <button
          type="button"
          className={`w-8 h-8 bg-[url('/editor_bold.svg')] bg-center bg-no-repeat ${
            editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        />
        <button
          type="button"
          className={`w-8 h-8 bg-[url('/editor_italic.svg')] bg-center bg-no-repeat ${
            editor.isActive('italic') ? 'bg-gray-200' : 'bg-white'
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        />
        <button
          type="button"
          className={`w-8 h-8 bg-[url('/editor_strike.svg')] bg-center bg-no-repeat ${
            editor.isActive('strike') ? 'bg-gray-200' : 'bg-white'
          }`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        />
      </div>

      <div className="w-px h-6 mx-3 bg-gray-300" />

      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="w-8 h-8 bg-[url('/editor_link.svg')] bg-center bg-no-repeat bg-white"
          onClick={setLink}
        />
        <button
          type="button"
          className="w-8 h-8 bg-[url('/editor_line.svg')] bg-center bg-no-repeat bg-white"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </div>
    </div>
  );
};

export default Toolbar;