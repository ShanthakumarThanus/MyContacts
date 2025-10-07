import React, { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Vérifie en direct si l’email est valide
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Format d'email invalide");
    } else {
      setEmailError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Vérifications côté client
    if (emailError || !email) {
      setIsSuccess(false);
      setMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setIsSuccess(false);
      setMessage(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre."
      );
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("Inscription réussie ! Redirection...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Erreur lors de l’inscription.");
      }
    } catch {
      setIsSuccess(false);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Inscription</h2>
      {message && (
        <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
      )}

      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        {/* Champ email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          required
          style={{
            border: `1px solid ${emailError ? "red" : "#ccc"}`,
            borderRadius: "4px",
            padding: "8px",
            fontSize: "14px",
          }}
          title="Veuillez entrer une adresse e-mail valide (ex : nom@exemple.com)"
        />
        {emailError && (
          <small style={{ color: "red", fontSize: "0.85em" }}>{emailError}</small>
        )}

        {/* Champ mot de passe */}
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            fontSize: "14px",
          }}
          title="Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre"
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          S'inscrire
        </button>
      </form>

      <p>
        Déjà un compte ? <a href="/">Se connecter</a>
      </p>
    </div>
  );
}
