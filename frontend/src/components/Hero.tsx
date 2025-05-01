import { Typography, Space, Flex } from "antd";
import SearchBar from "./SearchBar";

interface HeroProps {
  title: string;
  subtitle: string;
}

const { Title, Paragraph } = Typography;

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
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
        <div id="hero-search" className="mx-auto w-full max-w-3xl">
          <SearchBar
            size="large"
            className="rounded-lg shadow-xl"
            addonWidth={130}
          />
        </div>
      </Space>
    </Flex>
  );
};

export default Hero;
