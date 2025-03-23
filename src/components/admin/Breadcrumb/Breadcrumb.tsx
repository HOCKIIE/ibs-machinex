"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChevronForwardOutline } from "react-icons/io5";

const Breadcrumb = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment);

    function UcFirst(str:string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <nav className="text-sm text-gray-500">
            <ul className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        Home
                    </Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;
                    return (
                        <li key={href} className="flex items-center">
                            <span className="mx-2"><IoChevronForwardOutline/></span>
                            {isLast ? (
                                <span className="text-gray-700 dark:text-gray-500">{decodeURIComponent(UcFirst(segment))}</span>
                            ) : (
                                <Link href={href} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    {decodeURIComponent(UcFirst(segment))}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
