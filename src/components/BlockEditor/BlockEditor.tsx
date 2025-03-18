import { EditorContent } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { LinkMenu } from './components/menus'

import ImageBlockMenu from '@/components/BlockEditor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/BlockEditor/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/components/BlockEditor/extensions/Table/menus'
import { TextMenu } from './components/menus/TextMenu'
import { ContentItemMenu } from './components/menus/ContentItemMenu'
import { useBlockEditor } from '@/hooks/useBlockEditor'
import './styles/index.css'

export const BlockEditor = ({
  initialContent,
  onContentChange,
}: {
  initialContent?: string
  onContentChange?: (content: string) => void
}) => {
  const [isEditable, setIsEditable] = useState(true)
  const menuContainerRef = useRef(null)

  const { 
    editor, 
  } = useBlockEditor({
    initialContent,
    onTransaction({ editor: currentEditor }) {
      setIsEditable(currentEditor.isEditable)
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
