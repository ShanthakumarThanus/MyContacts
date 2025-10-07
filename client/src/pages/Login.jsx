import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // Vérifie que l'email est bien formaté
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsSuccess(false);
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    // Vérifie que le mot de passe n'est pas vide
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
    } catch (err) {
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

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Veuillez entrer une adresse email valide"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Se connecter</button>
      </form>

      <p>
        Pas encore de compte ? <a href="/register">Créer un compte</a>
      </p>
    </div>
  );
}
