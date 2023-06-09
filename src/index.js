import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import en_US from "antd/locale/en_US";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider locale={en_US}>
    <App />
  </ConfigProvider>
);
