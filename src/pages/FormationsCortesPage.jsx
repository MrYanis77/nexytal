import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardFormation from '../components/Card/CardFormation';
import CallToAction from '../components/CallToAction';
import { catalogueCourtes } from '../data/formations';
import {
  Search,
  Shield,
  Code,
  Users,
  Container,
  Monitor,
  Cpu,
  Filter,
  Clock,
  Zap,
} from 'lucide-react';

const categoryIcons = {
  'cybersecurite': <Shield className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'management': <Users className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'informatique-systemes-reseaux': <Monitor className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

export default function FormationsCortesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCatalogue = useMemo(() => {
    return catalogueCourtes
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.titre.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [searchTerm]);

  const visibleCatalogue = useMemo(() => {
    if (activeCategory === 'all') return filteredCatalogue;
    return filteredCatalogue.filter(c => c.id === activeCategory);
  }, [filteredCatalogue, activeCategory]);

  const totalCount = filteredCatalogue.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="bg-surface min-h-screen antialiased">

      {/* HERO */}
      <Hero
        title="E-Learning & Formations Courtes"
        subtitle="Des formations spécialisées et intensives pour monter rapidement en compétences sur des technologies ciblées."
        video="/assets/video/formations/dev-web-mobile.mp4"
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Formations', to: '/formations' },
          { label: 'E-Learning & Formations Courtes' },
        ]}
      />

      {/* BADGES AVANTAGES */}
      <section className="bg-primary py-8 px-6">
        <div className="max-w-container-3xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
          {[
            { icon: <Clock className="w-5 h-5" />, label: 'Formations courtes', sub: '1 à 5 jours' },
            { icon: <Zap className="w-5 h-5" />, label: 'Mise en pratique', sub: 'TP inclus' },
            { icon: <Shield className="w-5 h-5" />, label: 'Formateurs experts', sub: 'Certifiés' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <div className="bg-accent/20 p-2.5 rounded-xl text-accent">{b.icon}</div>
              <div>
                <p className="font-bold text-sm">{b.label}</p>
                <p className="text-white/60 text-xs">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTRE & RECHERCHE */}
      <section className="py-5 bg-white/95 backdrop-blur-md border-b border-border sticky top-[72px] z-30 shadow-[0_4px_24px_-4px_rgba(0,40,69,0.08)]">
        <div className="max-w-container-3xl mx-auto px-6">

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
            <div className="relative flex-1 sm:max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-content-muted group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une formation…"
                className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-surface-soft focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm text-primary font-body outline-none placeholder:text-content-muted"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-content-muted font-body shrink-0">
              <span className="inline-flex items-center justify-center bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
              formation{totalCount > 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <span className="shrink-0 text-xs font-semibold text-content-muted uppercase tracking-widest mr-1 hidden md:block">
              Domaines :
            </span>
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                activeCategory === 'all'
                  ? 'bg-accent text-white border-accent shadow-[0_2px_8px_rgba(243,146,51,0.35)] scale-[1.03]'
                  : 'bg-white text-primary border-border hover:border-accent/50 hover:text-accent hover:bg-accent/5'
              }`}
            >
              Tous les domaines
            </button>

            <div className="w-px h-5 bg-border shrink-0 mx-0.5 hidden md:block" />

            {catalogueCourtes.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(0,40,69,0.25)] scale-[1.03]'
                    : 'bg-white text-primary border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <span className={`[&>svg]:w-3.5 [&>svg]:h-3.5 transition-colors ${activeCategory === cat.id ? 'text-white' : 'text-content-muted'}`}>
                  {categoryIcons[cat.id] || <Filter className="w-3.5 h-3.5" />}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOGUE */}
      <div className="space-y-4 py-12">
        {visibleCatalogue.length > 0 ? (
          visibleCatalogue.map(cat => (
            <section key={cat.id} id={cat.id} className="scroll-mt-[180px] animate-fade-in">

              <div className="max-w-container-3xl mx-auto px-6 mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    {categoryIcons[cat.id] || <Filter className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                      {cat.label}
                    </h2>
                    <p className="text-content-muted text-sm font-body">{cat.description}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
              </div>

              <div className="mb-20 px-6">
                <div className="max-w-container-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cat.items.map((item, idx) => (
                      <CardFormation
                        key={idx}
                        title={item.titre}
                        image={item.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800'}
                        points={item.features}
                        variant="white"
                        href={item.href}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucune formation trouvée</h3>
            <p className="text-content-muted">Essayez d'ajuster vos critères de recherche.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* LIEN VERS FORMATIONS LONGUES */}
      <section className="py-12 px-6 bg-gray-50 border-y border-border">
        <div className="max-w-container-xl mx-auto text-center">
          <p className="text-content-muted text-sm mb-3 font-body">
            Vous cherchez une formation diplômante longue durée ?
          </p>
          <Link
            to="/formations"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors text-sm"
          >
            Voir toutes nos formations diplômantes →
          </Link>
        </div>
      </section>

      <CallToAction
        variante="sombre"
        titre="Une formation sur mesure ?"
        sousTitre="Nos conseillers peuvent adapter le contenu et le planning de toute formation courte à votre équipe ou vos besoins spécifiques."
        texteBouton="NOUS CONTACTER"
        lienBouton="/contact"
      />
    </div>
  );
}
