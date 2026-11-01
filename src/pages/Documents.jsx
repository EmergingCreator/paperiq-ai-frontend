
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Upload,
  FileText,
  FileUp,
  Eye,
  Trash2,
  RefreshCw,
  LoaderCircle,
  CheckCircle2,
  Clock3,
  AlertCircle,
  X,
  FolderOpen,
  Sparkles,
  FileCheck2,
} from "lucide-react";

import SiteLayout from "../components/SiteLayout";
import { useDocumentStore } from "../stores/documentStore";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getDocumentId(document) {
  return document?._id || document?.id || document?.documentId;
}

function getDocumentName(document) {
  return (
    document?.originalName ||
    document?.originalname ||
    document?.originalFilename ||
    document?.fileName ||
    document?.filename ||
    document?.name ||
    "Untitled document.pdf"
  );
}

function getDocumentStatus(document) {
  const status =
    document?.status ||
    document?.processingStatus ||
    document?.processing_status ||
    (document?.processed ? "completed" : "processing");

  return typeof status === "string" ? status.toLowerCase() : "unknown";
}

function getErrorMessage(value, fallback = "Something went wrong.") {
  if (typeof value === "string") return value;
  if (typeof value?.message === "string") return value.message;
  if (typeof value?.error === "string") return value.error;

  if (typeof value?.response?.data?.message === "string") {
    return value.response.data.message;
  }

  if (typeof value?.response?.data?.error?.message === "string") {
    return value.response.data.error.message;
  }

  return fallback;
}

function formatFileSize(bytes) {
  if (bytes === undefined || bytes === null || bytes === "") {
    return "PDF document";
  }

  const size = Number(bytes);

  if (!Number.isFinite(size) || size < 0) {
    return "PDF document";
  }

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusInfo(status) {
  if (
    ["completed", "complete", "processed", "success", "ready"].includes(status)
  ) {
    return {
      label: "Ready",
      icon: CheckCircle2,
      className:
        "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (["failed", "error", "rejected"].includes(status)) {
    return {
      label: "Failed",
      icon: AlertCircle,
      className: "border-red-400/20 bg-red-500/10 text-red-300",
    };
  }

  if (
    ["queued", "pending", "uploaded", "processing", "in_progress"].includes(
      status
    )
  ) {
    return {
      label:
        status === "queued" || status === "pending"
          ? "Queued"
          : status === "uploaded"
            ? "Uploaded"
            : "Processing",
      icon: Clock3,
      className:
        "border-amber-400/20 bg-amber-500/10 text-amber-300",
    };
  }

  return {
    label: status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown",
    icon: Clock3,
    className: "border-white/10 bg-white/5 text-slate-300",
  };
}

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const info = getStatusInfo(status);
  const Icon = info.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${info.className}`}
    >
      <Icon size={13} />
      {info.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <Icon size={19} />
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function EmptyState({ hasSearch, onUpload }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
        {hasSearch ? <Search size={28} /> : <FolderOpen size={28} />}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {hasSearch ? "No matching documents" : "No documents yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
        {hasSearch
          ? "Try a different search term to find your document."
          : "Upload your first PDF to start asking questions and exploring its contents with AI."}
      </p>

      {!hasSearch && (
        <button
          type="button"
          onClick={onUpload}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
          <Upload size={17} />
          Upload a PDF
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Delete Confirmation Modal                                                  */
/* -------------------------------------------------------------------------- */

function DeleteConfirmationModal({
  document,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!document) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start gap-4 border-b border-white/10 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-400">
            <Trash2 size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="delete-modal-title"
              className="text-lg font-semibold text-white"
            >
              Delete document?
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Are you sure you want to permanently delete this document?
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            aria-label="Close delete dialog"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
              <FileText size={21} />
            </div>

            <div className="min-w-0">
              <p className="break-words text-sm font-medium text-slate-100">
                {getDocumentName(document)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF document
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Make sure you no longer need this document before continuing.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function Documents() {
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Zustand state
  const documents = useDocumentStore((state) =>
    Array.isArray(state.documents) ? state.documents : []
  );

  const loading = useDocumentStore((state) => state.loading);
  const refreshing = useDocumentStore((state) => state.refreshing);
  const uploading = useDocumentStore((state) => state.uploading);
  const deletingId = useDocumentStore((state) => state.deletingId);
  const viewingId = useDocumentStore((state) => state.viewingId);
  const error = useDocumentStore((state) => state.error);

  // Zustand actions
  const fetchDocuments = useDocumentStore(
    (state) => state.fetchDocuments
  );

  const uploadDocument = useDocumentStore(
    (state) => state.uploadDocument
  );

  const deleteDocument = useDocumentStore(
    (state) => state.deleteDocument
  );

  const getDocumentViewUrl = useDocumentStore(
    (state) => state.getDocumentViewUrl
  );

  const clearError = useDocumentStore((state) => state.clearError);

  /* Load documents */
  useEffect(() => {
    fetchDocuments().catch((err) => {
      console.error("Failed to load documents:", err);
    });
  }, [fetchDocuments]);

  /* Search documents */
  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return documents;

    return documents.filter((document) =>
      getDocumentName(document).toLowerCase().includes(query)
    );
  }, [documents, search]);

  /* Statistics */
  const readyCount = documents.filter((document) =>
    ["completed", "complete", "processed", "success", "ready"].includes(
      getDocumentStatus(document)
    )
  ).length;

  const processingCount = documents.filter((document) =>
    [
      "queued",
      "pending",
      "uploaded",
      "processing",
      "in_progress",
    ].includes(getDocumentStatus(document))
  ).length;

  /* Upload a PDF */
  async function handleUpload(event) {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    clearError();
    setNotice("");

    try {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        useDocumentStore.setState({
          error: "Please select a PDF file.",
        });
        return;
      }

      const success = await uploadDocument(file);

      if (success) {
        setNotice(`${file.name} uploaded successfully.`);
      }
    } catch (err) {
      console.error("Upload failed:", err);

      useDocumentStore.setState({
        error: getErrorMessage(err, "Failed to upload PDF."),
      });
    } finally {
      input.value = "";
    }
  }

  /* Open a PDF */
  async function handleView(document) {
    const id = getDocumentId(document);

    if (!id) {
      useDocumentStore.setState({
        error: "This document does not have a valid ID.",
      });
      return;
    }

    clearError();
    setNotice("");

    const newWindow = window.open("about:blank", "_blank");

    try {
      const url = await getDocumentViewUrl(id);

      if (!url || typeof url !== "string") {
        newWindow?.close();

        if (!useDocumentStore.getState().error) {
          useDocumentStore.setState({
            error: "Could not retrieve the PDF viewing link.",
          });
        }

        return;
      }

      if (newWindow) {
        newWindow.opener = null;
        newWindow.location.href = url;
      } else {
        useDocumentStore.setState({
          error:
            "Your browser blocked the PDF tab. Allow pop-ups for this site and try again.",
        });
      }
    } catch (err) {
      newWindow?.close();

      useDocumentStore.setState({
        error: getErrorMessage(err, "Failed to open PDF."),
      });
    }
  }

  /* Open delete modal */
  function openDeleteModal(document) {
    clearError();
    setNotice("");
    setDeleteTarget(document);
  }

  /* Confirm and delete document */
  async function handleDelete() {
    if (!deleteTarget) return;

    const document = deleteTarget;
    const id = getDocumentId(document);
    const name = getDocumentName(document);

    if (!id) {
      useDocumentStore.setState({
        error: "This document does not have a valid ID.",
      });
      return;
    }

    clearError();
    setNotice("");

    try {
      const success = await deleteDocument(id);

      if (success) {
        setNotice(`"${name}" was deleted successfully.`);
        setDeleteTarget(null);
      }
    } catch (err) {
      useDocumentStore.setState({
        error: getErrorMessage(err, "Failed to delete document."),
      });
    }
  }

  /* Open file picker */
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  /* Refresh documents */
  async function handleRefresh() {
    clearError();
    setNotice("");

    try {
      await fetchDocuments({ refresh: true });
    } catch (err) {
      useDocumentStore.setState({
        error: getErrorMessage(err, "Failed to refresh documents."),
      });
    }
  }

  const displayedError = error
    ? getErrorMessage(error, "Something went wrong. Please try again.")
    : "";

  const isDeleting = Boolean(deletingId);

  return (
    <SiteLayout>
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />

          {/* Page heading */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                  <Sparkles size={14} />
                  YOUR WORKSPACE
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  My documents
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Upload, organize, and explore your PDFs. Your documents
                  become searchable knowledge for AI-powered conversations.
                </p>
              </div>

              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}

                {uploading ? "Uploading PDF..." : "Upload PDF"}
              </button>
            </div>
          </section>

          {/* Error message */}
          {displayedError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <p className="flex-1">{displayedError}</p>

              <button
                type="button"
                onClick={clearError}
                aria-label="Dismiss error"
                className="text-red-200 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Success message */}
          {notice && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"
            >
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

              <p className="flex-1">{notice}</p>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="text-emerald-200 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Statistics */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={FileText}
              label="Total documents"
              value={loading ? "—" : documents.length}
              description="PDFs in your workspace"
            />

            <StatCard
              icon={FileCheck2}
              label="Ready to use"
              value={loading ? "—" : readyCount}
              description="Successfully processed documents"
            />

            <StatCard
              icon={Clock3}
              label="Processing"
              value={loading ? "—" : processingCount}
              description="Waiting for AI processing"
            />
          </section>

          {/* Documents library */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] shadow-xl shadow-black/10">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Your library
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {documents.length}{" "}
                  {documents.length === 1 ? "document" : "documents"} available
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-72">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search documents..."
                    aria-label="Search documents"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  aria-label="Refresh documents"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-3">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-violet-300"
                />

                <p className="text-sm text-slate-400">
                  Loading your documents...
                </p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <EmptyState
                hasSearch={Boolean(search.trim())}
                onUpload={openFilePicker}
              />
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {filteredDocuments.map((document) => {
                  const id = getDocumentId(document);
                  const name = getDocumentName(document);
                  const status = getDocumentStatus(document);

                  const isRowDeleting =
                    deletingId != null &&
                    String(deletingId) === String(id);

                  const isViewing =
                    viewingId != null &&
                    String(viewingId) === String(id);

                  const fileSize =
                    document?.sizeBytes ??
                    document?.size ??
                    document?.fileSize ??
                    document?.file_size;

                  const createdAt =
                    document?.createdAt ||
                    document?.created_at ||
                    document?.uploadedAt ||
                    document?.uploadDate;

                  const documentError =
                    document?.errorMessage || document?.error;

                  return (
                    <article
                      key={id || name}
                      className="group flex flex-col gap-4 p-5 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                          <FileText size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3
                            title={name}
                            className="break-words text-sm font-semibold text-slate-100 sm:text-base"
                          >
                            {name}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                            <span>{formatFileSize(fileSize)}</span>

                            <span className="hidden text-slate-700 sm:inline">
                              •
                            </span>

                            <span>{formatDate(createdAt)}</span>
                          </div>

                          <div className="mt-3">
                            <StatusBadge status={status} />
                          </div>

                          {documentError && (
                            <p className="mt-2 text-xs text-red-300">
                              {getErrorMessage(
                                documentError,
                                "Document processing failed."
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                        <button
                          type="button"
                          onClick={() => handleView(document)}
                          disabled={isViewing || isRowDeleting}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          {isViewing ? (
                            <LoaderCircle
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Eye size={16} />
                          )}
                          Open
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(document)}
                          disabled={isRowDeleting || isViewing || isDeleting}
                          aria-label={`Delete ${name}`}
                          title="Delete document"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRowDeleting ? (
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && documents.length > 0 && (
              <div className="border-t border-white/10 bg-white/[0.015] px-5 py-4 sm:px-6">
                <p className="text-xs leading-5 text-slate-500">
                  Your document library is private to your account. The backend
                  must verify ownership for every document action.
                </p>
              </div>
            )}
          </section>

          {/* Upload information */}
          <section className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-400/10 bg-violet-500/[0.04] p-4 sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <FileUp size={19} />
            </span>

            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Uploading a document
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Upload a PDF up to 25 MB. After upload, your backend should
                process the document and update its status before it is ready
                for AI-powered questions.
              </p>
            </div>
          </section>
        </div>

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          document={deleteTarget}
          deleting={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </main>
    </SiteLayout>
  );
}
