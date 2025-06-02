import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ApiRegister } from "../ApiQueries.js";

function Register() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    Navigate("/social-circle-app/login");
    ApiRegister(formData);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <br />
        <input
          name="name"
          id="name"
          type="text"
          value={formData.name}
          onChange={(event) => {
            setFormData({
              ...formData,
              [event.target.name]: event.target.value,
            });
          }}
          required
        ></input>
        <br />
        <label htmlFor="email">E-Mail</label>
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
          required
        ></input>
        <br />
        <label htmlFor="password">Password</label>
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
          required
        ></input>
        <br />
        <label htmlFor="bio">Bio</label>
        <br />
        <textarea
          name="bio"
          id="bio"
          value={formData.bio}
          onChange={(event) => {
            setFormData({
              ...formData,
              [event.target.name]: event.target.value,
            });
          }}
          required
        ></textarea>

        <div className="form-button-container">
          <button>Register</button>
        </div>
      </form>

      <div className="form-button-container">
        <button onClick={() => Navigate("/social-circle-app/login")}>
          Login Instead
        </button>
      </div>
    </div>
  );
}

export default Register;
