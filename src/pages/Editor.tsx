import LayoutPage from "../layout";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Input } from '@arco-design/web-react';
import { useParams } from 'react-router-dom';
import { createReactEditorJS } from 'react-editor-js'

const ReactEditorJS = createReactEditorJS()

const Editor = () => {
    const editorCore = useRef(null);
    let {id} = useParams();
    let [content, setContent] = useState();
    let [loading, setLoading] = useState(true);
    let cont = [

    ]

    const handleInitialize = useCallback((instance: any) => {
        editorCore.current = instance
    }, [])

    useLayoutEffect(() => {
        const getPost = async () => {
            await fetch(`http://localhost:3000/api/v1/posts/${id}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => {
                const {content} = data;
                setContent(content);
                setLoading(false);
            });
        }
        getPost();
    }, [])

    const handleSave = useCallback(async () => {
        const savedData = await editorCore?.current!.save();

        const body = {
            "content": savedData
        }

        await fetch('http://localhost:3000/api/v1/posts/', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
    }, [])

    if(loading) {
        return (
            <LayoutPage>
                Загрузка...
            </LayoutPage>
        )
    }

    console.log(JSON.stringify(content));
    return (
        <LayoutPage>
            <ReactEditorJS defaultValue={content}  onInitialize={handleInitialize}/>
            <button onClick={() => handleSave()}>Сохранить</button>
        </LayoutPage>
    )
}

export default Editor;