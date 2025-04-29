import React from "react";
import { Typography } from "antd";
import { NavLink } from "react-router";

const { Title, Paragraph } = Typography;

interface CuisineCardProps {
  name: string;
  image: string;
  description?: string;
}

const CuisineCard: React.FC<CuisineCardProps> = ({
  name,
  image,
  description,
}) => {
  return (
    <NavLink
      className="transform cursor-pointer transition-all duration-300 hover:-translate-y-2"
      to={`/cuisine/${name.toLowerCase()}`}
    >
      <div className="relative h-[180px] overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
        {/* Image Background */}
        <div className="absolute inset-0 h-full w-full">
          <img
            alt={name}
            src={image}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-3 text-white">
          <Title
            level={5}
            className="m-0 mb-0.5 text-white"
            ellipsis={{ rows: 1 }}
          >
            {name}
          </Title>
          {description && (
            <Paragraph
              className="m-0 text-xs text-white/90"
              ellipsis={{ rows: 1, expandable: false, tooltip: description }}
            >
              {description}
            </Paragraph>
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default CuisineCard;
