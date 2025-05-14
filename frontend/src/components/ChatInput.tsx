import React, { useState, useRef } from "react";
import { Input, Button, Flex, message as antMessage } from "antd";
import {
  ArrowUpOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import "./ChatInput.css";
// Use type assertion instead of extending interface
type CustomUploadFile = UploadFile<File> & {
  originFileObj: File;
};

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  onNewChat: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onNewChat,
  placeholder = "Hỏi gì đó...",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (disabled) return;
    if (message.trim() || fileList.length > 0) {
      // Convert UploadFile[] to File[]
      const files: File[] = [];
      fileList.forEach((file) => {
        files.push(file.originFileObj);
      });

      onSend(message.trim(), files.length > 0 ? files : undefined);
      setMessage("");
      setFileList([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Check file types
    const newFiles: CustomUploadFile[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!file.type.startsWith("image/")) {
        antMessage.error("Please upload image files only");
        continue;
      }

      newFiles.push({
        uid: `-${Date.now()}-${i}`,
        name: file.name,
        status: "done",
        originFileObj: file as RcFile,
        type: file.type,
        size: file.size,
      });
    }

    setFileList((prev) => [...prev, ...newFiles]);

    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (uid: string) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  };

  return (
    <div className="chat-input-container">
      <Flex vertical className="rounded-2xl bg-white px-3 py-2 pt-4" gap={4}>
        {fileList.length > 0 && (
          <Flex className="flex-wrap gap-2 pb-2">
            {fileList.map((file) => (
              <div key={file.uid} className="relative h-16 w-16 rounded-md">
                <img
                  src={URL.createObjectURL(file.originFileObj)}
                  alt={file.name}
                  className="h-full w-full rounded-md object-cover"
                />
                <Button
                  type="text"
                  size="small"
                  className="absolute top-0 right-0 h-5 w-5 rounded-full bg-gray-700 p-0 text-white"
                  onClick={() => removeFile(file.uid)}
                >
                  ×
                </Button>
              </div>
            ))}
          </Flex>
        )}

        <Input
          className="chat-input"
          variant="borderless"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        <Flex align="center" justify="space-between">
          <Flex gap={2}>
            <Button
              type="text"
              icon={<PlusOutlined />}
              style={{ border: "1px solid rgba(5, 5, 5, 0.1)" }}
              onClick={onNewChat}
            >
              New chat
            </Button>
            <Button
              type="text"
              icon={<PictureOutlined />}
              style={{ border: "1px solid rgba(5, 5, 5, 0.1)" }}
              onClick={handleImageSelect}
            >
              Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Flex>

          <Button
            type="primary"
            shape="circle"
            size="large"
            className="border-none"
            icon={<ArrowUpOutlined className="mt-1 text-xl" />}
            onClick={handleSend}
            disabled={disabled || (!message.trim() && fileList.length === 0)}
          />
        </Flex>
      </Flex>
    </div>
  );
};

export default ChatInput;
