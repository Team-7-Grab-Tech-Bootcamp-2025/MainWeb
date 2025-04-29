import { Flex, Typography } from "antd";
import { Layout } from "antd";
import React from "react";
import { NavLink } from "react-router";

const { Title } = Typography;
const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header className="bg-background sticky top-0 z-50 w-full border-b border-none px-3 shadow-sm md:px-12">
      <NavLink to="/">
        <Flex className="mx-auto h-full" align="center" gap={12}>
          <img src="/icon.svg" alt="Logo" className="text-foreground size-7" />
          <Title level={3} style={{ marginBottom: 0 }}>
            Angi
          </Title>
        </Flex>
      </NavLink>
    </Header>
  );
};

export default AppHeader;
