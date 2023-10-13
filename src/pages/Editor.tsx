import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Message} from '@arco-design/web-react';
import LayoutPage from "../layout";
import PageContent from "../components/PageContent.tsx";
import {createPage, getPage, savePage} from "../api/api.ts";
import {useEditorContentContext} from "../components/providers/EditorContentProvider.tsx";
import {Page} from "../types/Page.ts";
import {BlockTypes} from "../types/BlockTypes.ts";
import {TextContent} from "../types/blocks/TextContent.ts";

const Editor = () => {
    const {id} = useParams();
    const {editorContent, setEditorContent, saveEditorContent} = useEditorContentContext();
    const [loading, setLoading] = useState<boolean>(!!id);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    }

    useEffect((): void => {
        if (!id) return;

        getPage(Number(id))
            .then((data: Page | null) => {
                if (!data) throw Error;

                const {content, title} = data;
                setTitle(title);

                const formattedContent = content.map((block, idx: number) => {
                    if (block.blockType === BlockTypes.TEXT_CONTENT) {
                        return {
                            id: idx,
                            editorRef: null,
                            content: block.html,
                            html: block.html,
                            blockType: block.blockType,
                        } as TextContent;
                    }

                    return block;
                })

                if (formattedContent) setEditorContent(formattedContent);
            })
            // todo: handle error
            .catch(() => {
            })
            .finally((): void => setLoading(false))
    }, []);

    const getContentData = async () => {
        const dataTosSave = [];

        try {
            const isEditorsSaved = await saveEditorContent();

            if (isEditorsSaved) {
                editorContent.forEach((block) => {
                    dataTosSave.push({
                        html: block.content,
                        blockType: block.blockType,
                    });
                })

                return dataTosSave;
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleSave = useCallback(async (): Promise<void> => {
        const savedData = await getContentData();
        console.log(savedData)

        if (!savedData) return;

        const data = {
            title,
            content: savedData
        }

        savePage(Number(id), data)
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
    }, [title, editorContent])

    const handleCreate = async (): Promise<void> => {
        const savedData = await getContentData();

        if (!savedData) return;

        const data = {
            title,
            content: savedData
        }

        await createPage(data);

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

    return (
        <LayoutPage>
            {
                loading ?
                    <p>Загрузка...</p> :
                    <div className="editor-page">
                        <input
                            className="title-editor"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetTitle(e)}
                            value={title}
                            placeholder="Заголовок"
                        />

                        <PageContent/>

                        {
                            id === undefined ?
                                <button className="editor-save" onClick={handleCreate}>Создать</button> :
                                <button className="editor-save" onClick={handleSave}>Сохранить</button>
                        }
                    </div>
            }
        </LayoutPage>
    )
}

export default Editor;