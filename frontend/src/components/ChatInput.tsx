import React, { useState } from "react";
import { Input, Button, Flex } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import "./ChatInput.css";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = "Hỏi gì đó...",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (disabled) return;
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <Flex align="center" className="rounded-2xl bg-white px-2 py-4 pr-3">
        <Input
          className="chat-input"
          variant="borderless"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <Button
          type="primary"
          shape="circle"
          size="large"
          className="border-none"
          icon={<ArrowUpOutlined className="mt-1 text-xl" />}
          onClick={handleSend}
          disabled={disabled || !message.trim()}
        />
      </Flex>
    </div>
  );
};

export default ChatInput;
