// declarations.d.ts
interface Word {
    id: string;
    chinese: string;
    english: string;
    done?: boolean;
    selected?: boolean;
}

interface Aset {
    id: string,
    tags: string[],
    title: string
}

interface StateFormat {
    showE: boolean,
    showC: boolean,
    onlyPlayUnDone: boolean,
    lock: boolean,
    selection: number,
    rand: boolean,
    init?: boolean,
}

interface Settings {
    timeWW: number,
    timeEE: number,
    timeEL: number,
    timeLC: number,
    speed: number,
    repeat: number,
    letter: boolean,
    chinese: boolean,
    init?: boolean
}

interface GroupsIndexMap {
    [key: string]: string[]
}