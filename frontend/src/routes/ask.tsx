import { useRef, useEffect } from "react";
import { Typography, Flex, Card } from "antd";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import useChatbot from "../hooks/useChatbot";

const { Title } = Typography;

export default function AskPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isLoading, reset } = useChatbot();
  const title = "Bạn muốn hỏi gì về các nhà hàng?";

  const handleSendMessage = (content: string, files?: File[]) => {
    sendMessage(content, files);
  };

  const handleNewChat = () => {
    reset();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <main className="container pb-24">
      <Flex className="relative mx-auto max-w-3xl flex-col pt-4" vertical>
        <Card className="min-h-[calc(100vh-15rem)] rounded-3xl">
          <Flex vertical className="overflow-y-auto p-4">
            {messages.length === 0 ? (
              <Title level={4} className="text-center">
                {title}
              </Title>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    type={msg.type}
                    content={msg.content}
                    images={msg.images}
                    restaurantIds={msg.restaurantIds}
                  />
                ))}
                {isLoading && (
                  <ChatMessage type="bot" content="" isLoading={true} />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </Flex>
        </Card>

        <div className="fixed right-0 bottom-0 left-0 bg-[var(--background-color)]">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSendMessage}
              onNewChat={handleNewChat}
              placeholder={isLoading ? "Đang trả lời..." : "Hỏi gì đó..."}
              disabled={isLoading}
            />
          </div>
        </div>
      </Flex>
    </main>
  );
}
