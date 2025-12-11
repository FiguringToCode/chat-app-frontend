import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername || !trimmedPassword) {
      setError("Please enter username and password");
      return;
    }

    try {
      const response = await axios.post("https://chat-app-backend-ao7g.onrender.com/auth/login", {
        username: trimmedUsername,
        password: trimmedPassword,
      });
      setUser(response.data);
    } catch (error) {
      console.error("Login error: ", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="card bg-dark text-white border-secondary shadow-lg h-100">
      <div className="card-header border-secondary text-center pt-4">
        <h3 className="fw-bold" style={{ color: "#6efa03" }}>Welcome Back</h3>
      </div>
      <div className="card-body p-4">
        <p className="text-center text-secondary mb-4">
          Login to access your chat
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-left">
            <label className="form-label text-light small text-uppercase">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              className="form-control bg-black text-white border-secondary py-2 text-center"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label text-light small text-uppercase">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className="form-control bg-black text-white border-secondary py-2 text-center"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            LOGIN
          </button>
        </form>
        {error && (
          <div className="alert alert-danger mt-3 py-2 text-center" role="alert">
            <small>{error}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;