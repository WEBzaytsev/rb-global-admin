import React, {createContext, useContext, useState} from "react";
/** types */
import {BlockTypes} from "../../types/BlockTypes.ts";
import {ClientTextContentBlock, EditorCore} from "../../types/blocks/TextContent.ts";
import {OutputData} from "@editorjs/editorjs";

interface Props {
    children: React.ReactElement;
}

interface EditorContentProviderValue {
    editorContent: (ClientTextContentBlock)[];
    setEditorContent: React.Dispatch<React.SetStateAction<ClientTextContentBlock[]>>;
    addEditorContentItem: (item: ClientTextContentBlock) => void;
    updateEditorContentItem: (item: {
        editorRef: React.MutableRefObject<EditorCore | null>;
        blockType: BlockTypes.TEXT_CONTENT;
        html: OutputData | undefined;
        id: number
    }) => void;
    saveEditorContent: () => Promise<boolean>;
    removeEditorContentItem: (item: ClientTextContentBlock) => number;
}

const EditorContentContext = createContext<EditorContentProviderValue | null>(null);

const EditorContentProvider = (props: Props): React.ReactElement => {
    const {children} = props;
    const [editorContent, setEditorContent] = useState<(ClientTextContentBlock)[]>([]);

    const addEditorContentItem = (item: ClientTextContentBlock): void => {
        const updatedContent = [...editorContent, item];
        setEditorContent(updatedContent);
    }

    const updateEditorContentItem = (item: ClientTextContentBlock) => {
        setEditorContent((prevContent: (ClientTextContentBlock)[]) =>
            prevContent.map((el: ClientTextContentBlock) =>
                el.id === item.id ? item : el
            )
        );
    }

    const saveEditorContent = async (): Promise<boolean> => {
        try {
            const savePromises = editorContent.map( async (block) => {
                if (block.blockType === BlockTypes.TEXT_CONTENT) {
                    block.html = await block.editorRef?.current!.save();
                }
            });

            await Promise.all(savePromises);
            return true;
        } catch (error) {
            return false;
        }
    }

    const removeEditorContentItem = (item: ClientTextContentBlock): number => {
        const updatedContent = editorContent.filter((block) => block.id !== item.id)
        setEditorContent(updatedContent);
        return item.id;
    }

    return (
        <EditorContentContext.Provider value={{
            editorContent,
            addEditorContentItem,
            updateEditorContentItem,
            setEditorContent,
            saveEditorContent,
            removeEditorContentItem
        }}>
            {children}
        </EditorContentContext.Provider>
    )
}

export const useEditorContentContext = (): EditorContentProviderValue => {
    const context = useContext(EditorContentContext);
    if (context === null) {
        throw new Error("useEditorContentContext must be used within an EditorContentProvider");
    }
    return context;
};

export default EditorContentProvider;