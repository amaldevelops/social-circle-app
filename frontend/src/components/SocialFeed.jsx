import { useState, useEffect } from "react";
import { loadProfile, decodeJWTPayload, newPost } from "../ApiQueries.js";
import JWTStatus from "./JwtStatus.jsx";

function SocialFeed() {
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

  // State for the form inputs for updating the new Post
  const [formInput, setFormInput] = useState({
    newPost: "", // Initialized with empty string
    
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
            SocialFeed: loadedProfileInfo.response.bio || "",
            
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

    try {
      const formData = {
        authenticatedUserName: userProfile.userName,
        post: formInput.newPost,
      };
      const response = await newPost(formData);

   
    } catch (err) {
      console.error("Error Creating New post:", err);
      setUpdateError(
        "An error occurred while creating new post. Please try again."
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
      <h1>Your Social Feed</h1>
      <img
        src={userProfile.profilePicUrl}
        alt="Profile Pic"
        width="50"
        height="75"
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
              <a href={followingName.following.userName}>
                {followingName.following.userName},{" "}
              </a>
            </div>
          ))}
        </h4>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {/* Contact ID is displayed, not editable directly here, as it's the logged-in user */}

          <label htmlFor="newPost">New Post</label>
          <br />
          <textarea
            name="newPost"
            id="newPost"
            value={formInput.newPost} // Controlled component: value tied to state
            onChange={handleChange} // Update state on change
            rows="2" // Add rows for better textarea appearance
            cols="50"
          ></textarea>
          <br />

          <br />

          <button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Publish New Post"}
          </button>

          {updateSuccess && (
            <p style={{ color: "green" }}>Profile updated successfully!</p>
          )}
          {updateError && <p style={{ color: "red" }}>{updateError}</p>}
        </form>
      </div>
      <div>
        <h2>Your Posts</h2>
        {userProfile.posts.map((post) => (
          <div key={post.id}>
            <h3>Post ID: {post.id}</h3>
            <h4>Post Name: {post.content}</h4>
          </div>
        ))}
      </div>
      <h2>Your Followers Posts</h2>
              {userProfile.posts.map((post) => (
          <div key={post.id}>
            <h3>Post ID: {post.id}</h3>
            <h4>Post Name: {post.content}</h4>
          </div>
        ))}
    </div>
  );
}

export default SocialFeed;
