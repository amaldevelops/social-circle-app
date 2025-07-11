import jwt from "jsonwebtoken";

// ***** Authentication using JWT (Without using Passport.js) *****

// Install jsonwebtoken package : `npm install jsonwebtoken`
// `createJWT` custom middleware will create a JWT token that can be sent as JSON via an API End Point. When authenticating routes custom middleware `authenticateJWT` can be used.
// To Protect a route add `authenticateJWT` middleware before all the other middleware that needs to be protected E.g: `mainRouter.get("/messaging-api/v1/contacts", authenticateJWT, getAllContacts);`
// Client will need to save the token received as JSON in the browser local storage in the front end/browser
// From Front End when authorizing routes with JWT token will need to be sent as an "Authorization" header, it is required to use format "Bearer <JWT>" as below;
// Bearer eyJhbGciOiJIUsfdsd34dfInR5cCI6IkpXVCJ9.eyJpYXQiOjE3dfdfdfyOTYsImV4cCI6MTc0NDA5OTA5Nn0.PboRrhU7xFTsdfdsf_ZA59eWs-pxXfH8sdfsdfjIKA

// Function to create JWT
async function createJWT(loginStatus) {
  try {
    console.log("Yoooo", loginStatus);
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          status: loginStatus.status,
          id: loginStatus.id,
          contactName: loginStatus.fullName,
          userName: loginStatus.userName,
          email: loginStatus.email,
          bio: loginStatus.bio,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1800s" },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve({
            Login: "Login Successful",
            token: token,
          });
          console.log(token);
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
}

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  // Split the Bearer <access_token> and get the <access_token>
  const token = req.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authData) => {
    if (err) {
      console.log("Forbidden: Invalid or expired token");
      return res.status(403).json({
        message: "Forbidden: Invalid or expired token",
      });
    }
    req.authData = authData;
    next();
  });
}

export { createJWT, authenticateJWT };
