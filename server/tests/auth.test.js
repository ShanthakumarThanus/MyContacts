const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// --- Simulation basique de l'app Express ---
const app = express();
app.use(bodyParser.json());

let users = []; // Base de données simulée

// Mock de /auth/register
app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Champs requis manquants" });

  const exists = users.find(u => u.email === email);
  if (exists)
    return res.status(400).json({ message: "Email déjà utilisé" });

  users.push({ email, password });
  res.status(201).json({ message: "Utilisateur enregistré avec succès" });
});

// Mock de /auth/login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user)
    return res.status(400).json({ message: "Identifiants incorrects" });

  if (user.password !== password)
    return res.status(400).json({ message: "Mot de passe incorrect" });

  res.status(200).json({ message: "Connexion réussie", token: "fake-jwt-token" });
});

// --- Tests ---
describe("Tests Auth simulés (sans MongoDB)", () => {
  beforeEach(() => {
    users = []; // Réinitialise la base à chaque test
  });

  test("doit inscrire un nouvel utilisateur", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "1234" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Utilisateur enregistré avec succès");
  });

  test("doit refuser un email déjà utilisé", async () => {
    users.push({ email: "test@example.com", password: "1234" });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "abcd" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email déjà utilisé");
  });

  test("doit se connecter avec succès", async () => {
    users.push({ email: "test@example.com", password: "1234" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("doit refuser une connexion avec mauvais mot de passe", async () => {
    users.push({ email: "test@example.com", password: "1234" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Mot de passe incorrect");
  });
});
