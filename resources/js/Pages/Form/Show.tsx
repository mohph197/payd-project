import FieldDisplay from "@/Components/Form/Field/FieldDisplay";
import { PageProps } from "@/types";
import { FormField } from "@/types/form-field";
import {
    faEdit,
    faPaperPlane,
    faRotate,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "laravel-precognition-react-inertia";
import { useEffect } from "react";

function createInitialData(form: { name: string; fields: FormField[] }) {
    const fields_data = form.fields.reduce((acc, field) => {
        if ([undefined, null].includes(field.value)) {
            acc[field.id!.toString()] = "";
        } else {
            acc[field.id!.toString()] = field.value;
        }
        return acc;
    }, {} as Record<string, any>);

    return {
        fields: fields_data,
    };
}

function getRoute(form_id: number, submission_id?: number) {
    return submission_id !== undefined
        ? route("submission.update", submission_id)
        : route("forms.submit", form_id);
}

function getMethod(submission_id?: number) {
    return submission_id !== undefined ? "patch" : "post";
}

export default function ShowForm({
    auth,
    form,
    country,
    edit_permitted,
    submission_id,
}: PageProps<{
    form: {
        id: number;
        name: string;
        fields: FormField[];
    };
    country: {
        currency_code: string;
        phone_code: string;
    };
    edit_permitted: boolean;
    submission_id?: number;
}>) {
    const { setData, submit, processing, data, reset, errors } = useForm<{
        fields: Record<string, any>;
    }>(
        getMethod(submission_id),
        getRoute(form.id, submission_id),
        createInitialData(form)
    );

    function changeFieldValue(field_id: number, value: any) {
        setData("fields", { ...data.fields, [field_id]: value });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submit({
            preserveScroll: true,
        });
    }

    function handleReset() {
        reset();
    }

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    useEffect(() => {
        console.log(form.fields.map((field) => field.value));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={form.name} />

            <form
                className="py-16 px-32 flex flex-col gap-5"
                onSubmit={handleSubmit}
                onReset={handleReset}
            >
                <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">{form.name}</h1>
                    {auth.user &&
                    edit_permitted &&
                    submission_id === undefined ? (
                        <Link
                            href={route("forms.edit", form.id)}
                            className="px-4 py-2 bg-sky-600 text-white sm:rounded-lg shadow-md hover:shadow-lg transition duration-150 self-start flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            Edit
                        </Link>
                    ) : null}
                </div>
                <div className="flex flex-col gap-4">
                    {form.fields
                        .toSorted((a, b) => a.order! - b.order!)
                        .map((field) => (
                            <FieldDisplay
                                key={field.id}
                                field={field}
                                field_value={field.value}
                                changeValue={(value) =>
                                    changeFieldValue(field.id!, value)
                                }
                                disabled={processing}
                                {...country}
                            />
                        ))}
                </div>
                <div className="flex gap-4">
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
                            <FontAwesomeIcon icon={faPaperPlane} />
                        )}
                        Save Form
                    </button>
                </div>
            </form>
        </div>
    );
}
