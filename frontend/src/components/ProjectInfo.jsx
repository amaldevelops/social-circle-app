function ProjectInfo() {
  return (
    <div className="projectInfoDiv">
      <h3>Project Technical Information</h3>

      <h3>Core functionality</h3>

      <ul>
        <li className="completedTick">
          Guest sign-in button that allows visitors to bypass the login screen
          without creating an account or supplying credentials.
        </li>
        <li className="pendingEmptyCheckbox">Users can like posts</li>
        <li className="pendingEmptyCheckbox">Users can comment on posts</li>
        <li className="pendingEmptyCheckbox">
          Posts should always display the post content, author, comments, and
          likes
        </li>
        <li className="completedTick">
          There should be an index page for posts, which shows all the recent
          posts from the current user and users they are following
        </li>
        <li className="completedTick">
          Users must sign in to see anything except the sign-in page
        </li>
        <li className="completedTick">
          Users should be able to sign in using a chosen authentication method
        </li>
        <li className="completedTick">
          Users can send follow requests to other users
        </li>
        <li className="completedTick">
          Users can create posts Text only posts
        </li>

        <li className="completedTick">
          Users can create a profile with a profile picture.
        </li>

        <li className="completedTick">
          A user’s profile page should contain their profile information,
          profile photo, and posts
        </li>

        <li className="completedTick">
          An index page for users, which shows all users and buttons for sending
          follow requests to users the user is not already following or have a
          pending request
        </li>

        <li className="completedTick">
          Front End:React, Javascript, HTML, CSS{" "}
        </li>
        <li className="completedTick">Back End: Node.js, Express.js </li>
        <li className="completedTick">Database: PostgreSQL </li>
      </ul>

      <h3>Design and Tasks</h3>

      <h4>Front End : User interface Design</h4>

      <ul>
        <li className="pendingEmptyCheckbox">
          Logged in users screen: Users Followers list which when clicked will
          take to other users screen and a button to follow them
        </li>

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
          User Profile: edit bio, Update profile Pic
        </li>
      </ul>

      <h4>Backend : Database Design</h4>
      <ul>
        <li className="completedTick">
          Data model Design : Authentication, Users, Message Storage
        </li>

        <li className="completedTick">
          "usersdetails" Table fields: id(Unique,auto generated), username
          (Unique, This will be the main ID for linking posts,likes, following
          and login to the app), fullname, email(Unique), password(Hashed),
          followers(usernames), following(usernames), likes(linked to ),
          profile_pic_url
        </li>

        <li className="completedTick">
          "posts" Table fields: id(Unique,auto generated), posterusername(linked
          to "usersdetails" Table id), likes, post_comments, postcontent,
          timestamp (Auto generated time and date)
        </li>
      </ul>

      <h4>Back End : Architecture</h4>
      <ul>
        <li className="completedTick">
          Authorization : Decide on Passport.js, JWT, cookie based or 3rd Party
          API based authentication
        </li>
        <li className="completedTick">Customizing a user profile logic</li>
      </ul>

      <h4>Cloud Infrastructure and Deployment</h4>

      <ul>
        <li className="completedTick">Render for Backend code hosting</li>
        <li className="completedTick">Neon for Database hosting</li>

        <li className="completedTick">Github Pages for FrontEnd</li>
      </ul>
    </div>
  );
}

export default ProjectInfo;
