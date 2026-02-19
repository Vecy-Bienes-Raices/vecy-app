import React from 'react';

const PlaceholderPage = ({ title, content }) => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400">{content}</p>
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
                🚧 Contenido en construcción. Próximamente disponible en la Fase 3.
            </div>
        </div>
    </div>
);

export const Problem = () => <PlaceholderPage title="El Problema Legal" content="Análisis profundo sobre la evasión de comisiones y la informalidad en el sector inmobiliario." />;
export const Solution = () => <PlaceholderPage title="Email Certificado" content="Cómo el correo electrónico se convierte en una prueba legalmente válida en Colombia." />;
export const Tools = () => <PlaceholderPage title="Herramientas Digitales" content="Tutoriales de MailSuite, 4-72 y otras herramientas de certificación." />;
export const Templates = () => <PlaceholderPage title="Generador de Plantillas" content="Herramienta interactiva para crear correos de captación y seguimiento blindados." />;
