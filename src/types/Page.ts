import {PostTypes} from "./PostTypes.ts";
import {DBTextContentBlock} from "./blocks/TextContent.ts";

export interface Page {
    readonly id: number;
    readonly postType: PostTypes.PAGE;
    title: string;
    slug: string;
    content: (DBTextContentBlock)[];
    createdBy: string;
    updatedBy: string | null;
    readonly createdAt: string;
    readonly updatedAt: string | null;
}
