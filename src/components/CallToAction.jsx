import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = ({
    titre,
    sousTitre,

    // Bouton Principal (Requis)
    texteBouton,
    lienBouton = "/contact",

    // Bouton Secondaire (Optionnel)
    texteBoutonSecondaire,
    lienBoutonSecondaire,

    variante = "claire"
}) => {

    const estSombre = variante === "sombre";

    return (
        <section className={`relative py-24 px-6 text-center border-t overflow-hidden ${estSombre
                ? "bg-[#002845] text-white border-navy/10"
                : "bg-[#F9FAFB] text-navy border-gray-100"
            }`}>

            {/* Décoration d'arrière-plan optionnelle pour la version sombre */}
            {estSombre && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            )}

            <div className="max-w-4xl mx-auto relative z-10">
                {/* TITRE */}
                <h2 className={`font-heading text-3xl md:text-[40px] font-extrabold uppercase tracking-tight leading-tight ${sousTitre ? 'mb-6' : 'mb-10'}`}>
                    {titre}
                </h2>

                {/* SOUS-TITRE (Optionnel) */}
                {sousTitre && (
                    <p className={`font-body text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${estSombre ? "text-slate-300" : "text-slate-600"
                        }`}>
                        {sousTitre}
                    </p>
                )}

                {/* ZONE DES BOUTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

                    {/* Bouton Principal (Orange) */}
                    <Link
                        to={lienBouton}
                        className={`w-full sm:w-auto inline-block bg-[#f29242] text-white px-10 py-4 rounded-lg font-heading font-bold transition-all duration-300 shadow-lg hover:shadow-orange/20 hover:-translate-y-1 uppercase tracking-widest text-sm ${estSombre ? "hover:bg-white hover:text-[#f29242]" : "hover:bg-[#e67e22]"
                            }`}
                    >
                        {texteBouton}
                    </Link>

                    {/* Bouton Secondaire (Outline / Transparent) */}
                    {texteBoutonSecondaire && lienBoutonSecondaire && (
                        <Link
                            to={lienBoutonSecondaire}
                            className={`w-full sm:w-auto inline-block px-10 py-4 rounded-lg font-heading font-bold transition-all duration-300 hover:-translate-y-1 uppercase tracking-widest text-sm border-2 ${estSombre
                                    ? "bg-transparent border-white/70 text-white hover:bg-white hover:text-[#002845]"
                                    : "bg-transparent border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-white"
                                }`}
                        >
                            {texteBoutonSecondaire}
                        </Link>
                    )}

                </div>
            </div>
        </section>
    );
};

export default CallToAction;