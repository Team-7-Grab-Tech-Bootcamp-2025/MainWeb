import { useState } from "react";
import { Input, Typography, Space, Flex } from "antd";

interface HeroProps {
  title: string;
  subtitle: string;
  onSearch?: (searchTerm: string) => void;
}

const { Title, Paragraph } = Typography;

const Hero: React.FC<HeroProps> = ({ title, subtitle, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    if (onSearch) onSearch(value);
  };

  return (
    <Flex className="relative h-72 w-full items-center justify-center">
      <Space
        direction="vertical"
        size={"middle"}
        className="w-full text-center"
      >
        <Title
          level={1}
          className="text-4xl font-bold md:text-5xl lg:text-6xl"
          style={{ marginBottom: 8 }}
        >
          {title}
        </Title>
        <Paragraph className="text-xl md:text-2xl" style={{ marginBottom: 16 }}>
          {subtitle}
        </Paragraph>

        {/* Search Bar */}
        <div className="mx-auto w-full max-w-3xl">
          <Input.Search
            placeholder="Search..."
            enterButton="Search"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            className="rounded-lg shadow-xl"
          />
        </div>
      </Space>
    </Flex>
  );
};

export default Hero;
