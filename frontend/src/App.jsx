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
<p>This project is designed to strengthen technical proficiency in building a secure web based social networking app using standard web technologies.</p>

<ul>
  <li className="bulletPointCustom1">Front End : React/Javascript/HTML/CSS Web interface to interact with your closest friends.</li>
  <li className="bulletPointCustom1">Backend : Node.js/Express for application Logic and PostgreSQL database for storing data</li>

</ul>

        </div>

        <Outlet />
      </div>
    </>
  );
}

export default App;
