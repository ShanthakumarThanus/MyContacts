process.env.NODE_ENV = "test";
require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Tests Contacts (CRUD)", () => {
  let token;
  let contactId;

  let mongoServer;

  beforeAll(async () => {
    // Démarre un serveur Mongo temporaire en mémoire
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Crée un utilisateur de test
    await request(app).post("/auth/register").send({
      email: "contactuser@example.com",
      password: "contactpass",
    });

    // Connexion pour obtenir un token
    const login = await request(app).post("/auth/login").send({
      email: "contactuser@example.com",
      password: "contactpass",
    });

    token = login.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop(); // arrête le serveur mémoire
  });

  test("doit créer un nouveau contact", async () => {
    const res = await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "John", lastName: "Doe", phone: "0606060606" });

    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("John");
    contactId = res.body._id;
  });

  test("doit récupérer la liste des contacts", async () => {
    const res = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("doit mettre à jour un contact", async () => {
    const res = await request(app)
      .patch(`/contacts/${contactId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0707070707" });

    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe("0707070707");
  });

  test("doit supprimer un contact", async () => {
    const res = await request(app)
      .delete(`/contacts/${contactId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Contact supprimé avec succès");
  });
});
