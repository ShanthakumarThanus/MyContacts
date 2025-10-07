const Contact = require("../models/Contact");

// Récupération des contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Création d’un contact
exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const contact = new Contact({ firstName, lastName, phone, userId: req.user.id });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création", error: err.message });
  }
};

// Mise à jour partielle d’un contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};

// Suppression d’un contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la suppression", error: err.message });
  }
};
