import { FieldType, FormField } from "@/types/form-field";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function FieldDisplay({
    field,
    currency_code,
    phone_code,
    changeValue,
    field_value,
    disabled = false,
}: {
    field: FormField;
    currency_code: string;
    phone_code: string;
    changeValue: (value: any) => void;
    field_value?: any;
    disabled?: boolean;
}) {
    const [checkboxValues, setCheckboxValues] = useState<number[] | string>(
        field.type === FieldType.CHECKBOX &&
            ![undefined, null].includes(field_value)
            ? field_value
            : ""
    );

    function isTextualType(type: FieldType) {
        return [
            FieldType.TEXT,
            FieldType.NUMBER,
            FieldType.EMAIL,
            FieldType.PHONE,
            FieldType.PASSWORD,
            FieldType.CURRENCY,
        ].includes(type);
    }

    function getHtmlType(type: FieldType) {
        if (type === FieldType.CURRENCY) {
            return "number";
        }
        if (type === FieldType.PHONE) {
            return "tel";
        }
        if (isTextualType(type)) {
            return type;
        }
        return undefined;
    }

    function isBoxChecked(value: number) {
        if (field.type === FieldType.CHECKBOX && Array.isArray(field_value)) {
            return field_value.includes(value);
        }

        if (field.type === FieldType.RADIO) {
            return field_value === value;
        }

        return false;
    }

    function processTextualValue(value: string) {
        if (field.type === FieldType.CURRENCY) {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? "" : parsed;
        }

        if (field.type === FieldType.NUMBER) {
            const parsed = parseInt(value);
            return isNaN(parsed) ? "" : parsed;
        }

        if (field.type === FieldType.PHONE) {
            if (value.startsWith("0")) {
                value = value.slice(1);
            }
            return value;
        }

        return value;
    }

    function processBoxSelection(checked: boolean, value: number) {
        if (field.type === FieldType.CHECKBOX) {
            setCheckboxValues((prevValues) => {
                if (checked) {
                    if (!Array.isArray(prevValues)) return [value];
                    return [...(prevValues || []), value];
                } else {
                    if (!Array.isArray(prevValues)) return prevValues;
                    return prevValues.filter((val) => val !== value);
                }
            });
        } else {
            if (checked) changeValue(value);
        }
    }

    useEffect(() => {
        if (field.type === FieldType.CHECKBOX) {
            changeValue(checkboxValues);
        }
    }, [checkboxValues]);

    return (
        <div className="bg-white p-3 rounded-lg shadow-md flex flex-col gap-2">
            <label
                htmlFor={`field-${field.id}`}
                className="font-semibold flex gap-1"
            >
                {field.name}
                {field.required ? (
                    <FontAwesomeIcon icon={faAsterisk} color="red" size="xs" />
                ) : null}
            </label>
            {isTextualType(field.type) ? (
                <div className="w-full flex items-stretch h-12">
                    {field.type === FieldType.PHONE && (
                        <div className="text-gray-500 rounded-l-lg h-full flex items-center justify-center bg-gray-100 px-2">
                            {phone_code}
                        </div>
                    )}
                    <input
                        type={getHtmlType(field.type)}
                        id={`field-${field.id}`}
                        name={`field-${field.id}-${field.name}`}
                        className={`p-2 border border-gray-300 rounded-lg w-full ${
                            field.type === FieldType.CURRENCY
                                ? "rounded-r-none"
                                : field.type === FieldType.PHONE
                                ? "rounded-l-none"
                                : ""
                        }`}
                        step={
                            field.type === FieldType.CURRENCY ? 0.01 : undefined
                        }
                        placeholder={
                            field.type === FieldType.CURRENCY
                                ? "0.00"
                                : undefined
                        }
                        defaultValue={field_value}
                        onChange={(e) => {
                            changeValue(processTextualValue(e.target.value));
                        }}
                        disabled={disabled}
                    />
                    {field.type === FieldType.CURRENCY && (
                        <span className="text-gray-500 rounded-r-lg h-full flex items-center justify-center bg-gray-100 px-2">
                            {currency_code}
                        </span>
                    )}
                </div>
            ) : field.type === FieldType.TEXTAREA ? (
                <textarea
                    id={`field-${field.id}`}
                    name={`field-${field.id}-${field.name}`}
                    className="p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    defaultValue={field_value}
                    onChange={(e) => {
                        changeValue(e.target.value);
                    }}
                    disabled={disabled}
                />
            ) : field.type === FieldType.DROPDOWN ? (
                <select
                    id={`field-${field.id}`}
                    name={`field-${field.id}-${field.name}`}
                    className="p-2 border border-gray-300 rounded-lg h-12"
                    defaultValue={
                        ![undefined, null].includes(field_value)
                            ? parseInt(field_value)
                            : ""
                    }
                    onChange={(e) => {
                        const parsed = parseInt(e.target.value);
                        changeValue(isNaN(parsed) ? "" : parsed);
                    }}
                    disabled={disabled}
                >
                    <option value=""></option>
                    {Array.isArray(field.options) &&
                        field.options.map((option, index) => (
                            <option key={index} value={index}>
                                {option}
                            </option>
                        ))}
                </select>
            ) : (
                <div className="flex flex-col gap-2">
                    {field.options &&
                        field.options.map((option, index) => (
                            <label
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type={field.type}
                                    className="p-2 border border-gray-300 w-5 h-5"
                                    id={`field-${field.id}-${index}`}
                                    name={`field-${field.id}-${field.name}`}
                                    value={index}
                                    defaultChecked={isBoxChecked(index)}
                                    onChange={(e) => {
                                        processBoxSelection(
                                            e.target.checked,
                                            parseInt(e.target.value)
                                        );
                                    }}
                                    disabled={disabled}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                </div>
            )}
        </div>
    );
}
