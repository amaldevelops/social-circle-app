import {
  prismaGetAllUsers,
  PrismaFollowOrUnfollowUser,
  PrismaAuthenticateUser,
  PrismaRegisterNewUser,
  PrismaGetUserProfile,
  PrismaUpdateLoggedUserProfile,
  PrismaHomeFeed,
  PrismaCommentOnPosts,
  PrismaLikePosts,
  PrismaCreateNewPost,
} from "../prisma/PrismaQueries.js";

import { createJWT, authenticateJWT } from "../middleware/Authenticator.js";

//TO BE MODIFIED
async function apiStatus(req, res, next) {
  try {
    res.json({
      status: "Backend Systems running ok",
      response: [
        "/social-circle-api/v1/status : GET End Point to show the running status of API",
      ],
    });
  } catch (error) {
    console.error(error);
  }
}

// Middleware to Authenticate login existing user using sent form data
// POST Method
// Require email, password sent as JSON
// Request from Front End is sent as body=>raw=>JSON {"email":"justus.armstrong@example.com", "password":"Pass1234"}
// JSON Format: {"email":"","password":""}
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const response = await PrismaAuthenticateUser(email, password);
    if (response.status === "Authentication Success!") {
      const createdJWT = await createJWT(response);
      res.json({
        jwt: createdJWT.token,
      });
    } else {
      res.json({
        jwt: "Authentication Failure!",
      });
    }

  } catch (error) {
    console.error(error);
    res.json({
      response: response,
    });
  }
}

//TO BE MODIFIED

// Middleware to Register New user using received form data
// POST Method
// Require name, email, password, bio sent as JSON
// Request is sent as body=>raw=>JSON
// JSON Format: {"name":"","email":"","password":"","bio":""}
async function register(req, res, next) {
  try {
    const { fullName,userName, email, password, bio } = req.body;
    const response = await PrismaRegisterNewUser(fullName,userName, email, password, bio);
    res.json({
      response: response,
    });
  } catch (error) {
    console.error(error);
    res.json({
      response: response,
    });
  }
}

//TO BE MODIFIED
async function getAllUsers(req, res, next) {
  try {
    const allContactsReceived = await prismaGetAllUsers();
    console.log(allContactsReceived);
    res.json({ status: "Get all contacts", response: allContactsReceived });
  } catch (error) {
    console.error(error);
  }
}

// async function getUserProfile(req, res, next) {
//   try {
//     const contactID = parseInt(req.params.loggedInUserID);
//     console.log(contactID);
//     const getUserMessages = await contactMessages(contactID);
//     console.log(getUserMessages);
//     res.json({
//       status: "Get logged in users messages",
//       response: getUserMessages,
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({ error: "Error Fetching messages" });
//   }
// }
// Function to send messages to a contact
// POST Method
// Require loggedInUserID, contactID, message
// Message is sent as body=>raw=>JSON
// JSON Format: {"loggedInUserID":"","contactID":"", "message":""}

//TO BE MODIFIED
async function followOrUnfollowUser(req, res, next) {
  try {
    const senderID = parseInt(req.params.loggedInUserID);
    const receiverID = parseInt(req.params.contactID);

    console.log();

    // const { message, loggedInUserID, contactID } = req.body;

    const { message } = req.body;

    const response = await PrismaFollowOrUnfollowUser(
      senderID,
      receiverID,
      message
    );
    res.json({
      response: response,
    });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Sending messages" });
  }
}

//TO BE MODIFIED

async function getUserProfile(req, res, next) {
  try {
    const userProfileID = parseInt(req.params.contactID);
    const getUserProfile = await PrismaGetUserProfile(userProfileID);

    res.json({
      status: "Load logged in users profile",
      response: getUserProfile,
    });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Loading profile" });
  }
}

//TO BE MODIFIED

// This function will update the user profile based on contactID
// PUT Method
// Require contactID, updatedBio
// Message is sent as body=>raw=>JSON,
// JSON Format expected: {"contactID":"", "updatedBio":""}
async function updateLoggedUserProfile(req, res, next) {
  try {
    const { contactID, updatedBio } = req.body;
    const updateProfile = await PrismaUpdateLoggedUserProfile(
      parseInt(contactID),
      updatedBio
    );
    res.json({ response: updateProfile });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

//TO BE MODIFIED
async function homeFeed(req, res, next) {
  try {
    const { contactID, updatedBio } = req.body;
    const updateProfile = await PrismaHomeFeed(parseInt(contactID), updatedBio);
    res.json({ response: updateProfile });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

//TO BE MODIFIED
async function createNewPost(req, res, next) {
  try {
    const { contactID, updatedBio } = req.body;
    const updateProfile = await PrismaCreateNewPost(
      parseInt(contactID),
      updatedBio
    );
    res.json({ response: updateProfile });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

//TO BE MODIFIED
async function likePosts(req, res, next) {
  try {
    const { contactID, updatedBio } = req.body;
    const updateProfile = await PrismaLikePosts(
      parseInt(contactID),
      updatedBio
    );
    res.json({ response: updateProfile });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

//TO BE MODIFIED
async function commentOnPosts(req, res, next) {
  try {
    const { contactID, updatedBio } = req.body;
    const updateProfile = await PrismaCommentOnPosts(
      parseInt(contactID),
      updatedBio
    );
    res.json({ response: updateProfile });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

export {
  apiStatus,
  login,
  register,
  getAllUsers,
  followOrUnfollowUser,
  getUserProfile,
  updateLoggedUserProfile,
  homeFeed,
  createNewPost,
  likePosts,
  commentOnPosts,
};
