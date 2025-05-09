import React, { useMemo } from "react";
import { Flex, Typography } from "antd";
import { NavLink } from "react-router";
import { CUISINE_COLORS } from "../constants/colorConstants";
import { RightCircleOutlined } from "@ant-design/icons";
import "./CuisineCard.css";

const { Title } = Typography;

interface CuisineCardProps {
  name: string;
  index: number;
}

const CuisineCard: React.FC<CuisineCardProps> = ({ name, index }) => {
  const { background } = useMemo(() => {
    return CUISINE_COLORS[index % CUISINE_COLORS.length];
  }, [index]);

  return (
    <NavLink to={`/cuisine/${name.toLowerCase()}`}>
      <div className="cuisine-card">
        <div
          className="cuisine-card-container"
          style={{ backgroundColor: background }}
        >
          <div className="cuisine-card-overlay" />
          {/* Content */}
          <Flex className="cuisine-card-content" justify="center" vertical>
            <Title
              level={3}
              className="cuisine-card-title"
              ellipsis={{ rows: 1 }}
            >
              {name}
            </Title>
            <span className="cuisine-card-link">
              Xem ẩm thực
              <RightCircleOutlined className="ml-2" />
            </span>
          </Flex>
        </div>
      </div>
    </NavLink>
  );
};

export default CuisineCard;
