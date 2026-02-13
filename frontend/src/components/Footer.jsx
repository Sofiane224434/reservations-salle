// components/Footer.jsx
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {/* Marque */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-3">TechSpace</h3>
                        <p className="text-sm leading-relaxed">
                            Solution de réservation de salles simple et efficace pour les entreprises modernes.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white transition">Accueil</Link></li>
                            <li><Link to="/planning" className="hover:text-white transition">Planning</Link></li>
                            <li><Link to="/profil" className="hover:text-white transition">Profil</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>contact@techspace.com</li>
                            <li>04 91 00 00 00</li>
                            <li>Marseille, France</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs">© {new Date().getFullYear()} TechSpace — La Plateforme_</p>
                    <p className="text-xs">Tous droits réservés</p>
                </div>
            </div>
        </footer>
    );
}
export default Footer;