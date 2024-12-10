import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({
    forms,
    submissions,
}: PageProps<{
    forms: [
        {
            id: number;
            name: string;
        }
    ];
    submissions: [
        {
            id: number;
            form_name: string;
        }
    ];
}>) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="p-12 flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <Link
                        href={route("forms.create")}
                        className="px-4 py-2 bg-sky-600 text-white sm:rounded-lg shadow-md hover:shadow-lg transition duration-150 self-start flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} color="white" />
                        Create Form
                    </Link>
                    {forms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {forms.map((form, index) => (
                                <Link
                                    key={index}
                                    href={route("forms.show", form.id)}
                                    className="p-6 bg-white sm:rounded-lg shadow-md hover:shadow-lg transition duration-150 hover:scale-105"
                                >
                                    <h3 className="font-semibold text-gray-800">
                                        {form.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            You have no created forms yet. Once you create a
                            form, you will see it here.
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Submissions</h2>
                    {submissions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {submissions.map((submission, index) => (
                                <Link
                                    key={index}
                                    href={route(
                                        "submission.show",
                                        submission.id
                                    )}
                                    className="p-6 bg-white sm:rounded-lg shadow-md hover:shadow-lg transition duration-150 hover:scale-105"
                                >
                                    <h3 className="font-semibold text-gray-800">
                                        {submission.form_name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            You have no submissions yet. Once you have
                            submissions, you will see them here.
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
