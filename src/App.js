import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Chat } from "./components/Chat";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="app d-flex flex-column min-vh-100 text-light" style={{ background: "linear-gradient(135deg,rgb(26, 26, 26) 0%, #2d3436 100%)" }}>
      {/* Navbar / Header */}
      <nav className="navbar navbar-dark bg-dark shadow-sm mb-4 py-3" style={{ background: "linear-gradient(135deg,rgb(110, 250, 3) 0%,rgb(0, 153, 8) 80%)" }}>
        <div className="container justify-content-center">
          <span className="navbar-brand mb-0 h1 fs-2 fw-bold text-uppercase">
            Chat App
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        {!user ? (
          <div className="row w-100 justify-content-center g-4">
            <div className="col-lg-5 col-md-6">
              <Register setUser={setUser} />
            </div>
            {/* Divider or spacing could go here, relying on Grid gap */}
            <div className="col-lg-5 col-md-6">
              <Login setUser={setUser} />
            </div>
          </div>
        ) : (
          <Chat user={user} />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-3 small" style={{ color: "#6efa03"}}>
        &copy; {new Date().getFullYear()} Secure Chat
      </footer>
      
    </div>
  );
};

export default App;
