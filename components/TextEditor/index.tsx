import React, { useCallback, useState } from 'react'

import { createEditor } from 'slate'

import { Slate, Editable, withReact, useSlate } from 'slate-react'

import { BaseEditor, Descendant, Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import codeIcon from './code-svgrepo-com.svg'

type CustomElement = { type: 'paragraph' | 'code'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const toggleMark = (editor: BaseEditor & ReactEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}


const isMarkActive = (editor: BaseEditor & ReactEditor, format: string) => {
  const marks: any = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const CodeBlockButton = ({ props }: any) => {
  const editor: Editor = useSlate()
  return (
    <button
    onMouseDown={event => {
      event.preventDefault()
      toggleMark(editor, "code")
    }}
    style={{
      backgroundColor: isMarkActive(editor, "code") ? "blue" : "white",
      color: "black"
    }}
    >
    Code Block
    </button>
  )
}


const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  return (
    <Slate editor={editor} value={initialValue}>
      <div>
      <CodeBlockButton icon={codeIcon} />
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (event.key === '`' && event.ctrlKey) {
            event.preventDefault()
            const [match]: any = Editor.nodes(editor, {
              match: (n: any) => n.type === 'code',
            })
            toggleMark(editor, "code")
            Transforms.setNodes(
              editor,
              { type: match ? 'paragraph' : 'code' },
              { match: n => Editor.isBlock(editor, n) }
            )
          }
        }}
      />
    </Slate>
  )
}

const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code style={{ color: "black"}}>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: any) => {
  return <p {...props.attributes} style={{ color: "black"}}>{props.children}</p>
}

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.code) {
    children = <code>{children}</code>
  }
  return <span {...attributes}>{children}</span>
}


export default TextEditor;