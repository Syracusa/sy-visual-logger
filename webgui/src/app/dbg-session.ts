
abstract class DbgElem
{
    id: string = "N/A";
    xpos: number = 0;
    ypos: number = 0;
    width: number = 0;
    height: number = 0;

    style: string = "";

    draw(): void {}
}

export class DbgElemText extends DbgElem
{
    text: string = "N/A";
}

export class DbgElemTextbox extends DbgElem
{
    text: string = "N/A";
    type: number = 0;
}

export class DbgElemRect extends DbgElem
{
    text: string = "";
    textRelPosX: number = 0;
    textRelPosY: number = 0;
}

type TextListMap = Map<string, DbgElemText>;

type TextboxListMap = Map<string, DbgElemTextbox>;
type RectListMap = Map<string, DbgElemRect>;
export class DbgSession
{
    selected: boolean = false;
    id: string = "N/A";
    dbgElemTextMap: TextListMap = new Map<string, DbgElemText>;
    dbgElemTextboxMap: TextboxListMap = new Map<string, DbgElemTextbox>;
    dbgElemRectMap: RectListMap = new Map<string, DbgElemRect>;
}