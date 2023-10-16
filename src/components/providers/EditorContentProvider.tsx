import React, {createContext, useContext, useState} from "react";
/** types */
import {BlockTypes} from "../../types/BlockTypes.ts";
import {ClientTextContentBlock} from "../../types/blocks/TextContent.ts";

interface Props {
    children: React.ReactElement;
}

interface EditorContentProviderValue {
    editorContent: (ClientTextContentBlock)[];
    setEditorContent: React.Dispatch<React.SetStateAction<ClientTextContentBlock[]>>;
    addEditorContentItem: (item: BlockTypes) => void;
    updateEditorContentItem: (item: ClientTextContentBlock) => void;
    saveEditorContent: () => Promise<boolean>;
    removeEditorContentItem: (item: ClientTextContentBlock) => number;
}

const EditorContentContext = createContext<EditorContentProviderValue | null>(null);

const EditorContentProvider = (props: Props): React.ReactElement => {
    const {children} = props;
    const [editorContent, setEditorContent] = useState<(ClientTextContentBlock)[]>([]);

    const addEditorContentItem = (blockType: BlockTypes): void => {
        let newBlock: ClientTextContentBlock;

        switch (blockType) {
            case BlockTypes.TEXT_CONTENT:
                newBlock = {
                    id: editorContent.length + 1,
                    blockType: blockType,
                    html: '',
                    editorRef: null,
                };

                const updatedContent = [...editorContent, newBlock];
                setEditorContent(updatedContent);
                console.log(updatedContent)
                break;
        }

        // if (newBlock.id) {
        //
        // }
    }

    const updateEditorContentItem = (item: ClientTextContentBlock): void => {
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
                    // todo: fix types
                    // @ts-ignore
                    block.html = await block.editorRef?.getContent();
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