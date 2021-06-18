import SortableTree, {changeNodeAtPath, removeNodeAtPath} from 'react-sortable-tree-patch-react-17';
import 'react-sortable-tree-patch-react-17/style.css';
import {useState} from "react";
import generateRandomAnimal from 'random-animal-name';


function App() {
    const availablePosts = [
        {
            id: 1,
            title: "my sample post",
            slug: "/my-sample-post",
            children: [
                {
                    id: 5,
                    title: "my child",
                    slug: "/my-child",
                    children: [
                        {
                            id: 6,
                            title: "my grandchild",
                            slug: "/my-grandchild"
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            title: "my sample post 2",
            slug: "/my-sample-post-2"
        },
        {
            id: 3,
            title: "my sample post 3",
            slug: "/my-sample-post-3"
        },
    ];

    const [treeData, setTreeData] = useState(availablePosts);
    const getNodeKey = ({treeIndex}) => treeIndex;

    return (
        <>

            <div style={{height: 300}}>
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
                                    onClick={() => setTreeData(
                                        changeNodeAtPath({
                                            treeData,
                                            path,
                                            getNodeKey,
                                            newNode: {...node, title: generateRandomAnimal()},
                                        })
                                    )}
                                >
                                    Randomize Name
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
                                    Remove
                                </button>
                            ]
                        })
                    }
}
/>


</div>

<pre>
                    {JSON.stringify(treeData, null, 2)}
                        </pre>
</>
)
}

export default App;
