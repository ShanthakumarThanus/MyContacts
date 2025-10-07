process.env.NODE_ENV = "test";
require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); 

describe("Tests Auth (Register & Login)", () => {
  const testUser = {
    email: "jestuser@example.com",
    password: "testpassword123",
  };

  // Nettoyage avant les tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // vide la base test uniquement
    await mongoose.connection.close();
  });

  test("doit inscrire un nouvel utilisateur", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Utilisateur enregistré avec succès");
  });

  test("doit se connecter avec succès", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("doit refuser une connexion avec un mauvais mot de passe", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Mot de passe incorrect.");
  });
});
