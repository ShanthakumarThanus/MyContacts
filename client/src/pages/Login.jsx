import { useState } from "react";

export default function Login() {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (emailError || !email) {
      setIsSuccess(false);
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!password.trim()) {
      setIsSuccess(false);
      setMessage("Veuillez entrer votre mot de passe.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsSuccess(true);
        setMessage("Connexion réussie ! Redirection...");
        setTimeout(() => {
          window.location.href = "/contacts";
        }, 1000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Erreur lors de la connexion.");
      }
    } catch {
      setIsSuccess(false);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <h2>Connexion</h2>

        {message && (
          <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
        )}

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
          title="Veuillez entrer une adresse email valide"
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
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            fontSize: "14px",
          }}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Se connecter
        </button>
      </form>

      <p>
        Pas encore de compte ? <a href="/register">Créer un compte</a>
      </p>
    </div>
  );
}
