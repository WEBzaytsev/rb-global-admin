type DateValuePiece = Date | null;
export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

export interface RbEvent {
    id: number,
    number: number,
    date: DateValue,
    url: string,
    isShow: boolean,
    place: string,
}
