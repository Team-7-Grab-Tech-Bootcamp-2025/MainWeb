import { Outlet } from "react-router";
import { Layout } from "antd";
import AppHeader from "../components/Header";
import { SearchProvider } from "../contexts/search";

const { Content } = Layout;

export default function AppLayout() {
  return (
    <SearchProvider>
      <Layout>
        <AppHeader />
        <Content>
          <main className="container min-h-screen">
            <Outlet />
          </main>
        </Content>
      </Layout>
    </SearchProvider>
  );
}
