// TODO: Change this file according to your exact requirement.
"use client";

import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add your registration logic here
    console.log("Registering:", { email, password });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ display: "block", margin: "10px 0" }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ display: "block", margin: "10px 0" }}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        style={{ display: "block", margin: "10px 0" }}
      />
      <button onClick={handleRegister} style={{ marginTop: "10px" }}>
        Register
      </button>
    </div>
  );
}
