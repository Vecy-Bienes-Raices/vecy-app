import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
    const { user } = useAuth();
    // Guardamos exactamente qué plan compró (ej: "abogado_mensual", "redactor_anual")
    const [supportPlan, setSupportPlan] = useState(null);
    const [generatorPlan, setGeneratorPlan] = useState(null);

    const hasPaidSupport = !!supportPlan;
    const hasPaidGenerator = !!generatorPlan;

    // El acceso al curso es true si ha pagado CUALQUIERA de las dos herramientas
    const hasAccessToCourse = hasPaidSupport || hasPaidGenerator;
    // Solo se obsequia certificado descargable a los planes ANUALES
    const hasAccessToCertificate = supportPlan?.includes('anual') || generatorPlan?.includes('anual');

    useEffect(() => {
        // Limpiamos los Storage globales antiguos
        localStorage.removeItem('vecy_sub_support');
        localStorage.removeItem('vecy_sub_generator');

        if (!user) {
            setSupportPlan(null);
            setGeneratorPlan(null);
            return;
        }

        // 1. Buscamos si ESTE usuario específico ya pagó
        const storedSupport = localStorage.getItem(`vecy_sub_support_${user.id}`);
        const storedGenerator = localStorage.getItem(`vecy_sub_generator_${user.id}`);

        // Purge old 'active' values from the previous MVP simulation to prevent false unlocks
        if (storedSupport === 'active') {
            localStorage.removeItem(`vecy_sub_support_${user.id}`);
        } else if (storedSupport) {
            setSupportPlan(storedSupport);
        }

        if (storedGenerator === 'active') {
            localStorage.removeItem(`vecy_sub_generator_${user.id}`);
        } else if (storedGenerator) {
            setGeneratorPlan(storedGenerator);
        }

        // 2. Interceptamos el callback de ePayco en la URL (ej: ?pago=exitoso&plan=abogado_anual)
        const params = new URLSearchParams(window.location.search);
        if (params.get('pago') === 'exitoso') {
            const planParam = params.get('plan');
            if (planParam) {
                processPaymentSuccess(planParam);
            }
            // Limpia la URL para evitar recargas infinitas si refresca la página
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [user]); // Ejecuta cuando cambia el usuario, para recargar sus pagos o procesar el callback si acaba de loguearse rápido.

    const processPaymentSuccess = (planParam) => {
        if (!user) return; // Seguridad extra
        if (planParam.startsWith('abogado')) {
            setSupportPlan(planParam);
            localStorage.setItem(`vecy_sub_support_${user.id}`, planParam);
        } else if (planParam.startsWith('redactor')) {
            setGeneratorPlan(planParam);
            localStorage.setItem(`vecy_sub_generator_${user.id}`, planParam);
        }
    };

    const logout = () => {
        setSupportPlan(null);
        setGeneratorPlan(null);
    };

    return (
        <PaymentContext.Provider value={{
            hasPaidSupport,
            hasPaidGenerator,
            hasAccessToCourse,
            hasAccessToCertificate,
            supportPlan,
            generatorPlan,
            processPaymentSuccess,
            logout
        }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
