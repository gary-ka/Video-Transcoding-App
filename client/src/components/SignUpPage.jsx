import React, { useState } from "react";
import { signUp, confirmSignUp } from "../services/authService";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSignUp = async () => {
    try {
      await signUp(username, password, email);
      setMessage(
        "Sign up successful! Please check your email for the confirmation code."
      );
      setIsSignedUp(true);
    } catch (error) {
      setMessage(`Sign up failed: ${error.message}`);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp(username, code);
      setMessage("Confirmation successful! You can now log in.");
      setIsConfirmed(true);
    } catch (error) {
      setMessage(`Confirmation failed: ${error.message}`);
    }
  };

  return (
    <div className="mt-20">
      {!isSignedUp ? (
        <>
          <h2 className="text-2xl mb-4">Sign Up</h2>
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
          <input
            className="border-2 border-blue-200 rounded text-2xl ml-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn ml-6" onClick={handleSignUp}>
            Sign Up
          </button>
          <p>{message}</p>
        </>
      ) : !isConfirmed ? (
        <>
          <h2 className="text-2xl">Confirm Sign Up</h2>
          <input
            className="border-2 border-blue-200 rounded text-2xl"
            type="text"
            placeholder="Confirmation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn ml-6" onClick={handleConfirmSignUp}>
            Confirm
          </button>
          <p>{message}</p>
        </>
      ) : (
        <p className="text-xl">You are successfully signed up and confirmed!</p>
      )}
    </div>
  );
}

export default SignUpPage;
