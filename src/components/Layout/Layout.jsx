import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, X, BookOpen, Shield, Mail, FileText, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-l-4 border-yellow-400'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
            }`
        }
    >
        <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform lg:transform-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Shield className="text-slate-900 w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                            Vecy Legal
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
                    <div className="mb-6">
                        <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Curso
                        </h3>
                        <SidebarItem to="/" icon={BookOpen} label="Introducción" onClick={() => setIsSidebarOpen(false)} />
                        <SidebarItem to="/problem" icon={Shield} label="El Problema Legal" onClick={() => setIsSidebarOpen(false)} />
                        <SidebarItem to="/solution" icon={Mail} label="Email Certificado" onClick={() => setIsSidebarOpen(false)} />
                    </div>

                    <div className="mb-6">
                        <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Herramientas
                        </h3>
                        <SidebarItem to="/tools" icon={Send} label="MailSuite & 4-72" onClick={() => setIsSidebarOpen(false)} />
                        <SidebarItem to="/templates" icon={FileText} label="Generador Plantillas" onClick={() => setIsSidebarOpen(false)} />
                    </div>

                    <div className="mt-8 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50">
                        <h4 className="text-yellow-400 font-semibold mb-1">Eddu-AI Pro</h4>
                        <p className="text-xs text-slate-400 mb-3">Tu asistente legal inmobiliario 24/7 disponible.</p>
                        <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg text-sm transition-colors">
                            Consultar Ahora
                        </button>
                    </div>
                </nav>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                            <Shield className="text-slate-900 w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-100">Vecy Legal</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-slate-800 rounded-lg text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
