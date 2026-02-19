import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Introduction = () => {
    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 overflow-hidden border border-slate-700/50"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-yellow-500/20">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        <span>Curso Certificado Vecy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
                        El Email como <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Arma Legal</span> Inmobiliaria
                    </h1>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Descubre cómo blindar tus comisiones y proteger tu trabajo utilizando herramientas digitales de correo certificado. Aprende a convertir un simple email en una prueba judicial contundente.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/problem"
                            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 transition-all flex items-center space-x-2"
                        >
                            <span>Comenzar Curso</span>
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        icon: AlertTriangle,
                        title: "El Problema",
                        desc: "Clientes que evaden comisiones y propietarios que 'se hacen los locos'.",
                        color: "text-red-400",
                        bg: "bg-red-500/10"
                    },
                    {
                        icon: Shield,
                        title: "La Solución",
                        desc: "El correo electrónico certificado como prueba legal irrefutable.",
                        color: "text-blue-400",
                        bg: "bg-blue-500/10"
                    },
                    {
                        icon: Target,
                        title: "Herramientas",
                        desc: "Domina MailSuite y 4-72 para profesionalizar tu comunicación.",
                        color: "text-green-400",
                        bg: "bg-green-500/10"
                    }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        <div className={`w-12 h-12 ${item.bg} rounded-lg flex items-center justify-center mb-4`}>
                            <item.icon className={item.color} size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Introduction;
