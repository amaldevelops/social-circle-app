import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { ApiLogin } from "../ApiQueries.js"; // Assuming ApiLogin is an async function

function Login() {
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    // Make the function asynchronous
    event.preventDefault();
    await ApiLogin(formData); // Await the API login call to complete

    // Add a 2-second delay before navigating
    setTimeout(() => {
      Navigate("/social-circle-app/socialfeed");
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-Mail: </label>
        <br />
        <input
          name="email"
          id="email"
          type="email"
          value={formData.email}
          onChange={(event) => {
            setFormData({
              ...formData,
              [event.target.name]: event.target.value,
            });
          }}
          autoComplete="username"
          required
        ></input>
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          name="password"
          id="password"
          type="password"
          value={formData.password}
          onChange={(event) => {
            setFormData({
              ...formData,
              [event.target.name]: event.target.value,
            });
          }}
          autoComplete="current-password"
          required
        ></input>
        <br />
        <div className="form-button-container">
          <button type="submit">Submit</button>
        </div>
      </form>
      <br />
      <button onClick={() => Navigate("/social-circle-app/register")}>
        Register Instead
      </button>
    </div>
  );
}

export default Login;
