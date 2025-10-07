import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {                     // http://localhost:4000/auth/login
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "/contacts";
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", }}>
                <h2>Connexion</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Se connecter</button>
            </form>
            <p>
                <a href="/register">Se créer un compte</a>
            </p>
        </div>
    )
}