import { Link, useNavigate } from "react-router-dom";
import { clearJwtLogOut } from "../ApiQueries.js";

function MenuBar() {
  const Navigate = useNavigate();

  function logout() {
    clearJwtLogOut();
    Navigate("/social-circle-app");
    console.log("Clear JWT");
  }
  return (
    <>
      <div className="menuBar">
        <Link to="/social-circle-app">Home</Link>
        <Link to="/social-circle-app/socialfeed">Social Feed</Link>
        <Link to="/social-circle-app/contacts">All Users</Link>

        <Link to="/social-circle-app/profile">Profile</Link>
        <p>|</p>
        <Link to="/social-circle-app/projectinfo">Technical Info</Link>

        <a
          href="https://github.com/amaldevelops/social-circle-app/"
          target="_blank"
        >
          Github Source code
        </a>
        <a href="https://www.amalk.au/social-circle-app/" target="_blank">
          Live Demo
        </a>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}

export default MenuBar;
