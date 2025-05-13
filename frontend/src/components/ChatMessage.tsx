import React from "react";
import { Typography } from "antd";
import "./ChatMessage.css";

const { Text, Paragraph } = Typography;

export type MessageType = "user" | "bot";

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp = new Date(),
}) => {
  return (
    <div
      className={`chat-message ${type === "user" ? "chat-message-user" : "chat-message-bot"}`}
    >
      <div className="chat-bubble">
        <Paragraph className="chat-content">{content}</Paragraph>
        <Text className="chat-timestamp">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </div>
    </div>
  );
};

export default ChatMessage;
