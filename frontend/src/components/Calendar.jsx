import { useState, useCallback, useEffect } from 'react';
import { reservationService } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_SHORT = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const DAYS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS_START = 8;
const HOURS_END = 19;

// Helpers
const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const pad = (n) => String(n).padStart(2, '0');
const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// ─── Modal réservation ──────────────────────────────
const ReservationModal = ({ isOpen, onClose, onSubmit, onDelete, reservation, defaultDate }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [debut, setDebut] = useState('');
    const [fin, setFin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (reservation) {
            setTitre(reservation.titre);
            setDescription(reservation.description || '');
            setDebut(reservation.debut.slice(0, 16));
            setFin(reservation.fin.slice(0, 16));
        } else if (defaultDate) {
            const d = new Date(defaultDate);
            const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            const startH = Math.max(HOURS_START, Math.min(d.getHours(), HOURS_END - 1));
            const endH = Math.min(startH + 1, HOURS_END);
            setDebut(`${dateStr}T${pad(startH)}:00`);
            setFin(`${dateStr}T${pad(endH)}:00`);
            setTitre('');
            setDescription('');
        }
        setError('');
    }, [reservation, defaultDate, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const dStart = new Date(debut);
            const dEnd = new Date(fin);
            const dayOfWeek = dStart.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                setError('Les réservations ne sont pas autorisées le samedi et le dimanche.');
                setLoading(false);
                return;
            }
            const dayOfWeekEnd = dEnd.getDay();
            if (dayOfWeekEnd === 0 || dayOfWeekEnd === 6) {
                setError('Les réservations ne sont pas autorisées le samedi et le dimanche.');
                setLoading(false);
                return;
            }
            if (dStart.getHours() < HOURS_START || dEnd.getHours() > HOURS_END || (dEnd.getHours() === HOURS_END && dEnd.getMinutes() > 0)) {
                setError(`Les réservations sont limitées entre ${HOURS_START}h et ${HOURS_END}h.`);
                setLoading(false);
                return;
            }
            const durationMs = dEnd - dStart;
            if (durationMs < 60 * 60 * 1000) {
                setError('La durée minimale d\'une réservation est de 1 heure.');
                setLoading(false);
                return;
            }
            await onSubmit({ titre, description, debut, fin }, reservation?.id);
            onClose();
        } catch (err) {
            setError(err.message || 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Supprimer cette réservation ?')) return;
        setLoading(true);
        try {
            await onDelete(reservation.id);
            onClose();
        } catch (err) {
            setError(err.message || 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {reservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
                </h3>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} required
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
                            <input type="datetime-local" value={debut} onChange={e => setDebut(e.target.value)} required
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                            <input type="datetime-local" value={fin} onChange={e => setFin(e.target.value)} required
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        {reservation && (
                            <button type="button" onClick={handleDelete} disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50">
                                Supprimer
                            </button>
                        )}
                        <div className="flex-1" />
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                            Annuler
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                            {loading ? '...' : reservation ? 'Modifier' : 'Réserver'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Modal consultation (lecture seule) ─────────────
const DetailModal = ({ isOpen, onClose, reservation }) => {
    if (!isOpen || !reservation) return null;

    const formatDT = (str) => {
        const d = new Date(str);
        return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' à ' + formatTime(d);
    };

    // Extraire prénom/nom depuis l'email du créateur
    const extractName = (email) => {
        if (!email) return 'Inconnu';
        const [first, last] = email.split('@')[0].replace(/\d+/g, '').split(/[.-]/);
        const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
        return `${cap(first)} ${cap(last)}`.trim();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Détails de la réservation</h3>
                <div className="space-y-3">
                    <div>
                        <span className="text-sm text-gray-500">Titre</span>
                        <p className="font-semibold text-gray-900">{reservation.titre}</p>
                    </div>
                    {reservation.description && (
                        <div>
                            <span className="text-sm text-gray-500">Description</span>
                            <p className="text-gray-700">{reservation.description}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-sm text-gray-500">Début</span>
                            <p className="text-gray-700 capitalize">{formatDT(reservation.debut)}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Fin</span>
                            <p className="text-gray-700 capitalize">{formatDT(reservation.fin)}</p>
                        </div>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Réservé par</span>
                        <p className="font-medium text-gray-900">{extractName(reservation.email)}</p>
                        <p className="text-xs text-gray-400">{reservation.email}</p>
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Pastille réservation ───────────────────────────
const EventPill = ({ event, onClick }) => (
    <div
        onClick={(e) => { e.stopPropagation(); onClick(event); }}
        className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-blue-700 mt-0.5"
        title={`${event.titre} (${formatTime(new Date(event.debut))} - ${formatTime(new Date(event.fin))})`}
    >
        {formatTime(new Date(event.debut))} {event.titre}
    </div>
);

// ─── Vue Année (JS pur) ────────────────────────────
const YearView = ({ year, onChangeYear, onClickMonth }) => {
    const today = new Date();

    const buildMonth = (monthIndex) => {
        const first = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0).getDate();
        // lundi = 0
        let startDay = (first.getDay() + 6) % 7;
        const cells = [];
        for (let i = 0; i < startDay; i++) cells.push(null);
        for (let d = 1; d <= lastDay; d++) cells.push(d);
        return cells;
    };

    const isToday = (monthIndex, day) =>
        day && today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day;

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={() => onChangeYear(year - 1)} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">‹</button>
                    <button onClick={() => onChangeYear(year + 1)} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">›</button>
                    <button onClick={() => onChangeYear(today.getFullYear())} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">Aujourd'hui</button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
            </div>
            {/* Grid 12 mois */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MONTHS.map((name, mi) => (
                    <div key={mi} className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => onClickMonth(year, mi)}>
                        <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-900 text-sm text-center">{name}</div>
                        <div className="p-2">
                            <div className="grid grid-cols-7 gap-px mb-1">
                                {DAYS_SHORT.map(d => <div key={d} className="text-[10px] text-center font-semibold text-gray-500 uppercase">{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-px">
                                {buildMonth(mi).map((day, i) => (
                                    <div key={i} className={`text-xs text-center py-0.5 rounded ${day ? 'text-gray-700' : ''} ${isToday(mi, day) ? 'bg-yellow-300 font-bold text-gray-900' : ''}`}>
                                        {day || ''}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Vue Jour avec heures (JS pur) ─────────────────
const DayView = ({ date, onChangeDate, reservations, onClickEvent, onClickSlot }) => {
    const today = new Date();

    const formatDate = (d) => {
        const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return d.toLocaleDateString('fr-FR', opts);
    };

    const prevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); onChangeDate(d); };
    const nextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); onChangeDate(d); };
    const goToday = () => onChangeDate(new Date());

    const isToday = date.toDateString() === today.toDateString();
    const nowHour = today.getHours();
    const nowMin = today.getMinutes();
    const showIndicator = isToday && nowHour >= HOURS_START && nowHour < HOURS_END;
    const indicatorTop = showIndicator ? ((nowHour - HOURS_START) * 60 + nowMin) / ((HOURS_END - HOURS_START) * 60) * 100 : -1;

    const hours = [];
    for (let h = HOURS_START; h < HOURS_END; h++) hours.push(h);

    // Réservations du jour
    const dayEvents = reservations.filter(r => {
        const rd = new Date(r.debut);
        return isSameDay(rd, date);
    });

    // Position et hauteur d'un événement
    const getEventStyle = (event) => {
        const start = new Date(event.debut);
        const end = new Date(event.fin);
        const startMin = (start.getHours() - HOURS_START) * 60 + start.getMinutes();
        const endMin = (end.getHours() - HOURS_START) * 60 + end.getMinutes();
        const totalMin = (HOURS_END - HOURS_START) * 60;
        return {
            top: `${(startMin / totalMin) * 100}%`,
            height: `${(Math.max(endMin - startMin, 15) / totalMin) * 100}%`,
        };
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={prevDay} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">‹</button>
                    <button onClick={nextDay} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">›</button>
                    <button onClick={goToday} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">Aujourd'hui</button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{formatDate(date)}</h2>
            </div>
            {/* Grille horaire */}
            <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                {hours.map(h => (
                    <div key={h} className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onClickSlot(new Date(date.getFullYear(), date.getMonth(), date.getDate(), h))}>
                        <div className="w-16 shrink-0 text-right pr-3 py-3 text-xs text-gray-500 font-medium border-r border-gray-200">
                            {pad(h)}:00
                        </div>
                        <div className="flex-1 min-h-[3rem]" />
                    </div>
                ))}
                {/* Événements */}
                {dayEvents.map(event => (
                    <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); onClickEvent(event); }}
                        className="absolute left-16 right-2 bg-blue-600 text-white rounded px-2 py-1 text-xs cursor-pointer hover:bg-blue-700 overflow-hidden"
                        style={getEventStyle(event)}
                    >
                        <div className="font-semibold truncate">{event.titre}</div>
                        <div className="opacity-80">{formatTime(new Date(event.debut))} - {formatTime(new Date(event.fin))}</div>
                    </div>
                ))}
                {/* Indicateur heure actuelle */}
                {showIndicator && (
                    <div className="absolute left-16 right-0 pointer-events-none" style={{ top: `${indicatorTop}%` }}>
                        <div className="border-t-2 border-red-500 relative">
                            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Vue Mois (JS pur) ─────────────────────────────
const MonthView = ({ date, onChangeDate, onClickDay, reservations, onClickEvent }) => {
    const today = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const prevMonth = () => onChangeDate(new Date(year, month - 1, 1));
    const nextMonth = () => onChangeDate(new Date(year, month + 1, 1));
    const goToday = () => onChangeDate(new Date());

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startDay = (firstDay.getDay() + 6) % 7; // lundi = 0

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = startDay - 1; i >= 0; i--) cells.push({ day: prevMonthLastDay - i, current: false });
    for (let d = 1; d <= lastDay; d++) cells.push({ day: d, current: true });
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) cells.push({ day: i, current: false });
    }

    const isToday = (d) => d.current && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d.day;
    const isPast = (d) => {
        if (!d.current) return false;
        const cellDate = new Date(year, month, d.day);
        return cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    // Réservations pour un jour donné
    const getEventsForDay = (day) => {
        if (!day) return [];
        return reservations.filter(r => {
            const rd = new Date(r.debut);
            return isSameDay(rd, new Date(year, month, day));
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">‹</button>
                    <button onClick={nextMonth} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">›</button>
                    <button onClick={goToday} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">Aujourd'hui</button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{MONTHS[month]} {year}</h2>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50">
                    {DAYS_SHORT.map(d => (
                        <div key={d} className="py-2 text-center text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {cells.map((cell, i) => {
                        const events = cell.current ? getEventsForDay(cell.day) : [];
                        return (
                            <div
                                key={i}
                                onClick={() => cell.current && onClickDay(new Date(year, month, cell.day))}
                                className={`min-h-20 p-2 border-b border-r border-gray-200 transition-colors hover:bg-gray-50 cursor-pointer
                                    ${!cell.current ? 'text-gray-300' : 'text-gray-700'}
                                    ${isToday(cell) ? 'bg-yellow-50' : ''}
                                    ${isPast(cell) ? 'bg-gray-50/50' : ''}`}
                            >
                                <span className={`text-sm font-medium ${isToday(cell) ? 'bg-blue-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center' : ''}`}>
                                    {cell.day}
                                </span>
                                {events.slice(0, 2).map(ev => (
                                    <EventPill key={ev.id} event={ev} onClick={onClickEvent} />
                                ))}
                                {events.length > 2 && (
                                    <div className="text-xs text-gray-500 mt-0.5">+{events.length - 2} autres</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Vue Semaine (JS pur) ───────────────────────────
const WeekView = ({ date, onChangeDate, onClickDay, reservations, onClickEvent }) => {
    const today = new Date();

    const getMonday = (d) => {
        const day = d.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        const monday = new Date(d);
        monday.setDate(d.getDate() + diff);
        return monday;
    };

    const monday = getMonday(date);

    const prevWeek = () => { const d = new Date(date); d.setDate(d.getDate() - 7); onChangeDate(d); };
    const nextWeek = () => { const d = new Date(date); d.setDate(d.getDate() + 7); onChangeDate(d); };
    const goToday = () => onChangeDate(new Date());

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }

    const isToday = (d) => d.toDateString() === today.toDateString();
    const isPast = (d) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const formatRange = () => {
        const first = days[0];
        const last = days[6];
        if (first.getMonth() === last.getMonth()) {
            return `${first.getDate()} – ${last.getDate()} ${MONTHS[first.getMonth()]} ${first.getFullYear()}`;
        }
        return `${first.getDate()} ${MONTHS[first.getMonth()]} – ${last.getDate()} ${MONTHS[last.getMonth()]} ${last.getFullYear()}`;
    };

    const getEventsForDay = (d) => reservations.filter(r => isSameDay(new Date(r.debut), d));

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={prevWeek} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">‹</button>
                    <button onClick={nextWeek} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">›</button>
                    <button onClick={goToday} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">Aujourd'hui</button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{formatRange()}</h2>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7">
                    {days.map((d, i) => {
                        const events = getEventsForDay(d);
                        return (
                            <div
                                key={i}
                                onClick={() => onClickDay(d)}
                                className={`min-h-32 p-3 border-r border-gray-200 transition-colors hover:bg-gray-50 cursor-pointer
                                    ${isToday(d) ? 'bg-yellow-50' : ''}
                                    ${isPast(d) ? 'bg-gray-50/50' : ''}`}
                            >
                                <div className="text-center mb-2">
                                    <div className="text-xs font-semibold text-gray-500 uppercase">{DAYS_SHORT[i]}</div>
                                    <span className={`text-lg font-medium ${isToday(d) ? 'bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center' : 'text-gray-700'}`}>
                                        {d.getDate()}
                                    </span>
                                </div>
                                {events.slice(0, 3).map(ev => (
                                    <EventPill key={ev.id} event={ev} onClick={onClickEvent} />
                                ))}
                                {events.length > 3 && (
                                    <div className="text-xs text-gray-500 mt-0.5">+{events.length - 3} autres</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Composant principal ────────────────────────────
const Calendar = () => {
    const { user } = useAuth();
    const [view, setView] = useState('month');
    const [yearViewYear, setYearViewYear] = useState(new Date().getFullYear());
    const [dayViewDate, setDayViewDate] = useState(new Date());
    const [monthViewDate, setMonthViewDate] = useState(new Date());
    const [weekViewDate, setWeekViewDate] = useState(new Date());

    // Réservations
    const [reservations, setReservations] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [defaultDate, setDefaultDate] = useState(null);

    // Charger les réservations
    const loadReservations = useCallback(async () => {
        try {
            const data = await reservationService.getAll();
            setReservations(data.reservations || []);
        } catch (err) {
            console.error('Erreur chargement réservations:', err);
        }
    }, []);

    useEffect(() => { loadReservations(); }, [loadReservations]);

    // CRUD
    const handleSubmit = async (formData, id) => {
        if (id) {
            await reservationService.update(id, formData);
        } else {
            await reservationService.create(formData);
        }
        await loadReservations();
    };

    const handleDelete = async (id) => {
        await reservationService.delete(id);
        await loadReservations();
    };

    // Ouvrir modal pour créer
    const openCreateModal = (date) => {
        setSelectedReservation(null);
        setDefaultDate(date || new Date());
        setModalOpen(true);
    };

    // Ouvrir modal pour modifier ou consulter
    const openEditModal = (event) => {
        setSelectedReservation(event);
        setDefaultDate(null);
        if (event.users_id === user?.id) {
            setModalOpen(true);
        } else {
            setDetailOpen(true);
        }
    };

    // Navigation
    const handleClickMonth = useCallback((y, m) => {
        setMonthViewDate(new Date(y, m, 1));
        setView('month');
    }, []);

    const handleClickDay = useCallback((d) => {
        setDayViewDate(new Date(d));
        setView('day');
    }, []);

    const btnClass = useCallback((v) =>
        `px-3 py-1.5 rounded font-medium transition ${view === v ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`
        , [view]);

    return (
        <div className="w-full">
            {/* Boutons de vue + Nouveau */}
            <div className="flex justify-between items-center gap-2 mb-4 flex-wrap">
                <button
                    onClick={() => openCreateModal(dayViewDate)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 font-medium transition"
                >
                    + Réserver
                </button>
                <div className="flex gap-1">
                    <button onClick={() => setView('year')} className={btnClass('year')}>Année</button>
                    <button onClick={() => setView('month')} className={btnClass('month')}>Mois</button>
                    <button onClick={() => setView('week')} className={btnClass('week')}>Semaine</button>
                    <button onClick={() => setView('day')} className={btnClass('day')}>Jour</button>
                </div>
            </div>

            {/* Vues */}
            {view === 'year' && <YearView year={yearViewYear} onChangeYear={setYearViewYear} onClickMonth={handleClickMonth} />}
            {view === 'month' && <MonthView date={monthViewDate} onChangeDate={setMonthViewDate} onClickDay={handleClickDay} reservations={reservations} onClickEvent={openEditModal} />}
            {view === 'week' && <WeekView date={weekViewDate} onChangeDate={setWeekViewDate} onClickDay={handleClickDay} reservations={reservations} onClickEvent={openEditModal} />}
            {view === 'day' && <DayView date={dayViewDate} onChangeDate={setDayViewDate} reservations={reservations} onClickEvent={openEditModal} onClickSlot={openCreateModal} />}

            {/* Modal édition */}
            <ReservationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                reservation={selectedReservation}
                defaultDate={defaultDate}
            />

            {/* Modal consultation */}
            <DetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                reservation={selectedReservation}
            />
        </div>
    );
};

export default Calendar;
