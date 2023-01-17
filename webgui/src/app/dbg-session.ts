
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

class DbgElemText extends DbgElem
{
    text: string = "N/A";
}

class DbgElemTextbox extends DbgElem
{
    text: string = "N/A";
    type: number = 0;
}

class DbgElemRect extends DbgElem
{
    text: string = "";
    textRelPosX: number = 0;
    textRelPosY: number = 0;
}

class DbgSession
{
    id: string = "N/A";
    dbgElemList: DbgElem[] = [];
}