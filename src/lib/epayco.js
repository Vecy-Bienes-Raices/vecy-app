export const openEpaycoCheckout = (user, plan) => {
    // Definimos la info basado en el plan (abogado o redactor, mes o año)
    let p_amount = 0;
    let title = "";
    let description = "";

    if (plan === 'abogado_mensual') {
        p_amount = 199997;
        title = "Suscripción Abogado Eddu AI (Mensual)";
        description = "Acceso a consultoría jurídica inteligente 24/7 y curso Máster.";
    } else if (plan === 'abogado_anual') {
        p_amount = 1999970;
        title = "Suscripción Abogado Eddu AI (Anual)";
        description = "Acceso a consultoría jurídica ilimitada todo el año y curso Máster vitalicio.";
    } else if (plan === 'redactor_mensual') {
        p_amount = 119997;
        title = "Redactor Jurídico VECY (Mensual)";
        description = "Generación de promesas y contratos ilimitados por un mes y curso Máster.";
    } else if (plan === 'redactor_anual') {
        p_amount = 1199970;
        title = "Redactor Jurídico VECY (Anual)";
        description = "Generación de contratos ilimitados todo el año y curso Máster vitalicio.";
    }

    // eslint-disable-next-line no-undef
    const handler = ePayco.checkout.configure({
        key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
        test: import.meta.env.VITE_EPAYCO_TESTING === 'true' || import.meta.env.VITE_EPAYCO_TESTING === 'test' // Activar fase pruebas desde el server
    });

    const data = {
        name: title,
        description: description,
        invoice: `VECY-${Date.now()}`,
        currency: "cop",
        amount: p_amount.toString(),
        tax_base: "0",
        tax: "0",
        country: "co",
        lang: "es",
        external: "false", // Modal interno
        
        // Metadata extra para que en el webhook del backend (Supabase) sepamos a quién activar
        extra1: user?.id || "anon", 
        extra2: plan, 
        extra3: user?.email || "",

        response: `${window.location.origin}/academia?pago=exitoso&plan=${plan}`,
        confirmation: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/epayco-webhook`, // Para cuando backend esté 100% hecho

        // Info prellenada
        email_billing: user?.email || "",
        type_doc_billing: "cc",
    }

    handler.open(data);
};
