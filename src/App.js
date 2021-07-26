import {useEffect, useRef, useState} from "react";
import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/react-editor';
import DatoCmsPlugin from 'datocms-plugins-sdk';

export default function App() {
  const [treeData, setTreeData] = useState();

  DatoCmsPlugin.init(plugin => {
    plugin.startAutoResizer();
  })

  useEffect(() => {
      DatoCmsPlugin.init(plugin => {
        const fieldData = plugin.getFieldValue(plugin.fieldPath);
        console.log('fieldData', fieldData);
        setTreeData(fieldData)
      })
    }, []
  )


  const sendTreeToDato = async newTree => {
    DatoCmsPlugin.init(plugin => {
      plugin.setFieldValue(plugin.fieldPath, newTree)
    }).then(() => {
        console.log('newTree', newTree);
        setTreeData(newTree)
      }
    )
  }

  const changeHandler = () => {
    const markdown = editorRef.current.getInstance().getMarkdown();
    console.log('markdown changed', markdown);
    sendTreeToDato(markdown);
  }

  const editorRef = useRef();

  return (
    <>
      <h1>Toast UI Editor</h1>
      {!treeData ? 'Loading, please wait...' :

        <Editor
          previewStyle="tab"
          height="auto"
          minHeight="400px"
          initialEditType="wysiwyg"
          initialValue={treeData}
          ref={editorRef}
          // onFocus={this.handleFocus}
          onChange={changeHandler}
        />

      }
      <h1>Raw Output</h1>
      {!treeData ? "Loading, please wait..." :
        <pre>{treeData}</pre>
      }

    </>
  )

}
