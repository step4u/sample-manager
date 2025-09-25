export type InputType = "select" | "text" | "checkbox" | "radio";

export interface FieldOption {
    id: string;          // UUID-like string
    index: number;
    value: string;
}

export interface Field {
    id: string;           // UUID-like
    label: string;
    type: InputType;
    visible: boolean;
    options: FieldOption[]; // for select/checkbox/radio
}

export interface Sample {
    id: string;            // UUID-like
    name: string;
}
