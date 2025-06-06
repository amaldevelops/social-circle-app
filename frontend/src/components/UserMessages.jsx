import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import JWTStatus from "./JwtStatus";
import { socialFeedQuery, decodeJWTPayload } from "../ApiQueries.js";

import ContactList from "./ContactList";
import ConversationView from "./ConversationView";

function UserMessages() {
  const location = useLocation(); // Initialize useLocation
  const navigate = useNavigate(); // Initialize useNavigate for the back button

  const [userID, setUserID] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: Check for state from navigation on mount ---
  useEffect(() => {
    if (location.state && location.state.selectedContact) {
      setSelectedContact(location.state.selectedContact);
      setStatusMessage(
        `Viewing conversation with ${location.state.selectedContact.name}`
      );
      // Clear the state from location to prevent unwanted re-triggers if navigating back and forth
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]); // Depend on location and navigate

  useEffect(() => {
    const fetchUserDataAndAllMessages = async () => {
      setLoading(true);
      setError(null);

      const decodedID = decodeJWTPayload();
      if (!decodedID || !decodedID.id) {
        setError("Could not decode user ID from JWT. Please log in.");
        setLoading(false);
        return;
      }
      setUserID(decodedID.id);

      try {
        console.log("Fetching all messages for User ID:", decodedID.id);
        const apiResponse = await socialFeedQuery(decodedID.id);

        let messagesToSet = [];
        let newStatusMessage = "Messages loaded.";

        // --- Handle the problematic double-nested 'response' ---
        if (
          apiResponse &&
          apiResponse.response &&
          apiResponse.response.response &&
          Array.isArray(apiResponse.response.response)
        ) {
          messagesToSet = apiResponse.response.response;
          newStatusMessage =
            apiResponse.response.status ||
            "Messages fetched successfully (double nested)";
          console.warn(
            "Detected double-nested API response. Consider fixing backend for cleaner structure."
          );
        }
        // --- End of double-nested handling ---
        else if (
          apiResponse &&
          apiResponse.response &&
          Array.isArray(apiResponse.response)
        ) {
          messagesToSet = apiResponse.response;
          newStatusMessage =
            apiResponse.status || "Messages fetched successfully.";
        } else if (Array.isArray(apiResponse)) {
          messagesToSet = apiResponse;
          newStatusMessage = "Messages loaded directly as array.";
        } else {
          console.error(
            "API response is not in any expected format:",
            apiResponse
          );
          setError("Failed to load messages: Unexpected data format from API.");
          setAllMessages([]);
          setLoading(false);
          return;
        }

        setAllMessages(messagesToSet);
        setStatusMessage(newStatusMessage);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setError(`Failed to load messages: ${err.message}`);
        setAllMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndAllMessages();
  }, []);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setStatusMessage(`Viewing conversation with ${contact.name}`);
  };

  // --- Adjusted handleBackToContacts ---
  const handleBackToContacts = () => {
    setSelectedContact(null);
    setStatusMessage("Select a contact to view messages.");
  };
  // --- End of adjusted function ---

  const handleNewMessageAdded = (newMessage) => {
    console.log("New message received from API:", newMessage);
    if (newMessage && newMessage.id) {
      setAllMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    } else {
      console.warn("Received invalid new message object:", newMessage);
    }
  };

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-chat-container">
      <JWTStatus />
      {selectedContact ? <></> : <h1>{statusMessage || "My Messages"}</h1>}

      {selectedContact ? (
        <ConversationView
          userID={userID}
          selectedContact={selectedContact}
          allMessages={allMessages}
          onBack={handleBackToContacts}
          onSendMessageSuccess={handleNewMessageAdded}
        />
      ) : (
        <ContactList
          userID={userID}
          allMessages={allMessages}
          onSelectContact={handleSelectContact}
        />
      )}
    </div>
  );
}

export default UserMessages;
