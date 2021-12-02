import {useEffect, useRef, useState} from "react"
import '@toast-ui/editor/dist/toastui-editor.css'
import {Editor} from '@toast-ui/react-editor' // https://github.com/nhn/tui.editor/tree/master/apps/react-editor#-usage
import DatoCmsPlugin from 'datocms-plugins-sdk'

export default function App() {
  const [editorData, setEditorData] = useState()
  const editorRef = useRef()

  useEffect(() => {
    DatoCmsPlugin.init(plugin => {
      const fieldData = plugin.getFieldValue(plugin.fieldPath) || ''
      setEditorData(fieldData)
      plugin.startAutoResizer()
      console.log('plugin', plugin)
      console.log('fieldData', fieldData)
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
      {typeof(editorData) !== 'string' ? 'Loading field data from DatoCMS. Please wait...' :

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
              ['heading', 'bold', 'italic', 'strike', 'ul', 'ol', 'link', 'table']
            ]
          }
        />
      }
    </>
  )

}
