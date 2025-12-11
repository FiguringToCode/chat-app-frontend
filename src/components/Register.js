import React, { useState } from "react";
import axios from "axios";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(null);
    setRegistrationSuccess(null);

    try {
      const { data } = await axios.post("https://chat-app-backend-ao7g.onrender.com/auth/register", {
        username,
        password,
      });

      setRegistrationSuccess("Account created! Logging you in...");
      
      // Optional: Add a small delay so user sees the success message before switching screens
      setTimeout(() => {
         setUser(data);
      }, 1000);

    } catch (error) {
      console.error(error.response?.data?.message || "Error registering user");
      setError(error.response?.data?.message || "Error registering user");
    } 
  };

  return (
    <div className="card bg-dark text-white border-secondary shadow-lg h-100">
      <div className="card-header border-secondary text-center pt-4">
        <h3 className="fw-bold" style={{ color: "#6efa03" }}>Create Account</h3>
      </div>
      <div className="card-body p-4">
        <p className="text-center text-secondary mb-4">
          New here? Join the conversation.
        </p>
        
        <form onSubmit={handleRegister}>
          <div className="mb-3">
             <label className="form-label text-light small text-uppercase">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              className="form-control bg-black text-white border-secondary py-2"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light small text-uppercase">Password</label>
            <input
              type="password"
              placeholder="Choose a password"
              value={password}
              className="form-control bg-black text-white border-secondary py-2"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold shadow-sm"
          >
            REGISTER
          </button>
        </form>

        {registrationSuccess && (
          <div className="alert alert-success mt-3 py-2 text-center">
             <small>{registrationSuccess}</small>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-3 py-2 text-center">
             <small>{error}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;