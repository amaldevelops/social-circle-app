function ProjectInfo() {
  return (
    <div className="projectInfoDiv">
      <h3>Project Technical Information</h3>

      <h3>Core functionality</h3>

      <ul>
        <li className="pendingEmptyCheckbox">
          Users, profiles, posts, following, and liking posts
        </li>

        <li className="pendingEmptyCheckbox">
          Users must sign in to see anything except the sign-in page
        </li>
        <li className="pendingEmptyCheckbox">
          Users should be able to sign in using your chosen authentication
          method
        </li>
        <li className="pendingEmptyCheckbox">
          Users can send follow requests to other users
        </li>
        <li className="pendingEmptyCheckbox">
          Users can create posts Text only posts
        </li>
        <li className="pendingEmptyCheckbox">Users can like posts</li>
        <li className="pendingEmptyCheckbox">Users can comment on posts</li>
        <li className="pendingEmptyCheckbox">
          Posts should always display the post content, author, comments, and
          likes
        </li>
        <li className="pendingEmptyCheckbox">
          There should be an index page for posts, which shows all the recent
          posts from the current user and users they are following
        </li>

        <li className="pendingEmptyCheckbox">
          Users can create a profile with a profile picture.
        </li>

        <li className="pendingEmptyCheckbox">
          A user’s profile page should contain their profile information,
          profile photo, and posts
        </li>

        <li className="pendingEmptyCheckbox">
          An index page for users, which shows all users and buttons for sending
          follow requests to users the user is not already following or have a
          pending request
        </li>

        <li className="pendingEmptyCheckbox">
          Front End:React, Javascript, HTML, CSS{" "}
        </li>
        <li className="pendingEmptyCheckbox">Back End: Node.js, Express.js </li>
        <li className="pendingEmptyCheckbox">Database: PostgreSQL </li>
      </ul>

      <h3>Design and Tasks</h3>

      <h4>Front End : User interface Design</h4>

      <ul>
        <li className="pendingEmptyCheckbox">
          User interface Design: Decide on number of UI elements and React
          components required
        </li>
        <li className="pendingEmptyCheckbox">
          Login Screen: User Name Input, Password Input, Login button which will
          submit entered data, New User Registration Link, Demo User Login
          Button
        </li>

        <li className="pendingEmptyCheckbox">
          Security: Validate Password and User name with predefined criteria and
          provide user feed back accordingly
        </li>
        <li className="pendingEmptyCheckbox">
          Register screen: Full Name Input, E-Mail Input, Password Input, Retype
          Password input, Signup button which will submit entered data, link for
          users who have a account already
        </li>

        <li className="pendingEmptyCheckbox">
          Logged in users screen: Users Followers list which when clicked will
          take to other users screen, At the top search bar to search other
          users by name and then button to follow them
        </li>

        <li className="pendingEmptyCheckbox">
          User Profile: Edit job title, edit bio
        </li>
      </ul>

      <h4>Backend : Database Design</h4>
      <ul>
        <li className="pendingEmptyCheckbox">
          Data model Design : Authentication, Users, Message Storage
        </li>

        <li className="pendingEmptyCheckbox">
          "usersdetails" Table fields: id(Unique,auto generated), user_name
          (Unique, This will be the main ID for linking posts,likes, following
          and login to the app), full_name, email(Unique), password(Hashed),
          followers(usernames), following(usernames), likes(linked to ), profile_pic_url
        </li>

        <li className="pendingEmptyCheckbox">
          "posts" Table fields: id(Unique,auto generated),
          poster_user_name(linked to "usersdetails" Table id), likes,
          post_comments, post_content, time_stamp (Auto generated time and date)
        </li>
      </ul>

      <h4>Back End : Architecture</h4>
      <ul>
        <li className="pendingEmptyCheckbox">
          Authorization : Decide on Passport.js, JWT, cookie based or 3rd Party
          API based authentication
        </li>
        <li className="pendingEmptyCheckbox">
          Customizing a user profile logic
        </li>
      </ul>

      <h4>Cloud Infrastructure and Deployment</h4>

      <ul>
        <li className="pendingEmptyCheckbox">
          Render for Backend code hosting
        </li>
        <li className="pendingEmptyCheckbox">Neon for Database hosting</li>

        <li className="pendingEmptyCheckbox">Github Pages for FrontEnd</li>
      </ul>
    </div>
  );
}

export default ProjectInfo;
