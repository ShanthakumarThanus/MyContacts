const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Contact = require('../models/Contact');

// GET /contacts (lecture)
/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupère les contacts de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []   # nécessite un token
 *     responses:
 *       200:
 *         description: Liste des contacts
 *       401:
 *         description: Token manquant ou invalide
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST /contacts (création)
/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crée un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []   # nécessite un token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Philipp
 *               lastName:
 *                 type: string
 *                 example: Lahm
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *     responses:
 *       201:
 *         description: Contact créé
 *       400:
 *         description: Erreur de validation
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const contact = new Contact({ firstName, lastName, phone, userId: req.user.id });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création", error: err.message });
  }
});

// PATCH /contacts/:id (update partielle)
/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Met à jour partiellement un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du contact à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Philipp
 *               lastName:
 *                 type: string
 *                 example: Lahm
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *     responses:
 *       200:
 *         description: Contact mis à jour avec succès
 *       400:
 *         description: Erreur de validation ou de requête
 *       401:
 *         description: Token invalide ou manquant
 *       404:
 *         description: Contact non trouvé
 */
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});

// DELETE /contacts/:id (suppression)
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprime un contact de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du contact à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *       400:
 *         description: Erreur lors de la suppression
 *       401:
 *         description: Token invalide ou manquant
 *       404:
 *         description: Contact non trouvé
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!contact) return res.status(404).json({ message: 'Contact non trouvé' });
    res.json({ message: 'Contact supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});

module.exports = router;
