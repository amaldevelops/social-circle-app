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
        "/social-circle-api/v1/login:POST End Point to login to Social Circle App",
        "/social-circle-api/v1/register: POST End Point to Register new user",
        "/social-circle-api/v1/authorized/:authenticated-user-name/:selected-user-name/profile/view:Authenticated End Point to GET any users profile",
        "/social-circle-api/v1/authorized/:authenticated-user-name/all-users : Authenticated End Point to GET all the users registered",
        "/social-circle-api/v1/authorized/:authenticated-user-name/all-users/:selected-user-name/followstatus : Authenticated End Point to follow request to selected user, this can be combined with GET all users endpoint to display and send requests",
        "/social-circle-api/v1/authorized/:authenticated-user-name/profile/edit : Authenticated End Point to update logged in users profile",
        "/social-circle-api/v1/authorized/:authenticated-user-name/all-users/:selected-user-name/home-feed : Authenticated End Point to get all recent posts of logged in user and followers",
        "/social-circle-api/v1/authorized/:authenticated-user-name/new-post : Authenticated End Point to create new posts",
        "/social-circle-api/v1/authorized/:authenticated-user-name/posts/:post-id/like : Authenticated End Point to like and unlike posts",
        "/social-circle-api/v1/authorized/:authenticated-user-name/posts/:post-id/comment : Authenticated End Point to comment on posts",
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

// Middleware to Register New user using received form data
// POST Method
// Require name, email, password, bio sent as JSON
// Request is sent as body=>raw=>JSON
// JSON Format: {    "fullName":"Maverick Cruise", "userName":"maverick",    "email":"maverick@example.com","password":"password","bio":"Top Gun Pilot"}
async function register(req, res, next) {
  try {
    const { fullName, userName, email, password, bio } = req.body;
    const response = await PrismaRegisterNewUser(
      fullName,
      userName,
      email,
      password,
      bio
    );
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
// Authenticated End Point to GET any users profile
//Requirement: A user’s profile page should contain their profile information, profile photo, and posts

async function getUserProfile(req, res, next) {
  try {
    // authenticatedUserName/:
    const selectedUserName = parseInt(req.params.selectedUserName);

    const getUserProfile = await PrismaGetUserProfile(selectedUserName);

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
