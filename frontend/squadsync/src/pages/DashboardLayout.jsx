import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div
      style={{
        marginLeft: 200, // leave space for fixed sidebar width
        minHeight: "100vh",
        backgroundColor: "#0b0f2a",
        color: "white",
        padding: 20,
      }}
    >
      <Sidebar />
      <main style={{ paddingTop: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}