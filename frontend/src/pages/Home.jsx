// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* Hero */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Réservez vos salles<br />
                        <span className="text-blue-600">en toute simplicité</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        TechSpace met à votre disposition un outil moderne pour réserver vos salles de réunion, suivre le planning en temps réel et collaborer efficacement.
                    </p>
                    <div className="flex gap-4 justify-center">
                        {isAuthenticated ? (
                            <Link to="/planning" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg">
                                Accéder au Planning
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg">
                                    Commencer gratuitement
                                </Link>
                                <Link to="/login" className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg">
                                    Se connecter
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Fonctionnalités */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tout ce dont vous avez besoin</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Planning interactif</h3>
                            <p className="text-gray-600">Visualisez les disponibilités par jour, semaine, mois ou année. Naviguez intuitivement entre les vues.</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Réservation rapide</h3>
                            <p className="text-gray-600">Réservez en quelques clics directement depuis le calendrier. Détection automatique des conflits de créneaux.</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboratif</h3>
                            <p className="text-gray-600">Consultez les réservations de vos collègues et organisez-vous en équipe sans conflit d'horaires.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* À propos */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">À propos de TechSpace</h2>
                    <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
                        TechSpace est une entreprise spécialisée dans les solutions numériques pour les espaces de travail.
                        Notre mission : simplifier la gestion quotidienne de vos locaux grâce à des outils intuitifs et performants.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-600">500+</div>
                            <div className="text-gray-500 mt-1">Entreprises clientes</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600">15 000+</div>
                            <div className="text-gray-500 mt-1">Réservations par mois</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600">99,9%</div>
                            <div className="text-gray-500 mt-1">Disponibilité</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            {!isAuthenticated && (
                <section className="py-16 px-4 bg-blue-600">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Prêt à simplifier vos réservations ?</h2>
                        <p className="text-blue-100 text-lg mb-8">Rejoignez TechSpace dès maintenant et gagnez du temps au quotidien.</p>
                        <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition text-lg">
                            Créer un compte
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;