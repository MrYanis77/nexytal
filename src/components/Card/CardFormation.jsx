import React from 'react';
import { Link } from 'react-router-dom';

export default function CardFormation({
  title,
  image,
  variant = "white",
  href = "#",
  hideButton = false,
  typeBadge,
  /** Ligne de puces sous le titre (optionnel ; ex. services sur la homepage) */
  items,
  /** Lien externe (ex. Google Maps) — affiche un bouton dédié */
  mapsHref,
  mapsButtonLabel = 'Google Maps',
}) {
  const isNavy = variant === "navy";

  return (
    <div className={`
      group flex flex-col rounded-sm overflow-hidden border transition-all duration-300 h-full hover:-translate-y-2
      ${isNavy
        ? "bg-primary text-white border-primary shadow-lg hover:shadow-2xl hover:shadow-primary/50"
        : "bg-white text-content-dark border-border shadow-sm hover:shadow-xl hover:border-accent/30"}
    `}>

      {/* Image de la formation */}
      <div className="relative h-48 w-full overflow-hidden">
        {typeBadge ? (
          <span
            className="absolute top-3 left-3 z-[1] max-w-[calc(100%-1.5rem)] rounded-md bg-primary/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md"
            title={typeBadge}
          >
            {typeBadge}
          </span>
        ) : null}
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          // Utilisation de group-hover pour que l'image zoome quand on survole la carte
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow relative">
        <h3
          className={`text-lg font-bold leading-tight transition-colors duration-300 ${!isNavy ? 'group-hover:text-accent' : ''}`}
        >
          {title}
        </h3>

        {items && items.length > 0 ? (
          <ul
            className={`mt-4 list-disc space-y-1.5 pl-5 text-sm font-body leading-relaxed ${isNavy ? 'text-white/90 marker:text-accent' : 'text-content-muted marker:text-accent'}`}
          >
            {items.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : null}

        {(!hideButton || mapsHref) && (
          <div className="mt-auto pt-6 flex flex-col gap-3">
            {!hideButton && (
              <Link
                to={href}
                className="btn-orange self-start text-sm py-2.5 px-6 no-underline inline-block transition-transform duration-300 hover:scale-105"
              >
                En savoir plus
              </Link>
            )}
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange self-start text-sm py-2.5 px-6 no-underline inline-block transition-transform duration-300 hover:scale-105"
              >
                {mapsButtonLabel}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}