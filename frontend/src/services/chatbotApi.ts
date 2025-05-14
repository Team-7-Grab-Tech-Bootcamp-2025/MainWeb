import axios from "axios";
import type { ChatbotRequest, ChatbotResponse } from "../types/chatbot";

const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_CHATBOT_API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export async function sendChatMessage(
  payload: ChatbotRequest,
): Promise<ChatbotResponse> {
  try {
    const formData = new FormData();
    formData.append("session_id", payload.session_id);
    formData.append("user_text_input", payload.user_text_input);

    if (payload.image_pb && payload.image_pb.length > 0) {
      payload.image_pb.forEach((file) => {
        formData.append("image_pb", file);
      });

      const response = await chatbotApi.post<ChatbotResponse>(
        "/chat",
        formData,
      );

      return response.data;
    }

    const response = await chatbotApi.post<ChatbotResponse>("/chat", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to send chat message: ${error.response?.data || error.message}`,
      );
    }
    throw error;
  }
}
