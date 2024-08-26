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
    title: string
}

interface State1 {
    showE: boolean,
    showC: boolean,
    editing: boolean,
    lock: boolean,
    selection: number
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
}