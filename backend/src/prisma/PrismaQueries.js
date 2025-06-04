import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prismaQuery = new PrismaClient();

// Function to register a new user into the database
async function PrismaRegisterNewUser(name, email, password, bio) {
  try {
    const createContact = await prismaQuery.contact.create({
      data: {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
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
    const authenticate = await prismaQuery.contact.findUnique({
      where: {
        email: email,
      },
    });
    console.log(authenticate);
    const passwordMatch = await bcrypt.compare(password, authenticate.password);
    console.log("Password Matching:", passwordMatch);

    if (passwordMatch) {
      console.log("Authentication Success !");
      return {
        status: "Authentication Success",
        id: authenticate.id,
        name: authenticate.name,
        email: authenticate.email,
        bio: authenticate.bio,
      };
    } else {
      console.log("Authentication Failure !");
      return { status: "Authentication Failure" };
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to get all contacts stored on database

async function prismaGetAllUsers() {
  try {
    const getAllContacts = await prismaQuery.contact.findMany({
      include: { password: false },
    });
    console.log(getAllContacts);
    return getAllContacts;
  } catch (error) {
    console.error(error);
    return "Error Fetching Contacts";
  }
}

// Function to send message to another contact based on sender contact ID and receiver contact ID

async function PrismaFollowOrUnfollowUser(senderID, receiverID, message) {
  try {
    const newMessage = await prismaQuery.message.create({
      data: {
        message: message,
        contactIdSender: senderID,
        contactIdReceiver: receiverID,
      },
    });
    return "Message Sent";
  } catch (error) {
    console.error(error);
    return "Error Sending Message";
  }
}

// Function to read profile based on contactID supplied
async function PrismaGetUserProfile(contactID) {
  try {
    const userProfile = await prismaQuery.contact.findUnique({
      where: { id: contactID },
      select: {
        email: true,
        password: false,
        bio: true,
        messagesSent: false,
        messagesReceived: false,
        password: false,
      },
    });
    console.log(userProfile);
    return userProfile;
  } catch (error) {
    console.error(error);
    return "Error Fetching Profile";
  }
}

// Function to Update user Profile based on contactID
async function PrismaUpdateLoggedUserProfile(contactID, updatedBio) {
  try {
    const updateProfile = await prismaQuery.contact.update({
      where: { id: contactID },
      data: {
        bio: updatedBio,
      },
    });
    return "User Profile Updated!";
  } catch (error) {
    console.error(error);
    return "User Profile Update ERROR !";
  }
}

// Function to get the home feed
async function PrismaHomeFeed(contactID) {
  // This is your backend function
  try {
    const contactData = await prismaQuery.contact.findUnique({
      where: { id: contactID },
      include: {
        messagesSent: {
          include: {
            contactSender: { select: { id: true, name: true, email: true } },
            contactReceiver: { select: { id: true, name: true, email: true } },
          },
        },
        messagesReceived: {
          include: {
            contactSender: { select: { id: true, name: true, email: true } },
            contactReceiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!contactData) {
      console.log(`No contact found for ID: ${contactID}`);
      // Return a consistent structure for "not found"
      return { response: [], status: `No contact found for ID ${contactID}` };
    }

    const allMessages = [
      ...contactData.messagesSent,
      ...contactData.messagesReceived,
    ];

    const formattedMessages = allMessages.map((msg) => {
      const senderName =
        msg.contactSender?.name || `Unknown Sender (${msg.contactIdSender})`;
      const receiverName =
        msg.contactReceiver?.name ||
        `Unknown Receiver (${msg.contactIdReceiver})`;
      const senderEmail = msg.contactSender?.email || null;
      const receiverEmail = msg.contactReceiver?.email || null;

      return {
        id: msg.id,
        message: msg.message,
        contactIdSender: msg.contactIdSender,
        contactIdReceiver: msg.contactIdReceiver,
        time: msg.time,
        senderName: senderName,
        receiverName: receiverName,
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
      };
    });

    formattedMessages.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    console.log(`Messages fetched for contact ID: ${contactID}`);

    return {
      response: formattedMessages,
      status: "Messages fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return {
      response: [],
      error: "Failed to fetch contact messages",
      details: error.message,
    };
  }
}

async function PrismaCommentOnPosts(name, email, password, bio) {
  try {
    const createContact = await prismaQuery.contact.create({
      data: {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        bio: bio,
      },
    });

    return "User Registered successfully !";
  } catch (error) {
    console.error(error);
    return "User Registration Error, Please try again !";
  }
}

async function PrismaLikePosts(name, email, password, bio) {
  try {
    const createContact = await prismaQuery.contact.create({
      data: {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        bio: bio,
      },
    });

    return "User Registered successfully !";
  } catch (error) {
    console.error(error);
    return "User Registration Error, Please try again !";
  }
}

async function PrismaCreateNewPost(name, email, password, bio) {
  try {
    const createContact = await prismaQuery.contact.create({
      data: {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        bio: bio,
      },
    });

    return "User Registered successfully !";
  } catch (error) {
    console.error(error);
    return "User Registration Error, Please try again !";
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
