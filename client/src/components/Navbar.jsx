import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token JWT
    navigate("/"); // Redirige vers la page de connexion
  };

  const isLoggedIn = !!localStorage.getItem("token"); // Vérifie si un token existe

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#282c34",
        color: "white",
        padding: "10px 20px",
      }}
    >
      <h3>MyContacts</h3>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/contacts" style={linkStyle}>
              Mes contacts
            </Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={linkStyle}>
              Connexion
            </Link>
            <Link to="/register" style={linkStyle}>
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginRight: "15px",
};

const logoutButtonStyle = {
  backgroundColor: "#e63946",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};
