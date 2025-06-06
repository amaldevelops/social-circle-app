import { useState } from "react";
import ProjectInfo from "./components/ProjectInfo";
import JWTStatus from "./components/JwtStatus";
import { useNavigate } from "react-router-dom";

import { ApiLogin } from "./ApiQueries"; // Assuming ApiLogin is an async function

import { Outlet } from "react-router-dom";

import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    email: "demoaccount@amalk.au",
    password: "Demo2025",
  });

  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    // Make the function asynchronous

    await ApiLogin(formData); // Await the API login call to complete

    // Add a 2-second delay before navigating
    setTimeout(() => {
      Navigate("/social-circle-app/socialfeed");
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  return (
    <>
      <div>
        <JWTStatus />
        <h1>Social Circle - Social networking web app </h1>

        <button className="button-container" onClick={() => Navigate("login")}>
          Login
        </button>
        <button className="button-container" onClick={() => handleSubmit()}>
          Demo Account login
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
