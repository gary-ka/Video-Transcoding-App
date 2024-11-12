const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: "ap-southeast-2_fv7rLIkSX",
  tokenUse: "id", // idToken
  clientId: "4173fpgleh57cg3hhio3d6hqm9",
});

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if the token is provided and formatted as 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    // Verify the token
    const payload = await verifier.verify(token);

    // Attach the user information (e.g., username) to the request object
    req.user = {
      username: payload["cognito:username"], // Extract the username from the token
      email: payload.email, // Extract user's email
      groups: payload["cognito:groups"] || [], // Extract Cognito groups
    };

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
