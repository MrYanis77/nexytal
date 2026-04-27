import formationData from './json/formation.json';

/**
 * Mapping explicite des images locales par ID de formation.
 * Les fichiers se trouvent dans /public/assets/images/
 */
export const imageMap = {
  // ── Cybersécurité & Réseaux ─────────────────────────────────────────────
  'formations-administrateur-dinfrastructures-securisees-ais': '/assets/images/expert_cyber.jpg',
  'formations-technicien-superieur-systemes-et-reseaux': '/assets/images/Terchnicien_reseau.jpg',
  'administrateur-reseaux-netops': '/assets/images/admin_system.jpg',
  'administrateursysteme-devops': '/assets/images/devops.jpg',
  'technicien-reseaux-cybersecurite': '/assets/images/analyst_soc.jpg',
  'formation-initiation-cybersecurite': '/assets/images/expert_cyber.jpg',
  'formation-implementer-politique-cybersecurite': '/assets/images/analyst_soc.jpg',
  'formation-cisco-configuration-administration': '/assets/images/Terchnicien_reseau.jpg',

  // ── Digital & Développement Web ─────────────────────────────────────────
  'formations-developpeur-web-mobile': '/assets/images/concepteur_web.jpg',
  'formations-developpeur-dapplications-multimedia': '/assets/images/designer_app_mobile.jpg',
  'formations-concepteur-developpeur-dapplications': '/assets/images/concepteur_app.jpg',
  'formations-concepteur-designer-ui': '/assets/images/designer_app_mobile.jpg',
  'formations-lead-developpeur-web': '/assets/images/concepteur_app.jpg',
  'formation-intelligence-artificielle': '/assets/images/analyste_data.jpg',
  'formation-python-tosa': '/assets/images/concepteur_app.jpg',
  'formation-responsive-web-design': '/assets/images/concepteur_web.jpg',
  'formation-php': '/assets/images/concepteur_app.jpg',
  'executive-mastere-ingenierie-logiciel': '/assets/images/concepteur_app.jpg',

  // ── RH, Gestion & Comptabilité ──────────────────────────────────────────
  'formations-community-manager': '/assets/images/designer_app_mobile.jpg',
  'formations-assistante-ressources-humaines': '/assets/images/responsable_rh.jpg',
  'formations-assistante-de-direction': '/assets/images/secretaire_5.png',
  'formations-assistante-administratifve': '/assets/images/secretaire_5.png',
  'formations-assistante-commerciale': '/assets/images/secretaire_4.jpg',
  'formations-conseillerere-relation-client-a-distance': '/assets/images/secretaire_1.jpg',
  'formations-secretaire-comptable': '/assets/images/secretaire_2.jpg',
  'gestionnaire-comptable-fiscal': '/assets/images/comptable_1.jpg',
  'formations-comptable-assistant': '/assets/images/comptable2.jpg',
};

// Fallback si un ID n'est pas encore dans le mapping
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800';

// Fonction d'aide pour extraire et formater une formation du JSON
const mapIdToItem = (id) => {
  const data = formationData[id];
  if (!data) return null;
  return {
    // On nettoie le titre pour l'affichage dans les cartes
    titre: data.hero.titre.replace(/^Devenez\s+/i, '').replace(/^Faites votre Formation en\s+/i, ''),
    features: (data.competences || []).slice(0, 3), // On prend au max les 3 premières compétences
    imageUrl: imageMap[id] || data.hero.image || FALLBACK_IMAGE,
    href: `/formation/${id}`
  };
};

export const hero = {
  titre: "Nos formations",
  sousTitre: "Des parcours certifiants adaptés à vos ambitions professionnelles",
  video: "/assets/video/formations/dev-web-mobile.mp4",
};

export const catalogue = [
  {
    id: 'cybersecurite-reseaux',
    label: 'Cybersécurité & Réseaux',
    items: [
      'formations-administrateur-dinfrastructures-securisees-ais',
      'formations-technicien-superieur-systemes-et-reseaux',
      'administrateur-reseaux-netops',
      'administrateursysteme-devops',
      'technicien-reseaux-cybersecurite',
      'formation-initiation-cybersecurite',
      'formation-implementer-politique-cybersecurite',
      'formation-cisco-configuration-administration'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'digital-developpement',
    label: 'Développement Web',
    items: [
      'formations-developpeur-web-mobile',
      'formations-developpeur-dapplications-multimedia',
      'formations-concepteur-developpeur-dapplications',
      'formations-concepteur-designer-ui',
      'formations-lead-developpeur-web',
      'formation-responsive-web-design',
      'formation-php',
      'executive-mastere-ingenierie-logiciel'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'ia-data',
    label: 'Intelligence Artificielle',
    items: [
      'formation-intelligence-artificielle',
      'formation-python-tosa'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'ressources-humaines',
    label: 'Ressources Humaines',
    items: [
      'formations-assistante-ressources-humaines',
      'formations-assistante-de-direction',
      'formations-assistante-administratifve',
      'formations-assistante-commerciale',
      'formations-conseillerere-relation-client-a-distance',
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'comptabilite-gestion',
    label: 'Comptabilité & Gestion',
    items: [
      'formations-community-manager',
      'formations-secretaire-comptable',
      'gestionnaire-comptable-fiscal',
      'formations-comptable-assistant'
    ].map(mapIdToItem).filter(Boolean),
  }
];
