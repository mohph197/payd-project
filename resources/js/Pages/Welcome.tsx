import AnnonymousLayout from "@/Layouts/AnonymousLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <AnnonymousLayout>
            <Head title="Welcome" />
            <h1 className="text-4xl font-bold text-center text-black/50 h-96 flex justify-center items-center">
                Welcome
            </h1>
        </AnnonymousLayout>
    );
}
