import FieldCreator from "@/Components/Form/Field/FieldCreator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { FieldCategory, FieldType, FormField } from "@/types/form-field";
import {
    faAdd,
    faRotate,
    faSave,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head } from "@inertiajs/react";
import { useForm } from "laravel-precognition-react-inertia";
import { useEffect, useState } from "react";

export default function EditForm({
    form,
    countries,
}: PageProps<{
    form: {
        id: number;
        name: string;
        country_code: string;
        fields: FormField[];
    };
    countries: [
        {
            code: string;
            name: string;
        }
    ];
}>) {
    const [formFields, setFormFields] = useState<FormField[]>(
        form.fields.toSorted((a, b) => a.order! - b.order!)
    );
    const [lastId, setLastId] = useState(
        form.fields.length === 0
            ? 0
            : Math.max(...form.fields.map((field) => field.id!))
    );
    const [removedFields, setRemovedFields] = useState<number[]>([]);
    const [addedIds, setAddedIds] = useState<number[]>([]);
    const { setData, submit, processing, reset, errors } = useForm<{
        name: string;
        country_code: string;
        fields: FormField[];
        removed_fields: number[];
    }>("patch", route("forms.update", form.id), {
        name: form.name,
        country_code: form.country_code,
        fields: [],
        removed_fields: [],
    });

    function addField() {
        const newId = lastId + 1;
        setFormFields((fields) => {
            return [
                ...fields,
                {
                    id: newId,
                    name: "",
                    category: FieldCategory.GENERAL,
                    type: FieldType.TEXT,
                    required: false,
                },
            ];
        });
        setLastId(newId);
        setAddedIds((ids) => [...ids, newId]);
    }

    function moveField(direction: "up" | "down", field_id: number) {
        setFormFields((fields) => {
            const index = fields.findIndex((field) => field.id === field_id);
            const newIndex = direction === "up" ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= fields.length) {
                return fields;
            }
            const newFields = [...fields];
            newFields[index] = newFields[newIndex];
            newFields[newIndex] = fields[index];
            return newFields;
        });
    }

    function updateField(field_id: number, attribute: string, value: any) {
        setFormFields((fields) =>
            fields.map((field) =>
                field.id === field_id ? { ...field, [attribute]: value } : field
            )
        );
    }

    function removeField(field_id: number) {
        setFormFields((fields) =>
            fields.filter((field) => field.id !== field_id)
        );
        if (!addedIds.includes(field_id)) {
            setRemovedFields((ids) => [...ids, field_id]);
        }
    }

    useEffect(() => {
        setData(
            (prevData: {
                name: string;
                country_code: string;
                fields: FormField[];
                removed_fields: number[];
            }) => ({
                ...prevData,
                removed_fields: removedFields,
                fields: formFields.map(({ id, ...field }, index) => {
                    if (addedIds.includes(id!)) {
                        return {
                            ...field,
                            order: index,
                        };
                    }

                    return {
                        id,
                        ...field,
                        order: index,
                    };
                }),
            })
        );
    }, [formFields, addedIds, removedFields]);

    function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submit({
            preserveScroll: true,
        });
    }

    function resetForm() {
        reset();
        setFormFields(form.fields.toSorted((a, b) => a.order! - b.order!));
        setRemovedFields([]);
        setAddedIds([]);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Edit Form" />

            <div className="p-12 flex flex-col gap-5">
                <h1 className="text-2xl font-semibold">Edit Form</h1>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={submitForm}
                    onReset={resetForm}
                >
                    {errors.fields && (
                        <div className="bg-red-100 text-red-700 p-2 rounded-lg">
                            {errors.fields}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr,1fr]">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold">
                                Form Name
                            </label>
                            {errors.name && (
                                <div className="text-red-700">
                                    {errors.name}
                                </div>
                            )}
                            <input
                                type="text"
                                id="name"
                                name="name"
                                // className="p-2 border border-gray-300 rounded-lg"
                                className={`p-2 border rounded-lg ${
                                    errors.name
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                disabled={processing}
                                defaultValue={form.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="country" className="font-semibold">
                                Select Country
                            </label>
                            {errors.country_code && (
                                <div className="text-red-700">
                                    {errors.country_code}
                                </div>
                            )}
                            <select
                                id="country"
                                name="country"
                                // className="p-2 border border-gray-300 rounded-lg"
                                className={`p-2 border rounded-lg ${
                                    errors.country_code
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                disabled={processing}
                                defaultValue={form.country_code}
                                onChange={(e) =>
                                    setData("country_code", e.target.value)
                                }
                            >
                                <option value=""></option>
                                {countries.map((country) => (
                                    <option
                                        key={country.code}
                                        value={country.code}
                                    >
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {formFields.map((field, index) => (
                        <FieldCreator
                            key={field.id}
                            index={index}
                            field={field}
                            errors={errors}
                            disabled={processing}
                            moveField={(direction) =>
                                field.id !== undefined &&
                                moveField(direction, field.id)
                            }
                            removeField={() =>
                                field.id !== undefined && removeField(field.id)
                            }
                            updateField={(attribute, value) =>
                                field.id !== undefined &&
                                updateField(field.id, attribute, value)
                            }
                        />
                    ))}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 flex items-center gap-2"
                            onClick={addField}
                            disabled={processing}
                        >
                            <FontAwesomeIcon icon={faAdd} />
                            Add Field
                        </button>
                        <button
                            type="reset"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 flex items-center gap-2"
                            disabled={processing}
                        >
                            <FontAwesomeIcon icon={faRotate} />
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 flex items-center gap-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                                <FontAwesomeIcon icon={faSave} />
                            )}
                            Save Form
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
