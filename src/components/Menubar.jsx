import { Bold,Italic,List,ListOrdered,Undo,Redo } from 'lucide-react';

function MenuBar({ editor }){
    // const { editor } = useCurrentEditor()
  
    if (!editor) {
      return null
    }
  
    return (
      <div className='rounded-t-lg border border-gray-500 p-4'>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'rounded-lg border-2 text-white bg-black p-2 m-2' : 'rounded-lg border-2 border-black p-1 m-2'}
        >
          <Bold />
        </button>
        <button
        type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'rounded-lg border-2 text-white bg-black p-2 m-2' : 'rounded-lg border-2 border-black p-1 m-2'}
        >
          <Italic />
        </button>
        
       
        
        
        
        <button
        type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'rounded-lg border-2 text-white bg-black p-2 m-2' : 'rounded-lg border-2 border-black p-1 m-2'}
        >
          <List />
        </button>
        <button
        type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'rounded-lg border-2 text-white bg-black p-2 m-2' : 'rounded-lg border-2 border-black p-1 m-2'}
        >
          <ListOrdered />
        </button>
        
        <button
        type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          className='rounded-lg border-2 border-black p-1 m-2'
        >
          <Undo />
        </button>
        <button
        type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          className='rounded-lg border-2 border-black p-1 m-2'
        >
          <Redo/>
        </button>
        
      </div>
    )
  }

export default MenuBar