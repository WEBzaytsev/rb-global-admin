import React, {createContext, useContext, useState} from "react";
/** types */
import {BlockTypes} from "../../types/BlockTypes.ts";
import {TextContent} from "../../types/blocks/TextContent.ts";

interface Props {
    children: React.ReactElement;
}

interface EditorContentProviderValue {
    editorContent: (TextContent)[];
    setEditorContent: React.Dispatch<React.SetStateAction<TextContent[]>>;
    addEditorContentItem: (item: TextContent) => void;
    updateEditorContentItem: (item: TextContent) => void;
    saveEditorContent: () => Promise<boolean>;
    removeEditorContentItem: (item: TextContent) => number;
}

const EditorContentContext = createContext<EditorContentProviderValue | null>(null);

const EditorContentProvider = (props: Props): React.ReactElement => {
    const {children} = props;
    const [editorContent, setEditorContent] = useState<(TextContent)[]>([]);

    const addEditorContentItem = (item: TextContent): void => {
        const updatedContent = [...editorContent, item];
        setEditorContent(updatedContent);
    }

    const updateEditorContentItem = (item: TextContent) => {
        setEditorContent((prevContent) =>
            prevContent.map((el) =>
                el.id === item.id ? item : el
            )
        );
    }

    const saveEditorContent = async (): Promise<boolean> => {
        try {
            const savePromises = editorContent.map( async (block) => {
                if (block.blockType === BlockTypes.TEXT_CONTENT) {
                    // todo: fix types
                    // @ts-ignore
                    block.content = await block.editorRef?.current!.save();
                }
            });

            await Promise.all(savePromises);
            return true;
        } catch (error) {
            return false;
        }
    }

    const removeEditorContentItem = (item: TextContent): number => {
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