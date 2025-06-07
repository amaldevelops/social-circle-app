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
  PrismaGetPostByID,
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

//Requirement: A user’s profile page should contain their profile information, profile photo, and posts
// Authenticated End Point to GET any users profile
// POST Method
// Require selectedUserName to be sent as JSON
// Request is sent as body=>raw=>JSON
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// JSON Format: {"selectedUserName":"Send the required profiles username"}

async function getUserProfile(req, res, next) {
  try {
    // authenticatedUserName/:
    const selectedUserName = req.params.selectedUserName;

    const getUserProfile = await PrismaGetUserProfile(selectedUserName);

    res.json({
      status: `Load ${selectedUserName} profile`,
      response: getUserProfile,
    });
  } catch (error) {
    console.error(error);
    res.json({ error: `Error Loading: ${selectedUserName} profile` });
  }
}

// This function will update the user profile based on contactID
// PUT Method
// Require authenticatedUserName, updatedBio,profilePicUrl
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// Message is sent as body=>raw=>JSON,
// JSON Format expected: {"authenticatedUserName":"maverick", "updatedBio":"Top Gun 2 Actor","profilePicUrl":"/"}
async function updateLoggedUserProfile(req, res, next) {
  try {
    const { authenticatedUserName, updatedBio, profilePicUrl } = req.body;
    const updateProfile = await PrismaUpdateLoggedUserProfile(
      authenticatedUserName,
      updatedBio,
      profilePicUrl
    );
    res.json({ response: updateProfile });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

// GET Method
// Require: N/a
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// Message is sent as body=>raw=>JSON,
// JSON Format expected: N/a

async function getAllUsers(req, res, next) {
  try {
    const allContactsReceived = await prismaGetAllUsers();
    console.log(allContactsReceived);
    res.json({
      status: "Get all registered users",
      response: allContactsReceived,
    });
  } catch (error) {
    console.error(error);
  }
}

// PUT Method
// Require authenticatedUserName, selectedUserName
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// Message is sent as body=>raw=>JSON,
// JSON Format expected: {"authenticatedUserName":"maverick", "selectedUserName":"jettrodriguez9"}
async function followOrUnfollowUser(req, res, next) {
  try {
    // const authenticatedUserName = req.params.authenticatedUserName;
    // const selectedUserName = req.params.selectedUserName;

    const { authenticatedUserName, selectedUserName } = req.body;

    const response = await PrismaFollowOrUnfollowUser(
      authenticatedUserName,
      selectedUserName
    );
    res.json({
      response: response,
    });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error changing follow status" });
  }
}

//Requirement: There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
// GET Method
// Require:authenticatedUserName,
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// Message is sent as body=>raw=>JSON,
// JSON Format expected: N/a
// URL Parameters:const authenticatedUserName = req.params.authenticatedUserName;const selectedUserName = req.params.selectedUserName;

async function homeFeed(req, res, next) {
  try {
    const authenticatedUserName = req.params.authenticatedUserName;

    const selectedUserName = req.params.selectedUserName;

    const userHomeFeed = await PrismaHomeFeed(selectedUserName);
    res.json({ response: userHomeFeed });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Loading Home Feed" });
  }
}

//Requirement: Users can create posts
// Authenticated End Point to GET any users profile
// POST Method
// Require authenticatedUserName to be sent as JSON
// Request is sent as body=>raw=>JSON
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// JSON Format: {"authenticatedUserName":"maverick", "post":"My First post"}
async function createNewPost(req, res, next) {
  try {
    const { authenticatedUserName, post } = req.body;
    const newPost = await PrismaCreateNewPost(authenticatedUserName, post);
    res.json({ response: newPost });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Creating post" });
  }
}

//Requirement: Users can like and unlike posts
// PUT Method
// Require authenticatedUserName and postId to be sent as JSON
// Request is sent as body=>raw=>JSON
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// JSON Format: {"authenticatedUserName":"maverick","postId":"1"}

async function likePosts(req, res, next) {
  try {
    const { authenticatedUserName, postId } = req.body;
    const likeUnlikePosts = await PrismaLikePosts(
      authenticatedUserName,
      parseInt(postId)
    );
    res.json({ response: likeUnlikePosts });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Updating profile" });
  }
}

//Requirement: Users can comment on posts
// POST Method
// Require authenticatedUserName and postId, comment to be sent as JSON
// Request is sent as body=>raw=>JSON
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// JSON Format: {"authenticatedUserName":"maverick","postId":"1","commentContent":"Awesome post matey !"}

async function commentOnPosts(req, res, next) {
  try {
    const { authenticatedUserName, postId, commentContent } = req.body;
    const newComment = await PrismaCommentOnPosts(
      authenticatedUserName,
      parseInt(postId),
      commentContent
    );
    res.json({ response: newComment });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Creating comment" });
  }
}

//Requirement: There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
// GET Method
// Require:authenticatedUserName,
// Authentication Headers need to sent as a Bearer Token: { Authorization: `Bearer ${jwtToken}`}
// Message is sent as body=>raw=>JSON,
// JSON Format expected: N/a
// URL Parameters:const authenticatedUserName = req.params.authenticatedUserName;const selectedUserName = req.params.selectedUserName;

async function postByIDController(req, res, next) {
  try {
    const authenticatedUserName = req.params.authenticatedUserName;

    const formData = { postId: parseInt(req.params.postId) };

    const prismaResponse = await PrismaGetPostByID(formData);
    res.json({ response: prismaResponse });
  } catch (error) {
    console.error(error);
    res.json({ error: "Error Loading post by Id" });
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
  postByIDController,
};
