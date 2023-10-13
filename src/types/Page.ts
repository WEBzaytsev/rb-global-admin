import {PostTypes} from "./PostTypes.ts";
import {TextContent} from "./blocks/TextContent.ts";

export interface Page {
    readonly id: number;
    readonly postType: PostTypes.PAGE;
    title: string;
    slug: string;
    content: (TextContent)[];
    createdBy: string;
    updatedBy: string | null;
    readonly createdAt: string;
    readonly updatedAt: string | null;
}
