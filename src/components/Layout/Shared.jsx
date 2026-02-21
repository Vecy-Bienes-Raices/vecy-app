import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- UTILS ---
export const FormatText = ({ text }) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                    return (
                        <strong key={index} className="text-[#bf953f] font-bold not-italic">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

export const PageTransition = ({ children }) => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                const char = text.charAt(currentIndex);
                setDisplayedText((prev) => prev + char);
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 15);

        return () => clearInterval(intervalId);
    }, [text]);

    return <FormatText text={displayedText} />;
};

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        if (window.history.scrollRestoration) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const detectGender = (name) => {
    if (!name) return 'neutral';
    const n = name.toLowerCase().trim();

    const femaleNames = [
        'maria', 'ana', 'laura', 'diana', 'andrea', 'carolina', 'paola', 'claudia',
        'patricia', 'monica', 'sandra', 'alejandra', 'natalia', 'catalina', 'valentina',
        'isabella', 'sara', 'sofia', 'camila', 'daniela', 'juliana', 'adriana', 'viviana',
        'martha', 'luisa', 'isabel', 'rosa', 'carmen', 'gloria', 'esperanza', 'luz',
        'helena', 'elena', 'manuela', 'paula', 'mariana', 'ximena', 'lorena', 'marcela',
        'lina', 'angela', 'blanca', 'cecilia', 'nora', 'pilar', 'teresa', 'olga',
        'constanza', 'alejandra', 'estefania', 'vanessa', 'yolanda', 'claudia',
        'silvia', 'liliana', 'tatiana', 'fernanda', 'michelle', 'stephanie', 'jennifer'
    ];

    const maleNames = [
        'juan', 'carlos', 'jose', 'luis', 'andres', 'andrés', 'martín', 'martin', 'julian', 'julián', 'jorge', 'miguel', 'david', 'oscar',
        'daniel', 'alberto', 'alejandro', 'pedro', 'ricardo', 'mario', 'hector', 'sergio',
        'pablo', 'gabriel', 'nicolas', 'sebastian', 'santiago', 'camilo', 'cesar',
        'felipe', 'rafael', 'antonio', 'manuel', 'francisco', 'rodrigo', 'ivan', 'john',
        'william', 'christian', 'jaime', 'javier', 'victor', 'edgar', 'wilson', 'henry',
        'alex', 'roberto', 'nelson', 'comando', 'diego', 'alonso', 'bernardo', 'hernan',
        'gilberto', 'giovanny', 'leonardo', 'oliver', 'samuel', 'mateo', 'tomas', 'eduardo'
    ];

    if (femaleNames.includes(n)) return 'female';
    if (maleNames.includes(n)) return 'male';

    if (n.endsWith('a') || n.endsWith('ia') || n.endsWith('ina') || n.endsWith('ela')) return 'female';
    if (n.endsWith('o') || n.endsWith('er') || n.endsWith('el') || n.endsWith('on') ||
        n.endsWith('in') || n.endsWith('és') || n.endsWith('es') || n.endsWith('ín') ||
        n.endsWith('an') || n.endsWith('en') || n.endsWith('us')) return 'male';

    return 'neutral';
};
