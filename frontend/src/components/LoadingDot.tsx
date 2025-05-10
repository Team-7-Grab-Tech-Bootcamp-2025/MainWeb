import { Flex } from "antd";
import "./LoadingDot.css";

interface LoadingDotProps {
  size?: number;
}

const LoadingDot = ({ size = 8 }: LoadingDotProps) => (
  <Flex align="center" justify="center" className="loading-dot" gap={2}>
    <div style={{ width: size, height: size }}></div>
    <div style={{ width: size, height: size }}></div>
    <div style={{ width: size, height: size }}></div>
  </Flex>
);

export default LoadingDot;
