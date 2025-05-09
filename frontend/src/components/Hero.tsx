import { Typography, Space, Flex } from "antd";
import SearchBar from "./SearchBar";
import "./Hero.css";

interface HeroProps {
  title: string;
  subtitle: string;
}

const { Title, Paragraph } = Typography;

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <Flex className="hero-container" align="center" justify="center">
      <Space direction="vertical" size="middle" className="hero-content">
        <Title level={1} className="hero-title">
          {title}
        </Title>
        <Paragraph className="hero-subtitle">{subtitle}</Paragraph>

        {/* Search Bar */}
        <div id="hero-search" className="hero-search">
          <SearchBar size="large" className="hero-search-bar" />
        </div>
      </Space>
    </Flex>
  );
};

export default Hero;
