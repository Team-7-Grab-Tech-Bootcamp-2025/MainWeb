import { Outlet } from "react-router";
import { Layout } from "antd";
import AppHeader from "../components/Header";
import { SearchProvider } from "../contexts/search";

const { Content } = Layout;

export default function AppLayout() {
  const handleSearch = (searchTerm: string, districts: string[]) => {
    console.log("Search term:", searchTerm, "Districts:", districts);
    // Implement your search logic here
  };

  return (
    <SearchProvider onSearch={handleSearch}>
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
