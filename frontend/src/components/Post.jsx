import { useState, useEffect } from "react";
import {
  newCommentApiQuery,
  likeStatusApiQuery,
  loadPostByIdApiQuery,
} from "../ApiQueries";
import JWTStatus from "./JwtStatus.jsx";

function Post(postDetailsObject) {
  const [formData, SetFormData] = useState({
    authenticatedUserName: "bobbiebarton",
    postId: "1",
    commentContent: "",
  });

  const [fetchedPost, setFetchedPost] = useState(null);

  const testFormData = {
    authenticatedUserName: "bobbiebarton",
    postId: "3",
    commentContent: "Awesome Comment",
  };

  const likeUnlike=async(event)=>{
    event.preventDefault();

    try{

        const sendLikeStatusToApi=await likeStatusApiQuery(formData);
        console.log("sendLikeStatusToApi",sendLikeStatusToApi)
    }

    catch(error)
    {
        console.error(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const apiQueryResult = await newCommentApiQuery(formData);
    } catch (err) {
      console.error("Error creating new comment", err);
    }
  };

  const handleChange = (e) => {
    SetFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const loadPostFromApi = await loadPostByIdApiQuery(formData);
        console.log("loadPostFromApi Output", loadPostFromApi);

        if (loadPostFromApi && loadPostFromApi.response) {
          setFetchedPost(loadPostFromApi.response); // Set fetchedPost to the actual post object
        } else {
          console.warn("API returned no data or unexpected format for post.");
          setFetchedPost(null); // Set to null if no post data
        }
      } catch (error) {
        console.error(error);
        setFetchedPost(null); // Reset to null on error
      }
    };
    fetchPost();
  }, []); // Empty dependency array means this runs once on mount

  //   console.log("fetchedPost", fetchedPost);

  return (
    <div>
      <h1>Individual Post View</h1>
      <div>
        <h2>Post</h2>

        {/* Check if fetchedPost exists before trying to render */}
        {fetchedPost ? (
          <div key={fetchedPost.id} className="posts">
            {/* Display Author Profile Picture */}
            {fetchedPost.author?.profilePicUrl && (
              <img
                src={fetchedPost.author.profilePicUrl}
                alt={`${fetchedPost.author.userName}'s profile`}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            )}
            {/* Display Author Name and Username */}
            <p>
              <strong>{fetchedPost.author.fullName || "Unknown User"}</strong>{" "}
              (@{fetchedPost.author.userName || "unknown"})
            </p>
            {/* Display Post Content */}
            <p className="post-content">{fetchedPost.content}</p>
            {/* Display Creation Date */}
            <p className="post-meta">
              Posted on: {new Date(fetchedPost.createdAt).toLocaleString()}
            </p>
            {/* Display Likes and Comments Count */}
            <p className="post-stats">
              Likes: {fetchedPost.likes?.length || 0} | Comments:{" "}
              {fetchedPost.comments?.length || 0}
            </p>
            <div>
                <form onSubmit={likeUnlike}>
                    <button>Like / Unlike</button>
                </form>
            </div>

            {/* Display Comments Section (if there are comments) */}
            {fetchedPost.comments && fetchedPost.comments.length > 0 && (
              <div className="comments-section">
                <h4>Comments:</h4>
                <ul>
                  {/* Map over the comments array within the post object */}
                  {fetchedPost.comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <strong>
                        User ID : {comment.userId || "Unknown"} :{" "}
                      </strong>{" "}
                      {comment.content}
                      <br />
                      <small>
                        Commented on:{" "}
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
                <div>
                  <h2>New Comment</h2>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Display message if no post data or loading
          <p>Loading post data or no post found for this ID.</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <p>
          <strong>Your ID:</strong> {formData.authenticatedUserName}
        </p>

        <label htmlFor="commentContent">New Comment</label>
        <br />
        <textarea
          name="commentContent"
          id="commentContent"
          value={formData.commentContent} // Controlled component: value tied to state
          onChange={handleChange} // Update state on change
          rows="5" // Add rows for better textarea appearance
          cols="30"
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Post;
