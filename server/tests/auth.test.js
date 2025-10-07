process.env.NODE_ENV = "test";
require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); 
let mongoServer;

describe("Tests Auth (Register & Login)", () => {
  const testUser = {
    email: "jestuser@example.com",
    password: "testpassword123",
  };

  // Démarre un serveur Mongo en mémoire avant les tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Nettoie et arrête le serveur après les tests
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
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
