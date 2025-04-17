import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TodoList } from "./components/TodoList";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider>
          <div className="app-container">
            <header className="app-header">
              <h1>Todo App</h1>
            </header>
            <TodoList />
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}

export default App;
