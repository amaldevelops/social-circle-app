import { useState, useEffect } from "react";

import { newCommentApiQuery, likeStatusApiQuery } from "../ApiQueries";
import JWTStatus from "./JwtStatus.jsx";

//postDetailsObject={authenticatedUserName,postId}

function Post(postDetailsObject) {
  const [formData, SetFormData] = useState({
    authenticatedUserName: "",
    postId: "",
    commentContent: "",
  });

  useEffect(() => {
    const submitNewComment = async () => {
      try {
        const apiQueryResult = await newCommentApiQuery(formData);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  return (
    <div>
      <h1>Individual Post View</h1>
    </div>
  );
}

export default Post;
