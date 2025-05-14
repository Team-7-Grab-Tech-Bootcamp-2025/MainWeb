import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../services/chatbotApi";
import type { ChatMessage, ChatbotRequest } from "../types/chatbot";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(() => generateSessionId());

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      // Add the bot response to messages
      if (data.status === "success") {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: data.messages,
            restaurantIds: data.res_id.length > 0 ? data.res_id : undefined,
          },
        ]);
      }
    },
    onError: (error) => {
      // Add an error message
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: `Error: ${error.message || "Failed to get response"}`,
        },
      ]);
    },
  });

  const sendMessage = useCallback(
    (message: string, files?: File[]) => {
      // Add user message to the list
      const fileUrls = files?.map((file) => URL.createObjectURL(file));

      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: message,
          images: fileUrls, // Add local URLs for preview
        },
      ]);

      // Prepare the request
      const request: ChatbotRequest = {
        session_id: sessionId,
        user_text_input: message,
      };

      if (files && files.length > 0) {
        request.image_pb = files;
      }

      // Send the message to the API
      chatMutation.mutate(request);
    },
    [sessionId, chatMutation],
  );

  return {
    messages,
    sendMessage,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
    reset: useCallback(() => {
      setMessages([]);
    }, []),
  };
}

export default useChatbot;
