import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import JWTStatus from "./JwtStatus";
import { allUsers, followRequest, decodeJWTPayload } from "../ApiQueries.js";

function Contacts() {
  const [allUsersState, setAllUsersState] = useState([]);
  const [loggedUser, setLoggedUser] = useState("carlobosco6");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const decodedJwt = decodeJWTPayload();
        if (!decodedJwt || !decodedJwt.id) {
          // setError("Could not decode user ID from JWT. Please log in.");
          // setLoading(false);

          return;
        }

        setLoggedUser(decodedJwt.userName);

        console.log("DECODER", decodedJwt.userName);

        setLoading(true);
        const loadedUsersInfo = await allUsers();

        if (
          loadedUsersInfo &&
          loadedUsersInfo.response &&
          Array.isArray(loadedUsersInfo.response)
        ) {
          setAllUsersState(loadedUsersInfo.response);
          if (loadedUsersInfo.status) {
            setStatusMessage(loadedUsersInfo.status);
          }
        } else if (Array.isArray(loadedUsersInfo)) {
          setAllUsersState(loadedUsersInfo);
          setStatusMessage("Contacts loaded");
        } else {
          console.error(
            "API response is not in the expected format:",
            loadedUsersInfo
          );
          setError("Failed to load contacts: Unexpected data format.");
        }
      } catch (err) {
        console.error("Failed to load Contacts:", err);
        setError(`Failed to load Contacts data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  if (loading) {
    return <div>Loading Users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleFollowClick = async (user) => {
    const responseFollowRequest = await followRequest(user, loggedUser);
    console.log("responseFollowRequest", responseFollowRequest);
    console.log("Logged user is:", loggedUser);
  };

  return (
    <div>
      <JWTStatus />
      {statusMessage && <h1>{statusMessage}</h1>}
      {!statusMessage && <h1>Contacts</h1>}

      <div>
        {allUsersState.length > 0 ? (
          <ul>
            {allUsersState.map((user) => (
              <li key={user.id}>
                <p className="p-format">
                  <strong>ID : </strong> {user.id}
                </p>
                <p className="p-format">
                  <strong>Name : </strong>
                  {user.fullName}
                </p>

                <p className="p-format">
                  <strong>User Name:</strong> {user.userName}
                </p>
                <p className="p-format">
                  <strong>Bio:</strong> {user.bio}
                </p>
                <button onClick={() => handleFollowClick(user)}>Follow</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No contacts found.</p>
        )}
      </div>
    </div>
  );
}

export default Contacts;
