import React from "react";

export default function Register() {
    return (
        <div>
            <h2>Inscription</h2>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Mot de passe" />
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
}