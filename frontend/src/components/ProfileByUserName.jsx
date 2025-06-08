import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { loadProfile, decodeJWTPayload, editProfile } from "../ApiQueries.js";
import JWTStatus from "./JwtStatus.jsx";

function ProfileByUserName() {
  const { userName } = useParams();
  const userObject = {
    userName: userName,
  };

  console.log("UserName ISSSSS", userName);

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

  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(null); // Error state for initial fetch

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

        const loadedProfileInfo = await loadProfile(userObject);

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
      <h1>{userProfile.userName}'s User Profile</h1>
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
              <Link
                to={`/social-circle-app/contacts/${followingName.following.userName}`}
              >
                {followingName.following.userName}
              </Link>
            </div>
          ))}
        </h4>
      </div>
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

export default ProfileByUserName;
