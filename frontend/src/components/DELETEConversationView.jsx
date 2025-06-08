import React, { useEffect, useState, useRef } from "react";

import { followRequest } from "../ApiQueries.js"; // Assuming this is your API call

// Helper constant for grouping time threshold
const MESSAGE_GROUP_TIME_THRESHOLD_MINUTES = 5;

function ConversationView({ userID, selectedContact, allMessages, onBack, onSendMessageSuccess }) { // <-- Added onSendMessageSuccess prop
  const [conversationMessages, setConversationMessages] = useState([]);
  const [currentMessageText, setCurrentMessageText] = useState(""); // <-- New state for input text
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  useEffect(() => {
    if (!selectedContact || !allMessages || allMessages.length === 0) {
      setConversationMessages([]);
      return;
    }

    // Filter messages relevant to the current conversation
    const filtered = allMessages.filter(
      (msg) =>
        (msg.contactIdSender === userID &&
          msg.contactIdReceiver === selectedContact.id) ||
        (msg.contactIdSender === selectedContact.id &&
          msg.contactIdReceiver === userID)
    );

    // Sort filtered messages by time to ensure correct display order and grouping logic
        const sortedFilteredMessages = filtered.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    setConversationMessages(sortedFilteredMessages);

    // Scroll to the bottom of the message list whenever conversation messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userID, selectedContact, allMessages]); // Re-run if any of these props change

  // Function to determine if a message should start a new group/show sender info
  const shouldShowSenderInfo = (currentMessage, previousMessage) => {
    // If it's the very first message in the conversation, always show sender info
    if (!previousMessage) {
      return true;
    }

    // Start a new group if the sender of the current message is different from the previous one
    if (currentMessage.contactIdSender !== previousMessage.contactIdSender) {
      return true;
    }

    // Start a new group if there's a significant time gap (e.g., 5 minutes) between messages
    const currentTime = new Date(currentMessage.time);
    const prevTime = new Date(previousMessage.time);
    const timeDifferenceMs = currentTime.getTime() - prevTime.getTime();
    const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);

    if (timeDifferenceMinutes > MESSAGE_GROUP_TIME_THRESHOLD_MINUTES) {
      return true;
    }

    return false;
  };

  // Function to determine if a message should show a date separator
  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    // Always show a date separator for the very first message in the conversation
    if (!previousMessage) {
      return true;
    }

    const currentDate = new Date(currentMessage.time);
    const prevDate = new Date(previousMessage.time);

    // Normalize dates to the start of the day for accurate comparison
    currentDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);

    // Show a separator if the date changes
    return currentDate.getTime() !== prevDate.getTime();
  };


  const handleSendMessage = async () => {
    if (!currentMessageText.trim()) { // Don't send empty messages
      return;
    }

    try {
      // Call the API function
      // Assuming sendMessage returns the new message object from the backend
      const newMessageResponse = await followRequest(
        userID,
        selectedContact.id, // <-- Correctly passing the ID
        currentMessageText
      );

      console.log(currentMessageText)

      // IMPORTANT: After sending, you need to update the `allMessages` state
      // in the parent `UserMessages` component so that this ConversationView
      // re-renders with the new message and the ContactList also gets updated.
      // We pass a callback prop `onSendMessageSuccess` for this.
      if (onSendMessageSuccess && newMessageResponse) {
          // Assuming newMessageResponse.response is the actual new message object
          // or newMessageResponse itself is the message object if your API is clean.
          // Adjust based on what your `sendMessage` function actually returns.
          onSendMessageSuccess(newMessageResponse.response || newMessageResponse);
      }

      setCurrentMessageText(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
      // You might want to show an error message to the user here
    }
  };


  // Safety check, though the parent should ensure selectedContact is not null when rendering this
  if (!selectedContact) {
    return (
      <div className="conversation-view-container">
        Please select a contact to view their messages.
      </div>
    );
  }

  return (
    <div className="conversation-view-container">
      {/* Chat Header with Back Button and Contact Name */}
      <div className="chat-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>{selectedContact.name}</h2>
      </div>

      {/* Message List Area */}
      <div className="message-list">
        <ul>
          {conversationMessages.length > 0 ? (
            conversationMessages.map((message, index) => {
              const previousMessage = conversationMessages[index - 1];
              const showDate = shouldShowDateSeparator(
                message,
                previousMessage
              );
              const isMyMessage = message.contactIdSender === userID;
              const showSender = shouldShowSenderInfo(message, previousMessage);

              // Format date and time using native Date methods for local display
              const messageDate = new Date(message.time);
              const formattedDate = messageDate.toLocaleDateString("en-AU", {
                // Australian locale for date
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const formattedTime = messageDate.toLocaleTimeString("en-AU", {
                // Australian locale for time
                hour: "numeric",
                minute: "2-digit",
                hour12: true, // Use 12-hour format with AM/PM
              });

              return (
                <li
                  key={message.id}
                  className={`message-item ${
                    isMyMessage ? "my-message" : "other-message"
                  }`}
                >
                  {/* Date Separator */}
                  {showDate && (
                    <div className="date-separator">
                      <span>{formattedDate}</span>
                    </div>
                  )}

                  {/* Sender Info (only for 'other' messages or when sender changes) */}
                  {!isMyMessage && showSender && (
                    <div className="sender-info">
                      <strong>{message.senderName}</strong>
                    </div>
                  )}

                  {/* The Message Bubble */}
                  <div className="message-bubble">
                    <p className="message-text">{message.message}</p>
                    <span className="message-time">{formattedTime}</span>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="no-messages-text">
              Start a conversation with {selectedContact.name}.
            </p>
          )}
          <div ref={messagesEndRef} />{" "}
          {/* Used for auto-scrolling to the bottom */}
        </ul>
      </div>

      {/* Message Input Area */}
      <div className="message-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessageText} // <-- Bind value to state
          onChange={(e) => setCurrentMessageText(e.target.value)} // <-- Update state on change
          onKeyPress={(e) => { // Optional: Send message on Enter key press
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>{" "}
        {/* <-- Call the new handler */}
      </div>
    </div>
  );
}

export default ConversationView;