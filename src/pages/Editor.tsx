import LayoutPage from "../layout";
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReactEditorJS } from 'react-editor-js'
import { Message } from '@arco-design/web-react';
import LinkTool from '@editorjs/link'
import Header from '@editorjs/header'
import { OutputData } from "@editorjs/editorjs";
import {PageData} from "../types/PageData.ts";

const ReactEditorJS = createReactEditorJS()
interface EditorCore {
    destroy(): Promise<void>
  
    clear(): Promise<void>
  
    save(): Promise<OutputData>
  
    render(data: OutputData): Promise<void>
}

const host = import.meta.env.VITE_HOST;
const protocol = import.meta.env.VITE_PROTOCOL;
const path = 'api/v1/posts';

const Editor = () => {
    const editorCore = useRef<EditorCore | null>(null);
    const {id} = useParams();
    const [content, setContent] = useState<OutputData | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(!!id);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    }
    
    const handleInitialize = useCallback((instance: EditorCore | null): void => {
        editorCore.current = instance
    }, [])

    useLayoutEffect((): void => {
        if (!id) return;

        const url = `${host}:${protocol}/${path}/${id}`;
        const getPost = async (): Promise<void> => {
            await fetch(url, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
                .then((res: Response) => res.json())
                .then((data: PageData): void => {
                    const {content, title} = data;
                    setContent(content);
                    setTitle(title);
                    setLoading(false);
                });
        }
        getPost();
    }, []);

    const handleSave = useCallback(async (): Promise<void> => {
        const savedData = await editorCore?.current!.save();
        const url = `${host}:${protocol}/${path}/${id}`;

        let body = {
            title,
            content: savedData
        }

        await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((res: Response) => res.json())
            .then((): void => {
                Message.loading({
                    id: 'need_update',
                    content: 'Сохранение...',
                });
                setTimeout((): void => {
                    Message.success({
                        id: 'need_update',
                        content: 'Успешно сохранено!',
                    });
                    navigate('/');
                }, 1000);
        });
    }, [title])

    const handleCreate = async (): Promise<void> => {
        const savedData = await editorCore?.current!.save();
        const url = `${host}:${protocol}/${path}`;

        let body = {
            title,
            content: savedData
        }

        await fetch(url, {
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
                <input
                    className="title-editor"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetTitle(e)}
                    value={title}
                    placeholder="Заголовок"
                />
                <ReactEditorJS 
                    tools={EDITOR_JS_TOOLS}
                    defaultValue={content} 
                    onInitialize={handleInitialize} 
                />
                {
                    id === undefined ?
                        <button className="editor-save" onClick={handleCreate}>Создать</button> :
                        <button className="editor-save" onClick={handleSave}>Сохранить</button>
                }
            </div>
        </LayoutPage>
    )
}

export default Editor;