export interface ChatbotRequest {
  session_id: string;
  user_text_input: string;
  image_pb?: File[];
}

export interface ChatbotResponse {
  status: string;
  messages: string;
  res_id: string[];
}

export type ChatMessageType = "user" | "bot";

export interface ChatMessage {
  type: ChatMessageType;
  content: string;
  images?: string[];
  restaurantIds?: string[];
}
