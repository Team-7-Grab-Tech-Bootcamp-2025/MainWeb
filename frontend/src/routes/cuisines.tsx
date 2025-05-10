import { Typography, Row, Col, Card, Skeleton } from "antd";
import CuisineCard from "../components/CuisineCard";
import { useCuisines } from "../hooks/useCuisine";

const { Title } = Typography;

export default function Cuisines() {
  const { data: cuisines, isLoading } = useCuisines();

  return (
    <main className="container min-h-screen">
      <div className="space-y-8">
        <Title level={2} className="mb-6">
          Tất cả ẩm thực
        </Title>

        {isLoading ? (
          <Row gutter={[24, 24]}>
            {Array(12)
              .fill(null)
              .map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                  <Card>
                    <Skeleton.Image active className="!h-[180px] !w-full" />
                    <Skeleton active paragraph={{ rows: 1 }} className="mt-4" />
                  </Card>
                </Col>
              ))}
          </Row>
        ) : (
          <Row gutter={[24, 24]}>
            {cuisines?.map((cuisine, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={cuisine}>
                <CuisineCard name={cuisine} index={index} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </main>
  );
}
