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

mainRouter.post("/social-circle-api/v1/profile/register", register); // POST End Point to Register new user

mainRouter.get(
  "/social-circle-api/v1/profile",
  authenticateJWT,
  getAllContacts
); // Authenticated End Point to GET all the

mainRouter.get(
  "/social-circle-api/v1/profile/:loggedInUserID/messages",
  authenticateJWT,
  getContactMessages
); // Authenticated End Point to GET messages sent and received by the logged in user

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

//Users can send follow requests to other users.
//Users can create posts (begin with text only)
//Users can like posts
//Users can comment on posts
//Posts should always display the post content, author, comments, and likes
//There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
//Users can create a profile with a profile picture.
//A user’s profile page should contain their profile information, profile photo, and posts
//There should be an index page for users, which shows all users and buttons for sending follow requests to users the user is not already following or have a pending request.

export default mainRouter;
