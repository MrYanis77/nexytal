import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Composant carrousel générique pour le header des pages.
 * Supporte le mix images et vidéos courtes (muted/autoplay/loop).
 *
 * @param {Array} slides - [{ type: 'image'|'video', src: string, title?: string, subtitle?: string }]
 * @param {boolean} autoPlay - Activer le défilement automatique (defaut: true)
 * @param {number} interval - Durée entre deux slides en ms (defaut: 6000)
 */
export default function PageCarousel({ slides = [], autoPlay = true, interval = 6000 }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, slides.length, interval]);

  if (!slides || slides.length === 0) return null;

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-navy overflow-hidden group">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {slides[currentSlide].type === 'video' ? (
            <video
              className="w-full h-full object-cover"
              src={slides[currentSlide].src}
              autoPlay
              muted
              loop
              playsInline
              loading="lazy" /* Bonnes perfs : ne charge la vidéo que si nécessaire */
            />
          ) : (
            <img
              className="w-full h-full object-cover"
              src={slides[currentSlide].src}
              alt={slides[currentSlide].title || `Slide ${currentSlide + 1}`}
              loading="lazy"
            />
          )}

          {/* Calque d'assombrissement pour le texte */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>

      {/* Contenu Texte Optionnel */}
      {(slides[currentSlide].title || slides[currentSlide].subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
          <motion.div
             key={`text-${currentSlide}`}
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.3 }}
          >
            {slides[currentSlide].title && (
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg font-heading uppercase tracking-wide">
                {slides[currentSlide].title}
              </h1>
            )}
            {slides[currentSlide].subtitle && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md font-body">
                {slides[currentSlide].subtitle}
              </p>
            )}
          </motion.div>
        </div>
      )}

      {/* Navigation Flèches (Visibles au survol) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 inset-y-0 my-auto h-12 w-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30"
            aria-label="Slide précédent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 inset-y-0 my-auto h-12 w-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30"
            aria-label="Slide suivant"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-orange' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
