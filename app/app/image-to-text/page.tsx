"use client";
import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
    Button
} from "flowbite-react";
import Link from "next/link";
export default function LandingPage() {
    return (
        <div className="antialiased bg-white dark:bg-gray-900">
            {/* HEADER / NAV */}
            <header className="fixed w-full">
                <Navbar fluid>
                    <NavbarBrand href="/">
                        {/* Ensure this path matches public/images/logo.svg */}
                        <img
                            src="/images/imageLab_dark.png"
                            className="mr-3 h-6 sm:h-9"
                            alt="Landwind Logo"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            Landwind
                        </span>
                    </NavbarBrand>

                    <div className="flex md:order-2">
                        {/* 'primary' refers to the blue colors we added to globals.css */}
                        <Button color="primary" href="#" className="hidden sm:inline-flex">
                            Get started
                        </Button>
                        <NavbarToggle />
                    </div>

                    <NavbarCollapse>
                        <NavbarLink href="#" active>Home</NavbarLink>
                        <NavbarLink href="#">Company</NavbarLink>
                        <NavbarLink href="#">Marketplace</NavbarLink>
                        <NavbarLink href="#">Features</NavbarLink>
                        <NavbarLink href="#">Team</NavbarLink>
                        <NavbarLink href="#">Contact</NavbarLink>
                    </NavbarCollapse>
                </Navbar>
            </header>

            {/* HERO SECTION */}
            <section className="bg-white dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 pt-28 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-32">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
                            Turn Any Image Into <br />Clean, Editable Text.
                        </h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                            Upload screenshots, receipts, or handwritten notes and get accurate OCR results in seconds. Built for speed and privacy.
                        </p>
                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <Link
                                href="/auth"
                                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white bg-purple-700 rounded-lg sm:w-auto hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                            >
                                Start Converting Now
                            </Link>
                            <Link
                                href="#features"
                                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            >
                                How it works
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        {/* You can replace this src with your own product screenshot/illustration */}
                        <div className="bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl w-full h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <p className="text-gray-400 italic">Product Preview Image</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BAR / LOGOS */}
            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-16">
                    <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-wider mb-8">Trusted by students and professionals</p>
                    <div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 sm:grid-cols-3 lg:grid-cols-4 dark:text-gray-400 opacity-60 grayscale">
                        {/* Example Placeholder Icons */}
                        <div className="flex items-center justify-center font-bold text-xl">FAST OCR</div>
                        <div className="flex items-center justify-center font-bold text-xl">PRIVACY+</div>
                        <div className="flex items-center justify-center font-bold text-xl">SECURE</div>
                        <div className="flex items-center justify-center font-bold text-xl">ACCURATE</div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="bg-gray-50 dark:bg-gray-800 py-20">
                <div className="max-w-screen-xl px-4 mx-auto space-y-12 lg:space-y-20">
                    <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
                        <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Professional Grade OCR</h2>
                            <p className="mb-8 font-light lg:text-xl">Our engine handles complex layouts and various font types to give you the cleanest text possible.</p>
                            <ul className="pt-8 space-y-5 border-t border-gray-200 dark:border-gray-700">
                                <li className="flex space-x-3">
                                    <CheckIcon />
                                    <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Batch processing coming soon</span>
                                </li>
                                <li className="flex space-x-3">
                                    <CheckIcon />
                                    <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">History tracking for all scans</span>
                                </li>
                                <li className="flex space-x-3">
                                    <CheckIcon />
                                    <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">3 Daily extractions for free</span>
                                </li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <FeatureCard title="Fast" desc="Results in under 2 seconds." />
                            <FeatureCard title="Safe" desc="Images are never stored." />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
                    <div className="max-w-screen-sm mx-auto text-center">
                        <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Ready to save hours of typing?</h2>
                        <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Join users who have already converted thousands of images to digital text.</p>
                        <Link href="/auth" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800">Free Trial Account</Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
                    <div className="text-center">
                        <span className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white">
                            Image→Text
                        </span>
                        <p className="my-6 text-gray-500 dark:text-gray-400">The fastest way to digitize your physical documents.</p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">© 2024 ImageToText™. All Rights Reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="flex-shrink-0 w-5 h-5 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
    );
}