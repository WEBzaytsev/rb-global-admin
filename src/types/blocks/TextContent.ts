import {OutputData} from "@editorjs/editorjs";
import {BlockTypes} from "../BlockTypes.ts";

export interface EditorCore {
    destroy(): Promise<void>
    clear(): Promise<void>
    save(): Promise<OutputData>
    render(data: OutputData): Promise<void>
}

export interface TextContent {
    id: number;
    html: EditorCore | null;
    blockType: BlockTypes.TEXT_CONTENT;
    editorRef: EditorCore | null;
    content: OutputData | undefined;
}
