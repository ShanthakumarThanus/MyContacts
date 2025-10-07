const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

// Inscription d’un utilisateur
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Vérifie que l'email a un bon format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Format d'email invalide." });
    }

    // Vérifie que l'utilisateur n'existe pas déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Cet email est déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

// Connexion d’un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Vérifie que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Utilisateur introuvable. Veuillez créer un compte." });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    // Génère un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Expiration facultative, mais bonne pratique
    );

    res.status(200).json({
      message: "Utilisateur connecté avec succès",
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
