import React, {useCallback, useRef} from "react";
import {createReactEditorJS} from "react-editor-js";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";
import {EditorCore, TextContent as TextContentType} from "../../types/blocks/TextContent.ts";
import {useEditorContentContext} from "../providers/EditorContentProvider.tsx";

const ReactEditorJS = createReactEditorJS();

interface Props {
    block: TextContentType;
}

const TextContent = (props: Props) => {
    const {block} = props;
    const {editorContent, updateEditorContentItem} = useEditorContentContext();
    const editorCore = useRef<EditorCore | null>(null);

    const isCurrentBlockRefSet = (): boolean =>
        Boolean(editorContent.find((item) => item.id === block.id)?.editorRef);

    const handleInitialize = useCallback((instance: EditorCore | null): void => {
        editorCore.current = instance;

        if (isCurrentBlockRefSet()) return;

        // todo: fix types
        // @ts-ignore
        updateEditorContentItem({...block, editorRef: editorCore});
    }, []);

    const EDITOR_JS_TOOLS = {
        linkTool: LinkTool,
        header: Header,
    }

    return (
        <ReactEditorJS
            tools={EDITOR_JS_TOOLS}
            defaultValue={block.content}
            onInitialize={handleInitialize}
        />
    )
}

export default TextContent;