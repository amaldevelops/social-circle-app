import ProjectInfo from "./components/ProjectInfo";
import JWTStatus from "./components/JwtStatus";
import { useNavigate } from "react-router-dom";

import { ApiLogin } from "./ApiQueries"; // Assuming ApiLogin is an async function

import { Outlet } from "react-router-dom";

import "./App.css";

function App() {
  const formData = {
    email: "demoaccount@demo.com",
    password: "Demo2025",
    //https://avatars.githubusercontent.com/u/65403645
  };
  const Navigate = useNavigate();

  const handleSubmit = async () => {
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
        <h2>
          Please Note: The apps are hosted on the free tiers of Render, Neon,
          and GitHub Pages. As a result, initial loading may take up to two
          minutes due to server startup times.Front end is hosted on GitHub
          Pages using React Router, directly accessing nested routes (e.g.,
          `/send`) may lead to a 404 error. Please use the navigation within the
          site.
        </h2>

        <div>
          <button
            className="button-container"
            onClick={() => Navigate("login")}
          >
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
        </div>

        <div>
          <h2>📘 Project Introduction</h2>
          <p>
            This project is designed to strengthen technical proficiency in
            building a secure web based social networking app using standard web
            technologies.
          </p>

          <ul>
            <li className="bulletPointCustom1">
              Front End : React/Javascript/HTML/CSS Web interface to interact
              with your closest friends.
            </li>
            <li className="bulletPointCustom1">
              Backend : Node.js/Express for application Logic and PostgreSQL
              database for storing data. Database interaction via Prisma ORM
            </li>
            <li className="bulletPointCustom1">
              Security: JWT based authentication with hashed passwords using
              bcryptjs
            </li>
            <li className="bulletPointCustom1">Postman for API testing</li>
            <li className="bulletPointCustom1">REST API based backend </li>
          </ul>

          <h3>Live Demo</h3>
          <ul>
            <li className="bulletPointCustom2">
              <a href="https://www.amalk.au/social-circle-app" target="_blank">
                Front End Web App(GitHub Pages)
              </a>
            </li>
            <li className="bulletPointCustom2">
              <a
                href="https://social-circle-app.onrender.com/social-circle-api/v1/status"
                target="_blank"
              >
                Backend API (Render.com)
              </a>
            </li>
          </ul>

          <h3>💻 Source Code</h3>
          <ul>
            <li className="bulletPointCustom2">
              <a
                href="https://github.com/amaldevelops/social-circle-app"
                target="_blank"
              >
                Main GitHub Repository
              </a>
            </li>
            <li className="bulletPointCustom2">
              <a
                href="https://github.com/amaldevelops/social-circle-app/tree/main/frontend"
                target="_blank"
              >
                Front End Code
              </a>
            </li>

            <li className="bulletPointCustom2">
              <a
                href="https://github.com/amaldevelops/social-circle-app/tree/main/backend"
                target="_blank"
              >
                Back End Code
              </a>
            </li>
          </ul>
        </div>

        <Outlet />
      </div>
    </>
  );
}

export default App;
