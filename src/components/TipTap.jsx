import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import React from 'react'
import MenuBar from './Menubar'
import { useEffect } from 'react'

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

const content = ''

const Tiptap = ({ onChange }) => {
  const editor = useEditor({
    extensions: extensions,
    content,
    editorProps:{
        attributes: {
            class: 'prose max-w-4xl rounded-b-lg border border-t-0 border-gray-500 min-h-[250px] p-3',
        },
    }, 
    
  })

  useEffect(() => {

    if (!editor) {
      console.error("Editor is null. Waiting for initialization...");
      return;
    }
  
    console.log("Adding event listener...");
    const subscription = editor.on('update', ({ editor }) => {
      onChange(editor.getHTML());
    });
  
    console.log("Subscription:", subscription);
  
    return () => {
      console.log("Removing event listener...");
      if (typeof subscription === 'function') {
        subscription();
      } else {
        console.warn("Subscription is not a function:", subscription);
      }
    };
  }, [editor, onChange]);

  return (
    <>
      {/* <Toolbar editor={editor} /> */}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      

      
    </>
  )
}

export default Tiptap