// controllers/reservation.controller.js
import Reservation from '../models/reservation.model.js';

// GET /api/reservations
export const getAll = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.json({ reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// GET /api/reservations/me
export const getMine = async (req, res) => {
    try {
        const reservations = await Reservation.findByUser(req.user.id);
        res.json({ reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// GET /api/reservations/:id
export const getOne = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }
        res.json({ reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// POST /api/reservations
export const create = async (req, res) => {
    try {
        const { titre, description, debut, fin } = req.body;

        if (!titre || !debut || !fin) {
            return res.status(400).json({ error: 'Titre, début et fin sont requis' });
        }

        if (new Date(debut) >= new Date(fin)) {
            return res.status(400).json({ error: 'La date de fin doit être après la date de début' });
        }

        // Vérifier les conflits
        const hasConflict = await Reservation.checkConflict(debut, fin);
        if (hasConflict) {
            return res.status(409).json({ error: 'Ce créneau est déjà réservé' });
        }

        const reservation = await Reservation.create({
            titre,
            description,
            debut,
            fin,
            users_id: req.user.id
        });

        res.status(201).json({ message: 'Réservation créée', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// PUT /api/reservations/:id
export const update = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        // Seul le créateur peut modifier
        if (reservation.users_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez modifier que vos propres réservations' });
        }

        const { titre, description, debut, fin } = req.body;

        if (!titre || !debut || !fin) {
            return res.status(400).json({ error: 'Titre, début et fin sont requis' });
        }

        if (new Date(debut) >= new Date(fin)) {
            return res.status(400).json({ error: 'La date de fin doit être après la date de début' });
        }

        // Vérifier les conflits (en excluant cette réservation)
        const hasConflict = await Reservation.checkConflict(debut, fin, req.params.id);
        if (hasConflict) {
            return res.status(409).json({ error: 'Ce créneau est déjà réservé' });
        }

        const updated = await Reservation.update(req.params.id, { titre, description, debut, fin });
        res.json({ message: 'Réservation modifiée', reservation: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// DELETE /api/reservations/:id
export const remove = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        // Seul le créateur peut supprimer
        if (reservation.users_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez supprimer que vos propres réservations' });
        }

        await Reservation.delete(req.params.id);
        res.json({ message: 'Réservation supprimée' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
