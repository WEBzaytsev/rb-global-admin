import React, {useRef, useState} from "react";
import {ClientTextContentBlock} from "../../types/blocks/TextContent.ts";
import {useEditorContentContext} from "../providers/EditorContentProvider.tsx";
import {Editor} from '@tinymce/tinymce-react';

interface Props {
    block: ClientTextContentBlock;
}

const TextContent = (props: Props) => {
    const {block} = props;
    const {updateEditorContentItem} = useEditorContentContext();
    const [isEditor, setIsEditor] = useState(false);
    const [value, setValue] = useState(block.html);

    const editorRef = useRef(null);

    // todo: fix types
    // @ts-ignore
    const handleInitialize = (evt, editor): void => {
        editorRef.current = editor;
        updateEditorContentItem({...block, editorRef: editorRef.current});
    };

    // const showEditor = () => setIsEditor(true);
    const hideEditor = () => setIsEditor(false);

    return (
        <>
            {/*{isEditor || value.trim() === '' ? (*/}
            <Editor
                apiKey="cb4hlcyhyugrpps31s1942gf87i4875wjdmfkon2ux16ndou"
                onInit={handleInitialize}
                onBlur={hideEditor}
                onEditorChange={(newValue) => setValue(newValue)}
                value={value}
                init={{
                    height: 300,
                    menubar: true,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            {/*) : (*/}
            {/*    <div onClick={showEditor} dangerouslySetInnerHTML={{__html: value}} />*/}
            {/*)}*/}
        </>
    )
}

export default TextContent;