import {BlockTypes} from "../BlockTypes.ts";
import {Ref} from "react";

export interface DBTextContentBlock {
    id: number;
    html: string;
    blockType: BlockTypes.TEXT_CONTENT;
}

export interface ClientTextContentBlock extends DBTextContentBlock {
    // todo: fix any
    editorRef: Ref<any>;
}
