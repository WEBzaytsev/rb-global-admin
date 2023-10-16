import {OutputData} from "@editorjs/editorjs";
import {BlockTypes} from "../BlockTypes.ts";

export interface EditorCore {
    destroy(): Promise<void>
    clear(): Promise<void>
    save(): Promise<OutputData>
    render(data: OutputData): Promise<void>
}

export interface DBTextContentBlock {
    id: number;
    html: OutputData | undefined;
    blockType: BlockTypes.TEXT_CONTENT;
}

export interface ClientTextContentBlock extends DBTextContentBlock {
    editorRef: {
        current: EditorCore | null
    } | null;
}
