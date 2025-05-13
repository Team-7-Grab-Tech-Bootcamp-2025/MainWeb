import { useState, useRef, useEffect } from "react";
import { Typography, Empty, Flex } from "antd";
import ChatMessage from "../components/ChatMessage";
import type { ChatMessageProps } from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

const { Title } = Typography;

export default function AskPage() {
  const initialMessages = [
    {
      type: "bot" as const,
      content: "Xin chào! Tôi là nhà hàng Bot. Tôi có thể giúp gì cho bạn?",
      timestamp: new Date(),
    },
  ];

  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const title = "Bạn muốn hỏi gì về các nhà hàng?";

  // Mock bot response - in a real app, this would call an API
  const handleBotResponse = (userMessage: string) => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Simple responses based on keywords
      let botResponse = "Xin lỗi, tôi không hiểu câu hỏi của bạn.";

      const lowercaseMsg = userMessage.toLowerCase();
      if (lowercaseMsg.includes("nhà hàng")) {
        botResponse =
          "Chúng tôi có nhiều nhà hàng ngon để bạn khám phá. Bạn có thể tìm kiếm theo địa điểm hoặc loại ẩm thực.";
      } else if (
        lowercaseMsg.includes("đặt bàn") ||
        lowercaseMsg.includes("đặt chỗ")
      ) {
        botResponse =
          "Để đặt bàn, bạn có thể vào trang chi tiết nhà hàng và chọn tính năng đặt bàn.";
      } else if (
        lowercaseMsg.includes("món ngon") ||
        lowercaseMsg.includes("đặc sản")
      ) {
        botResponse =
          "Mỗi nhà hàng đều có những món đặc sản riêng. Bạn có thể xem đánh giá của người dùng để biết thêm chi tiết.";
      } else if (
        lowercaseMsg.includes("xin chào") ||
        lowercaseMsg.includes("hi") ||
        lowercaseMsg.includes("hello")
      ) {
        botResponse = "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?";
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleSendMessage = (content: string) => {
    const newUserMessage = {
      type: "user" as const,
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    handleBotResponse(content);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <main className="container pb-24">
      <Flex className="relative mx-auto max-w-3xl flex-col pt-4" vertical>
        <div style={{ padding: "16px 24px" }}>
          <Title level={4} className="mb-4 border-gray-200 pb-2 text-center">
            {title}
          </Title>
        </div>

        <Flex vertical className="overflow-y-auto p-4">
          {messages.length === 0 ? (
            <Empty
              className="flex items-center justify-center py-12"
              description="Bắt đầu cuộc trò chuyện"
            />
          ) : (
            messages.map((msg, index) => (
              <ChatMessage
                key={index}
                type={msg.type}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </Flex>

        <div className="fixed right-0 bottom-0 left-0 bg-[var(--background-color)]">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSendMessage}
              placeholder={loading ? "Đang trả lời..." : "Hỏi gì đó..."}
              disabled={loading}
            />
          </div>
        </div>
      </Flex>
    </main>
  );
}
