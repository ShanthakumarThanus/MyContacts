const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Simulation des données
let contacts = [];
let token = "fake-jwt-token"; // Token simulé

// Middleware simulé de vérification du token
app.use((req, res, next) => {
  if (req.path.startsWith("/contacts")) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${token}`) {
      return res.status(401).json({ message: "Token invalide ou manquant" });
    }
  }
  next();
});

// Routes simulées
app.get("/contacts", (req, res) => {
  res.status(200).json(contacts);
});

app.post("/contacts", (req, res) => {
  const { firstName, lastName, phone } = req.body;
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const newContact = { id: Date.now(), firstName, lastName, phone };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.patch("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contact = contacts.find(c => c.id === id);
  if (!contact) return res.status(404).json({ message: "Contact non trouvé" });

  Object.assign(contact, req.body);
  res.status(200).json(contact);
});

app.delete("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  contacts = contacts.filter(c => c.id !== id);
  res.status(200).json({ message: "Contact supprimé avec succès" });
});

describe("Tests Contacts simulés (sans MongoDB)", () => {
  beforeEach(() => {
    contacts = []; // Vide la liste avant chaque test
  });

  test("doit créer un nouveau contact", async () => {
    const res = await request(app)
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "John", lastName: "Doe", phone: "0606060606" });

    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("John");
  });

  test("doit récupérer la liste des contacts", async () => {
    contacts.push({ id: 1, firstName: "Alice", lastName: "Dupont", phone: "0707070707" });

    const res = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("doit mettre à jour un contact", async () => {
    const contact = { id: 1, firstName: "Bob", lastName: "Martin", phone: "0101010101" };
    contacts.push(contact);

    const res = await request(app)
      .patch(`/contacts/${contact.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0202020202" });

    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe("0202020202");
  });

  test("doit supprimer un contact", async () => {
    const contact = { id: 1, firstName: "Test", lastName: "User", phone: "0606060606" };
    contacts.push(contact);

    const res = await request(app)
      .delete(`/contacts/${contact.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Contact supprimé avec succès");
  });
});
