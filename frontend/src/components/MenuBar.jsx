import { Link, useNavigate } from "react-router-dom";
import { clearJwtLogOut } from "../ApiQueries.js";

function MenuBar() {
  const Navigate = useNavigate();

  function logout() {
    clearJwtLogOut();
    Navigate("/messaging-app");
    console.log("Clear JWT");
  }
  return (
    <>
      <div className="menuBar">
        <Link to="/messaging-app">Home</Link>
        <Link to="/messaging-app/contacts">All Contacts</Link>
        <Link to="/messaging-app/messages">Messages</Link>
        <Link to="/messaging-app/profile">Profile</Link>
        <Link to="/messaging-app/projectinfo">Technical Info</Link>

        <a
          href="https://github.com/amaldevelops/messaging-app/"
          target="_blank"
        >
          Github Source code
        </a>
        <a href="https://www.amalk.au/messaging-app/" target="_blank">
          Live Demo
        </a>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}

export default MenuBar;
