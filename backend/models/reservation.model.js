// models/reservation.model.js
import { query } from '../config/db.js';

const Reservation = {
    // Toutes les réservations (avec email du créateur)
    async findAll() {
        const sql = `
            SELECT r.*, u.email 
            FROM reservations r 
            JOIN users u ON r.users_id = u.id 
            ORDER BY r.debut ASC
        `;
        return await query(sql);
    },

    // Réservations d'un utilisateur
    async findByUser(userId) {
        const sql = `
            SELECT * FROM reservations 
            WHERE users_id = ? 
            ORDER BY debut ASC
        `;
        return await query(sql, [userId]);
    },

    // Réservation par ID
    async findById(id) {
        const sql = `
            SELECT r.*, u.email 
            FROM reservations r 
            JOIN users u ON r.users_id = u.id 
            WHERE r.id = ?
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Créer une réservation
    async create({ titre, description, debut, fin, users_id }) {
        const sql = `
            INSERT INTO reservations (titre, description, debut, fin, users_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [titre, description || null, debut, fin, users_id]);
        return { id: result.insertId, titre, description, debut, fin, users_id };
    },

    // Modifier une réservation
    async update(id, { titre, description, debut, fin }) {
        const sql = `
            UPDATE reservations 
            SET titre = ?, description = ?, debut = ?, fin = ?
            WHERE id = ?
        `;
        await query(sql, [titre, description || null, debut, fin, id]);
        return await Reservation.findById(id);
    },

    // Supprimer une réservation
    async delete(id) {
        const sql = 'DELETE FROM reservations WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    },

    // Vérifier les conflits (chevauchement d'heures)
    async checkConflict(debut, fin, excludeId = null) {
        let sql = `
            SELECT * FROM reservations 
            WHERE debut < ? AND fin > ?
        `;
        const params = [fin, debut];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const results = await query(sql, params);
        return results.length > 0;
    }
};

export default Reservation;
