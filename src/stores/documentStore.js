
import { create } from "zustand";
import api from "../api/client";

export const useDocumentStore = create((set, get) => ({
  documents: [],
  loading: true,
  refreshing: false,
  uploading: false,
  deletingId: null,
  viewingId: null,
  error: null,

  clearError: () => set({ error: null }),

  fetchDocuments: async ({ refresh = false } = {}) => {
    set({
      ...(refresh
        ? { refreshing: true }
        : { loading: true }),
      error: null,
    });

    try {
      const { data } = await api.get("/documents");

      const documents =
        (Array.isArray(data) && data) ||
        data?.documents ||
        data?.pdfs ||
        data?.data?.documents ||
        data?.data?.pdfs ||
        data?.data ||
        data?.results ||
        [];

      if (!Array.isArray(documents)) {
        throw new Error("The server returned an invalid document list.");
      }

      set({ documents });
      return documents;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to load documents.",
      });

      throw error;
    } finally {
      set({ loading: false, refreshing: false });
    }
  },

uploadDocument: async (file) => {
  if (!file) {
    set({ error: "Please select a PDF file." });
    return false;
  }
  const formData = new FormData();
  formData.append("file", file);
  console.log("FormData contents:", [...formData.entries()]);
  set({ uploading: true, error: null });

  try {
    await api.post("/documents/upload", formData);

    await get().fetchDocuments();

    return true;
  } catch (error) {
    set({
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to upload document.",
    });

    return false;
  } finally {
    set({ uploading: false });
  }
},

  deleteDocument: async (id) => {
    set({ deletingId: id, error: null });

    try {
      await api.delete(`/documents/${id}`);

      set((state) => ({
        documents: state.documents.filter(
          (document) =>
            String(document._id || document.id || document.documentId) !==
            String(id)
        ),
      }));

      return true;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete document.",
      });

      return false;
    } finally {
      set({ deletingId: null });
    }
  },

  getDocumentViewUrl: async (id) => {
    set({ viewingId: id, error: null });

    try {
      const { data } = await api.get(`/documents/${id}/view`);

      if (!data?.url) {
        throw new Error("The server did not return a PDF viewing URL.");
      }

      return data.url;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to open document.",
      });

      return null;
    } finally {
      set({ viewingId: null });
    }
  },

  resetDocuments: () =>
    set({
      documents: [],
      loading: true,
      refreshing: false,
      uploading: false,
      deletingId: null,
      viewingId: null,
      error: null,
    }),
}));
