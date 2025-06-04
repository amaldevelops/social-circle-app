import { Router } from "express";

import {
  apiStatus,
  login,
  register,
  getAllUsers,
  getUserProfile,
  followOrUnfollowUser,
  updateLoggedUserProfile,
  homeFeed,
  createNewPost,
  likePosts,
  commentOnPosts,
} from "../controllers/mainController.js";

import { authenticateJWT } from "../middleware/Authenticator.js";

const mainRouter = Router();

mainRouter.get("/social-circle-api/v1/status", apiStatus); // End Point to show the running status of backend systems

mainRouter.post("/social-circle-api/v1/login", login); // POST End Point to login to Social Circle App
//Requirement: Users must sign in to see anything except the sign-in page

mainRouter.post("/social-circle-api/v1/register", register); // POST End Point to Register new user
// Requirement: Ability to register new users

mainRouter.get(
  "/social-circle-api/v1/authorized/:authenticated-user-name/:selected-user-name/profile/view",
  authenticateJWT,
  getUserProfile
); // Authenticated End Point to GET any users profile
//Requirement: A user’s profile page should contain their profile information, profile photo, and posts

mainRouter.get(
  "/social-circle-api/v1/authorized/:authenticated-user-name/all-users",
  authenticateJWT,
  getAllUsers
); // Authenticated End Point to GET all the users registered
//Requirement: There should be an index page for users, which shows all users and buttons for sending follow requests to users the user is not already following or have a pending request.

mainRouter.put(
  "/social-circle-api/v1/authorized/:authenticated-user-name/all-users/:selected-user-name/followstatus",
  authenticateJWT,
  followOrUnfollowUser
); // Authenticated End Point to follow request to selected user, this can be combined with GET all users endpoint to display and send requests
//Requirement: Users can send follow requests to other users.

mainRouter.put(
  "/social-circle-api/v1/authorized/:authenticated-user-name/profile/edit",
  authenticateJWT,
  updateLoggedUserProfile
); // Authenticated End Point to update logged in users profile
//Requirement: Users can create a profile with a profile picture.

mainRouter.get(
  "/social-circle-api/v1/authorized/:authenticated-user-name/all-users/:selected-user-name/home-feed",
  authenticateJWT,
  homeFeed
); // Authenticated End Point to get all recent posts of logged in user and followers
//Requirement: There should be an index page for posts, which shows all the recent posts from the current user and users they are following.

mainRouter.post(
  "/social-circle-api/v1/authorized/:authenticated-user-name/new-post",
  authenticateJWT,
  createNewPost
); // Authenticated End Point to create new posts
//Requirement: Users can create posts

mainRouter.get(
  "/social-circle-api/v1/authorized/:authenticated-user-name/posts/:post-id/like",
  authenticateJWT,
  likePosts
); // Authenticated End Point to like and unlike posts
//Requirement: Users can like and unlike posts

mainRouter.get(
  "/social-circle-api/v1/authorized/:authenticated-user-name/posts/:post-id/comment",
  authenticateJWT,
  commentOnPosts
); // Authenticated End Point to comment on posts
//Requirement: Users can comment on posts

export default mainRouter;
