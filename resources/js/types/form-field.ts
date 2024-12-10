export enum FieldCategory {
    GENERAL = "general",
    IDENTITY = "identity",
    BANK_RELATED = "bank-related",
}

export enum FieldType {
    TEXT = "text",
    NUMBER = "number",
    EMAIL = "email",
    PHONE = "phone",
    PASSWORD = "password",
    CURRENCY = "currency",
    TEXTAREA = "textarea",
    DROPDOWN = "dropdown",
    CHECKBOX = "checkbox",
    RADIO = "radio",
}

export type FormField = {
    id?: number;
    name: string;
    category: FieldCategory;
    type: FieldType;
    required: boolean;
    order?: number;
    options?: string[];
    value?: any;
};
