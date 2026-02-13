import { useEffect, useRef } from 'react';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

const Calendar = () => {
    const calendarRef = useRef(null);
    const calendarInstanceRef = useRef(null);

    // Initialiser le calendrier
    useEffect(() => {
        if (!calendarRef.current) return;

        const calendar = new FullCalendar(calendarRef.current, {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            locale: frLocale,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
            },
            buttonText: {
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine'
            },
            height: 'auto',
            selectable: true,
            editable: false
        });

        calendar.render();
        calendarInstanceRef.current = calendar;

        // Nettoyage
        return () => {
            if (calendarInstanceRef.current) {
                calendarInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="w-full">
            <div
                ref={calendarRef}
                className="rounded-lg p-4"
            />
        </div>
    );
};

export default Calendar;
