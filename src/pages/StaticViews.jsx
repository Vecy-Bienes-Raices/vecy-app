import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Server } from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';

export const LegalView = () => (
    <PageTransition>
        <div className="min-h-screen pt-24 px-6 pb-12 w-full bg-[#050505]">
            <Link to="/" className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver</Link>
            <div className="max-w-4xl mx-auto bg-[#1c1c1c] p-12 rounded-sm border border-[#333] shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-white mb-8 border-b border-[#333] pb-6 flex items-center gap-3"><Scale className="w-8 h-8 text-[#d4af37]" /> Aviso Legal</h1>
                <div className="space-y-8 text-gray-400 text-sm leading-7 text-justify">
                    <p><strong>1. RESPALDO PROFESIONAL Y NATURALEZA DEL SITIO:</strong> Nuestro agente virtual, "Eddu AI", ha sido rigurosamente entrenado con los mejores fundamentos y jurisprudencia colombiana, enfocándose de manera exclusiva en el <strong>Derecho Inmobiliario y Comercial</strong>. Queremos ser enfáticos: si bien Eddu AI es una herramienta tecnológica de vanguardia, <strong>todas sus directrices y parámetros operativos operan bajo la supervisión y validación constante de nuestro equipo jurídico humano</strong>. Nuestro equipo interdisciplinario en VECY BIENES RAÍCES concibió y desarrolló VECY ACADEMIA con un propósito claro: empoderar tecnológicamente al agente inmobiliario, dotándolo de un ecosistema legal plenamente seguro que amalgama el máximo rigor del conocimiento técnico con el respaldo irrestricto de abogados titulados y en ejercicio.</p>

                    <p><strong>2. USO DE HERRAMIENTAS IA Y CONTRASTE DE INFORMACIÓN:</strong> El "Redactor Jurídico IA" orienta y genera documentos preliminares sumamente persuasivos. No obstante, fomentamos el análisis crítico: <strong>los usuarios tienen absoluta libertad y derecho de someter cualquier planteamiento o escrito sugerido por Eddu AI al escrutinio y revisión de otro abogado independiente</strong> para comprobar su veracidad, exactitud o, dado el caso, denegar su aplicabilidad a un contexto singular. El envío final de cualquier requerimiento generado por la plataforma es potestad y responsabilidad indelegable del agente.</p>

                    <p><strong>3. NUESTRO ENFOQUE: MEDIACIÓN, SOLUCIONES PRONTAS Y HONORARIOS JUSTOS:</strong> Como firma de abogados innovadora, nuestro objetivo central es la mediación ágil. Intervenimos con notificaciones judiciales mediante <strong>correo certificado</strong> para procurar que las contrapartes asuman los pagos adeudados, borrar historiales negativos en centrales de riesgo, reducir deudas al máximo o hacer valer prescripciones y cláusulas penales. Nuestra meta es <strong>solucionar conflictos antes de instaurar sentidas y costosas demandas judiciales</strong>. Precisamente por priorizar este escenario mediatorio tecnológico, nuestros honorarios son altamente solidarios y competitivos (rondan entre el 10% y el 15%, inferior al estándar que supera el 20%), poniendo un respaldo jurídico poderoso al alcance del bolsillo de cualquier corredor.</p>

                    <p><strong>4. EFICACIA PROBATORIA (LEY 527):</strong> La firmeza de nuestras actuaciones se soporta técnica y legalmente en el <strong>Principio de Equivalencia Funcional (Ley 527 de 1999)</strong>. Los requerimientos vehiculizados a través de nuestro blindaje digital no son meros "correos electrónicos", sino plena prueba documental lícita que servirá de soporte irrefutable ante una eventual escala judicial frente a los infractores.</p>

                    <p><strong>5. PROPIEDAD INTELECTUAL Y RÉGIMEN DISPLICENTE:</strong> Las lógicas del "Redactor IA", los manuales de la Academia, marcas y códigos fuente son patrimonio inalienable de VECY. Su replicación o uso no autorizado en otras plataformas será perseguido legalmente. Todas las relaciones que emerjan bajo la sombrilla de este ecosistema se regirán bajo las estrictas leyes y la jurisdicción de la República de Colombia.</p>
                </div>
            </div>
        </div>
    </PageTransition>
);

export const DataPolicyView = () => (
    <PageTransition>
        <div className="min-h-screen pt-24 px-6 pb-12 w-full bg-[#050505]">
            <Link to="/" className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver</Link>
            <div className="max-w-4xl mx-auto bg-[#1c1c1c] p-12 rounded-sm border border-[#333] shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-white mb-8 border-b border-[#333] pb-6 flex items-center gap-3"><Server className="w-8 h-8 text-[#10b981]" /> Política de Datos</h1>
                <div className="space-y-6 text-gray-400 text-sm leading-relaxed text-justify">
                    <p><strong>1. MARCO NORMATIVO:</strong> En estricto cumplimiento de la Ley Estatutaria 1581 de 2012 (Habeas Data) y sus decretos reglamentarios, VECY garantiza la protección y confidencialidad de los datos personales suministrados en la plataforma.</p>
                    <p><strong>2. FINALIDAD DEL TRATAMIENTO:</strong> Los datos aportados serán empleados exclusivamente para: (a) Facilitar el uso de nuestras herramientas educativas y el Redactor Jurídico IA; (b) Enviar lineamientos o actualizaciones de la plataforma; (c) Fomentar nuestra política ambiental de <strong>CERO PAPEL</strong>.</p>
                    <p><strong>3. CONFIDENCIALIDAD DEL REDACTOR IA:</strong> Entendemos el deber de reserva sobre las negociaciones inmobiliarias. Los "Detalles" introducidos en el Generador de Correos (nombres de terceros, montos, direcciones) son procesados por nuestra inteligencia artificial de manera transitoria para construir el documento y no se almacenan para entrenar modelos públicos o infringir el secreto profesional.</p>
                    <p><strong>4. DERECHOS DE LOS TITULARES:</strong> El usuario tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales, así como a revocar la autorización de su tratamiento en cualquier momento.</p>
                    <p><strong>5. CANALES Y ATENCIÓN:</strong> Para ejercer sus derechos correspondientes al Habeas Data, el titular podrá hacer uso de los canales integrados en nuestra plataforma o dirigirse a nuestros medios de contacto electrónicos.</p>
                </div>
            </div>
        </div>
    </PageTransition>
);
