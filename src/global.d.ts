// declarations.d.ts
interface Word {
    id: string;
    chinese: string;
    english: string;
    done?: boolean;
}

interface State1 {
    showE: boolean,
    showC: boolean,
    Editing: boolean,
    selection: number
}