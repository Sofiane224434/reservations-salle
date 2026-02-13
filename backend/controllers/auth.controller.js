// controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Extrait prénom et nom depuis l'email
const extractNamesFromEmail = (email) => {
    // Validation du domaine @techspace.com
    const emailRegex = /^[a-zA-Z0-9.-]+@techspace\.com$/;

    if (!emailRegex.test(email)) {
        throw new Error('Email invalide. Doit être au format @techspace.com');
    }

    // Extraire, enlever les chiffres et séparer
    const [firstName, lastName] = email
        .split('@')[0]
        .replace(/\d+/g, '')
        .split(/[.-]/);

    // Capitaliser
    const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

    return {
        firstName: capitalize(firstName) || '',
        lastName: capitalize(lastName) || ''
    };
};

// Génère un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};
// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Valider le domaine et extraire les noms
        let firstName, lastName;
        try {
            const names = extractNamesFromEmail(email);
            firstName = names.firstName;
            lastName = names.lastName;
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }

        const user = await User.create({ email, password });
        const token = generateToken(user);

        res.status(201).json({
            message: 'Inscription réussie',
            user: {
                id: user.id,
                email: user.email,
                firstName,
                lastName
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user || !(await User.verifyPassword(password, user.password))) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        // Extraire les noms depuis l'email
        const { firstName, lastName } = extractNamesFromEmail(email);

        const token = generateToken(user);
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName,
                lastName
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// GET /api/auth/me
export const getProfile = async (req, res) => {
    // Extraire les noms depuis l'email
    const { firstName, lastName } = extractNamesFromEmail(req.user.email);

    res.json({
        user: {
            ...req.user,
            firstName,
            lastName
        }
    });
};