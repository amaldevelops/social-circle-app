import { useState } from "react";
import ProjectInfo from "./components/ProjectInfo";
import JWTStatus from "./components/JwtStatus";
import { useNavigate } from "react-router-dom";

import { Outlet } from "react-router-dom";

import "./App.css";

function App() {
  const Navigate = useNavigate();

  return (
    <>
      <div>
        <JWTStatus />
        <h1>Web Based Messaging App </h1>

        <button className="button-container" onClick={() => Navigate("login")}>
          Login
        </button>
        <button
          className="button-container"
          onClick={() => Navigate("register")}
        >
          Register
        </button>
        <Outlet />
      </div>
    </>
  );
}

export default App;
