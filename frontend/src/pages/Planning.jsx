import Calendar from '../components/Calendar';

const Planning = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        📅 Planning
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Visualisez et gérez votre planning
                    </p>
                </div>

                {/* Calendrier */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <Calendar />
                </div>
            </div>
        </div>
    );
};

export default Planning;
