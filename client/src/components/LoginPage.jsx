import React, { useState, useEffect } from "react";
import { login, logout } from "../services/authService";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const token = await login(username, password);
      localStorage.setItem("idToken", token);
      setIsLoggedIn(true);
      setMessage("Login successful!");
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("idToken");
    setIsLoggedIn(false);
    setMessage("You have logged out.");
  };

  return (
    <div className="mt-20">
      {!isLoggedIn ? (
        <>
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            className="border-2 border-blue-200 rounded text-2xl"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border-2 border-blue-200 rounded text-2xl ml-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn ml-6" onClick={handleLogin}>
            Login
          </button>
          <p>{message}</p>
        </>
      ) : (
        <div className="mt-20">
          <p className="text-2xl">{message}</p>
          <button className="btn ml-6 mt-6" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
