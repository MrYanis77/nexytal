<<<<<<< Updated upstream
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navlinks } from "../data/navdata";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/accueil");
  };
=======
import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { navlinks, megaMenuFormations } from "../data/navdata";

// ── Mega Menu Formations ───────────────────────────────────────────────────────
function FormationsMegaMenu({ onMouseEnter, onMouseLeave }) {
  const [activeTab, setActiveTab] = useState("diplomantes");
  const [hoveredCatId, setHoveredCatId] = useState(
    megaMenuFormations.diplomantes[0]?.id
  );
>>>>>>> Stashed changes

  const allCats =
    activeTab === "diplomantes"
      ? megaMenuFormations.diplomantes
      : megaMenuFormations.elearning;

  const currentCat = allCats.find((c) => c.id === hoveredCatId) || allCats[0];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const cats =
      tab === "diplomantes"
        ? megaMenuFormations.diplomantes
        : megaMenuFormations.elearning;
    setHoveredCatId(cats[0]?.id);
  };

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t-[3px] border-accent z-[99] overflow-hidden"
      style={{ maxHeight: "520px" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex" style={{ height: "520px" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-72 bg-[#f8f9fb] border-r border-gray-100 flex flex-col shrink-0">

          {/* Tabs Diplômantes / E-Learning */}
          <div className="p-4 border-b border-gray-100 shrink-0">
            <div className="flex gap-1 bg-gray-200/80 rounded-xl p-1">
              <button
                onClick={() => handleTabChange("diplomantes")}
                className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${
                  activeTab === "diplomantes"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Diplômantes
              </button>
              <button
                onClick={() => handleTabChange("elearning")}
                className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${
                  activeTab === "elearning"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                E-Learning
              </button>
            </div>
          </div>

          {/* Category list */}
          <div className="flex-1 overflow-y-auto py-2">
            {allCats.map((cat) => (
              <button
                key={cat.id}
                onMouseEnter={() => setHoveredCatId(cat.id)}
                onClick={() => setHoveredCatId(cat.id)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm font-bold transition-all border-l-[3px] ${
                  hoveredCatId === cat.id
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-transparent text-primary hover:bg-gray-100 hover:text-accent"
                }`}
              >
                <span className="truncate">{cat.label}</span>
                <span
                  className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    hoveredCatId === cat.id
                      ? "bg-accent text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {cat.formations.length}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="p-4 border-t border-gray-100 shrink-0">
            <Link
              to={activeTab === "diplomantes" ? "/formations" : "/formations-courtes"}
              className="flex items-center justify-between w-full px-4 py-3 bg-primary text-white rounded-xl text-xs font-bold no-underline hover:bg-primary/90 transition-colors"
            >
              <span>
                {activeTab === "diplomantes"
                  ? "Toutes les formations"
                  : "Tout le catalogue E-Learning"}
              </span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: detail de la catégorie ── */}
        {currentCat && (
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Category header avec image */}
            <div className="flex items-center gap-5 px-8 py-5 border-b border-gray-100 bg-white shrink-0">
              <div className="relative w-32 h-[72px] rounded-xl overflow-hidden shadow-md shrink-0">
                <img
                  src={currentCat.image}
                  alt={currentCat.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-accent uppercase tracking-widest mb-0.5">
                  {activeTab === "diplomantes" ? "Formation Diplômante" : "E-Learning"}
                </p>
                <h3 className="font-heading font-extrabold text-primary text-lg uppercase tracking-wide truncate">
                  {currentCat.label}
                </h3>
                <Link
                  to={currentCat.href}
                  className="text-[11px] text-accent font-semibold hover:underline no-underline"
                >
                  Voir toutes les formations de ce domaine →
                </Link>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-extrabold text-primary leading-none">
                  {currentCat.formations.length}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                  formation{currentCat.formations.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Formations grid avec images + badge vidéo */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {currentCat.formations.map((f, i) => (
                  <Link
                    key={i}
                    to={f.href}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-accent/40 hover:bg-orange-50/50 transition-all no-underline group"
                  >
                    {/* Miniature image + badge vidéo */}
                    <div className="relative w-14 h-11 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={f.image}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {f.video && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <div className="bg-white/95 rounded-full p-0.5 shadow-sm">
                            <svg className="w-2.5 h-2.5 text-accent fill-current ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Titre */}
                    <span className="text-[11px] font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug flex-1">
                      {f.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Navbar principale ──────────────────────────────────────────────────────────
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState({});
  const [formationsOpen, setFormationsOpen] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  const toggleMobileMenu = (label) => {
    setOpenMobileMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setFormationsOpen(true);
  };

  const scheduleMegaClose = () => {
    closeTimer.current = setTimeout(() => setFormationsOpen(false), 180);
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-primary px-4 xl:px-8 flex items-center justify-between h-[104px] relative">

      {/* Logo */}
      <Link to="/" className="flex-shrink-0 no-underline flex items-center gap-3 group">
        <img
          src="/assets/logo-nexytal-dark.png"
          alt="Logo Nexytal"
          className="h-20 md:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* ── Menu Desktop ── */}
      <div className="hidden xl:flex items-center gap-2 2xl:gap-6">
        {navlinks.map((item) => {
          /* Formations → Mega Menu */
          if (item.label === "Formations") {
            return (
              <div
                key={item.label}
                className="self-stretch flex items-center"
                onMouseEnter={openMega}
                onMouseLeave={scheduleMegaClose}
              >
                <Link
                  to={item.href}
                  className={`text-nav 2xl:text-nav-lg font-semibold transition-colors duration-200 no-underline font-heading flex items-center gap-1 ${
                    location.pathname.startsWith(item.href) && item.href !== "/"
                      ? "text-accent"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  <svg
                    className={`w-3.5 h-3.5 fill-current opacity-50 transition-transform duration-200 ${
                      formationsOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </Link>
              </div>
            );
          }

          /* Autres items → dropdown classique */
          return (
            <div key={item.label} className="relative group py-[25px]">
              <Link
                to={item.href}
                className={`text-nav 2xl:text-nav-lg font-semibold transition-colors duration-200 no-underline font-heading flex items-center gap-1 ${
                  location.pathname.startsWith(item.href) && item.href !== "/"
                    ? "text-accent"
                    : "text-gray-300 group-hover:text-white"
                }`}
              >
                {item.label}
                {item.submenu && (
                  <svg className="w-3.5 h-3.5 fill-current opacity-50 group-hover:rotate-180 transition-transform" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                )}
              </Link>

              {/* Dropdown Niveau 1 */}
              {item.submenu && (
                <div className="absolute top-[70px] left-0 w-[260px] bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="flex flex-col py-2">
                    {item.submenu.map((sub) => (
                      <div key={sub.label} className="relative group/sub">
                        <Link
                          to={sub.href}
                          className="px-5 py-3 text-nav font-bold text-primary hover:bg-accent hover:text-white transition-colors no-underline font-heading flex w-full items-center justify-between"
                        >
                          {sub.label}
                          {sub.submenu && (
                            <svg className="w-3.5 h-3.5 fill-current opacity-50" viewBox="0 0 20 20">
                              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                            </svg>
                          )}
                        </Link>

                        {/* Dropdown Niveau 2 */}
                        {sub.submenu && (
                          <div className="absolute top-0 left-full ml-0 w-[260px] bg-white shadow-xl rounded-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 translate-x-[-10px] group-hover/sub:translate-x-0 z-[60]">
                            <div className="flex flex-col py-2">
                              {sub.submenu.map((subItem) => (
                                <div key={subItem.label} className="relative group/subItem">
                                  <Link
                                    to={subItem.href}
                                    className="px-5 py-3 text-nav font-bold text-primary hover:bg-accent hover:text-white transition-colors no-underline font-heading flex items-center justify-between w-full"
                                  >
                                    {subItem.label}
                                    {subItem.submenu && (
                                      <svg className="w-3.5 h-3.5 fill-current opacity-50" viewBox="0 0 20 20">
                                        <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                      </svg>
                                    )}
                                  </Link>

                                  {/* Dropdown Niveau 3 */}
                                  {subItem.submenu && (
                                    <div className="absolute top-0 left-full ml-0 w-[260px] bg-white shadow-xl rounded-lg overflow-hidden opacity-0 invisible group-hover/subItem:opacity-100 group-hover/subItem:visible transition-all duration-300 translate-x-[-10px] group-hover/subItem:translate-x-0 z-50">
                                      <div className="flex flex-col py-2">
                                        {subItem.submenu.map((subSub) => (
                                          <Link
                                            key={subSub.label}
                                            to={subSub.href}
                                            className="px-5 py-3 text-sm font-bold text-primary hover:bg-accent hover:text-white transition-colors no-underline font-heading block w-full"
                                          >
                                            {subSub.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

<<<<<<< Updated upstream
      {/* Actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="hidden sm:flex items-center gap-2">
            {isAdmin ? (
              <Link
                to="/admin"
                className="text-xs sm:text-sm font-bold text-primary bg-accent hover:bg-accent-dark hover:text-white px-3 py-2 rounded-lg no-underline transition-colors"
              >
                Admin · {user.prenom}
              </Link>
            ) : (
              <Link
                to="/mon-espace"
                className="text-xs sm:text-sm font-bold text-primary bg-white hover:bg-gray-100 px-3 py-2 rounded-lg no-underline transition-colors"
              >
                {user.prenom}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm font-bold text-white hover:text-accent px-2 py-2 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/connexion" className="hidden sm:block btn-orange text-sm py-2.5 px-5 no-underline">
            Se connecter
          </Link>
        )}

=======
      {/* ── Mega Menu Formations (rendu dans le nav pour absolute top-full) ── */}
      {formationsOpen && (
        <FormationsMegaMenu
          onMouseEnter={openMega}
          onMouseLeave={scheduleMegaClose}
        />
      )}

      {/* ── Actions ── */}
      <div className="flex items-center gap-4">
        <button className="hidden sm:block btn-orange text-sm py-2.5 px-5">
          <a href="/connexion">Se connecter</a>
        </button>
>>>>>>> Stashed changes
        <button className="xl:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Menu Mobile ── */}
      <div
        className={`fixed inset-0 bg-primary z-[90] transition-transform duration-300 xl:hidden ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } flex flex-col overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 min-h-[70px] border-b border-white/10 shrink-0">
          <span className="text-white font-heading font-extrabold text-lg tracking-widest uppercase">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-semibold uppercase">Retour</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 py-10 px-6">
          {navlinks.map((item) => (
            <div key={item.label} className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between w-full">
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-bold font-heading no-underline flex-grow ${
                    location.pathname.startsWith(item.href) && item.href !== "/"
                      ? "text-accent"
                      : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <button onClick={() => toggleMobileMenu(item.label)} className="p-2 text-white">
                    <svg
                      className={`w-6 h-6 fill-current transition-transform ${
                        openMobileMenus[item.label] ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Mobile Niveau 1 */}
              {item.submenu && openMobileMenus[item.label] && (
                <div className="flex flex-col gap-5 pl-4 border-l-2 border-accent/30">
                  {/* Pour Formations, affiche Diplômantes + E-Learning directement */}
                  {item.label === "Formations" ? (
                    <>
                      {/* Section Diplômantes */}
                      <p className="text-xs font-extrabold text-accent uppercase tracking-widest">
                        Formations Diplômantes
                      </p>
                      {megaMenuFormations.diplomantes.map((cat) => (
                        <Link
                          key={cat.id}
                          to={cat.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 text-gray-300 text-base font-semibold no-underline hover:text-white"
                        >
                          <img
                            src={cat.image}
                            alt=""
                            className="w-8 h-8 object-cover rounded-md shrink-0"
                          />
                          {cat.label}
                          <span className="ml-auto text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded-full">
                            {cat.formations.length}
                          </span>
                        </Link>
                      ))}

                      {/* Section E-Learning */}
                      <p className="text-xs font-extrabold text-accent uppercase tracking-widest mt-2">
                        E-Learning
                      </p>
                      <Link
                        to="/formations-courtes"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-300 text-base font-semibold no-underline hover:text-white"
                      >
                        Voir tout le catalogue →
                      </Link>
                      {megaMenuFormations.elearning.map((cat) => (
                        <Link
                          key={cat.id}
                          to={cat.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 text-gray-300 text-base font-semibold no-underline hover:text-white"
                        >
                          <img
                            src={cat.image}
                            alt=""
                            className="w-8 h-8 object-cover rounded-md shrink-0"
                          />
                          {cat.label}
                          <span className="ml-auto text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded-full">
                            {cat.formations.length}
                          </span>
                        </Link>
                      ))}
                    </>
                  ) : (
                    /* Autres items avec sous-menu classique */
                    item.submenu.map((sub) => (
                      <div key={sub.label} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                          <Link
                            to={sub.href}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 text-lg font-semibold no-underline flex-grow"
                          >
                            {sub.label}
                          </Link>
                          {sub.submenu && (
                            <button onClick={() => toggleMobileMenu(sub.label)} className="p-2 text-gray-400">
                              <svg
                                className={`w-5 h-5 fill-current transition-transform ${
                                  openMobileMenus[sub.label] ? "rotate-180" : ""
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {sub.submenu && openMobileMenus[sub.label] && (
                          <div className="flex flex-col gap-4 pl-4 border-l-2 border-slate-600">
                            {sub.submenu.map((subItem) => (
                              <div key={subItem.label} className="flex flex-col gap-3">
                                <div className="flex items-center justify-between w-full">
                                  <Link
                                    to={subItem.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 text-base font-semibold no-underline flex-grow"
                                  >
                                    {subItem.label}
                                  </Link>
                                  {subItem.submenu && (
                                    <button onClick={() => toggleMobileMenu(subItem.label)} className="p-1 text-gray-500">
                                      <svg
                                        className={`w-5 h-5 fill-current transition-transform ${
                                          openMobileMenus[subItem.label] ? "rotate-180" : ""
                                        }`}
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                      </svg>
                                    </button>
                                  )}
                                </div>

                                {subItem.submenu && openMobileMenus[subItem.label] && (
                                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-600/50">
                                    {subItem.submenu.map((subSub) => (
                                      <Link
                                        key={subSub.label}
                                        to={subSub.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 text-sm font-semibold no-underline"
                                      >
                                        {subSub.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Auth mobile */}
          <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-3">
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="bg-accent text-white text-center py-3 px-5 rounded-lg font-bold no-underline"
                  >
                    Tableau de bord admin ({user.prenom})
                  </Link>
                ) : (
                  <Link
                    to="/mon-espace"
                    onClick={() => setIsOpen(false)}
                    className="bg-white text-primary text-center py-3 px-5 rounded-lg font-bold no-underline"
                  >
                    Mon espace ({user.prenom})
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="border border-white/30 text-white text-center py-3 px-5 rounded-lg font-bold"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  onClick={() => setIsOpen(false)}
                  className="btn-orange text-center py-3 px-5 no-underline"
                >
                  Se connecter
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="border border-white/30 text-white text-center py-3 px-5 rounded-lg font-bold no-underline"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
