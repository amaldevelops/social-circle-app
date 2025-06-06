import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prismaQuery = new PrismaClient();

// Function to register a new user into the database
async function PrismaRegisterNewUser(fullName, userName, email, password, bio) {
  try {
    const createContact = await prismaQuery.user.create({
      data: {
        fullName: fullName,
        userName: userName,
        email: email,
        hashedPassword: await bcrypt.hash(password, 10),
        bio: bio,
      },
    });

    return "User Registered successfully !";
  } catch (error) {
    console.error(error);
    return "User Registration Error, Please try again !";
  }
}

// Function to authenticate contact based on supplied email, password and stored password on database
async function PrismaAuthenticateUser(email, password) {
  try {
    const authenticate = await prismaQuery.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(authenticate);
    const passwordMatch = await bcrypt.compare(
      password,
      authenticate.hashedPassword
    );
    console.log("Password Matching:", passwordMatch);

    if (passwordMatch) {
      console.log("Authentication Success !");
      return {
        status: "Authentication Success!",
        id: authenticate.id,
        userName: authenticate.userName,
        fullName: authenticate.fullName,
        email: authenticate.email,
        bio: authenticate.bio,
      };
    } else {
      console.log("Authentication Failure !");
      return { status: "Authentication Failure!" };
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to read profile based on selectedUserName supplied
async function PrismaGetUserProfile(selectedUserName) {
  try {
    const userProfile = await prismaQuery.user.findUnique({
      where: { userName: selectedUserName },
      select: {
        email: true,
        hashedPassword: false,
        bio: true,
        profilePicUrl: true,
        fullName: true,
        userName: true,
        posts: {
          select: {
            id: true,
            content: true,
          },
        }, // This will return an array of Post objects
        followers: {
          // If you want to see who is following this user
          select: {
            id: true, // The ID of the Follow record
            status: true, // The status of the follow relationship
            follower: {
              select: {
                id: true,
                userName: true,
                fullName: false,
                profilePicUrl: false,
              },
            },
          },
        },
        following: {
          // If you want to see who this user is following
          select: {
            id: true, // The ID of the Follow record
            status: true, // The status of the follow relationship
            following: {
              select: {
                id: true,
                userName: true, // Add userName for display
                fullName: false,
                profilePicUrl: false,
              },
            },
          },
        },
      },
    });

    console.log(JSON.stringify(userProfile, null, 2)); // Use JSON.stringify for better console output
    return userProfile;
  } catch (error) {
    console.error("Error in PrismaGetUserProfile:", error); // Add context to your error log
    return "Error Fetching Profile"; // Consider throwing the error or returning null/object for better error handling
  }
}

// Function to Update user Profile based on authenticatedUserName
async function PrismaUpdateLoggedUserProfile(
  authenticatedUserName,
  updatedBio,
  profilePicUrl
) {
  try {
    console.log(authenticatedUserName);
    const updateProfile = await prismaQuery.user.update({
      where: { userName: authenticatedUserName },
      data: {
        bio: updatedBio,
        profilePicUrl: profilePicUrl,
      },
    });
    return "User Profile Updated!";
  } catch (error) {
    console.error(error);
    return "User Profile Update ERROR !";
  }
}

// Function to get all contacts stored on database

async function prismaGetAllUsers() {
  try {
    const getAllContacts = await prismaQuery.user.findMany({
      include: { hashedPassword: false },
    });
    console.log(getAllContacts);
    return getAllContacts;
  } catch (error) {
    console.error(error);
    return "Error Fetching Contacts";
  }
}

// Function to follow or unfollow another user based on authenticatedUserName and selectedUserName

async function PrismaFollowOrUnfollowUser(
  authenticatedUserName,
  selectedUserName
) {
  try {
    // 1. Find the IDs of both users
    const authenticatedUser = await prismaQuery.user.findUnique({
      where: { userName: authenticatedUserName },
      select: { id: true },
    });

    const selectedUser = await prismaQuery.user.findUnique({
      where: { userName: selectedUserName },
      select: { id: true },
    });

    // Handle cases where users are not found
    if (!authenticatedUser) {
      return { success: false, message: "Authenticated user not found." };
    }
    if (!selectedUser) {
      return { success: false, message: "Selected user not found." };
    }

    // Prevent a user from following themselves
    if (authenticatedUser.id === selectedUser.id) {
      return { success: false, message: "Users cannot follow themselves." };
    }

    // 2. Check if a follow relationship already exists
    const existingFollow = await prismaQuery.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: authenticatedUser.id,
          followingId: selectedUser.id,
        },
      },
    });

    let actionMessage = "";

    if (existingFollow) {
      // If a follow relationship already exists, this means "Unfollow"
      await prismaQuery.follow.delete({
        where: {
          id: existingFollow.id, // Use the ID of the existing follow record
        },
      });
      actionMessage = `Successfully unfollowed ${selectedUserName}.`;
      console.log(actionMessage);
      return { success: true, message: actionMessage, status: "UNFOLLOWED" };
    } else {
      // If no follow relationship exists, this means "Follow"
      // Create a new follow request with PENDING status
      const newFollow = await prismaQuery.follow.create({
        data: {
          followerId: authenticatedUser.id,
          followingId: selectedUser.id,
          status: "PENDING", // Default status as per your schema
        },
      });
      actionMessage = `Successfully sent follow request to ${selectedUserName}. Status: PENDING.`;
      console.log(actionMessage);
      return { success: true, message: actionMessage, status: "PENDING" };
    }
  } catch (error) {
    console.error("Error in PrismaFollowOrUnfollowUser:", error);
    return { success: false, message: "Error updating follow status." };
  } finally {
    await prismaQuery.$disconnect(); // Consider whether to disconnect here or in a higher-level function
  }
}

// Function to get the home feed
async function PrismaHomeFeed(currentUserName) {
  try {
    // 1. Find the current user to get their ID and their following list
    const currentUser = await prismaQuery.user.findUnique({
      where: { userName: currentUserName },
      select: {
        id: true,
        // Select 'following' relationships where the status is ACCEPTED
        following: {
          where: { status: "ACCEPTED" }, // Only accepted follows
          select: {
            followingId: true, // Get the ID of the user they are following
          },
        },
      },
    });

    if (!currentUser) {
      console.log(`User Not found: ${currentUserName}`);
      return {
        success: false,
        message: `No user found for ${currentUserName}`,
        data: [],
      };
    }

    // 2. Extract IDs of users the current user is following (ACCEPTED status)
    const followedUserIds = currentUser.following.map((f) => f.followingId);

    // 3. Combine the current user's ID with the IDs of followed users
    const usersToFetchPostsFrom = [currentUser.id, ...followedUserIds];

    // 4. Fetch all posts from these users, ordered by creation date
    const posts = await prismaQuery.post.findMany({
      where: {
        authorId: {
          in: usersToFetchPostsFrom, // Get posts where authorId is in our list
        },
      },
      include: {
        author: {
          select: {
            id: true,
            userName: true,
            fullName: true,
            profilePicUrl: true, // Include useful author info
          },
        },
        likes: {
          select: {
            userId: true, // Only need the ID of users who liked it
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                userName: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recent posts first
      },
    });

    console.log(`Home Feed for ${currentUserName} fetched successfully.`);
    return {
      success: true,
      message: "Home Feed fetched successfully",
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return {
      success: false,
      message: "Failed to fetch home feed",
      details: error.message,
      data: [],
    };
  }
}

async function PrismaCommentOnPosts(
  authenticatedUserName,
  postId,
  commentContent
) {
  //
  try {
    // 1. Get the ID of the authenticated user
    const authenticatedUser = await prismaQuery.user.findUnique({
      where: { userName: authenticatedUserName },
      select: { id: true },
    });

    if (!authenticatedUser) {
      console.log(`Authenticated user not found: ${authenticatedUserName}`);
      return { success: false, message: "Authenticated user not found." };
    }

    // 2. Check if the post exists
    const postExists = await prismaQuery.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      console.log(`Post with ID ${postId} not found.`);
      return { success: false, message: `Post with ID ${postId} not found.` };
    }

    // 3. Create a new comment record in the Comment model
    const newComment = await prismaQuery.comment.create({
      data: {
        userId: authenticatedUser.id, // Link to the user who made the comment
        postId: postId, // Link to the post being commented on
        content: commentContent, // The actual comment text
      },
      select: {
        // Optionally select specific fields to return (e.g., confirmation)
        id: true,
        content: true,
        createdAt: true,
        user: { select: { userName: true, fullName: true } }, // Include commenter's info
        post: { select: { id: true } }, // Include post info
      },
    });

    console.log(
      `Comment posted successfully by ${authenticatedUserName} on post ${postId}.`
    );
    return {
      success: true,
      message: "Comment posted successfully!",
      data: newComment,
    };
  } catch (error) {
    console.error("Error in PrismaCommentOnPosts:", error);
    return {
      success: false,
      message: "Comment creation error, please try again!",
    };
  }
}

async function PrismaLikePosts(authenticatedUserName, postId) {
  try {
    // 1. Get the ID of the authenticated user
    const authenticatedUser = await prismaQuery.user.findUnique({
      where: { userName: authenticatedUserName },
      select: { id: true },
    });

    if (!authenticatedUser) {
      console.log(`Authenticated user not found: ${authenticatedUserName}`);
      return { success: false, message: "Authenticated user not found." };
    }

    // 2. Check if the post exists
    const postExists = await prismaQuery.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      console.log(`Post with ID ${postId} not found.`);
      return { success: false, message: `Post with ID ${postId} not found.` };
    }

    // 3. Check for an existing like relationship
    const existingLike = await prismaQuery.postLike.findUnique({
      where: {
        userId_postId: {
          // This uses the compound unique index defined in schema
          userId: authenticatedUser.id,
          postId: postId,
        },
      },
    });

    let actionMessage = "";
    let actionStatus = "";

    if (existingLike) {
      // If a like exists, this means the user wants to UNLIKE the post
      await prismaQuery.postLike.delete({
        where: {
          userId_postId: {
            userId: authenticatedUser.id,
            postId: postId,
          },
        },
      });
      actionMessage = "Post unliked successfully!";
      actionStatus = "UNLIKED";
      console.log(`${authenticatedUserName} unliked post ${postId}`);
    } else {
      // If no like exists, this means the user wants to LIKE the post
      await prismaQuery.postLike.create({
        data: {
          userId: authenticatedUser.id,
          postId: postId,
        },
      });
      actionMessage = "Post liked successfully!";
      actionStatus = "LIKED";
      console.log(`${authenticatedUserName} liked post ${postId}`);
    }

    return { success: true, message: actionMessage, status: actionStatus };
  } catch (error) {
    console.error("Error in PrismaLikePosts:", error);
    // Provide more specific error messages if possible (e.g., from PrismaClientKnownRequestError)
    return {
      success: false,
      message: "Error liking/unliking post, please try again!",
    };
  }
}

async function PrismaCreateNewPost(authenticatedUserName, post) {
  try {
    const authenticatedUserId = await prismaQuery.user.findUnique({
      where: { userName: authenticatedUserName },
      select: { id: true },
    });

    console.log("User Id", authenticatedUserId);

    const createContact = await prismaQuery.post.create({
      data: {
        authorId: authenticatedUserId.id,
        content: post,
      },
    });

    return "Post created !";
  } catch (error) {
    console.error(error);
    return "Post creation error !";
  }
}

export {
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
};
