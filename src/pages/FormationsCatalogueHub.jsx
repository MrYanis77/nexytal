import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CatalogueFormationsPage from '../components/CatalogueFormationsPage';
import {
  catalogue,
  catalogueCourtes,
  catalogueCertifiantes,
  hero,
  heroCertifiantes,
} from '../data/formations';
import { hero as heroElearning } from '../data/elearning';
import { normalizeCatalogType } from '../data/formationsCatalogTypes';
import {
  HardDrive,
  Code,
  Brain,
  Users,
  Calculator,
  Container,
  Cpu,
  Shield,
  Monitor,
} from 'lucide-react';

const categoryIconsDiplomantes = {
  'cybersecurite-reseaux': <HardDrive className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'ia-data': <Brain className="w-6 h-6" />,
  'ressources-humaines': <Users className="w-6 h-6" />,
  'comptabilite-gestion': <Calculator className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

const categoryIconsCertifiantes = {
  devops: <Container className="w-6 h-6" />,
  devsecops: <Container className="w-6 h-6" />,
};

const categoryIconsElearning = {
  cybersecurite: <Shield className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  management: <Users className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'informatique-systemes-reseaux': <Monitor className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

const TABS = [
  {
    id: 'diplomantes',
    label: 'Diplômantes',
    hint: 'Titres RNCP, présentiel ou alternance',
  },
  {
    id: 'certifiantes',
    label: 'Certifiantes',
    hint: 'Sessions certifiantes inter / intra',
  },
  {
    id: 'elearning',
    label: 'E-Learning',
    hint: 'Modules courts, 100 % à distance',
  },
];

export default function FormationsCatalogueHub() {
  const [searchParams] = useSearchParams();
  const tab = normalizeCatalogType(searchParams.get('type'));

  const bundle = useMemo(() => {
    switch (tab) {
      case 'certifiantes':
        return {
          hero: heroCertifiantes,
          breadcrumb: 'Formations certifiantes',
          catalogue: catalogueCertifiantes,
          categoryIcons: categoryIconsCertifiantes,
          cardTypeBadge: 'Certifiante',
          cta: {
            titre: 'Prêt à décrocher votre certification ?',
            sousTitre:
              'Formations disponibles en Inter ou Intra-Entreprise. Contactez-nous pour planifier une session adaptée à vos besoins.',
            bouton: 'NOUS CONTACTER',
            lien: '/contact',
          },
        };
      case 'elearning':
        return {
          hero: heroElearning,
          breadcrumb: 'E-Learning',
          catalogue: catalogueCourtes,
          categoryIcons: categoryIconsElearning,
          cardTypeBadge: 'E-Learning',
          cta: {
            titre: 'Une formation sur mesure ?',
            sousTitre:
              'Nos conseillers peuvent adapter le contenu et le planning de toute formation courte à votre équipe ou vos besoins spécifiques.',
            bouton: 'NOUS CONTACTER',
            lien: '/contact',
          },
        };
      default:
        return {
          hero,
          breadcrumb: 'Formations diplômantes',
          catalogue,
          categoryIcons: categoryIconsDiplomantes,
          cardTypeBadge: 'Diplômante',
          cta: {
            titre: "Besoin d'un conseil personnalisé ?",
            sousTitre:
              'Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée à votre profil et vos financements.',
            bouton: 'PRENDRE RENDEZ-VOUS',
            lien: '/contact',
          },
        };
    }
  }, [tab]);

  const afterBreadcrumbSlot = (
    <section className="bg-surface border-b border-gray-100">
      <div className="max-w-container-3xl mx-auto px-6 py-6">
        <p className="text-xs font-extrabold text-accent uppercase tracking-widest mb-3">
          Catalogue des formations
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {TABS.map((t) => {
            const active = tab === t.id;
            const to = t.id === 'diplomantes' ? '/formations' : `/formations?type=${t.id}`;

            const content = (
              <>
                <span
                  className={`block font-heading font-extrabold text-sm tracking-wide ${
                    active ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {t.label}
                </span>
                <span className="block text-xs text-content-muted mt-1 leading-snug">{t.hint}</span>
              </>
            );

            if (active) {
              return (
                <div
                  key={t.id}
                  aria-current="page"
                  className="flex-1 rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 shadow-sm ring-2 ring-accent/20"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={t.id}
                to={to}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 no-underline transition-all hover:border-accent/50 hover:bg-orange-50/40"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );

  return (
    <CatalogueFormationsPage
      key={tab}
      hero={bundle.hero}
      breadcrumb={bundle.breadcrumb}
      catalogue={bundle.catalogue}
      categoryIcons={bundle.categoryIcons}
      cta={bundle.cta}
      crossLinks={[]}
      afterBreadcrumbSlot={afterBreadcrumbSlot}
      cardTypeBadge={bundle.cardTypeBadge}
    />
  );
}
