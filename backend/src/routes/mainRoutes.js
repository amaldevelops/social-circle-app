import { Router } from "express";

import {
  apiStatus,
  login,
  register,
  getAllContacts,
  getContactMessages,
  sendMessageToContact,
  loadUserProfile,
  updateLoggedUserProfile,
} from "../controllers/mainController.js";

import { authenticateJWT } from "../middleware/Authenticator.js";

const mainRouter = Router();

mainRouter.get("/social-circle-api/v1/status", apiStatus); // End Point to show the running status of backend systems

mainRouter.post("/social-circle-api/v1/profile/login", login); // POST End Point to login to Social Circle App
//Requirement: Users must sign in to see anything except the sign-in page

mainRouter.post("/social-circle-api/v1/profile/register", register); // POST End Point to Register new user

mainRouter.get(
  "/social-circle-api/v1/profile/:loggedInUserID/messages",
  authenticateJWT,
  getContactMessages
); // Authenticated End Point to GET users profile
//Requirement: A user’s profile page should contain their profile information, profile photo, and posts

mainRouter.get(
  "/social-circle-api/v1/profile",
  authenticateJWT,
  getAllContacts
); // Authenticated End Point to GET all the
//Requirement: There should be an index page for users, which shows all users and buttons for sending follow requests to users the user is not already following or have a pending request.

mainRouter.post(
  "/social-circle-api/v1/profile/:loggedInUserID/message/:contactID",
  authenticateJWT,
  sendMessageToContact
); // Authenticated End Point to send message to selected contact

mainRouter.get(
  "/social-circle-api/v1/profile/:contactID/profile",
  authenticateJWT,
  loadUserProfile
); // Authenticated End Point to get logged in users profile

mainRouter.put(
  "/social-circle-api/v1/profile/:contactID/profile",
  authenticateJWT,
  updateLoggedUserProfile
); // Authenticated End Point to update logged in users profile
//Requirement: Users can create a profile with a profile picture.


//Requirement: Users can send follow requests to other users.
//Requirement: Users can create posts (begin with text only)
//Requirement: Users can like posts
//Requirement: Users can comment on posts
//Requirement: Posts should always display the post content, author, comments, and likes
//Requirement: There should be an index page for posts, which shows all the recent posts from the current user and users they are following.

export default mainRouter;
