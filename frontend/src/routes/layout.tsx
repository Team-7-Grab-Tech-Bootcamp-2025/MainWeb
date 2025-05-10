import { Outlet } from "react-router";
import { Layout } from "antd";
import AppHeader from "../components/Header";
import { SearchProvider } from "../contexts/search";
import { LocationProvider } from "../contexts/location";
import LocationRequestCard from "../components/LocationRequestCard";

const { Content } = Layout;

export default function AppLayout() {
  return (
    <LocationProvider>
      <SearchProvider>
        <Layout>
          <AppHeader />
          <Content>
            <Outlet />
            <LocationRequestCard />
          </Content>
        </Layout>
      </SearchProvider>
    </LocationProvider>
  );
}
