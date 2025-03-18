'use client'
import {
  useEditor,
} from '@tiptap/react'
import type { AnyExtension, Editor, EditorOptions } from '@tiptap/core'
import ExtensionKit from '@/components/BlockEditor/extensions/extension-kit'
declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  initialContent = "<p>Start writing...</p>",
  onContentChange, // 새로 추가한 콜백 prop
  onTransaction: parentOnTransaction, // 부모 콜백도 받기
  ...editorOptions
}: {
  initialContent?: string
  userId?: string
  userName?: string
  onContentChange?: (content: string) => void
  onTransaction?: (params: { editor: Editor }) => void
} & Partial<Omit<EditorOptions, 'extensions'>>) => {
  const editor = useEditor(
    {
      ...editorOptions,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: ctx => {

        if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent)
          ctx.editor.commands.focus('start', { scrollIntoView: true })
        }
      },
      onTransaction({ editor: currentEditor }) {
        // 부모 콜백이 있다면 먼저 호출
        if (parentOnTransaction) {
          parentOnTransaction({ editor: currentEditor })
        }
        // 그리고 onContentChange 업데이트
        if (onContentChange) {
          onContentChange(currentEditor.getHTML())
        }
      },
      extensions: [
        ...ExtensionKit({
        }),

      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [],
  )

  if (typeof window !== 'undefined') {
    window.editor = editor
  }

  return {
    editor,
    // users, 
    // collabState 
  }
}
