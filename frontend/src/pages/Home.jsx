// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Home() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur l'appli de réservation</h1>
                <div className="flex gap-4 justify-center">
                    {isAuthenticated ? (
                        <Link to="/planning" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                            📅 Accéder au Planning
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                                Commencer
                            </Link>
                            <Link to="/login" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition">
                                Se connecter
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;