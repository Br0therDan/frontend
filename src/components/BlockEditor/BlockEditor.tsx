import { EditorContent } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { LinkMenu } from './components/menus'
import './styles/index.css'

import ImageBlockMenu from '@/components/BlockEditor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/BlockEditor/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/components/BlockEditor/extensions/Table/menus'
import { EditorHeader } from './components/EditorHeader'
import { TextMenu } from './components/menus/TextMenu'
import { ContentItemMenu } from './components/menus/ContentItemMenu'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { useBlockEditor } from '@/hooks/useBlockEditor'

export const BlockEditor = ({
  aiToken,
  ydoc,
  provider,
  onContentChange, // 새로 추가한 콜백 prop
}: {
  aiToken?: string
  ydoc: Y.Doc | null
  provider?: TiptapCollabProvider | null | undefined
  onContentChange?: (content: string) => void
}) => {
  const [isEditable, setIsEditable] = useState(true)
  const menuContainerRef = useRef(null)

  const { editor, users, collabState } = useBlockEditor({
    aiToken,
    ydoc,
    provider,
    onTransaction({ editor: currentEditor }) {
      setIsEditable(currentEditor.isEditable)
      if (onContentChange) {
        onContentChange(currentEditor.getHTML())
      }
    },
  })

  if (!editor || !users) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
        />
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
