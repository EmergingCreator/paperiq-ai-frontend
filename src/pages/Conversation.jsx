
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  History,
  Menu,
  MessageSquare,
  MoreVertical,
  Pencil,
  Save,
  Trash2,
  AlertTriangle,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import SiteLayout from "../components/SiteLayout";
import { useDocumentStore } from "../stores/documentStore";
import { useConversationStore } from "../stores/conversationStore";

const suggestions = [
  {
    title: "Summarize this document",
    description: "Get the key points in a concise summary.",
    icon: BookOpen,
    prompt:
      "Summarize this document and highlight its most important points.",
  },
  {
    title: "Explain the main concepts",
    description: "Understand complex ideas in simple language.",
    icon: Sparkles,
    prompt:
      "Explain the main concepts in this document in simple language.",
  },
  {
    title: "Find important information",
    description: "Identify key facts, dates, and details.",
    icon: Search,
    prompt:
      "Identify the most important facts, dates, and details in this document.",
  },
  {
    title: "Create study questions",
    description: "Generate questions to test your understanding.",
    icon: MessageSquare,
    prompt:
      "Create 10 useful questions to test my understanding of this document.",
  },
];

const getId = (item) =>
  String(item?._id ?? item?.id ?? item?.documentId ?? "");

const getPdfId = (conversation) => {
  const pdf = conversation?.pdf;

  if (typeof pdf === "string") return pdf;

  return String(pdf?._id ?? pdf?.id ?? conversation?.documentId ?? "");
};

const getName = (item) =>
  item?.originalName ||
  item?.originalname ||
  item?.originalFilename ||
  item?.fileName ||
  item?.filename ||
  item?.name ||
  "Untitled document.pdf";

const getErrorText = (error) => {
  const message =
    error?.response?.data?.message ??
    error?.response?.data?.error?.message ??
    error?.message ??
    error;

  return typeof message === "string"
    ? message
    : "Something went wrong. Please try again.";
};

const getConversationTitle = (conversation) =>
  conversation?.title || "New conversation";

function Conversation() {
  // Document store
  const documents = useDocumentStore((state) => state.documents);
  const documentsLoading = useDocumentStore((state) => state.loading);
  const fetchDocuments = useDocumentStore((state) => state.fetchDocuments);
  const documentError = useDocumentStore((state) => state.error);
  const clearDocumentError = useDocumentStore((state) => state.clearError);

  // Conversation store
  const conversations = useConversationStore(
    (state) => state.conversations
  );
  const activeConversation = useConversationStore(
    (state) => state.activeConversation
  );
  const conversationsLoading = useConversationStore(
    (state) => state.loading
  );
  const sending = useConversationStore((state) => state.sending);
  const conversationError = useConversationStore((state) => state.error);

  const fetchConversations = useConversationStore(
    (state) => state.fetchConversations
  );
  const createConversation = useConversationStore(
    (state) => state.createConversation
  );
  const openConversationInStore = useConversationStore(
    (state) => state.openConversation
  );
  const sendMessageToStore = useConversationStore(
    (state) => state.sendMessage
  );
  const resetActiveConversation = useConversationStore(
    (state) => state.resetActiveConversation
  );
  const clearConversationError = useConversationStore(
    (state) => state.clearError
  );

  // Page state
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showDocumentPicker, setShowDocumentPicker] = useState(false);
  const [notice, setNotice] = useState("");
  const [conversationMenuId, setConversationMenuId] = useState("");
  const [renamingConversationId, setRenamingConversationId] = useState("");
  const [renameTitle, setRenameTitle] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState("");
  const [conversationToDelete, setConversationToDelete] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const messages = activeConversation?.messages || [];
  const activeConversationId = getId(activeConversation);

  const selectedDocument = useMemo(
    () =>
      documents?.find(
        (document) => getId(document) === selectedDocumentId
      ) || null,
    [documents, selectedDocumentId]
  );

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (documents || []).filter((document) =>
      getName(document).toLowerCase().includes(query)
    );
  }, [documents, search]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (conversations || []).filter((conversation) => {
      const title = getConversationTitle(conversation);
      const documentName =
        conversation?.pdf?.originalName ||
        conversation?.documentName ||
        "";

      return (
        title.toLowerCase().includes(query) ||
        documentName.toLowerCase().includes(query)
      );
    });
  }, [conversations, search]);

  const displayError = conversationError
    ? getErrorText(conversationError)
    : documentError
      ? getErrorText(documentError)
      : "";

  useEffect(() => {
    fetchDocuments?.();
    fetchConversations?.();
  }, [fetchDocuments, fetchConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const clearErrors = () => {
    clearConversationError?.();
    clearDocumentError?.();
    setNotice("");
  };

  const startNewConversation = () => {
    resetActiveConversation?.();
    setSelectedDocumentId("");
    setInput("");
    setNotice("");
    setSearch("");
    setShowHistory(false);
    setShowDocumentPicker(false);
    clearErrors();
  };

  const chooseDocument = (document) => {
    const documentId = getId(document);

    if (!documentId) {
      setNotice("Could not identify this document. Please refresh and try again.");
      return;
    }

    resetActiveConversation?.();
    setSelectedDocumentId(documentId);
    setShowDocumentPicker(false);
    setShowHistory(false);
    setNotice("");
    setSearch("");
    clearErrors();
  };

  const openConversation = async (conversation) => {
    const conversationId = getId(conversation);

    if (!conversationId) {
      setNotice("Could not identify this conversation.");
      return;
    }

    clearErrors();
    setNotice("");
    setConversationMenuId("");

    try {
      const opened = await openConversationInStore(conversationId);

      // Support stores that return the conversation or only update state.
      const current =
        opened?.conversation ||
        opened ||
        useConversationStore.getState().activeConversation;

      const pdfId = getPdfId(current || conversation);

      if (pdfId) {
        setSelectedDocumentId(pdfId);
      }

      setInput("");
      setShowHistory(false);
      setShowDocumentPicker(false);
    } catch (error) {
      setNotice(getErrorText(error));
    }
  };

  const beginRenameConversation = (conversation) => {
    const id = getId(conversation);
    if (!id) return;
    setConversationMenuId("");
    setRenamingConversationId(id);
    setRenameTitle(getConversationTitle(conversation));
  };

  const saveConversationTitle = async (conversation) => {
    const id = getId(conversation);
    const title = renameTitle.trim();

    if (!id || !title) {
      setNotice("Conversation title cannot be empty.");
      return;
    }
    if (title.length > 100) {
      setNotice("Conversation title must be 100 characters or fewer.");
      return;
    }

    setRenaming(true);
    setNotice("");
    try {
      const store = useConversationStore.getState();
      if (typeof store.renameConversation === "function") {
        await store.renameConversation(id, title);
      } else {
        // Requires PATCH /api/conversations/:conversationId on the Express backend.
        const response = await fetch(`/api/conversations/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title }),
        });
        if (!response.ok) {
          let message = "Could not rename conversation.";
          try {
            const body = await response.json();
            message = body.message || body.error || message;
          } catch {}
          throw new Error(message);
        }
        await response.json().catch(() => ({}));
        useConversationStore.setState((state) => ({
          conversations: (state.conversations || []).map((item) =>
            getId(item) === id ? { ...item, title } : item
          ),
          activeConversation:
            getId(state.activeConversation) === id
              ? { ...state.activeConversation, title }
              : state.activeConversation,
        }));
      }
      setRenamingConversationId("");
      setRenameTitle("");
      setNotice("Conversation renamed.");
    } catch (error) {
      setNotice(getErrorText(error));
    } finally {
      setRenaming(false);
    }
  };

  const deleteConversation = (conversation) => {
    if (!getId(conversation) || deletingConversationId) return;
    setConversationMenuId("");
    setConversationToDelete(conversation);
  };

  const confirmDeleteConversation = async () => {
    const conversation = conversationToDelete;
    const id = getId(conversation);
    if (!id || deletingConversationId) return;

    setDeletingConversationId(id);
    setNotice("");

    try {
      const store = useConversationStore.getState();
      if (typeof store.deleteConversation === "function") {
        await store.deleteConversation(id);
      } else {
        // Requires DELETE /api/conversations/:conversationId on the Express backend.
        const response = await fetch(`/api/conversations/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) {
          let message = "Could not delete conversation.";
          try {
            const body = await response.json();
            message = body.message || body.error || message;
          } catch {}
          throw new Error(message);
        }
        await response.json().catch(() => ({}));
        useConversationStore.setState((state) => ({
          conversations: (state.conversations || []).filter((item) => getId(item) !== id),
          activeConversation: getId(state.activeConversation) === id ? null : state.activeConversation,
        }));
      }

      // Keep the UI in a clean state if the deleted conversation was open.
      if (activeConversationId === id) {
        resetActiveConversation?.();
        setSelectedDocumentId("");
        setInput("");
      }
      setNotice("Conversation deleted.");
      setConversationToDelete(null);
    } catch (error) {
      setNotice(getErrorText(error));
    } finally {
      setDeletingConversationId("");
    }
  };

  const sendMessage = async (event) => {
    event?.preventDefault();

    const question = input.trim();

    if (!question || sending) return;

    if (!selectedDocumentId) {
      setNotice("Select a PDF document before starting a conversation.");
      return;
    }

    clearErrors();
    setNotice("");

    try {
      let conversationId = activeConversationId;

      // Create a database conversation the first time the user sends a question.
      // If the active conversation belongs to another PDF, create a new one.
      if (
        !conversationId ||
        getPdfId(activeConversation) !== selectedDocumentId
      ) {
        const created = await createConversation(selectedDocumentId);

        const newConversation =
          created?.conversation ||
          created?.data?.conversation ||
          created?.data ||
          created;

        conversationId = getId(newConversation);

        // Some stores update activeConversation but return no document.
        if (!conversationId) {
          const current =
            useConversationStore.getState().activeConversation;

          conversationId = getId(current);
        }

        if (!conversationId) {
          throw new Error(
            "Conversation could not be created. Please try again."
          );
        }
      }

      setInput("");

      // The store sends the question to Express:
      // POST /api/conversations/:conversationId/chat
      // The backend saves the user question and AI response.
      await sendMessageToStore(question);
    } catch (error) {
      setNotice(getErrorText(error));
      // Restore the question so the user can retry.
      setInput((current) => current || question);
    }
  };

  const selectSuggestion = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <SiteLayout>
      <div className="flex h-[calc(100vh-80px)] min-h-[480px] min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0d12] text-slate-100">
        {/* Sidebar */}
        <aside
          className={`${
            showHistory ? "fixed inset-0 z-40 flex" : "hidden"
          } h-full min-h-0 w-full shrink-0 flex-col border-r border-white/[0.08] bg-[#0e1016] md:flex md:w-[270px]`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Sparkles size={19} />
              </div>

              <div>
                <h2 className="text-sm font-semibold">PaprIQ AI</h2>
                <p className="text-xs text-slate-500">PDF workspace</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] md:hidden"
              aria-label="Close history"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            <button
              type="button"
              onClick={startNewConversation}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              <Plus size={17} />
              New conversation
            </button>
          </div>

          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3">
              <Search size={16} className="shrink-0 text-slate-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations and PDFs..."
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 [scrollbar-width:thin] [scrollbar-color:#49445f_transparent]">
            <div className="mb-2 flex items-center gap-2 px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <History size={14} />
              Recent conversations
            </div>

            {conversationsLoading && !conversations?.length ? (
              <p className="px-3 py-5 text-xs text-slate-500">
                Loading conversations...
              </p>
            ) : filteredConversations.length === 0 ? (
              <div className="px-3 py-5 text-xs leading-5 text-slate-500">
                Your recent conversations will appear here.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => {
                  const conversationId = getId(conversation);

                  return (
                    <div
                      key={conversationId}
                      className={`group relative rounded-xl transition ${
                        activeConversationId === conversationId
                          ? "bg-violet-500/10"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {renamingConversationId === conversationId ? (
                        <div className="flex items-center gap-1 p-2">
                          <input
                            autoFocus
                            value={renameTitle}
                            maxLength={100}
                            onChange={(event) => setRenameTitle(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                saveConversationTitle(conversation);
                              }
                              if (event.key === "Escape") {
                                setRenamingConversationId("");
                                setRenameTitle("");
                              }
                            }}
                            aria-label="Conversation title"
                            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b0d12] px-2 py-2 text-xs text-white outline-none focus:border-violet-400/50"
                          />
                          <button
                            type="button"
                            disabled={renaming || !renameTitle.trim()}
                            onClick={() => saveConversationTitle(conversation)}
                            className="rounded-lg p-2 text-violet-300 hover:bg-white/[0.06] disabled:opacity-40"
                            aria-label="Save conversation title"
                            title="Save"
                          >
                            <Save size={15} />
                          </button>
                          <button
                            type="button"
                            disabled={renaming}
                            onClick={() => {
                              setRenamingConversationId("");
                              setRenameTitle("");
                            }}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06]"
                            aria-label="Cancel renaming"
                            title="Cancel"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openConversation(conversation)}
                            className={`flex min-w-0 flex-1 items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                              activeConversationId === conversationId
                                ? "text-violet-200"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <MessageSquare size={16} className="mt-0.5 shrink-0" />
                            <span className="min-w-0 flex-1 truncate text-sm">
                              {getConversationTitle(conversation)}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setConversationMenuId((current) =>
                                current === conversationId ? "" : conversationId
                              )
                            }
                            className="mr-1 rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.08] hover:text-slate-200 md:opacity-0 md:group-hover:opacity-100"
                            aria-label={`Options for ${getConversationTitle(conversation)}`}
                            title="Conversation options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      )}

                      {conversationMenuId === conversationId &&
                        renamingConversationId !== conversationId && (
                          <div className="absolute right-2 top-10 z-40 w-44 rounded-xl border border-white/10 bg-[#191b25] p-1.5 shadow-2xl">
                            <button
                              type="button"
                              onClick={() => beginRenameConversation(conversation)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/[0.07]"
                            >
                              <Pencil size={15} className="text-violet-300" />
                              Rename conversation
                            </button>
                            <button
                              type="button"
                              disabled={deletingConversationId === conversationId}
                              onClick={() => deleteConversation(conversation)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              {deletingConversationId === conversationId ? "Deleting..." : "Delete conversation"}
                            </button>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-2 mt-7 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <FileText size={14} />
              Your documents
            </div>

            {documentsLoading && !documents?.length ? (
              <p className="px-3 py-4 text-xs text-slate-500">
                Loading documents...
              </p>
            ) : filteredDocuments.length ? (
              <div className="space-y-1">
                {filteredDocuments.map((document) => {
                  const documentId = getId(document);

                  return (
                    <button
                      type="button"
                      key={documentId}
                      onClick={() => chooseDocument(document)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                        selectedDocumentId === documentId
                          ? "bg-white/[0.07] text-white"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-300">
                        <FileText size={16} />
                      </div>

                      <span className="min-w-0 flex-1 truncate text-xs">
                        {getName(document)}
                      </span>

                      {selectedDocumentId === documentId && (
                        <Check
                          size={14}
                          className="shrink-0 text-violet-300"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-4 text-xs leading-5 text-slate-500">
                No documents found. Upload a PDF on the Documents page first.
              </p>
            )}
          </div>

          <div className="border-t border-white/[0.07] p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold">
                DM
              </div>

              <div>
                <p className="text-xs font-medium text-slate-200">
                  Personal workspace
                </p>
                <p className="text-[11px] text-slate-500">
                  Your documents, your insights
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex min-h-[68px] items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] md:hidden"
                aria-label="Open conversation history"
              >
                <Menu size={19} />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold sm:text-base">
                  {activeConversation?.title || "Conversation"}
                </h1>

                <p className="mt-0.5 text-xs text-slate-500">
                  Ask questions about your PDF
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowDocumentPicker((value) => !value)
                }
                className="flex max-w-[200px] items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-xs transition hover:bg-white/[0.06] sm:max-w-[270px] sm:text-sm"
              >
                <FileText size={16} className="shrink-0 text-red-300" />

                <span className="truncate">
                  {selectedDocument
                    ? getName(selectedDocument)
                    : "Select a document"}
                </span>

                <ChevronDown
                  size={15}
                  className="shrink-0 text-slate-500"
                />
              </button>

              {showDocumentPicker && (
                <div className="absolute right-0 top-full z-30 mt-2 max-h-72 w-72 overflow-y-auto rounded-xl border border-white/10 bg-[#171923] p-2 shadow-2xl">
                  <p className="px-3 py-2 text-xs font-medium text-slate-500">
                    Select a PDF
                  </p>

                  {filteredDocuments.map((document) => {
                    const documentId = getId(document);

                    return (
                      <button
                        type="button"
                        key={documentId}
                        onClick={() => chooseDocument(document)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm text-slate-300 hover:bg-white/[0.06]"
                      >
                        <FileText
                          size={16}
                          className="shrink-0 text-red-300"
                        />

                        <span className="flex-1 truncate">
                          {getName(document)}
                        </span>

                        {selectedDocumentId === documentId && (
                          <Check
                            size={15}
                            className="text-violet-300"
                          />
                        )}
                      </button>
                    );
                  })}

                  {!filteredDocuments.length && (
                    <p className="px-3 py-4 text-xs text-slate-500">
                      Upload a document to get started.
                    </p>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {!selectedDocument ? (
              <div className="mx-auto flex min-h-[520px] max-w-3xl flex-col items-center justify-center px-5 py-12 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                  <MessageSquare size={28} />
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Your AI reading companion
                </p>

                <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Understand your documents, faster.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                  Select a PDF from your workspace to ask questions, explore
                  key concepts, and find information without reading every page.
                </p>

                <button
                  type="button"
                  onClick={() => setShowDocumentPicker(true)}
                  className="mt-7 flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  <Plus size={17} />
                  Choose a document
                </button>

                {documentsLoading && (
                  <p className="mt-4 text-xs text-slate-500">
                    Loading your documents...
                  </p>
                )}
              </div>
            ) : messages.length === 0 ? (
              <div className="mx-auto flex max-w-3xl flex-col px-5 py-10 sm:px-8 sm:py-14">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                    <Sparkles size={21} />
                  </div>

                  <div className="pt-1">
                    <h2 className="text-xl font-semibold text-white sm:text-2xl">
                      Let's explore your document.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Ask a question about{" "}
                      <span className="font-medium text-slate-200">
                        {getName(selectedDocument)}
                      </span>
                      , or start with one of these suggestions.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestions.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.title}
                        onClick={() => selectSuggestion(item.prompt)}
                        className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition hover:border-violet-400/30 hover:bg-violet-500/[0.05]"
                      >
                        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-violet-300 transition group-hover:bg-violet-500/10">
                          <Icon size={18} />
                        </div>

                        <p className="text-sm font-semibold text-slate-200">
                          {item.title}
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <BookOpen size={14} />
                  Answers should be grounded in your selected document.
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-7 px-5 py-8 sm:px-8">
                {messages.map((message, index) => (
                  <div
                    key={message._id || message.id || `${message.role}-${index}`}
                    className={`flex gap-3 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role !== "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                        <Sparkles size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-violet-500 text-white"
                          : "border border-white/[0.07] bg-white/[0.025] text-slate-200"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="whitespace-pre-wrap text-sm leading-7">
                          {message.content}
                        </p>
                      ) : (
                        <div className="markdown-answer text-sm leading-7">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="mb-3 mt-1 text-xl font-bold tracking-tight text-white">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="mb-2 mt-5 text-lg font-semibold text-white">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="mb-2 mt-4 text-base font-semibold text-white">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="my-2 leading-7 text-slate-300">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="my-3 list-disc space-y-1 pl-6 text-slate-300">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="my-3 list-decimal space-y-1 pl-6 text-slate-300">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="pl-1 leading-7">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-white">
                                  {children}
                                </strong>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="my-3 border-l-2 border-violet-400 pl-4 text-slate-400">
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children }) => (
                                <div className="my-4 overflow-x-auto rounded-lg border border-white/10">
                                  <table className="w-full border-collapse text-left text-sm">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border-b border-white/10 bg-white/[0.04] px-3 py-2 font-semibold text-slate-100">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border-b border-white/[0.06] px-3 py-2 align-top text-slate-300">
                                  {children}
                                </td>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-violet-300 underline decoration-violet-300/40 underline-offset-4 hover:text-violet-200"
                                >
                                  {children}
                                </a>
                              ),
                              code: ({ children }) => (
                                <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-200">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {message.content || ""}
                          </ReactMarkdown>
                        </div>
                      )}

                      {message.sources?.length > 0 && (
                        <div className="mt-4 border-t border-white/[0.08] pt-3">
                          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            <BookOpen size={13} />
                            Sources
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {[...new Map(
                              message.sources.map((source) => {
                                const page = source.page ?? source.pageNumber;
                                return [String(page ?? source.label ?? "unknown"), source];
                              })
                            ).values()].map((source, sourceIndex) => {
                              const page = source.page ?? source.pageNumber;
                              return (
                                <span
                                  key={`${page ?? source.label ?? "source"}-${sourceIndex}`}
                                  title={source.snippet || source.label || ""}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-500/[0.06] px-2.5 py-1.5 text-xs text-violet-300"
                                >
                                  <FileText size={13} />
                                  Page {page ?? "—"}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-xs font-semibold text-white">
                        You
                      </div>
                    )}
                  </div>
                ))}

                {sending && (
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Sparkles
                      size={17}
                      className="animate-pulse text-violet-300"
                    />
                    Thinking about your document...
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Message composer */}
          <div className="shrink-0 border-t border-white/[0.08] bg-[#0b0d12] p-4 sm:px-6 sm:py-5">
            <div className="mx-auto max-w-3xl">
              {(notice || displayError) && (
                <div
                  role="alert"
                  className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-3 py-3 text-xs leading-5 text-amber-200"
                >
                  <span>{notice || displayError}</span>

                  <button
                    type="button"
                    onClick={clearErrors}
                    className="shrink-0 text-amber-200/70 hover:text-amber-100"
                    aria-label="Dismiss message"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <form
                onSubmit={sendMessage}
                className="rounded-2xl border border-white/[0.12] bg-[#11131b] p-2 transition focus-within:border-violet-400/40"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      sendMessage(event);
                    }
                  }}
                  placeholder={
                    selectedDocument
                      ? "Ask anything about your document..."
                      : "Select a document to start chatting..."
                  }
                  disabled={!selectedDocument || sending}
                  rows={2}
                  className="max-h-40 min-h-[54px] w-full resize-y bg-transparent px-3 py-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
                />

                <div className="flex items-center justify-between gap-3 px-2 pb-1">
                  <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                      <FileText size={13} />
                    </span>

                    <span className="truncate">
                      {selectedDocument
                        ? getName(selectedDocument)
                        : "No document selected"}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!input.trim() || !selectedDocument || sending}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-slate-600"
                    aria-label="Send message"
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </form>

              <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">
                AI responses can be inaccurate. Verify important information
                against the original document.
              </p>
            </div>
          </div>
        </main>
      {conversationToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingConversationId) {
              setConversationToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-conversation-title"
            aria-describedby="delete-conversation-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#151720] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
                <AlertTriangle size={23} />
              </div>
              <h2 id="delete-conversation-title" className="text-lg font-semibold text-white">
                Delete conversation?
              </h2>
              <p id="delete-conversation-description" className="mt-2 text-sm leading-6 text-slate-400">
                Are you sure you want to delete <span className="font-medium text-slate-200">“{getConversationTitle(conversationToDelete)}”</span>? This conversation and its chat history will be removed. This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                disabled={Boolean(deletingConversationId)}
                onClick={() => setConversationToDelete(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(deletingConversationId)}
                onClick={confirmDeleteConversation}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingConversationId ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Deleting...</> : <><Trash2 size={15} /> Delete conversation</>}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </SiteLayout>
  );
}

export default Conversation;
