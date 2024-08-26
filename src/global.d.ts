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