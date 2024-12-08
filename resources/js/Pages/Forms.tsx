import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({
    forms,
}: PageProps<{
    forms: [
        {
            id: number;
            name: string;
        }
    ];
}>) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {forms.map((form) => (
                        <Link
                            key={form.id}
                            href={route("forms.edit", form.id)}
                            className="p-6 bg-white sm:rounded-lg shadow-sm"
                        >
                            <h3 className="font-semibold text-gray-800">
                                {form.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
