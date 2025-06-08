import { useState, useEffect } from "react";

import {
  newCommentApiQuery,
  likeStatusApiQuery,
  loadPostByIdApiQuery,
} from "../ApiQueries";
import JWTStatus from "./JwtStatus.jsx";

//postDetailsObject={authenticatedUserName,postId}

function Post(postDetailsObject) {
  const [formData, SetFormData] = useState({
    authenticatedUserName: "",
    postId: "",
    commentContent: "",
  });

  const [fetchedPost, setFetchedPost] = useState({
    id: "",
    authorId: "",
    author: {
      id: "",
      userName: "",
      fullName: "",
      email: "",
      profilePicUrl: "",
      bio: "",
    },
    content: "",
    createdAt: "",
    likes: [
      {
        id: "",
        userId: "",
        postId: "",
        createdAt: "",
      },
    ],
    comments: [],
  });

  const testFormData = {
    authenticatedUserName: "bobbiebarton",
    postId: "3",
    commentContent: "Awesome Comment",
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
        const loadPostFromApi = await loadPostByIdApiQuery(testFormData);
        console.log("loadPostFromApi Output", loadPostFromApi);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, []);

  console.log(fetchedPost);
  return (
    <div>
      <h1>Individual Post View</h1>
    </div>
  );
}

export default Post;
