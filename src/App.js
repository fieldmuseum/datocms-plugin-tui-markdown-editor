import SortableTree, {addNodeUnderParent, changeNodeAtPath, removeNodeAtPath} from 'react-sortable-tree-patch-react-17';
import 'react-sortable-tree-patch-react-17/style.css';
import {useEffect, useState} from "react";
import {useAsync} from 'react-async-hook';

import DatoCmsPlugin from 'datocms-plugins-sdk';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const getNodeKey = ({treeIndex}) => treeIndex;

const sampleTree = [
    {
        id: 1,
        title: 'Placeholder',
        slug: '/placehoder',
    }
];

export default function App() {
    const [treeData, setTreeData] = useState(sampleTree);

    DatoCmsPlugin.init(plugin => {
        plugin.startAutoResizer();
    })

    useEffect(() => {
            DatoCmsPlugin.init(plugin => {
                setTreeData(JSON.parse(plugin.getFieldValue(plugin.fieldPath)))
            })
        }, []
    )


    const sendTreeToDato = async newTree => {
        DatoCmsPlugin.init(plugin => {
            plugin.setFieldValue(plugin.fieldPath, JSON.stringify(newTree))
        }).then(() =>
            setTreeData(newTree)
        )
    }

    return (
        <>
            <h1>Tree Output</h1>

            <div style={{height: 1000}}>

                {!treeData ? "Loading, please wait..." :
                    <SortableTree
                        treeData={treeData}
                        onChange={sendTreeToDato}
                        generateNodeProps={({node, path}) => {

                            return ({
                                title: <input value={node.title}
                                              onChange={event => sendTreeToDato(
                                                  changeNodeAtPath({
                                                      treeData,
                                                      path,
                                                      getNodeKey,
                                                      newNode: {...node, title: event.target.value},
                                                  })
                                              )}
                                />,
                                buttons: [
                                    <button
                                        onClick={() => {
                                            const newId = node.id++;
                                            const modifiedTree = addNodeUnderParent({
                                                treeData,
                                                parentKey: path[path.length - 1],
                                                newNode: {id: newId, title: `New node ${newId}`},
                                                expandParent: true,
                                                addAsFirstChild: true,
                                                getNodeKey
                                            });

                                            sendTreeToDato(modifiedTree.treeData);
                                        }
                                        }
                                    >
                                        Add +
                                    </button>,
                                    <button
                                        onClick={() =>
                                            sendTreeToDato(
                                                removeNodeAtPath({
                                                    treeData,
                                                    path,
                                                    getNodeKey
                                                })
                                            )
                                        }
                                    >
                                        Del -
                                    </button>
                                ]
                            })
                        }}
                    />
                }

            </div>

            <h1>JSON Output</h1>
            {!treeData ? "Loading, please wait..." :
                <pre>{JSON.stringify(treeData, null, 2)}</pre>
            }

        </>
    )

}
