import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardFormation from '../components/Card/CardFormation';
import CallToAction from '../components/CallToAction';
import { hero, catalogue } from '../data/formations';
import { Search, Filter, HardDrive, Code, Brain, Users, Calculator, Briefcase } from 'lucide-react';

// ── Icônes associées aux nouveaux domaines ──────────────────────────────────────
const domainIcons = {
  'cybersecurite-reseaux': <HardDrive className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'ia-data': <Brain className="w-6 h-6" />,
  'ressources-humaines': <Users className="w-6 h-6" />,
  'comptabilite-gestion': <Calculator className="w-6 h-6" />,
  'relation-client': <Briefcase className="w-6 h-6" />,
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
      <section className="py-5 bg-white/95 backdrop-blur-md border-b border-border sticky top-[72px] z-30 shadow-[0_4px_24px_-4px_rgba(0,40,69,0.08)]">
        <div className="max-w-container-3xl mx-auto px-6">

          {/* Ligne 1 : recherche + compteur */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
            
            {/* Barre de recherche */}
            <div className="relative flex-1 sm:max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-content-muted group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une formation…"
                className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-surface-soft focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm text-primary font-body outline-none placeholder:text-content-muted"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-muted hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Compteur de résultats */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-content-muted font-body shrink-0">
              <span className="inline-flex items-center justify-center bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">
                {domainsWithData.reduce((acc, d) => acc + d.categories.reduce((a, c) => a + c.items.length, 0), 0)}
              </span>
              formation{domainsWithData.reduce((acc, d) => acc + d.categories.reduce((a, c) => a + c.items.length, 0), 0) > 1 ? 's' : ''}
            </div>
          </div>

          {/* Ligne 2 : chips de domaines */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <span className="shrink-0 text-xs font-semibold text-content-muted uppercase tracking-widest mr-1 hidden md:block">
              Domaines : 
            </span>
            <button
              onClick={() => setActiveDomain('all')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                activeDomain === 'all'
                  ? 'bg-accent text-white border-accent shadow-[0_2px_8px_rgba(243,146,51,0.35)] scale-[1.03]'
                  : 'bg-white text-primary border-border hover:border-accent/50 hover:text-accent hover:bg-accent/5'
              }`}
            >
              Tous les domaines
            </button>

            {/* Séparateur */}
            <div className="w-px h-5 bg-border shrink-0 mx-0.5 hidden md:block" />

            {domainsWithData.map((domain) => {
              const isActive = activeDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(0,40,69,0.25)] scale-[1.03]'
                      : 'bg-white text-primary border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className={`transition-colors ${isActive ? 'text-white' : 'text-content-muted'}`}>
                    {domainIcons[domain.id] 
                      ? <span className="[&>svg]:w-3.5 [&>svg]:h-3.5">{domainIcons[domain.id]}</span>
                      : domain.icon
                        ? <span className="[&>svg]:w-3.5 [&>svg]:h-3.5">{domain.icon}</span>
                        : <Filter className="w-3.5 h-3.5" />
                    }
                  </span>
                  {domain.label}
                </button>
              );
            })}
          </div>

        </div>
      </section>

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