import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { reservationService } from '../services/api.js';

const pad = (n) => String(n).padStart(2, '0');
const formatDateTime = (str) => {
    const d = new Date(str);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} à ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function Profil() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'

    useEffect(() => {
        reservationService.getMine()
            .then(data => setReservations(data.reservations || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const now = new Date();
    const filtered = reservations.filter(r => {
        if (filter === 'upcoming') return new Date(r.debut) >= now;
        if (filter === 'past') return new Date(r.debut) < now;
        return true;
    });

    const upcoming = reservations.filter(r => new Date(r.debut) >= now).length;
    const past = reservations.filter(r => new Date(r.debut) < now).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Carte profil */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{reservations.length}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{upcoming}</div>
                            <div className="text-sm text-gray-600">À venir</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-500">{past}</div>
                            <div className="text-sm text-gray-600">Passées</div>
                        </div>
                    </div>
                </div>

                {/* Historique */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <h2 className="text-xl font-bold text-gray-900">Historique des réservations</h2>
                        <div className="flex gap-1">
                            {[
                                { key: 'all', label: 'Toutes' },
                                { key: 'upcoming', label: 'À venir' },
                                { key: 'past', label: 'Passées' },
                            ].map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilter(f.key)}
                                    className={`px-3 py-1.5 rounded font-medium text-sm transition ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-gray-500 text-center py-8">Chargement...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Aucune réservation</p>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(r => {
                                const isPast = new Date(r.debut) < now;
                                return (
                                    <div key={r.id} className={`border rounded-lg p-4 transition ${isPast ? 'border-gray-200 bg-gray-50/50' : 'border-blue-200 bg-blue-50/30'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{r.titre}</h3>
                                                {r.description && <p className="text-sm text-gray-500 mt-0.5">{r.description}</p>}
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <span>📅 {formatDateTime(r.debut)}</span>
                                                    <span>→</span>
                                                    <span>{formatDateTime(r.fin)}</span>
                                                </div>
                                            </div>
                                            <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${isPast ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                                {isPast ? 'Passée' : 'À venir'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profil;