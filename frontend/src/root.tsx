import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Flex } from "antd";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "@ant-design/v5-patch-for-react-19";
import "./index.css";
import LoadingDot from "./components/LoadingDot";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Angi</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

export function HydrateFallback() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c99383",
        },
      }}
    >
      <Flex className="min-h-screen" align="center" justify="center">
        <LoadingDot />
      </Flex>
    </ConfigProvider>
  );
}

export function links() {
  return [
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },
  ];
}

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider
          theme={{
            token: {
              colorSuccess: "#a3b18a",
              colorError: "#bf1922",
              colorWarning: "#e1ad01",
              colorPrimary: "#c99383",
              colorInfo: "#c99383",
              colorTextBase: "#112d4e",
              colorBgBase: "#f7e8d3",
            },
            components: {
              Rate: {
                starColor: "rgb(255,149,41)",
              },
            },
          }}
        >
          <Outlet />
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}
