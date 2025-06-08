// src/components/ContactList.js
import React, { useEffect, useState } from "react";

function ContactList({ userID, allMessages, onSelectContact }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!allMessages || allMessages.length === 0) {
      setContacts([]);
      return;
    }

    const uniqueContactsMap = new Map(); // Use a Map to store unique contacts by their ID

    allMessages.forEach((msg) => {
      let otherContactId = null;
      let otherContactName = null;
      let otherContactEmail = null; // Assuming email might be useful for contact info

      // Determine the 'other' contact in the conversation
      if (msg.contactIdSender === userID) {
        // Message sent by current user, the other contact is the receiver
        otherContactId = msg.contactIdReceiver;
        otherContactName = msg.receiverName; // Use receiverName from the API response
        otherContactEmail = msg.receiverEmail;
      } else if (msg.contactIdReceiver === userID) {
        // Message received by current user, the other contact is the sender
        otherContactId = msg.contactIdSender;
        otherContactName = msg.senderName; // Use senderName from the API response
        otherContactEmail = msg.senderEmail;
      }

      // Ensure we don't add the current user to the contact list and the ID is valid
      if (otherContactId && otherContactId !== userID) {
        if (!uniqueContactsMap.has(otherContactId)) {
          // Add new unique contact
          uniqueContactsMap.set(otherContactId, {
            id: otherContactId,
            name: otherContactName,
            email: otherContactEmail, // Store email if available
            lastMessageTime: msg.time,
            lastMessageContent: msg.message, // Store last message for preview
          });
        } else {
          // Update last message if the current message is newer
          const existingContact = uniqueContactsMap.get(otherContactId);
          if (
            new Date(msg.time).getTime() >
            new Date(existingContact.lastMessageTime).getTime()
          ) {
            existingContact.lastMessageTime = msg.time;
            existingContact.lastMessageContent = msg.message;
          }
        }
      }
    });

    // Convert map values to array and sort by last message time (most recent conversations first)
    const sortedContacts = Array.from(uniqueContactsMap.values()).sort(
      (a, b) => {
        return (
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
        );
      }
    );

    setContacts(sortedContacts);
  }, [userID, allMessages]); // Re-run this effect if userID or allMessages change

  return (
    <div className="contact-list-container">
      <h2>Your Chats</h2>
      {contacts.length > 0 ? (
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="contact-list-item"
            >
              <div className="contact-info">
                <strong>{contact.name}</strong>
                {/* Display last message preview */}
                <span className="last-message-preview">
                  {contact.lastMessageContent}
                </span>
              </div>
              {/* Display last message time, formatted for local time */}
              <span className="last-message-time">
                {contact.lastMessageTime &&
                  new Date(contact.lastMessageTime).toLocaleTimeString(
                    "en-AU",
                    { hour: "numeric", minute: "2-digit", hour12: true }
                  )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No conversations found.</p>
      )}
    </div>
  );
}

export default ContactList;
