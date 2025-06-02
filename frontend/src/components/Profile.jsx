import { useState, useEffect } from "react";
import { loadProfile, decodeJWTPayload, editProfile } from "../ApiQueries.js";
import JWTStatus from "./JwtStatus";

function Profile() {
  // State for displaying the user's current profile
  const [userProfile, setUserProfile] = useState({
    id: null,
    email: "",
    bio: "",
  });

  // State for the form inputs for updating the profile
  const [formInput, setFormInput] = useState({
    bio: "", // Initialized with empty string
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

        const decodedID = decodeJWTPayload();
        if (!decodedID || !decodedID.id) {
          setError("Could not decode user ID from JWT. Please log in.");
          setLoading(false);
          return;
        }

        // Store the user ID for potential future use (e.g., in update calls)
        setUserProfile((prev) => ({ ...prev, id: decodedID.id }));

        const loadedProfileInfo = await loadProfile(decodedID.id);

        // Ensure loadedProfileInfo.response contains email and bio
        if (loadedProfileInfo && loadedProfileInfo.response) {
          setUserProfile((prev) => ({
            ...prev, // Keep existing ID
            email: loadedProfileInfo.response.email || "",
            bio: loadedProfileInfo.response.bio || "",
          }));
          // Set initial form input value to current bio
          setFormInput({ bio: loadedProfileInfo.response.bio || "" });
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
        contactID: userProfile.id,
        updatedBio: formInput.bio,
      };
      const response = await editProfile(formData);

      if (response && response.status === "User Profile Updated") {
        // Update the displayed profile immediately on success
        setUserProfile((prev) => ({ ...prev, bio: formInput.bio }));
        setUpdateSuccess(true);
      } else {
        // setUpdateError(response.message || "Failed to update profile.");
        console.log(" ")
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
      <p>E-Mail: {userProfile.email}</p>
      <p>Bio: {userProfile.bio || "No bio set."}</p>{" "}
      {/* Display bio, with fallback */}
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

        <button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Edit Profile"}
        </button>

        {updateSuccess && (
          <p style={{ color: "green" }}>Profile updated successfully!</p>
        )}
        {updateError && <p style={{ color: "red" }}>{updateError}</p>}
      </form>
    </div>
  );
}

export default Profile;
