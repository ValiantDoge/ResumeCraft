import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import React from 'react'
import MenuBar from './Menubar'
import { useState, useEffect } from 'react'

//toolbar


// define your extension array
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

// const content = ''

function Tiptap({ value,onChange= () => {}}) {
  // const [content, setContent] = useState(value)
  const editor = useEditor({
    extensions: extensions,
    content: value,
    editorProps:{
        attributes: {
            class: 'prose max-w-4xl rounded-b-lg border border-t-0 border-gray-500 min-h-[250px] p-3',
        },
    }, 
    
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      // setContent(editor.getHTML())
      // console.log(value)
    },
    

    
  })

  return (
    <>
      {/* <Toolbar editor={editor} /> */}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      

      
    </>
  )
}

export default Tiptap