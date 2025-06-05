import { decodeJWTPayload } from "../ApiQueries.js";
import { useState, useEffect } from "react"; // Import useEffect

function JWTStatus() {
  const [JWT, setJWT] = useState({
    id: "  N/A", // Use "N/A" or null as initial values for better display
    status: "  Not Authenticated",
    contactName: "   N/A",
    userName: "N/A",
    email: "   N/A",
    bio: "   N/A",
  });

  // Use useEffect to run decodeJWTPayload and setJWT only once after initial render
  useEffect(() => {
    try {
      const JWTDecoded = decodeJWTPayload();

      // Ensure JWTDecoded and its properties exist before setting state
      if (JWTDecoded) {
        setJWT({
          id: JWTDecoded.id || "N/A", // Use || "N/A" for fallback if property is missing
          status: JWTDecoded.status || "Authenticated", // Assuming 'status' comes from payload
          userName: JWTDecoded.userName || "N/A",
          contactName: JWTDecoded.contactName || "N/A",
          email: JWTDecoded.email || "N/A",
          bio: JWTDecoded.bio || "N/A",
        });
      } else {
        // Handle case where decodeJWTPayload returns null or undefined
        console.warn("JWTDecoded is null or undefined. JWT state not updated.");
        setJWT((prevState) => ({
          // Reset or set default unauthenticated state
          ...prevState,
          status: "Not Authenticated",
        }));
      }
    } catch (error) {
      console.error("Error decoding JWT payload:", error);
      setJWT((prevState) => ({
        // Handle errors, e.g., token not found or invalid
        ...prevState,
        status: "Error decoding token",
      }));
    }
  }, []); // The empty dependency array [] ensures this effect runs only once after the initial render

  return (
    <div className="JWTDiv">
      <h4>JWT Status</h4>
      <p>Authentication Status : {JWT.status}</p>
      <p>Contact ID : {JWT.id}</p>
      <p>User Name : {JWT.userName}</p>
      <p>Full Name : {JWT.contactName}</p>

      <p>E-Mail : {JWT.email}</p>
      <p>Bio : {JWT.bio}</p>
    </div>
  );
}

export default JWTStatus;
