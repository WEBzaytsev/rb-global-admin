import LayoutPage from "../layout";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReactEditorJS } from 'react-editor-js'
import { Message } from '@arco-design/web-react';
import LinkTool from '@editorjs/link'
import Header from '@editorjs/header'
import { OutputData } from "@editorjs/editorjs";

const ReactEditorJS = createReactEditorJS()
interface EditorCore {
    destroy(): Promise<void>
  
    clear(): Promise<void>
  
    save(): Promise<OutputData>
  
    render(data: OutputData): Promise<void>
}
const Editor = () => {
    const editorCore = useRef<EditorCore | null>(null);
    const {id} = useParams();
    const [content, setContent] = useState();
    const [loading, setLoading] = useState(id ? true : false);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleSetTitle = (e: any) => {
        setTitle(e.target.value);
    }
    
    const handleInitialize = useCallback((instance: any) => {
        editorCore.current = instance
    }, [])

    if(id) {
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
                    const {content, title} = data;
                    setContent(content);
                    setTitle(title);
                    setLoading(false);
                });
            }
            getPost();
        }, [])
    }

    const handleSave = useCallback(async () => {
        const savedData = await editorCore?.current!.save();

        let body = {
            title,
            "content": savedData
        }

        await fetch(`http://localhost:3000/api/v1/posts/${id}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            Message.loading({
                id: 'need_update',
                content: 'Сохранение...',
            });
            setTimeout(() => {
                Message.success({
                    id: 'need_update',
                    content: 'Успешно сохранено!',
                });
                navigate('/');
            }, 1000);
            console.log(data);
        });
    }, [title])

    const handleCreate = async () => {
        const savedData = await editorCore?.current!.save();

        let body = {
            title,
            "content": savedData
        }

        await fetch(`http://localhost:3000/api/v1/posts/`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });
        Message.loading({
            id: 'need_update',
            content: 'Создание...',
        });
        setTimeout(() => {
            Message.success({
                id: 'need_update',
                content: 'Успешно!',
            });
            navigate('/');
        }, 1000);
    }

    const EDITOR_JS_TOOLS = {
        linkTool: LinkTool,
        header: Header,
      }

    if(loading) {
        return (
            <LayoutPage>
                Загрузка...
            </LayoutPage>
        )
    }

    return (
        <LayoutPage>
            <div className="editor-page">
                <input className="title-editor" onChange={(e) => handleSetTitle(e)} value={title} placeholder="Заголовок" />
                <ReactEditorJS 
                    tools={EDITOR_JS_TOOLS}
                    defaultValue={content} 
                    onInitialize={handleInitialize} 
                />
                {(id === undefined) ? <button className="editor-save" onClick={() => handleCreate()}>Создать</button> : <button className="editor-save" onClick={() => handleSave()}>Сохранить</button>}
            </div>
        </LayoutPage>
    )
}

export default Editor;