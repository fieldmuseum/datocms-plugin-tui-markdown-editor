import {useEffect, useRef, useState} from "react"
import '@toast-ui/editor/dist/toastui-editor.css'
import {Editor} from '@toast-ui/react-editor' // https://github.com/nhn/tui.editor/tree/master/apps/react-editor#-usage
import DatoCmsPlugin from 'datocms-plugins-sdk'

export default function App() {
  const [editorData, setEditorData] = useState()
  const editorRef = useRef()

  useEffect(() => {
    DatoCmsPlugin.init(plugin => {
      const fieldData = plugin.getFieldValue(plugin.fieldPath)
      setEditorData(fieldData)
      plugin.startAutoResizer()
    })

  }, [])


  const uploadEditorData = async (newEditorData) => {
    DatoCmsPlugin.init(plugin => {
      plugin.setFieldValue(plugin.fieldPath, newEditorData)
    }).then(() => {
        setEditorData(newEditorData)
      }
    )
  }

  const changeHandler = () => {
    const rawMarkdown = editorRef.current.getInstance().getMarkdown()
    uploadEditorData(rawMarkdown)
  }

  return (
    <>
      {!editorData ? 'Loading field data from DatoCMS. Please wait...' :

        // Available options: https://nhn.github.io/tui.editor/latest/ToastUIEditorCore
        <Editor
          previewStyle="vertical"
          height="500px"
          initialEditType="wysiwyg"
          initialValue={editorData}
          ref={editorRef}
          onChange={changeHandler}
          toolbarItems={
            // Toolbar customization: https://nhn.github.io/tui.editor/latest/tutorial-example15-customizing-toolbar-buttons
            [
              [
 /*               {
                  // Custom toolbar button: https://github.com/nhn/tui.editor/blob/master/docs/en/toolbar.md
                  name: 'myItem',
                  tooltip: 'myItem',
                  command: "image",
                  text: '@',
                  className: 'toastui-editor-toolbar-icons',
                  style: {backgroundImage: 'none', color: 'red'}
                },*/
                'heading', 'bold', 'italic', 'strike', 'code', 'ul', 'ol', 'link',
                // 'image', 'indent', 'outdent', 'quote', 'codeblock', 'hr', 'table'
              ]
            ]
          }
        />
      }
    </>
  )

}
