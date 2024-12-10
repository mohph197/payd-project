import { FieldCategory, FieldType, FormField } from "@/types/form-field";
import {
    faAdd,
    faArrowDown,
    faArrowUp,
    faTrash,
    faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function FieldCreator({
    field,
    updateField,
    moveField,
    removeField,
    disabled = true,
}: {
    field: FormField;
    updateField: (attribute: string, value: any) => void;
    moveField: (direction: "up" | "down") => void;
    removeField: () => void;
    disabled?: boolean;
}) {
    const [options, setOptions] = useState<string[] | undefined>();

    function requiresOptions(type: FieldType) {
        return [
            FieldType.DROPDOWN,
            FieldType.RADIO,
            FieldType.CHECKBOX,
        ].includes(type);
    }

    function updateOption(index: number, option: string) {
        setOptions((options) => {
            if (!options) return options;
            const newOptions = [...options];
            newOptions[index] = option;
            return newOptions;
        });
    }

    function addOption() {
        setOptions((options) => {
            if (!options) return [""];
            return [...options, ""];
        });
    }

    function removeOption(index: number) {
        setOptions((options) => {
            if (!options) return options;
            return options.filter((_, optionIndex) => optionIndex !== index);
        });
    }

    useEffect(() => {
        if (options) updateField("options", options);
    }, [options]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
            <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-2 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 flex gap-2 items-center justify-center w-8 h-8"
                        onClick={() => moveField("up")}
                        disabled={disabled}
                    >
                        <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                    <button
                        type="button"
                        className="px-2 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 flex gap-2 items-center justify-center w-8 h-8"
                        onClick={() => moveField("down")}
                        disabled={disabled}
                    >
                        <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                </div>
                <button
                    type="button"
                    className="px-2 py-1 bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 flex gap-2 items-center"
                    onClick={removeField}
                    disabled={disabled}
                >
                    <FontAwesomeIcon icon={faTrash} />
                    Remove
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-items-stretch">
                <div className="flex gap-4 items-center">
                    <label
                        htmlFor={`field-name-${field.id}`}
                        className="font-semibold min-w-max"
                    >
                        Field Name
                    </label>
                    <input
                        type="text"
                        id={`field-name-${field.id}`}
                        name="name"
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        defaultValue={field.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        disabled={disabled}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <label
                        htmlFor={`field-category-${field.id}`}
                        className="font-semibold min-w-max"
                    >
                        Field Category
                    </label>
                    <select
                        id={`field-category-${field.id}`}
                        name="category"
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        value={field.category}
                        onChange={(e) =>
                            updateField(
                                "category",
                                e.target.value as FieldCategory
                            )
                        }
                        disabled={disabled}
                    >
                        {Object.values(FieldCategory).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4 items-center">
                    <label
                        htmlFor={`field-type-${field.id}`}
                        className="font-semibold min-w-max"
                    >
                        Field Type
                    </label>
                    <select
                        id={`field-type-${field.id}`}
                        name="type"
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        value={field.type}
                        onChange={(e) => {
                            updateField("type", e.target.value as FieldType);
                            if (!requiresOptions(e.target.value as FieldType)) {
                                setOptions(undefined);
                            }
                        }}
                        disabled={disabled}
                    >
                        {Object.values(FieldType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4 items-center">
                    <label
                        htmlFor={`field-required-${field.id}`}
                        className="font-semibold min-w-max"
                    >
                        Required
                    </label>
                    <input
                        type="checkbox"
                        id={`field-required-${field.id}`}
                        name="required"
                        className="p-2 border border-gray-300 rounded-full w-5 h-5"
                        defaultChecked={field.required}
                        onChange={(e) =>
                            updateField("required", e.target.checked)
                        }
                        disabled={disabled}
                    />
                </div>
            </div>
            {requiresOptions(field.type) && (
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor={`field-options-${field.id}`}
                        className="font-semibold"
                    >
                        Options
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {options != undefined &&
                            options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                >
                                    <button
                                        type="button"
                                        className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 aspect-square h-8 w-8 flex items-center justify-center"
                                        onClick={() => removeOption(index)}
                                        disabled={disabled}
                                    >
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                    <input
                                        type="text"
                                        id={`field-option-${field.id}-${index}`}
                                        name={`option-${index}`}
                                        className="p-2 border border-gray-300 rounded-lg"
                                        value={option}
                                        onChange={(e) =>
                                            updateOption(index, e.target.value)
                                        }
                                        disabled={disabled}
                                    />
                                </div>
                            ))}
                        <button
                            type="button"
                            className="px-2 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 justify-self-start flex gap-2 items-center"
                            onClick={() => addOption()}
                            disabled={disabled}
                        >
                            <FontAwesomeIcon icon={faAdd} />
                            Add Option
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
