import { useState } from "react";
import { useLocation } from "../hooks/useLocation";
import { Card, Flex, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import LoadingDot from "./LoadingDot";
import "./LocationRequestCard.css";

interface LocationRequestProps {
  onClose?: () => void;
}

export default function LocationRequest({ onClose }: LocationRequestProps) {
  const { loading, error, requestLocation, coordinates } = useLocation();
  const [dismissed, setDismissed] = useState(false);

  const handleRequestLocation = () => {
    requestLocation();
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onClose) onClose();
    localStorage.setItem("locationPromptDismissed", "true");
  };

  if (coordinates || dismissed) {
    return null;
  }

  return (
    <div className="location-card">
      <Card className="shadow-lg">
        <Flex align="start">
          <div className="location-card-icon">
            <EnvironmentOutlined className="location-card-icon-svg" />
          </div>
          <div className="location-card-content">
            <h3 className="location-card-title">Bật dịch vụ vị trí</h3>
            <p className="location-card-description">
              Cho phép chúng tôi hiển thị các nhà hàng gần bạn và tính toán
              khoảng cách.
            </p>
            {error && <p className="location-card-error">{error}</p>}
            <div className="location-card-actions">
              <Button
                type="primary"
                onClick={handleRequestLocation}
                disabled={loading}
              >
                {loading ? <LoadingDot size={6} /> : "Cho phép"}
              </Button>
              <Button onClick={handleDismiss}>Không phải bây giờ</Button>
            </div>
          </div>
        </Flex>
      </Card>
    </div>
  );
}
