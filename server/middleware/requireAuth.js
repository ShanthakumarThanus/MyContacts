const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    try {
        // vérification présence header authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès refusé. Token Manquant' });
        }

        //coupe la chaîne en 2 partie pour récupérer ce qu'il a après "Bearer"
        const token = authHeader.split(' ')[1];

        // valide la signature avec jwt secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalide.' });
    }
};

module.exports = requireAuth;