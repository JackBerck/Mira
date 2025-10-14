import { introductionNavigation } from '@/data/navigation';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function GuestNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="section-padding-x fixed top-0 z-50 w-full bg-white shadow-sm">
            <div className="container max-w-screen-xl">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <div className="flex flex-shrink-0 items-center">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-blue-600"
                            >
                                Mira
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {introductionNavigation.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex-shrink-0">
                            <Link
                                href="/login"
                                className="relative inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
                        >
                            {isOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 pt-2 pb-3">
                        {introductionNavigation.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                {item.title}
                            </Link>
                        ))}
                        <Link
                            href="/register"
                            className="block rounded border-l-4 border-transparent bg-blue-600 py-2 pr-4 pl-3 text-base font-medium text-gray-500 text-white hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
