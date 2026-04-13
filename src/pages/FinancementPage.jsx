import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardDesc from '../components/Card/CardDesc';
import CallToAction from '../components/CallToAction';

// Import des données depuis ton fichier JS
import { hero, cpf, opco, poleEmploi, autresSolutions } from '../data/financement';

export default function FinancementsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Financements' }]}
      />

      <main className="py-[60px] px-6 max-w-[1100px] mx-auto flex flex-col gap-8" id="main-content">

        {/* SECTION CPF (Highlight orange + Bouton) */}
        <CardDesc
          title={cpf.titre}
          description={cpf.description}
          highlight={true}
          columns={[
            { label: cpf.howTo.label, items: cpf.howTo.items },
            { label: cpf.amount.label, text: cpf.amount.description }
          ]}
          cta={{ label: cpf.amount.cta, href: cpf.amount.ctaHref }}
        />

        {/* SECTION OPCO (3 colonnes) */}
        <CardDesc
          title={opco.titre}
          description={opco.description}
          columns={opco.columns} // On passe directement le tableau columns du fichier JS
        />

        {/* SECTION POLE EMPLOI (2 colonnes) */}
        <CardDesc
          title={poleEmploi.titre}
          description={poleEmploi.description}
          columns={poleEmploi.columns}
        />

        {/* SECTION AUTRES (3 colonnes) */}
        <CardDesc
          title={autresSolutions.titre}
          columns={autresSolutions.columns}
        />

      </main>

      {/* CTA FINAL */}
      <CallToAction
        variante="claire"
        titre="Besoin d'aide pour votre financement ?"
        sousTitre="Nos conseillers vous accompagnent gratuitement dans le montage de votre dossier et le choix du dispositif adapté."
        texteBouton="Prendre rendez-vous"
        lienBouton="/contact"
      />
    </div>
  );
}