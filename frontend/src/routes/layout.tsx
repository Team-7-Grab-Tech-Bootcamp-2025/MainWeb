import { Outlet } from "react-router";
import { Layout } from "antd";
import AppHeader from "../components/common/Header";

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout>
      <AppHeader />
      <Content>
        <main className="container min-h-screen">
          <Outlet />
        </main>
      </Content>
    </Layout>
  );
}
