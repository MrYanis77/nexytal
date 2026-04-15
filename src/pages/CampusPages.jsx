import React, { useState } from 'react';
import { campus } from '../data/campus';
import CardFormation from '../components/Card/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';

export default function CampusPage() {
  const [activeCampus, setActiveCampus] = useState(campus[0]);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <Hero
        title="Nos Campus"
        subtitle="Retrouvez-nous dans toute l'Île-de-France. Des infrastructures modernes au service de votre réussite."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
      />

      {/* Fil d'Ariane */}
      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Nos Campus' }
        ]}
      />

      {/* 2. GRILLE DES CAMPUS ET CARTE INTERACTIVE */}
      <section className="py-20 px-6 bg-slate-50 relative">
        <div className="max-w-[1400px] mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Découvrez nos infrastructures</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Sélectionnez un campus pour afficher sa localisation exacte et obtenir l'itinéraire.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* Liste des campus */}
            <div className="w-full lg:w-[45%] xl:w-[40%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:max-h-[800px] lg:overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-orange scrollbar-track-orange/10">
              {campus.map((item) => {
                const isActive = activeCampus.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveCampus(item)}
                    className={`cursor-pointer transition-all duration-300 rounded-[24px] ${isActive ? 'shadow-xl scale-[1.02]' : 'hover:-translate-y-1'}`}
                  >
                    <div className="pointer-events-none">
                      <CardFormation
                        title={item.nom}
                        image={item.image}
                        href={item.mapLink}
                        points={[
                          item.adresse,
                          item.mail,
                          item.id === "val-d-europe" ? "Campus principal (Siège)" : "Accessible en transports en commun"
                        ]}
                        variant="white"
                        hideButton={true}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carte Interactive Google Maps */}
            <div className="w-full lg:w-[55%] xl:w-[60%] h-[500px] lg:h-[800px] sticky top-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white relative group">
              {/* Panneau d'information flottant */}
              <div className="absolute bottom-6 left-6 right-6 lg:right-auto z-10 bg-white/95 backdrop-blur-md pb-4 pt-5 px-6 rounded-2xl shadow-lg border border-gray-100 max-w-sm transition-all duration-500 transform group-hover:-translate-y-1">
                <h3 className="font-extrabold text-2xl text-navy mb-2 flex items-center gap-2">
                  {activeCampus.nom}
                </h3>
                <p className="text-sm text-muted font-medium mb-4 flex items-start gap-2">
                  <span className="text-orange mt-0.5 min-w-[16px]">📍</span>
                  {activeCampus.adresse}
                </p>
                <a
                  href={activeCampus.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-orange/10 text-orange font-bold text-sm rounded-xl transition-colors hover:bg-orange hover:text-white"
                  // Re-enabling pointer events for this specific button since parent is pointer-events-none
                  style={{ pointerEvents: 'auto' }}
                >
                  Ouvrir dans Google Maps →
                </a>
              </div>

              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(activeCampus.adresse)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                title={`Carte interactif du campus ${activeCampus.nom}`}
                loading="lazy"
                className="transition-opacity duration-500"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}