import {
    Scale, Shield, Gavel
} from 'lucide-react';

export const academyModules = [
    {
        id: 'ley527',
        title: "Módulo 1: El Acta de Guerra (WhatsApp vs Email) ⚖️",
        shortTitle: "Defensa Legal",
        icon: Scale,
        description: "Descubre por qué WhatsApp es el mayor riesgo para tu comisión y cómo la Ley 527 es tu mejor escudo.",
        lessons: [
            {
                id: 'falacia-screenshot',
                title: "La Falacia de la Captura de Pantalla",
                content: `
                    ¡Hola! Vamos a empezar por lo más importante. Muchos colegas creen que una captura de pantalla de **WhatsApp** es una prueba reina. **Grave error.**
                    
                    En derecho digital, WhatsApp se considera una "prueba volátil". ¿Por qué?
                    1. **Alterabilidad:** Se pueden editar mensajes, borrar para todos o incluso manipular con apps de terceros.
                    2. **Dependencia del Dispositivo:** Si pierdes el celular o se daña la base de datos local, la prueba desaparece.
                    3. **Impugnación Fácil:** Un abogado de la contraparte puede alegar que la imagen fue editada (Photoshop) y el juez te exigirá un peritaje forense que cuesta millones.
                    
                    **El Email es diferente.** El correo electrónico deja una huella en servidores independientes (Google, Outlook, VECY) que ni tú ni el cliente pueden borrar después de enviado. Eso se llama **Integridad**.
                `
            },
            {
                id: 'ley-527-equiv',
                title: "Equivalencia Funcional",
                content: `
                    La **Ley 527 de 1999** es nuestra biblia. El **Artículo 6** dice algo potente: *"Cuando cualquier norma requiera que la información conste por escrito, ese requisito quedará satisfecho con un Mensaje de Datos"*.
                    
                    Esto significa que un correo tiene el mismo peso que una carta firmada en notaría. No dejes que te digan que "necesitamos el papel para que sea legal". Si tienes un email donde el cliente acepta tus honorarios, **tienes un contrato vinculante.**
                `
            },
            {
                id: 'caso-50-millones',
                title: "Caso de Estudio: Los $50M Perdidos",
                content: `
                    **Escenario:** Un agente inmobiliario envió la ficha técnica por WhatsApp. El cliente respondió con un emoji de "pulgar arriba" (👍). 
                    
                    **El Conflicto:** El cliente compró directamente con el propietario. El agente demandó el pago de su comisión.
                    
                    **El Fallo:** El juez desestimó la prueba porque el cliente alegó que el emoji era por la foto del inmueble, no por el acuerdo de comisión. Además, el agente no pudo probar que el número de teléfono pertenecía legalmente al cliente en ese momento exacto.
                    
                    **Lección VECY:** Si el agente hubiera enviado un **Email Formal de Presentación**, tendría la trazabilidad de apertura y un texto inequívoco. El "Ok" por correo no deja espacio a interpretaciones.
                `
            }
        ]
    },
    {
        id: 'blindaje',
        title: "Módulo 2: Certificación Técnica y MailSuite 📧",
        shortTitle: "Certificación",
        icon: Shield,
        description: "Aprende a usar la trazabilidad digital como una confesión presunta ante un juez.",
        lessons: [
            {
                id: 'cadena-custodia',
                title: "La Cadena de Custodia Digital",
                content: `
                    Para que una prueba sea contundente, debe ser **inalterable**. 
                    
                    Cuando envías un correo a través de nuestra plataforma, se genera una cadena de custodia:
                    - **Log de Envío:** Hora exacta en que salió de nuestros servidores.
                    - **Pixel de Seguimiento:** Confirmación técnica de que el destinatario abrió el correo.
                    - **Headers del Mensaje:** ADN técnico que prueba que el contenido no ha sido modificado.
                `
            },
            {
                id: 'merito-ejecutivo',
                title: "Convertir un Email en Mérito Ejecutivo",
                content: `
                    ¿Sabías que puedes cobrar tus honorarios sin ir a una audiencia larga si tienes las pruebas correctas?
                    
                    Para que haya **Mérito Ejecutivo**, la obligación debe ser clara, expresa y exigible. 
                    Un email donde dices: *"Mis honorarios son del 3%"* y el cliente responde: *"Acepto condiciones"*, cumple con esto bajo la Ley 527. Es una confesión digital que te ahorra años de pleitos.
                `
            }
        ]
    },
    {
        id: 'practica-ia',
        title: "Módulo 3: Taller Pro con Eddu-AI (IA Redactora) 🤝",
        shortTitle: "Taller de IA",
        icon: Gavel,
        description: "Domina el arte de redactar blindajes jurídicos en segundos usando nuestra Inteligencia Artificial.",
        lessons: [
            {
                id: 'redaccion-blindada',
                title: "Anatomía de un Email Blindado",
                content: `
                    No basta con escribir. Hay que redactar con "veneno jurídico" saludable. 
                    Un correo profesional de VECY debe incluir:
                    1. **Asunto Jurídico:** Referencia clara al inmueble.
                    2. **Identificación de Partes:** Nombres completos.
                    3. **Cita Normativa:** Siempre menciona la Ley 527 o el Código de Comercio.
                    4. **Cláusula de Validez:** Avisar que el mensaje es vinculante.
                    
                    **Truco de Experto:** Usa a Eddu-AI para que lo haga por ti. Solo dale los datos y él estructurará las cláusulas necesarias.
                `
            },
            {
                id: 'presentacion-colegas',
                title: "Acuerdos de Puntas con Colegas",
                content: `
                    El mayor dolor de cabeza: "Me saltó el colega". 
                    
                    Nunca compartas una punta sin enviar primero el **Acuerdo de Compartición de Comisión**. 
                    Usa nuestra IA generadora de correos seleccionando "Acuerdo de Puntas". Este documento especifica que la información es confidencial y que la comisión se divide 50/50. Si el colega te salta, el email es tu prueba para demandar tu parte.
                `
            }
        ]
    }
];

export const quizData = {
    timeLimit: 600, // 10 minutes in seconds
    passingScore: 80, // Percentage
    questions: [
        {
            id: 1,
            question: "¿Qué artículo de la Ley 527 de 1999 establece la 'Equivalencia Funcional' del mensaje de datos?",
            options: ["Artículo 1", "Artículo 6", "Artículo 10", "Artículo 2"],
            correct: 1
        },
        {
            id: 2,
            question: "¿Por qué se considera a WhatsApp una 'prueba volátil' en un proceso judicial?",
            options: [
                "Por su bajo costo de uso.",
                "Porque los mensajes pueden ser editados o eliminados sin dejar rastro en servidores independientes.",
                "Porque requiere conexión a internet.",
                "Porque los jueces no usan WhatsApp."
            ],
            correct: 1
        },
        {
            id: 3,
            question: "Para que un email tenga 'Mérito Ejecutivo', la obligación debe ser:",
            options: [
                "Escrita, firmada y sellada.",
                "Clara, expresa y exigible.",
                "Larga, detallada y compleja.",
                "Enviada por correo físico únicamente."
            ],
            correct: 1
        },
        {
            id: 4,
            question: "¿Cuál es la principal ventaja probatoria del correo electrónico sobre WhatsApp?",
            options: [
                "Es más rápido.",
                "Permite enviar archivos más pesados.",
                "Deja una huella en servidores independientes (inmutabilidad).",
                "Tiene mejores emojis."
            ],
            correct: 2
        },
        {
            id: 5,
            question: "¿Qué es la 'Conducta Concluyente' en el Código de Comercio?",
            options: [
                "Un comportamiento que indica aceptación tácita de un acuerdo.",
                "Una forma de terminar un contrato.",
                "Un tipo de firma digital.",
                "Un requisito para registrarse en VECY."
            ],
            correct: 0
        },
        {
            id: 6,
            question: "¿Qué permite probar un Pixel de Seguimiento (Tracker) en un email?",
            options: [
                "El contenido del mensaje.",
                "La identidad del remitente.",
                "La confirmación técnica de apertura por el destinatario.",
                "El valor de la propiedad."
            ],
            correct: 2
        },
        {
            id: 7,
            question: "Según el Artículo 10 de la Ley 527, ¿un juez puede negar fuerza obligatoria a un mensaje por ser digital?",
            options: [
                "Sí, siempre que no tenga firma física.",
                "No, no se puede negar eficacia por el solo hecho de ser un mensaje de datos.",
                "Solo en casos de arriendo.",
                "Si el abogado de la contraparte lo solicita."
            ],
            correct: 1
        },
        {
            id: 8,
            question: "¿Qué documento debe enviarse ANTES de compartir una punta con un colega?",
            options: [
                "La escritura del inmueble.",
                "Un WhatsApp informal.",
                "El Acuerdo de Compartición de Comisión (Acuerdo de Puntas).",
                "Un audio de voz explicando el negocio."
            ],
            correct: 2
        },
        {
            id: 9,
            question: "¿Cuál es el riesgo de usar 'Mensajes Efímeros' en negociaciones inmobiliarias?",
            options: [
                "Se gasta más batería.",
                "Se pierde la evidencia y la cadena de custodia en poco tiempo.",
                "Son más difíciles de leer.",
                "El cliente se molesta."
            ],
            correct: 1
        },
        {
            id: 10,
            question: "En VECY, ¿cuál es el porcentaje de aprobación para obtener la certificación?",
            options: [
                "50%",
                "70%",
                "80%",
                "100%"
            ],
            correct: 2
        }
    ]
};
