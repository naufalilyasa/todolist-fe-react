import { Layout, Spin } from "antd";

const Loading = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "99svw",
        overflowX: "hidden",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: "200px",
          width: "100%",
          marginTop: "10%",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    </Layout>
  );
};

export default Loading;
