function ProjectInfo() {
  return (
    <div className="projectInfoDiv">
      <h3>Project Technical Information</h3>

      <h3>Core functionality</h3>

      <ul>
        <li className="completedTick">Authorization</li>
        <li className="completedTick">Sending messages to another user</li>
        <li className="completedTick">Customizing a user profile</li>
        <li className="completedTick">
          Front End:React, Javascript, HTML, CSS{" "}
        </li>
        <li className="completedTick">Back End: Node.js, Express.js </li>
        <li className="completedTick">Database: PostgreSQL </li>
      </ul>

      <h3>Design and Tasks</h3>

      <h4>Front End : User interface Design</h4>

      <ul>
        <li className="completedTick">
          User interface Design: Decide on number of UI elements and React
          components required
        </li>
        <li className="completedTick">
          Login Screen: User Name Input, Password Input, Login button which will
          submit entered data, New User Registration Link, Demo User Login
          Button
        </li>

        <li className="completedTick">
          Security: Validate Password and User name with predefined criteria and
          provide user feed back accordingly
        </li>
        <li className="completedTick">
          Register screen: Full Name Input, E-Mail Input, Password Input, Retype
          Password input, Signup button which will submit entered data, link for
          users who have a account already
        </li>

        <li className="completedTick">
          Logged in users screen: Users previously Contacted list which when
          clicked will take to messaging screen, At the top search bar to search
          other users by e-mail and then button to add them to own contact list
        </li>

        <li className="completedTick">
          User Profile: Edit job title, edit bio
        </li>
      </ul>

      <h4>Backend : Database Design</h4>
      <ul>
        <li className="completedTick">
          Data model Design : Authentication, Users, Message Storage
        </li>

        <li className="completedTick">
          Users Table fields: Full Name, E-mail (This will be the main ID for
          linking posts), Hashed Password
        </li>

        <li className="completedTick">
          Messages Table fields: Sender ID(e-mail), Receiver ID (e-mail),
          Message Content, Time Stamp
        </li>
      </ul>

      <h4>Back End : Architecture</h4>
      <ul>
        <li className="completedTick">
          Authorization : Decide on Passport.js, JWT, cookie based or 3rd Party
          API based authentication
        </li>
        <li className="completedTick">
          Sending messages to another user, decide on realtime or JSON API based{" "}
        </li>
        <li className="completedTick">
          Customizing a user profile logic
        </li>
      </ul>

      <h4>Cloud Infrastructure and Deployment</h4>

      <ul>
        <li className="completedTick">
          Render for Backend code hosting
        </li>
        <li className="completedTick">Neon for Database hosting</li>

        <li className="completedTick">Github Pages for FrontEnd</li>
      </ul>
    </div>
  );
}

export default ProjectInfo;
