import FieldCreator from "@/Components/Form/Field/FieldCreator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { FieldCategory, FieldType, FormField } from "@/types/form-field";
import { faAdd, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head } from "@inertiajs/react";
import { useForm } from "laravel-precognition-react-inertia";
import { useEffect, useState } from "react";

export default function CreateForm({
    countries,
}: PageProps<{
    countries: [
        {
            code: string;
            name: string;
        }
    ];
}>) {
    const [formFields, setFormFields] = useState<FormField[]>([]);
    const [lastId, setLastId] = useState(0);
    const { setData, submit, processing } = useForm<{
        name: string;
        country_code: string;
        fields: FormField[];
    }>("post", route("forms.store"), {
        name: "",
        country_code: "",
        fields: [],
    });

    function addField() {
        setFormFields((fields) => {
            const newId = lastId + 1;
            setLastId(newId);

            return [
                ...fields,
                {
                    id: lastId + 1,
                    name: "",
                    category: FieldCategory.GENERAL,
                    type: FieldType.TEXT,
                    required: false,
                },
            ];
        });
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
    }

    useEffect(() => {
        setData(
            "fields",
            formFields.map(({ id, ...field }, index) => ({
                ...field,
                order: index,
            }))
        );
    }, [formFields]);

    function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submit();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Form" />

            <div className="p-12 flex flex-col gap-5">
                <h1 className="text-2xl font-semibold">Form Creation</h1>
                <form className="flex flex-col gap-4" onSubmit={submitForm}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr,1fr]">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold">
                                Form Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="p-2 border border-gray-300 rounded-lg"
                                disabled={processing}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="country" className="font-semibold">
                                Select Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                className="p-2 border border-gray-300 rounded-lg"
                                disabled={processing}
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
                    {formFields.map((field) => (
                        <FieldCreator
                            key={field.id}
                            field={field}
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
