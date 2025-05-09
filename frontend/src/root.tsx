import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Spin } from "antd";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

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
      <div className="relative min-h-screen">
        <Spin
          size="large"
          className="absolute top-1/3 left-1/2 -translate-x-1/2"
        />
      </div>
    </ConfigProvider>
  );
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
          <ReactQueryDevtools initialIsOpen={false} />
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}
