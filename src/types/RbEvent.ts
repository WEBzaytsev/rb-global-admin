import {PostTypes} from "./PostTypes.ts";

type DateValuePiece = Date | null;
export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

export interface RbEvent {
    readonly id: number;
    readonly postType: PostTypes.EVENT;
    number: number;
    date: DateValue;
    place: string;
    url: string;
    isShow: boolean;
    readonly createdAt: string;
    readonly updatedAt: string | null;
}
