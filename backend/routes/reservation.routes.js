// routes/reservation.routes.js
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getAll, getMine, getOne, create, update, remove } from '../controllers/reservation.controller.js';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

router.get('/', getAll);          // Toutes les réservations
router.get('/me', getMine);       // Mes réservations
router.get('/:id', getOne);       // Une réservation
router.post('/', create);         // Créer
router.put('/:id', update);       // Modifier
router.delete('/:id', remove);    // Supprimer

export default router;
