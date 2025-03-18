import { EditorContent } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { LinkMenu } from './components/menus'
import './styles/index.css'

import ImageBlockMenu from '@/components/BlockEditor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/BlockEditor/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/components/BlockEditor/extensions/Table/menus'
// import { EditorHeader } from './components/EditorHeader'
import { TextMenu } from './components/menus/TextMenu'
import { ContentItemMenu } from './components/menus/ContentItemMenu'
// import * as Y from 'yjs'
// import { TiptapCollabProvider } from '@hocuspocus/provider'
import { useBlockEditor } from '@/hooks/useBlockEditor'

export const BlockEditor = ({
  // aiToken,
  // ydoc,
  userId,
  userName,
  initialContent,
  // provider,
  onContentChange,
}: {
  // aiToken?: string
  // ydoc: Y.Doc | null
  userId: string
  userName?: string
  initialContent?: string
  // provider?: TiptapCollabProvider | null | undefined
  onContentChange?: (content: string) => void
}) => {
  const [isEditable, setIsEditable] = useState(true)
  const menuContainerRef = useRef(null)

  const { 
    editor, 
    // users, 
    // collabState 
  } = useBlockEditor({
    // aiToken,
    // ydoc,
    userId,
    userName,
    initialContent,
    // provider,
    onTransaction({ editor: currentEditor }) {
      setIsEditable(currentEditor.isEditable)
      // 부모 onTransaction는 전달되지 않으므로, 이 부분은
      // 이제 useBlockEditor 내부에서 처리됩니다.
    },
    onContentChange, // 전달한 onContentChange가 useBlockEditor로 전달됨
  })

  if (!editor 
      // || !users
    ) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        {/* <EditorHeader
          editor={editor}
          // collabState={collabState}
          // users={users}
        /> */}
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} isEditable={isEditable} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default BlockEditor
