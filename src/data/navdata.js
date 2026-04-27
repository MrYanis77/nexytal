import formationsData from './json/formation.json';

// Mapping local en sécurité au cas où le fichier JSON est écrasé sans les catégories
const categoryMap = {
  // Cybersécurité
  'formations-administrateur-dinfrastructures-securisees-ais': 'cybersecurite-reseaux',
  'formations-technicien-superieur-systemes-et-reseaux': 'cybersecurite-reseaux',
  'administrateur-reseaux-netops': 'cybersecurite-reseaux',
  'administrateursysteme-devops': 'cybersecurite-reseaux',
  'technicien-reseaux-cybersecurite': 'cybersecurite-reseaux',
  'formation-initiation-cybersecurite': 'cybersecurite-reseaux',
  'formation-implementer-politique-cybersecurite': 'cybersecurite-reseaux',
  'formation-cisco-configuration-administration': 'cybersecurite-reseaux',

  // Développement
  'formations-developpeur-web-mobile': 'digital-developpement',
  'formations-developpeur-dapplications-multimedia': 'digital-developpement',
  'formations-concepteur-developpeur-dapplications': 'digital-developpement',
  'formations-concepteur-designer-ui': 'digital-developpement',
  'formations-lead-developpeur-web': 'digital-developpement',
  'formation-responsive-web-design': 'digital-developpement',
  'formation-php': 'digital-developpement',
  'executive-mastere-ingenierie-logiciel': 'digital-developpement',

  // IA
  'formation-intelligence-artificielle': 'ia-data',
  'formation-python-tosa': 'ia-data',

  // RH
  'formations-assistante-ressources-humaines': 'ressources-humaines',
  'formations-assistante-de-direction': 'ressources-humaines',
  'formations-assistante-administratifve': 'ressources-humaines',
  'formations-assistante-commerciale': 'ressources-humaines',
  'formations-conseillerere-relation-client-a-distance': 'ressources-humaines',

  // Compta & Gestion
  'formations-community-manager': 'comptabilite-gestion',
  'formations-secretaire-comptable': 'comptabilite-gestion',
  'gestionnaire-comptable-fiscal': 'comptabilite-gestion',
  'formations-comptable-assistant': 'comptabilite-gestion'
};

// Conversion du JSON en tableau et ajout dynamique de la catégorie si manquante
// On fait également correspondre la structure du JSON (anglais) à celle des composants (français)
export const formationsArray = Object.entries(formationsData).map(([id, data]) => {

  // 1. Adapter stats (value -> valeur) et ajouter des icônes de fallback s'il n'y en a pas
  const statsFormatted = data.stats?.map((stat, idx) => ({
    label: stat.label,
    valeur: stat.valeur || stat.value,
    icon: stat.icon || (idx === 0 ? 'clock' : idx === 1 ? 'medal' : idx === 2 ? 'users' : 'trend')
  }));

  // 2. Adapter programme.modules (title -> titre, duration -> duree, id)
  let programmeFormatted = data.programme;
  if (programmeFormatted && programmeFormatted.modules) {
    programmeFormatted = {
      ...programmeFormatted,
      modules: programmeFormatted.modules.map(mod => ({
        id: mod.id,
        titre: mod.titre || mod.title,
        duree: mod.duree || mod.duration,
        description: mod.description
      }))
    };
  }

  return {
    id,
    categorie: data.categorie || categoryMap[id] || 'autre',
    ...data,
    stats: statsFormatted || data.stats,
    programme: programmeFormatted || data.programme
  };
});

// Filtrage pour récupérer chaque groupe et générer le sous-sous-menu
const getSubMenu = (categoryKey) => {
  return formationsArray
    .filter(f => f.categorie === categoryKey)
    .map(f => ({
      label: f.hero?.titre || f.titre || f.id,
      href: `/formation/${f.id}` // Le lien pointant vers /formation/:id
    }));
};

/**
 * navlinks — Structure de la navigation principale
 */
export const navlinks = [
  {
    label: "Formations",
    href: "/formations",
    submenu: [
      {
        label: "Formations Diplômantes",
        href: "/formations",
        submenu: [
          {
            label: "Cybersécurité",
            href: "/formations#cybersecurite-reseaux",
            submenu: getSubMenu('cybersecurite-reseaux')
          },
          {
            label: "Développement Web",
            href: "/formations#digital-developpement",
            submenu: getSubMenu('digital-developpement')
          },
          {
            label: "IA & Data",
            href: "/formations#ia-data",
            submenu: getSubMenu('ia-data')
          },
          {
            label: "Ressources Humaines",
            href: "/formations#ressources-humaines",
            submenu: getSubMenu('ressources-humaines')
          },
          {
            label: "Gestion & Compta",
            href: "/formations#comptabilite-gestion",
            submenu: getSubMenu('comptabilite-gestion')
          }
        ],
      },
    ],
  },
  { label: "Certifications", href: "/certification" },
  { label: "Financements", href: "/financements" },
  {
    label: "Carrières",
    submenu: [
      {
        label: "Gestion de carrières",
        href: "/gestion-carrieres",
      },
      {
        label: "Coaching emploi",
        href: "/coaching-emploi",
      },
    ],
  },
  {
    label: "Ressources",
    submenu: [
      {
        label: "IA",
        href: "/ressources-ia",
      },
    ],
  },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Nos Campus", href: "/campus" },
  { label: "Contact", href: "/contact" },
  { label: "F.A.Q", href: "/faq" },
];