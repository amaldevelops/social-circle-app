import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import JWTStatus from "./JwtStatus";
import { allContacts } from "../ApiQueries.js";

function Contacts() {
  const [allContactsState, setAllContactsState] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        setLoading(true);
        const loadedContactInfo = await allContacts();

        if (
          loadedContactInfo &&
          loadedContactInfo.response &&
          Array.isArray(loadedContactInfo.response)
        ) {
          setAllContactsState(loadedContactInfo.response);
          if (loadedContactInfo.status) {
            setStatusMessage(loadedContactInfo.status);
          }
        } else if (Array.isArray(loadedContactInfo)) {
          setAllContactsState(loadedContactInfo);
          setStatusMessage("Contacts loaded");
        } else {
          console.error(
            "API response is not in the expected format:",
            loadedContactInfo
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

    fetchContactsData();
  }, []);

  if (loading) {
    return <div>Loading Contacts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleMessageClick = (contact) => {
    navigate("/messaging-app/messages", {
      state: { selectedContact: contact },
    });
  };

  return (
    <div>
      <JWTStatus />
      {statusMessage && <h1>{statusMessage}</h1>}
      {!statusMessage && <h1>Contacts</h1>}

      <div>
        {allContactsState.length > 0 ? (
          <ul>
            {allContactsState.map((contact) => (
              <li key={contact.id}>
                <p className="p-format">
                  <strong>ID : </strong> {contact.id}
                </p>
                <p className="p-format">
                  <strong>Name : </strong>
                  {contact.name}
                </p>

                <p className="p-format">
                  <strong>Email:</strong> {contact.email}
                </p>
                <p className="p-format">
                  <strong>Bio:</strong> {contact.bio}
                </p>
                <button onClick={() => handleMessageClick(contact)}>
                  Message
                </button>
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
