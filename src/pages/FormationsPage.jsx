import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardFormation from '../components/Card/CardFormation';
import CallToAction from '../components/CallToAction';
import FiltreCat from '../components/Items/FiltreCat';
import { hero, catalogue, catalogueCourtes } from '../data/formations';
import { Filter, HardDrive, Code, Brain, Users, Calculator, Briefcase, Cpu } from 'lucide-react';

// ── Icônes associées aux nouveaux domaines ──────────────────────────────────────
const domainIcons = {
  'cybersecurite-reseaux': <HardDrive className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'ia-data': <Brain className="w-6 h-6" />,
  'ressources-humaines': <Users className="w-6 h-6" />,
  'comptabilite-gestion': <Calculator className="w-6 h-6" />,
  'relation-client': <Briefcase className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

// ── Nouveaux domaines plus précis ───────────────────────────────────────────────
const domains = [
  {
    id: 'cybersecurite-reseaux',
    label: 'Cybersécurité & Réseaux',
    description: "Protection des données et infrastructures.",
    categoryIds: ['cybersecurite-reseaux'],
  },
  {
    id: 'digital-developpement',
    label: 'Développement Web',
    description: "Conception d'applications et de sites modernes.",
    categoryIds: ['digital-developpement'],
  },
  {
    id: 'ia-data',
    label: 'Intelligence Artificielle',
    description: "Maîtrise des outils de demain.",
    categoryIds: ['ia-data'],
  },
  {
    id: 'ressources-humaines',
    label: 'Ressources Humaines',
    description: "Gestion du capital humain et carrières.",
    categoryIds: ['ressources-humaines'],
  },
  {
    id: 'comptabilite-gestion',
    label: 'Comptabilité & Gestion',
    description: "Expertise financière et administrative.",
    categoryIds: ['comptabilite-gestion'],
  },
];

export default function FormationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDomain, setActiveDomain] = useState('all');
  const location = useLocation();

  // Scroll vers l'ancre si présente dans l'URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveDomain(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [location.hash]);

  // Filtrage des formations
  const filteredCatalogue = useMemo(() => {
    return catalogue.map(cat => {
      const filteredItems = cat.items.filter(item => 
        item.titre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...cat, items: filteredItems };
    }).filter(cat => cat.items.length > 0);
  }, [searchTerm]);

  // Regroupement par domaines pour l'affichage
  const domainsWithData = useMemo(() => {
    const data = domains.map(domain => {
      const categories = domain.categoryIds
        .map(catId => filteredCatalogue.find(c => c.id === catId))
        .filter(Boolean);
      
      return { ...domain, categories };
    }).filter(d => d.categories.length > 0);

    // Ajouter les catégories qui ne sont pas dans les domaines définis
    const matchedCategoryIds = domains.flatMap(d => d.categoryIds);
    const otherCategories = filteredCatalogue.filter(c => !matchedCategoryIds.includes(c.id));
    
    if (otherCategories.length > 0) {
      data.push({
        id: 'autres',
        label: 'Autres formations',
        description: "Découvrez nos autres spécialités.",
        categories: otherCategories,
        icon: <Filter className="w-6 h-6" />
      });
    }

    return data;
  }, [filteredCatalogue]);

  return (
    <div className="bg-surface min-h-screen antialiased">

      {/* --- HERO --- */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      {/* --- BREADCRUMB --- */}
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Formations' }]} />

      {/* ===== FILTRE & RECHERCHE ===== */}
      <FiltreCat
        categories={domainsWithData.map(d => ({
          id: d.id,
          label: d.label,
          icon: domainIcons[d.id] || d.icon || <Filter className="w-3.5 h-3.5" />,
        }))}
        activeCat={activeDomain}
        setActiveCat={setActiveDomain}
        allValue="all"
        allLabel="Tous les domaines"
        sectionLabel="Domaines"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Rechercher une formation…"
      />

      {/* ===== CONTENU DES DOMAINES ===== */}
      <div className="space-y-4 py-12">
        {domainsWithData.length > 0 ? (
          domainsWithData
            .filter(domain => activeDomain === 'all' || activeDomain === domain.id)
            .map((domain) => (
              <section key={domain.id} id={domain.id} className="scroll-mt-[180px] animate-fade-in">
                
                {/* Header de domaine */}
                <div className="max-w-container-3xl mx-auto px-6 mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                      {domainIcons[domain.id] || domain.icon || <Filter className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                        {domain.label}
                      </h2>
                      <p className="text-content-muted text-sm font-body">{domain.description}</p>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gray-100"></div>
                </div>

                {/* Catégories du domaine */}
                {domain.categories.map((category) => (
                  <div key={category.id} className="mb-20 px-6">
                    <div className="max-w-container-3xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {category.items.map((item, idx) => (
                          <CardFormation
                            key={idx}
                            title={item.titre}
                            image={item.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800"}
                            points={item.features}
                            variant="white"
                            href={item.href}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucune formation trouvée</h3>
            <p className="text-content-muted">Essayez d'ajuster vos critères de recherche ou de changer de domaine.</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveDomain('all');}}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* ===== FORMATIONS COURTES / E-LEARNING ===== */}
      <div id="formations-courtes" className="scroll-mt-[180px] py-12 bg-primary/5">
        <div className="max-w-container-3xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                E-Learning & Formations Courtes
              </h2>
              <p className="text-content-muted text-sm font-body">
                Formations spécialisées courtes pour monter rapidement en compétences.
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {catalogueCourtes.map((category) => (
          <div key={category.id} className="mb-10 px-6">
            <div className="max-w-container-3xl mx-auto">
              <h3 className="font-heading text-lg font-bold text-primary mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full inline-block"></span>
                {category.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, idx) => (
                  <CardFormation
                    key={idx}
                    title={item.titre}
                    image={item.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800"}
                    points={item.features}
                    variant="white"
                    href={item.href}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CTA FINAL --- */}
      <CallToAction
        variante="sombre"
        titre="Besoin d'un conseil personnalisé ?"
        sousTitre="Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée à votre profil et vos financements."
        texteBouton="PRENDRE RENDEZ-VOUS"
        lienBouton="/contact"
      />

    </div>
  );
}