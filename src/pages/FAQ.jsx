import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  MessageCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  Sparkles,
} from "lucide-react";
import SiteLayout from "../components/SiteLayout";

const faqSections = [
  {
    title: "Getting Started",
    icon: Sparkles,
    questions: [
      {
        question: "What is PaprIQ?",
        answer:
          "PaprIQ is an AI-powered PDF assistant that lets you upload documents, ask questions, and find information from your PDFs using AI.",
      },
      {
        question: "How do I use PaprIQ?",
        answer:
          "Create an account, log in, upload a PDF document, and start asking questions about its contents.",
      },
      {
        question: "Which file formats are supported?",
        answer:
          "PaprIQ is designed for PDF documents. Make sure your document is a valid PDF before uploading it.",
      },
    ],
  },
  {
    title: "AI and Documents",
    icon: FileText,
    questions: [
      {
        question: "How does the AI answer my questions?",
        answer:
          "PaprIQ processes your uploaded PDF and uses its content to generate answers to your questions. AI-generated answers may not always be accurate, so verify important information against the original document.",
      },
      {
        question: "Can I ask multiple questions about a PDF?",
        answer:
          "Yes. You can ask multiple questions about your uploaded document, subject to your plan's monthly question limit.",
      },
      {
        question: "Can AI make mistakes?",
        answer:
          "Yes. AI responses can sometimes be incomplete or incorrect. Always check important details against your original PDF.",
      },
    ],
  },
  {
    title: "Account and Plans",
    icon: CreditCard,
    questions: [
      {
        question: "Is there a free plan?",
        answer:
          "Yes. The Free plan includes 5 questions per month. You can upgrade to Pro for a higher monthly question allowance.",
      },
      {
        question: "What is included in the Pro plan?",
        answer:
          "The Pro plan includes up to 1,000 questions per month. Check the Pricing page for current plan and payment details.",
      },
      {
        question: "How can I manage my subscription?",
        answer:
          "You can manage your subscription from your account's subscription or billing section, where available.",
      },
      {
        question: "Can I change my account details?",
        answer:
          "You can manage your available profile information from the Profile section of your PaprIQ dashboard.",
      },
      {
        question: "Are payments refundable?",
        answer:
          "All payments made for PaprIQ subscriptions are non-refundable. Once a payment is completed, we do not offer refunds or reimbursements for unused subscription periods, unused questions, or partial billing periods.",
      },
    ],
  },
  {
    title: "Privacy and Support",
    icon: ShieldCheck,
    questions: [
      {
        question: "Is my information secure?",
        answer:
          "PaprIQ uses account authentication and security measures to protect user information. Please review our Privacy Policy for details about data handling.",
      },
      {
        question: "Who can I contact if I need help?",
        answer:
          "You can contact our support team at creatoremerging@gmail.com or use the Helpbox section if it is available in your account.",
      },
      {
        question: "Where can I read the privacy and terms policies?",
        answer:
          "You can find these documents on our Privacy Policy and Terms of Service pages.",
      },
    ],
  },
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (id) => {
    setOpenQuestion((current) => (current === id ? null : id));
  };

  return (
    <SiteLayout>

    <div className="min-h-screen bg-[#080b18] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
            <MessageCircle className="h-7 w-7 text-violet-400" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Help Center
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Find answers to common questions about PaprIQ, uploading PDFs,
            AI-powered answers, subscriptions, and your account.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;

            return (
              <section key={section.title}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <SectionIcon size={18} />
                  </div>

                  <h2 className="text-lg font-semibold text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.questions.map((item, questionIndex) => {
                    const id = `${sectionIndex}-${questionIndex}`;
                    const isOpen = openQuestion === id;

                    return (
                      <div
                        key={id}
                        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-violet-400/30"
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(id)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                        >
                          <span className="font-medium text-slate-200">
                            {item.question}
                          </span>

                          <ChevronDown
                            size={19}
                            className={`shrink-0 text-violet-400 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="border-t border-white/[0.06] px-5 py-4">
                            <p className="text-sm leading-7 text-slate-400">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-16 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/[0.04] p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold">Still have questions?</h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-400">
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>

          <a
            href="mailto:creatoremerging@gmail.com"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Contact Support
            <MessageCircle size={16} />
          </a>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="text-sm text-slate-400 transition hover:text-violet-400"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
    </SiteLayout>

  );
}
