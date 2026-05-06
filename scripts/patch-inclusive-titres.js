/**
 * Marque inclusive (e) sur hero.titre, ctaFinal.titre et debouches.postes[].titre
 *
 * npm run inclusif:titres
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, '../src/data/json/formation.json');

const SKIP_EXACT = new Set([
  'Le métier',
  'Les métiers visés',
  "Modalités d'apprentissage",
  'Public concerné & Prérequis',
]);

const EXACT_REPLACE = new Map([
  ['Prêt à devenir Formation en IA ?', 'Prêt(e) à vous former à l’IA ?'],
]);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** $1 doit être ajoutée (e) si pas suivie déjà par (e) */
function suffixE(word) {
  return new RegExp(`(\\b${escapeRe(word)})\\b(?!\\(e\\)|\\()`, 'gi');
}

function inclusiveTitle(raw) {
  if (!raw || typeof raw !== 'string') return raw;
  const trimmed = raw.trim();
  if (SKIP_EXACT.has(trimmed)) return raw;

  if (EXACT_REPLACE.has(trimmed)) return EXACT_REPLACE.get(trimmed);

  let s = raw;

  s = s.replace(/\bCommunity Manager\b(?!\(e\))/gi, 'Community Manager(e)');
  s = s.replace(/\bOffice Manager\b(?!\(e\))/gi, 'Office Manager(e)');
  s = s.replace(/\bExpert UI Designer\b(?!\(e\))/gi, 'Expert(e) UI Designer(e)');
  s = s.replace(/\bUX\/UI Designer\b(?!\(e\))/gi, 'UX/UI Designer(e)');
  s = s.replace(/\bUI Designer\b(?!\(e\))/gi, 'UI Designer(e)');
  s = s.replace(/\bWebdesigner\b(?!\(e\))/gi, 'Webdesigner(e)');
  s = s.replace(/Analyste programmeur\b/gi, 'Analyste programmeur(e)');
  s = s.replace(/\bChef de projet\b/gi, 'Chef(fe) de projet');

  for (const w of [
    'Développeur',
    'Concepteur',
    'Administrateur',
    'administrateur',
    'Technicien',
    'Conseiller',
    'Gestionnaire',
    'Secrétaire',
    'programmeur',
    'Consultant',
    'Ingénieur',
    'Intégrateur',
    'Expert',
    'Designer',
    'Comptable',
  ]) {
    s = s.replace(suffixE(w), '$1(e)');
  }

  s = s.replace(/\bAssistant\b(?!\()/gi, 'Assistant(e)');
  s = s.replace(/\bLead\b(?!\()/g, 'Lead(e)');
  s = s.replace(/Prêt à devenir\b/gi, 'Prêt(e) à devenir');

  // Faux doubles
  s = s.replace(/Assistant\(e\)\(e\)/gi, 'Assistant(e)');
  s = s.replace(/Prêt\(e\) \(e\) à/g, 'Prêt(e) à');

  while (/\(e\)\(e\)/.test(s)) s = s.replace(/\(e\)\(e\)/g, '(e)');

  return s;
}

function patchFormation(entry) {
  if (entry.hero?.titre) entry.hero.titre = inclusiveTitle(entry.hero.titre);
  if (entry.ctaFinal?.titre) entry.ctaFinal.titre = inclusiveTitle(entry.ctaFinal.titre);
  if (Array.isArray(entry.debouches?.postes)) {
    entry.debouches.postes.forEach((p) => {
      if (typeof p?.titre === 'string') p.titre = inclusiveTitle(p.titre);
    });
  }
}

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
for (const entry of Object.values(data)) patchFormation(entry);
fs.writeFileSync(JSON_PATH, `${JSON.stringify(data, null, 4)}\n`, 'utf8');
console.log('Écrit:', JSON_PATH);
