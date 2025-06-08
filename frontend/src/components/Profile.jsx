import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { loadProfile, decodeJWTPayload, editProfile } from "../ApiQueries.js";
import JWTStatus from "./JwtStatus";

function Profile() {
  const { userName } = useParams();

  // State for displaying the user's current profile
  const [userProfile, setUserProfile] = useState({
    id: null,
    fullName: "",
    email: "",
    bio: "",
    posts: [],
    followers: [],
    following: [],
  });

  // State for the form inputs for updating the profile
  const [formInput, setFormInput] = useState({
    bio: "", // Initialized with empty string
    profilePicUrl: "",
  });

  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(null); // Error state for initial fetch
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for update operation
  const [updateError, setUpdateError] = useState(null); // Error state for update operation
  const [updateSuccess, setUpdateSuccess] = useState(false); // Success message for update

  // Effect to load the user's profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const decodedJwt = decodeJWTPayload();
        if (!decodedJwt || !decodedJwt.id) {
          setError("Could not decode user ID from JWT. Please log in.");
          setLoading(false);
          return;
        }

        // Store the user ID for potential future use (e.g., in update calls)
        setUserProfile((prev) => ({ ...prev, id: decodedJwt.id }));

        const loadedProfileInfo = await loadProfile(decodedJwt);
        console.log("Loadfdfdfsdf", loadedProfileInfo);

        // Ensure loadedProfileInfo.response contains email and bio
        if (loadedProfileInfo && loadedProfileInfo.response) {
          setUserProfile((prev) => ({
            ...prev, // Keep existing ID
            userName: loadedProfileInfo.response.userName || "",
            fullName: loadedProfileInfo.response.fullName || "",
            posts: loadedProfileInfo.response.posts || [],
            followers: loadedProfileInfo.response.followers || [],
            following: loadedProfileInfo.response.following || [],
            email: loadedProfileInfo.response.email || "",
            bio: loadedProfileInfo.response.bio || "",
            profilePicUrl: loadedProfileInfo.response.profilePicUrl || "",
          }));
          // Set initial form input value to current bio
          setFormInput({
            bio: loadedProfileInfo.response.bio || "",
            profilePicUrl: loadedProfileInfo.response.profilePicUrl || "",
          });
        } else {
          setError("Failed to load profile: Unexpected data format.");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Runs once on mount

  // Handle changes in the form inputs
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for editing the profile
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    setIsUpdating(true); // Set updating state to true
    setUpdateError(null); // Clear previous update errors
    setUpdateSuccess(false); // Reset success message

    if (!userProfile.id) {
      setUpdateError("User ID not available for profile update.");
      setIsUpdating(false);
      return;
    }

    try {
      // Call editProfile with the necessary data
      // Assuming editProfile expects contactID (which is userProfile.id) and the updatedBio
      const formData = {
        authenticatedUserName: userProfile.userName,
        updatedBio: formInput.bio,
        profilePicUrl: formInput.profilePicUrl,
      };
      const response = await editProfile(formData);

      if (response && response.status === "User Profile Updated") {
        // Update the displayed profile immediately on success
        setUserProfile((prev) => ({
          ...prev,
          bio: formInput.bio,
          profilePicUrl: formInput.profilePicUrl,
        }));
        setUpdateSuccess(true);
      } else {
        // setUpdateError(response.message || "Failed to update profile.");
        console.log(" ");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateError(
        "An error occurred while updating the profile. Please try again."
      );
    } finally {
      setIsUpdating(false); // Always set updating to false
    }
  };

  // Display loading, error, or profile data
  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <JWTStatus />
      <h1>User Profile</h1>
      <img
        src={userProfile.profilePicUrl}
        alt="Profile Pic"
        width="50"
        height="55"
      ></img>
      <p>User Name: {userProfile.userName}</p>
      <p>Full Name: {userProfile.fullName}</p>
      <p>E-Mail: {userProfile.email}</p>
      <p>Bio: {userProfile.bio || "No bio set."}</p>{" "}
      <div>
        <h4>
          Followers:{" "}
          {userProfile.followers.map((followers) => (
            <div key={followers.id}>
              <p>{followers.userName}</p>
            </div>
          ))}
        </h4>
      </div>
      <div>
        <h4>
          Following:{" "}
          {userProfile.following.map((followingName) => (
            <div key={followingName.id}>
              <Link
                to={`/social-circle-app/contacts/${followingName.following.userName}`}
              >
                {followingName.following.userName}
              </Link>
            </div>
          ))}
        </h4>
      </div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Contact ID is displayed, not editable directly here, as it's the logged-in user */}
        <p>
          <strong>Your ID:</strong> {userProfile.id}
        </p>

        <label htmlFor="bio">Bio</label>
        <br />
        <textarea
          name="bio"
          id="bio"
          value={formInput.bio} // Controlled component: value tied to state
          onChange={handleChange} // Update state on change
          rows="5" // Add rows for better textarea appearance
          cols="30"
        ></textarea>
        <br />
        <label htmlFor="profilePicUrl">Profile Pic</label>
        <br />
        <input
          name="profilePicUrl"
          id="profilePicUrl"
          value={formInput.profilePicUrl}
          onChange={handleChange}
        ></input>
        <br />

        <button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Edit Profile"}
        </button>

        {updateSuccess && (
          <p style={{ color: "green" }}>Profile updated successfully!</p>
        )}
        {updateError && <p style={{ color: "red" }}>{updateError}</p>}
      </form>
      <div>
        <h2>Users Posts</h2>
        {userProfile.posts.map((post) => (
          <div key={post.id}>
            <h3>Post ID: {post.id}</h3>
            <h4>Post Name: {post.content}</h4>
            <Link
              to={`/social-circle-app/${userProfile.userName}/post/${post.id}`}
            >
              View Post Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
