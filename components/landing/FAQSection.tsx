"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "What does the Free plan offer?",
        answer: "Our Free plan includes access to basic tools with limited usage quotas perfect for individual use and testing out our features."
    },
    {
        question: "Can I try before I buy?",
        answer: "Yes, you can try all premium features for free for 14 days. No credit card required."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll keep access until the end of your billing period."
    },
    {
        question: "Is there a limit on users or licenses?",
        answer: "The Personal plan is for a single user. For teams, please contact us for our Enterprise licensing options."
    },
    {
        question: "Is there a discount on yearly plans?",
        answer: "Yes! We offer a 20% discount if you choose to be billed annually instead of monthly."
    },
    {
        question: "How secure is my data?",
        answer: "We use industry-standard encryption and security practices to ensure your data remains safe and private at all times."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

                <h2 className="text-3xl font-bold tracking-tight text-center text-[#0F172A] mb-12">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-b border-slate-200"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
                            >
                                <span className="text-lg font-semibold text-[#0F172A]">
                                    {faq.question}
                                </span>
                                <span className="ml-6 flex-shrink-0 text-slate-500">
                                    {openIndex === index ? (
                                        <div className="bg-slate-900 text-white rounded-full p-1"><Minus className="h-4 w-4" /></div>
                                    ) : (
                                        <div className="bg-slate-100 text-slate-900 rounded-full p-1"><Plus className="h-4 w-4" /></div>
                                    )}
                                </span>
                            </button>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openIndex === index ? "max-h-48 opacity-100 pb-6" : "max-h-0 opacity-0"
                                )}
                            >
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
