// import { useEffect, useState } from 'react'
import { 
  useEditor, 
  // useEditorState 
} from '@tiptap/react'
import type { AnyExtension, Editor, EditorOptions } from '@tiptap/core'
// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
// import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
// import type { Doc as YDoc } from 'yjs'

// import { userColors, userNames } from '../lib/constants'
// import { randomElement } from '@/lib/tiptap-utils'
// import type { EditorUser } from '../components/BlockEditor/types'

// import { AiWriter } from '@/components/BlockEditor/extensions'
import ExtensionKit from '@/components/BlockEditor/extensions/extension-kit'
// import { Ai } from '@/components/BlockEditor/extensions/Ai'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  // aiToken,
  // ydoc,
  initialContent = "<p>Start writing...</p>",
  // provider,
  // userId,
  // userName,
  onContentChange, // 새로 추가한 콜백 prop
  onTransaction: parentOnTransaction, // 부모 콜백도 받기
  ...editorOptions
}: {
  // aiToken?: string
  // ydoc: YDoc | null
  initialContent?: string
  // provider?: TiptapCollabProvider | null | undefined
  userId?: string
  userName?: string
  onContentChange?: (content: string) => void
  onTransaction?: (params: { editor: Editor }) => void
} & Partial<Omit<EditorOptions, 'extensions'>>) => {
  // const [collabState, setCollabState] = useState<WebSocketStatus>(
  //   provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected,
  // )

  const editor = useEditor(
    {
      ...editorOptions,
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: ctx => {
        // if (provider && !provider.isSynced) {
        //   provider.on('synced', () => {
        //     setTimeout(() => {
        //       if (ctx.editor.isEmpty) {
        //         ctx.editor.commands.setContent(initialContent)
        //       }
        //     }, 0)
        //   })
        // } 
        // else 
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
          // provider,
        }),
        // provider && ydoc
        //   ? Collaboration.configure({
        //       document: ydoc,
        //     })
        //   : undefined,
        // provider
        //   ? CollaborationCursor.configure({
        //       provider,
        //       user: {
        //         name: randomElement(userNames),
        //         color: randomElement(userColors),
        //       },
        //     })
        //   : undefined,
        // aiToken
        //   ? AiWriter.configure({
        //       authorId: userId,
        //       authorName: userName,
        //     })
        //   : undefined,
        // aiToken ? Ai.configure({ token: aiToken }) : undefined,
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
  // const users = useEditorState({
  //   editor,
  //   selector: (ctx): (EditorUser & { initials: string })[] => {
  //     if (!ctx.editor?.storage.collaborationCursor?.users) {
  //       return []
  //     }

  //     return ctx.editor.storage.collaborationCursor.users.map((user: EditorUser) => {
  //       const names = user.name?.split(' ')
  //       const firstName = names?.[0]
  //       const lastName = names?.[names.length - 1]
  //       const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`
  //       return { ...user, initials: initials.length ? initials : '?' }
  //     })
  //   },
  // })

  // useEffect(() => {
  //   provider?.on('status', (event: { status: WebSocketStatus }) => {
  //     setCollabState(event.status)
  //   })
  // }, [provider])

  window.editor = editor

  return { 
    editor, 
    // users, 
    // collabState 
  }
}
