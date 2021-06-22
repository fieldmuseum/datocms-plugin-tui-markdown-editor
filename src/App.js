import SortableTree, {addNodeUnderParent, changeNodeAtPath, removeNodeAtPath} from 'react-sortable-tree-patch-react-17';
import 'react-sortable-tree-patch-react-17/style.css';
import {useState} from "react";
import {useAsync} from 'react-async-hook';

import DatoCmsPlugin from 'datocms-plugins-sdk';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const getNodeKey = ({treeIndex}) => treeIndex;

const sampleTree = [
    {
        id: 1,
        title: 'my sample poswwewefwft',
        slug: '/my-sample-post',
        children: [
            {
                id: 5,
                title: 'my child',
                slug: '/my-child',
                children: [
                    {
                        id: 6,
                        title: 'my grandeeechild',
                        slug: '/my-grandchild'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'my sample post 2',
        slug: '/my-sample-post-2'
    },
    {
        id: 3,
        title: 'my sample post 3',
        slug: '/my-sample-post-3'
    }
];

export default function App() {
    const [treeData, setTreeData] = useState(sampleTree);

    DatoCmsPlugin.init(plugin => {
        plugin.startAutoResizer();
        // setTreeData(JSON.parse(plugin.getFieldValue(plugin.fieldPath)));

    });

    return (
        <>
            <h1>Tree Output</h1>

            <div style={{height: 1000}}>

                {!treeData ? "Loading, please wait..." :
                    <SortableTree
                        treeData={treeData}
                        onChange={setTreeData}
                        generateNodeProps={({node, path}) => {

                            return ({
                                title: <input value={node.title}
                                              onChange={event => setTreeData(
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

                                            console.log(modifiedTree);
                                            setTreeData(modifiedTree.treeData);
                                        }
                                        }
                                    >
                                        Add +
                                    </button>,
                                    <button
                                        onClick={() =>
                                            setTreeData(
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
