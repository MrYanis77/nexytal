/**
 * navlinks — Structure de la navigation principale
 * 
 * Formation dispose d'un dropdown à 2 niveaux :
 *  - E-learning  → lien vers /e-learning + sous-menu des catégories (submenu)
 *  - Présentiel  → lien vers /alternance (ancienne page Alternance)
 * 
 * Les liens secondaires (À propos, Blog, Nos Campus) sont dans le Footer.
 */
export const navlinks = [
  {
    label: "Formation",
    href: "/formations",
    submenu: [
      {
        label: "E-learning",
        href: "/e-learning",
        submenu: [
          { label: "Cybersécurité",      href: "/formations/expert-cybersecurite" },
          { label: "Management",          href: "/formations/management" },
          { label: "Ressources Humaines", href: "/formations/ressources-humaines" },
          { label: "Digital & Marketing", href: "/formations/digitaletmarketing" },
        ],
      },
      {
        label: "Présentiel",
        href: "/alternance",
      },
    ],
  },
  { label: "Financements",    href: "/financements" },
  { label: "Entreprise",      href: "/entreprise" },
  { label: "Certification",   href: "/certification" },
  { label: "Nous rejoindre",  href: "/nous-rejoindre" },
  { label: "Contact",         href: "/contact" },
];