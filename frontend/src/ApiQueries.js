const apiURL = import.meta.env.VITE_API_URL;

async function loadJwtTokenToHttpHeader() {
  try {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken) {
      console.log("JWT Token invalid");
    }

    const Headers = { Authorization: `Bearer ${jwtToken}` };
    return Headers;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function ApiLogin(formData) {
  try {
    let response = await fetch(`${apiURL}/social-circle-api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP Error!`);
    }

    const ApiResponse = await response.json();
    localStorage.setItem("jwt", ApiResponse.jwt);
  } catch (error) {
    console.error(error);
  }
}

async function ApiRegister(formData) {
  try {
    console.log(formData);

    let response = await fetch(`${apiURL}/social-circle-api/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
      }),
    });
    const ApiResponse = await response.json();
    console.log(ApiResponse);
  } catch (error) {
    console.error(error);
  }
}

async function loadProfile(decodedJwt) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();

    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${decodedJwt.userName}/${decodedJwt.userName}/profile/view`,
      {
        method: "GET",
        headers: { ...storedJwt, "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! status:${response.status}`);
    }

    const queryResult = await response.json();
    console.log(queryResult);
    return queryResult;
  } catch (error) {
    console.error(error);
  }
}

async function editProfile(formData) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();
    console.log("Formsubmitted data", formData);
    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${formData.authenticatedUserName}/profile/edit`,
      {
        method: "PUT",
        headers: { ...storedJwt, "Content-Type": "application/json" },
        body: JSON.stringify({
          authenticatedUserName: formData.authenticatedUserName,
          updatedBio: formData.updatedBio,
          profilePicUrl: formData.profilePicUrl,
        }),
      }
    );
    const ApiResponse = await response.json();
    console.log(ApiResponse);
    return ApiResponse;
  } catch (error) {
    console.error(error);
  }
}

async function newPost(formData) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();
    console.log("Formsubmitted data", formData);
    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${formData.authenticatedUserName}/new-post`,
      {
        method: "POST",
        headers: { ...storedJwt, "Content-Type": "application/json" },
        body: JSON.stringify({
          authenticatedUserName: formData.authenticatedUserName,
          post: formData.post,
        }),
      }
    );
    const ApiResponse = await response.json();
    console.log(ApiResponse);
    return ApiResponse;
  } catch (error) {
    console.error(error);
  }
}

function decodeJWTPayload(runOnRequest) {
  try {
    const jwtToken = localStorage.getItem("jwt");

    if (!jwtToken || typeof jwtToken !== "string" || !jwtToken.includes(".")) {
      console.warn("No valid JWT found in localStorage");
      return {};
    }

    const jwtExtractPayLoad = jwtToken.split(".")[1];

    function base64UrlToJsonString(string) {
      string = string.replace(/-/g, "+").replace(/_/g, "/");
      const pad = string.length % 4;
      if (pad) string += "=".repeat(4 - pad);

      try {
        return decodeURIComponent(
          atob(string)
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
        );
      } catch (err) {
        console.error("Invalid base64 encoding in JWT:", err);
        return null;
      }
    }

    const jsonString = base64UrlToJsonString(jwtExtractPayLoad);
    if (!jsonString) return {};

    const payLoad = JSON.parse(jsonString);
    return payLoad;
  } catch (error) {
    console.error("Failed to Decode JWT payload:", error);
    return {};
  }
}

async function socialFeedQuery(decodedJwt) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();

    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${decodedJwt.userName}/all-users/${decodedJwt.userName}/home-feed`,
      {
        method: "GET",
        headers: { ...storedJwt, "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! status:${response.status}`);
    }

    const queryResult = await response.json();
    // console.log(queryResult);
    return queryResult;
  } catch (error) {
    console.error(error);
  }
}

async function clearJwtLogOut() {
  localStorage.removeItem("jwt");
  return "loggedOut";
}

async function allUsers() {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();

    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/users/all-users`,
      {
        method: "GET",
        headers: { ...storedJwt, "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! status:${response.status}`);
    }

    const queryResult = await response.json();
    console.log(queryResult);
    return queryResult;
  } catch (error) {
    console.error(error);
  }
}

async function followRequest(user, loggedUser) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();
    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${loggedUser.userName}/all-users/${user.userName}/followstatus`,
      {
        method: "PUT",
        headers: { ...storedJwt, "Content-Type": "application/json" },
        body: JSON.stringify({
          authenticatedUserName: loggedUser,
          selectedUserName: user.userName,
        }),
      }
    );
    const ApiResponse = await response.json();
    return ApiResponse;
  } catch (error) {
    console.error(error);
  }
}

async function newCommentApiQuery(formData) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();
    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${formData.userName}/posts/${formData.postID}/comment`,
      {
        method: "POST",
        headers: { ...storedJwt, "Content-Type": "application/json" },
        body: JSON.stringify({
          authenticatedUserName: formData.authenticatedUserName,
          postId: formData.postId,
          commentContent: formData.commentContent,
        }),
      }
    );
    const ApiResponse = await response.json();
    return ApiResponse;
  } catch (error) {
    console.error(error);
  }
}

async function likeStatusApiQuery(formData) {
  try {
    console.log("This is formData from Likesatus query", formData);
    const storedJwt = await loadJwtTokenToHttpHeader();
    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${formData.authenticatedUserName}/posts/${formData.postId}/like`,
      {
        method: "PUT",
        headers: { ...storedJwt, "Content-Type": "application/json" },
        body: JSON.stringify({
          authenticatedUserName: formData.authenticatedUserName,
          postId: formData.postId,
        }),
      }
    );
    const ApiResponse = await response.json();
    return ApiResponse;
  } catch (error) {
    console.error(error);
  }
}

async function loadPostByIdApiQuery(formData) {
  try {
    const storedJwt = await loadJwtTokenToHttpHeader();

    let response = await fetch(
      `${apiURL}/social-circle-api/v1/authorized/${formData.authenticatedUserName}/posts/${formData.postId}`,
      {
        method: "GET",
        headers: { ...storedJwt, "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! status:${response.status}`);
    }

    const queryResult = await response.json();
    console.log(queryResult);
    return queryResult;
  } catch (error) {
    console.error(error);
  }
}

export {
  ApiLogin,
  ApiRegister,
  loadJwtTokenToHttpHeader,
  loadProfile,
  editProfile,
  decodeJWTPayload,
  socialFeedQuery,
  clearJwtLogOut,
  allUsers,
  followRequest,
  newPost,
  newCommentApiQuery,
  likeStatusApiQuery,
  loadPostByIdApiQuery,
};
