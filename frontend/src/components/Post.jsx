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

  const testFormData = {
    authenticatedUserName: "carlobosco6",
    postId: "1",
    commentContent: "08052025 Awesome",
  };

  const submitNewComment = async () => {
    try {
      const apiQueryResult = await newCommentApiQuery(testFormData);
      console.log(apiQueryResult);
    } catch (error) {
      console.error(error);
    }
  };

  // submitNewComment();

  useEffect(() => {
    const fetchPost = async () => {
      try {
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
