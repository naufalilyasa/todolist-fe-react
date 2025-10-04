import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { Result, Button, Layout } from "antd";

const { Content } = Layout;

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "99svw",
        overflowX: "hidden",
        background: "#f5f5f5",
      }}
    >
      <Content
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "100vw",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle="Oops! The page you are looking for does not exist."
          extra={
            <Button type="primary" size="large" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          }
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            padding: "48px 24px",
            width: "100%",
            maxWidth: 600,
          }}
        />
      </Content>
    </Layout>
  );
};

export default NotFound;
