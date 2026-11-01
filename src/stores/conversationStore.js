
import { create } from "zustand";
import api from "../api/client";


export const useConversationStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  loading: false,
  sending: false,
  error: null,

  clearError: () => set({ error: null }),

  // Fetch conversation history from MongoDB through Express 
  fetchConversations: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/conversations");
      console.log(response)

      set({
        conversations: response.data.conversations || [],
      });

      return true;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch conversations.",
      });

      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Create a conversation for the selected PDF
  createConversation: async (pdfId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/conversations", {
        pdfId,
      });

      const conversation = response.data.conversation;

      set((state) => ({
        conversations: [
          conversation,
          ...state.conversations.filter(
            (item) => item._id !== conversation._id
          ),
        ],
        activeConversation: conversation,
      }));

      return conversation;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create conversation.",
      });

      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Open an existing conversation
  openConversation: async (conversationId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(
        `/conversations/${conversationId}`
      );

      set({
        activeConversation: response.data.conversation,
      });

      return response.data.conversation;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to open conversation.",
      });

      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Send a question to Express, which calls FastAPI
  sendMessage: async (question) => {
    const conversation = get().activeConversation;

    if (!conversation?._id) {
      set({ error: "Please create or select a conversation first." });
      return false;
    }

    if (!question?.trim()) return false;

    set({ sending: true, error: null });

    // Optimistically display the user's question
    const userMessage = {
      role: "user",
      content: question.trim(),
      sources: [],
      createdAt: new Date().toISOString(),
      _localId: `user-${Date.now()}`,
    };

    set((state) => ({
      activeConversation: {
        ...state.activeConversation,
        messages: [
          ...(state.activeConversation?.messages || []),
          userMessage,
        ],
      },
    }));

    try {
      const response = await api.post(
        `/conversations/${conversation._id}/chat`,
        { question: question.trim() }
      );

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources || [],
        createdAt: new Date().toISOString(),
        _localId: `assistant-${Date.now()}`,
      };

      set((state) => {
        const current = state.activeConversation;

        if (current?._id !== conversation._id) {
          return {};
        }

        const messages = current.messages || [];

        // Replace the optimistic user message with the saved server
        // messages when the API returns them, if available.
        const userMessages = messages.filter(
          (message) => message._localId !== userMessage._localId
        );

        return {
          activeConversation: {
            ...current,
            messages: [...userMessages, assistantMessage],
          },
        };
      });

      // Refresh the saved conversation so MongoDB remains the source
      // of truth for history and message ordering.
      await get().openConversation(conversation._id);

      return true;
    } catch (error) {
      set((state) => ({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get an AI response.",
        // Keep the user's question visible so they can retry.
        activeConversation: state.activeConversation,
      }));

      return false;
    } finally {
      set({ sending: false });
    }
  },

  // Rename an existing conversation
  renameConversation: async (conversationId, title) => {
    try {
      const response = await api.patch(
        `/conversations/${conversationId}`,
        { title }
      );

      const updated = response.data.conversation;

      set((state) => ({
        conversations: state.conversations.map((item) =>
          item._id === conversationId ? updated : item
        ),
        activeConversation:
          state.activeConversation?._id === conversationId
            ? updated
            : state.activeConversation,
      }));

      return true;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to rename conversation.",
      });

      return false;
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    try {
      await api.delete(`/conversations/${conversationId}`);

      set((state) => ({
        conversations: state.conversations.filter(
          (item) => item._id !== conversationId
        ),
        activeConversation:
          state.activeConversation?._id === conversationId
            ? null
            : state.activeConversation,
      }));

      return true;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to delete conversation.",
      });

      return false;
    }
  },

  resetActiveConversation: () => {
    set({ activeConversation: null });
  },
}));
