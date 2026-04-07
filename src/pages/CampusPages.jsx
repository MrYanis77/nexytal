import React from 'react';
import { campus } from '../data/campus';
import CardFormation from '../components/CardFormation';
import Breadcrumb from '../components/Breadcrumb'; 
import PageCarousel from '../components/PageCarousel'; 

export default function CampusPage() {
  const carouselSlides = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', // Example image
      title: "Nos Campus",
      subtitle: "Retrouvez-nous dans toute l'Île-de-France. Des infrastructures modernes au service de votre réussite.",
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <PageCarousel slides={carouselSlides} />

      {/* Fil d'Ariane */}
      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' }, 
          { label: 'Nos Campus' }
        ]}
      />

      {/* 2. GRILLE DES CAMPUS */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campus.map((item) => (
              <CardFormation
                key={item.id}
                title={item.nom}
                image={item.image}
                // On passe le lien Google Maps à la prop href du composant
                href={item.mapLink}
                points={[
                  item.adresse,
                  "Espaces de coworking modernes",
                  "Accessible en transports en commun",
                  item.id === "val-d-europe" ? "Campus principal (Siège)" : "Centre de formation certifié"
                ]}
                variant="white"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}