import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of These Terms",
    content: (
      <p>
        By accessing or using PaprIQ AI, you agree to these Terms &
        Conditions. If you do not agree, you should not use the service.
      </p>
    ),
  },
  {
    title: "2. About PaprIQ AI",
    content: (
      <p>
        PaprIQ AI is a document-assistance platform that allows users to
        upload PDF documents, ask questions about their content, and receive
        AI-generated responses. The service is provided as part of AppKaun.
      </p>
    ),
  },
  {
    title: "3. User Accounts",
    content: (
      <>
        <p>When creating an account, you agree to:</p>
        <ul>
          <li>Provide accurate and up-to-date account information.</li>
          <li>Keep your login credentials secure.</li>
          <li>Not share your account in a way that violates your plan or these terms.</li>
          <li>Notify us if you believe your account has been accessed without permission.</li>
          <li>Take responsibility for activity performed through your account.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Uploaded Documents and Ownership",
    content: (
      <>
        <p>
          You retain ownership of the documents and content you upload. You
          grant us permission to process that content only as reasonably
          necessary to operate and provide the service.
        </p>
        <p>You agree that:</p>
        <ul>
          <li>You have the necessary rights or permissions to upload your documents.</li>
          <li>You will not upload content that violates another person's rights or applicable law.</li>
          <li>You are responsible for maintaining your own copies of important documents.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. AI-Generated Responses",
    content: (
      <>
        <p>
          PaprIQ AI uses artificial intelligence to generate responses based
          on document content and user questions.
        </p>
        <p>
          AI-generated responses may be inaccurate, incomplete, outdated, or
          misleading. You should independently verify important information
          before relying on it.
        </p>
        <p>
          The service is not a substitute for professional legal, medical,
          financial, educational, or other expert advice.
        </p>
      </>
    ),
  },
  {
    title: "6. Free and Paid Plans",
    content: (
      <>
        <p>
          PaprIQ AI may offer free and paid subscription plans. Each plan may
          have different features, usage limits, and availability.
        </p>
        <ul>
          <li>Free plan users are currently limited to 5 questions per calendar month.</li>
          <li>Paid plan limits and features are displayed on the Pricing page.</li>
          <li>Usage limits may reset according to the calendar-month schedule shown in the application.</li>
          <li>We may introduce, modify, or discontinue plan features with appropriate notice where required.</li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Payments and Subscriptions",
    content: (
      <>
        <p>
          Paid features may require payment through a third-party payment
          provider. By purchasing a subscription, you agree to the price,
          billing period, and payment terms presented during checkout.
        </p>
        <p>
          Subscription renewal, cancellation, refunds, and payment disputes
          are subject to the terms shown at checkout and applicable law.
          Cancellation may stop future renewals without automatically
          refunding an already completed payment.
        </p>
        <p>
          We do not store complete payment card details when those details are
          handled by an external payment provider.
        </p>
      </>
    ),
  },
  {
    title: "8. Acceptable Use",
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for unlawful activities.</li>
          <li>Upload malicious files or attempt to compromise the platform.</li>
          <li>Attempt unauthorized access to another user's account or documents.</li>
          <li>Interfere with the security, availability, or operation of the service.</li>
          <li>Abuse usage limits or attempt to bypass subscription restrictions.</li>
          <li>Use the service to infringe intellectual property or privacy rights.</li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Service Availability",
    content: (
      <p>
        We aim to keep PaprIQ AI available and functioning reliably.
        However, we do not guarantee uninterrupted or error-free service.
        Maintenance, technical issues, third-party outages, or other
        circumstances may temporarily affect availability.
      </p>
    ),
  },
  {
    title: "10. Suspension and Termination",
    content: (
      <p>
        We may suspend or restrict access where reasonably necessary to protect
        the service, investigate suspected misuse, address security concerns,
        or comply with legal obligations. You may stop using the service at any
        time. Contact us if you want assistance with account closure.
      </p>
    ),
  },
  {
    title: "11. Limitation of Liability",
    content: (
      <p>
        To the extent permitted by applicable law, PaprIQ AI and its
        operators are not responsible for indirect or consequential losses
        arising from use of the service, reliance on AI-generated responses,
        loss of data, or temporary service interruptions. Nothing in these
        terms excludes liability that cannot legally be excluded.
      </p>
    ),
  },
  {
    title: "12. Changes to These Terms",
    content: (
      <p>
        We may update these Terms & Conditions as the service evolves or legal
        requirements change. Updated terms will be published on this page with
        a revised effective date. Continued use after an update takes effect
        is subject to the updated terms, to the extent permitted by law.
      </p>
    ),
  },
  {
    title: "13. Governing Law",
    content: (
      <p>
        These terms are subject to applicable laws. Before publication, specify
        the appropriate governing law and jurisdiction for the business
        operating PaprIQ AI, after obtaining suitable legal advice.
      </p>
    ),
  },
  {
    title: "14. Contact",
    content: (
      <p>
        For questions about these Terms & Conditions, contact us at{" "}
        <a
          href="mailto:creatoremerging@gmail.com"
          className="font-medium text-violet-300 hover:text-violet-200"
        >
          creatoremerging@gmail.com
        </a>
        .
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#080d18] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-violet-300"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <header className="mb-10 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.12] to-violet-500/[0.04] p-7 sm:p-10">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <Scale size={24} />
          </div>

          <p className="text-sm font-semibold text-violet-300">LEGAL</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Please read these terms carefully before using PaprIQ AI.
            They explain the rules and responsibilities associated with
            using our platform.
          </p>

          <p className="mt-5 text-xs text-slate-500">
            Effective date: November 1, 2026
          </p>
        </header>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7"
            >
              <h2 className="mb-4 text-lg font-semibold text-white">
                {section.title}
              </h2>

              <div className="space-y-3 text-sm leading-7 text-slate-400 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-violet-400/15 bg-violet-500/[0.05] p-5 text-sm leading-6 text-slate-400">
          PaprIQ AI is a product by AppKaun. For questions about these
          terms, contact{" "}
          <a
            href="mailto:creatoremerging@gmail.com"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            creatoremerging@gmail.com
          </a>
          .
        </div>
      </div>
    </main>
  );
}