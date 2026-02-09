import jwt from "jsonwebtoken";

export const auth = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "No token, authorization denied" }),
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info manually
    req.userId = decoded.id;
    req.userRole = decoded.role;

    return true; // ✅ authorization passed
  } catch (error) {
    console.error("Auth error:", error.message);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Token is not valid" }));
    return false;
  }
};
