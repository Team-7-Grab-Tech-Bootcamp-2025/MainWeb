import { Typography, Space, Flex, Button } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { Link } from "react-router";
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
        <Flex id="hero-search" className="hero-search" align="center" gap={12}>
          {/* Chatbot Button */}
          <Link to="/ask">
            <Button
              type="default"
              shape="circle"
              size="large"
              className="hero-chat-button"
              icon={<CommentOutlined />}
            ></Button>
          </Link>

          <SearchBar size="large" className="hero-search-bar" />
        </Flex>
      </Space>
    </Flex>
  );
};

export default Hero;
