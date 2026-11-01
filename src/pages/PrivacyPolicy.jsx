import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>When you use PaprIQ AI, we may collect the following information:</p>
        <ul>
          <li>Account details, such as your name, email address, and authentication information.</li>
          <li>Documents and PDF files that you choose to upload.</li>
          <li>Your questions, prompts, and conversation history.</li>
          <li>Usage information, such as the number of questions you ask and your subscription plan.</li>
          <li>Technical information, such as browser details, device information, and service logs.</li>
          <li>Payment and subscription status information. Payment details may be handled by the payment provider.</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We use collected information to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Provide PDF uploading, document processing, and AI question-answering features.</li>
          <li>Save and display your conversations and document history.</li>
          <li>Manage subscription plans, usage limits, and billing status.</li>
          <li>Respond to support requests and service-related communications.</li>
          <li>Maintain security, prevent abuse, and improve the service.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Uploaded Documents and AI Processing",
    content: (
      <>
        <p>
          When you upload a PDF or ask a question, the relevant document content
          and question may be processed by our application and third-party
          infrastructure or AI service providers to generate an answer.
        </p>
        <p>
          Do not upload confidential, sensitive, or personal information unless
          you are comfortable with the processing required to provide the service.
        </p>
        <p>
          We do not claim ownership of documents you upload. You remain
          responsible for having the rights and permissions needed to upload and
          use those documents.
        </p>
      </>
    ),
  },
  {
    title: "4. Third-Party Services",
    content: (
      <>
        <p>
          PaprIQ AI may rely on third-party providers for services such as
          hosting, databases, AI processing, email delivery, analytics, and
          payment processing.
        </p>
        <p>
          These providers may process information as necessary to deliver their
          services. Their handling of information is subject to their own
          privacy policies and applicable agreements.
        </p>
        <p>
          Before publishing this policy, identify the providers currently used
          by your deployed application and link to their privacy policies where
          appropriate.
        </p>
      </>
    ),
  },
  {
    title: "5. Data Storage and Retention",
    content: (
      <>
        <p>
          Account information, uploaded documents, and conversation data may be
          stored to provide the features of PaprIQ AI.
        </p>
        <p>
          Data is retained for as long as necessary to provide the service,
          meet legitimate operational needs, resolve disputes, and comply with
          applicable legal obligations.
        </p>
        <p>
          The actual deletion period depends on your storage configuration,
          backups, and third-party providers. Contact us if you have a question
          about deleting your information.
        </p>
      </>
    ),
  },
  {
    title: "6. Data Security",
    content: (
      <p>
        We use reasonable technical and organizational measures intended to
        protect information. However, no internet transmission or electronic
        storage system can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    title: "7. Your Choices and Rights",
    content: (
      <>
        <p>Depending on applicable law, you may have rights to:</p>
        <ul>
          <li>Request access to personal information associated with your account.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your account or personal information.</li>
          <li>Ask questions about how your information is processed.</li>
        </ul>
        <p>
          To make a request, contact us using the email address below. We may
          need to verify your identity before responding.
        </p>
      </>
    ),
  },
  {
    title: "8. Children's Privacy",
    content: (
      <p>
        PaprIQ AI is not intended for children who are not legally permitted
        to use the service under applicable law. If you believe a child has
        provided personal information without appropriate authorization,
        contact us so we can review the request.
      </p>
    ),
  },
  {
    title: "9. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy as our service or legal obligations
        change. Updates will be published on this page with a revised
        effective date.
      </p>
    ),
  },
  {
    title: "10. Contact Us",
    content: (
      <p>
        If you have questions or requests about this Privacy Policy, contact
        us at{" "}
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

export default function PrivacyPolicy() {
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

        <header className="mb-10 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] to-indigo-500/[0.04] p-7 sm:p-10">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <ShieldCheck size={24} />
          </div>

          <p className="text-sm font-semibold text-violet-300">LEGAL</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            This policy explains how PaprIQ AI collects, uses, stores, and
            handles information when you use our services.
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
          PaprIQ AI is a product by AppKaun. For privacy-related questions,
          contact{" "}
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