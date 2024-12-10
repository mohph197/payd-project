import ApplicationLogo from "@/Components/ApplicationLogo";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";

export default function Annonymous({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return !user ? (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link
                                href={route("login")}
                                className="text-gray-500 rounded-lg transition duration-150 flex items-center gap-2 hover:text-black"
                            >
                                <FontAwesomeIcon icon={faRightToBracket} />
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                                className="text-gray-500 rounded-lg transition duration-150 flex items-center gap-2 hover:text-black"
                            >
                                <FontAwesomeIcon icon={faUser} />
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    ) : (
        <AuthenticatedLayout>
            {header}
            {children}
        </AuthenticatedLayout>
    );
}
