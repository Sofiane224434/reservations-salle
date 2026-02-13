// components/Header.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import logo from '../assets/icons/logo techspace.webp';

function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `relative px-1 py-2 text-sm font-medium transition hover:text-blue-200 ${isActive ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full' : 'text-blue-100'
        }`;

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="shrink-0">
                        <img src={logo} alt="TechSpace" className="h-10" />
                    </Link>

                    {/* Nav desktop */}
                    <nav className="hidden md:flex items-center gap-6">
                        <NavLink to="/" className={navLinkClass}>Accueil</NavLink>
                        {isAuthenticated && (
                            <>
                                <NavLink to="/planning" className={navLinkClass}>Planning</NavLink>
                                <NavLink to="/profil" className={navLinkClass}>Profil</NavLink>
                            </>
                        )}
                    </nav>

                    {/* Actions desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </div>
                                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm px-4 py-1.5 border border-white/30 rounded-lg hover:bg-white/10 transition font-medium"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-blue-200 transition">
                                    Connexion
                                </Link>
                                <Link to="/register" className="text-sm px-4 py-1.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition font-semibold">
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Burger mobile */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10 transition">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {menuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            {menuOpen && (
                <div className="md:hidden border-t border-white/10 px-4 pb-4 space-y-2">
                    <NavLink to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium hover:text-blue-200 transition">Accueil</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/planning" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium hover:text-blue-200 transition">Planning</NavLink>
                            <NavLink to="/profil" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium hover:text-blue-200 transition">Profil</NavLink>
                        </>
                    )}
                    <div className="pt-2 border-t border-white/10">
                        {isAuthenticated ? (
                            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left py-2 text-sm font-medium hover:text-blue-200 transition">
                                Déconnexion ({user?.firstName})
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium hover:text-blue-200 transition">Connexion</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm px-4 py-1 bg-white text-blue-700 rounded-lg font-semibold">S'inscrire</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
export default Header;