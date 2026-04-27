import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { contactData } from '../../data/contact';

// === SÉCURITÉ : SCHÉMA ZOD STRICT ===
const noHtmlRegex = /^[^<>{}"'`]*$/;

// Le sujet n'est requis que sur le variant "page" (formulaire complet).
// Sur le variant "section" (sans champ Sujet), un sujet par défaut est injecté.
const buildContactSchema = (requireSujet) => z.object({
  nom: z.string().min(2, "Le nom est trop court").max(50).regex(noHtmlRegex, "Caractères illégaux détectés"),
  prenom: z.string().min(2, "Le prénom est trop court").max(50).regex(noHtmlRegex, "Caractères illégaux détectés"),
  email: z.string().email("Veuillez saisir un format d'email valide").max(100),
  telephone: z.string().max(20).regex(noHtmlRegex, "Format invalide").optional().or(z.literal('')),
  sujet: requireSujet
    ? z.string().min(2, "Sujet requis").max(100).regex(noHtmlRegex, "Caractères illégaux détectés")
    : z.string().max(100).regex(noHtmlRegex, "Caractères illégaux détectés").optional().or(z.literal('')),
  message: z.string().min(10, "Message trop court (10 caractères mini)").max(1500).regex(noHtmlRegex, "Caractères illégaux détectés"),
  honeypot: z.string().max(0, "Bot détecté")
});

export default function ContactForm({ variant = "section", title }) {
  const isSection = variant === "section";

  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [draft, setDraft] = useState(null); // { destinataire, sujet, corps, mailtoUrl }
  const [copied, setCopied] = useState(null); // 'email' | 'sujet' | 'corps' | 'tout'

  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(buildContactSchema(!isSection)),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      sujet: '',
      message: '',
      honeypot: ''
    }
  });

  // Construit un brouillon mailto à partir des données du formulaire.
  // Aucune API d'envoi n'est utilisée : la soumission est confiée à l'utilisateur.
  const onSubmit = (data) => {
    setServerError('');

    const emailItem = contactData.coordonnees.items.find(item => item.type === "Email");
    const destinataire = emailItem ? emailItem.valeur : 'contact@nexytal.fr';

    const sujet = (data.sujet && data.sujet.trim())
      ? data.sujet.trim()
      : `Demande de contact – ${data.prenom} ${data.nom}`;

    const corps = [
      `Nom : ${data.nom}`,
      `Prénom : ${data.prenom}`,
      `Email : ${data.email}`,
      `Téléphone : ${data.telephone || 'Non renseigné'}`,
      `Sujet : ${sujet}`,
      '',
      'Message :',
      data.message,
      '',
      '— Envoyé depuis le formulaire de contact du site Nexytal'
    ].join('\n');

    const mailtoUrl = `mailto:${destinataire}`
      + `?subject=${encodeURIComponent(sujet)}`
      + `&body=${encodeURIComponent(corps)}`;

    setDraft({ destinataire, sujet, corps, mailtoUrl });

    // Tentative d'ouverture du client mail.
    // Selon l'environnement (pas de client mail desktop, webmail), il se peut que rien ne s'ouvre :
    // l'écran de succès affiche alors les informations à copier manuellement.
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erreur ouverture client mail:", err);
    }

    setStatus('success');
    reset();
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Erreur copie presse-papiers:", err);
    }
  };

  const resetStatus = () => {
    setStatus('idle');
    setDraft(null);
    setCopied(null);
  };

  const FormWrapper = isSection ? "section" : "div";
  const wrapperClass = isSection ? "bg-content-dark py-[60px] px-10 text-center" : "w-full";
  const containerClass = isSection ? "max-w-[600px] mx-auto" : "w-full";

  const getInputClass = (hasError) => {
    let base = isSection
      ? "w-full p-[12px_14px] border rounded-[3px] bg-white font-body text-small text-content-dark outline-none focus:border-accent transition-colors placeholder:text-content-muted "
      : "w-full p-3 border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all ";

    return base + (hasError ? "border-red-500 bg-red-50/50 " : (isSection ? "border-transparent" : "border-gray-200"));
  };

  const buttonClass = isSection
    ? "bg-accent hover:bg-accent-dark text-white p-[14px] rounded-sm font-heading text-sm font-bold cursor-pointer transition-colors duration-200 uppercase tracking-wide border-none flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed w-full"
    : "w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4";

  return (
    <FormWrapper className={wrapperClass} id={isSection ? "contact" : undefined}>
      {(title || isSection) && (
        <h2 className={isSection ? "font-heading text-[26px] font-extrabold text-white mb-[30px] uppercase tracking-wider" : "text-primary font-bold text-[24px] mb-8"}>
          {title || "Contactez-nous"}
        </h2>
      )}

      <div className={containerClass}>
        {status === 'success' && draft && (
          <div className={isSection ? "bg-white text-content-dark p-6 rounded-md text-left" : "bg-green-50/30 border border-green-200 text-content-dark p-6 sm:p-8 rounded-xl text-left"}>
            <div className="flex items-start gap-3 mb-5">
              <svg className="w-8 h-8 shrink-0 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h3 className="font-bold text-lg text-primary">Votre message est prêt à être envoyé</h3>
                <p className="text-sm text-content-muted mt-1">
                  Votre client mail devrait s'ouvrir automatiquement avec un brouillon pré-rempli.
                  S'il ne s'ouvre pas, copiez les informations ci-dessous et envoyez-les manuellement.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-bold text-primary min-w-[110px]">Destinataire :</span>
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-content-dark break-all">{draft.destinataire}</code>
                <button type="button" onClick={() => copyToClipboard(draft.destinataire, 'email')} className="text-xs font-bold uppercase px-3 py-2 rounded bg-primary text-white hover:bg-primary-light transition whitespace-nowrap">
                  {copied === 'email' ? 'Copié ✓' : 'Copier'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-bold text-primary min-w-[110px]">Sujet :</span>
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-content-dark break-all">{draft.sujet}</code>
                <button type="button" onClick={() => copyToClipboard(draft.sujet, 'sujet')} className="text-xs font-bold uppercase px-3 py-2 rounded bg-primary text-white hover:bg-primary-light transition whitespace-nowrap">
                  {copied === 'sujet' ? 'Copié ✓' : 'Copier'}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Message :</span>
                  <button type="button" onClick={() => copyToClipboard(draft.corps, 'corps')} className="text-xs font-bold uppercase px-3 py-2 rounded bg-primary text-white hover:bg-primary-light transition">
                    {copied === 'corps' ? 'Copié ✓' : 'Copier le message'}
                  </button>
                </div>
                <pre className="bg-gray-100 px-3 py-2 rounded font-mono text-content-dark text-xs whitespace-pre-wrap break-words max-h-48 overflow-auto">{draft.corps}</pre>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={draft.mailtoUrl}
                className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 px-5 rounded-lg text-center transition no-underline uppercase tracking-wide text-sm"
              >
                Ouvrir mon client mail
              </a>
              <button type="button" onClick={resetStatus} className="flex-1 sm:flex-none px-5 py-3 border border-gray-300 text-content-dark hover:bg-gray-50 font-medium rounded-lg transition text-sm">
                Nouveau message
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className={isSection ? "" : "md:col-span-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3 mb-6"}>
            {!isSection && (
              <svg className="w-5 h-5 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <p className={isSection ? "text-red-500 font-semibold mb-6 text-sm bg-red-100/10 border border-red-500/30 p-3 rounded" : "text-medium font-medium"} role="alert">
              {serverError}
            </p>
          </div>
        )}

        {status !== 'success' && (
          <form ref={formRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>

            <div aria-hidden="true" className="hidden">
              <input type="text" {...register('honeypot')} tabIndex="-1" autoComplete="off" />
            </div>

            <div className="flex flex-col gap-1">
              {!isSection && <label className="text-sm font-medium text-primary">Nom *</label>}
              <input type="text" placeholder={isSection ? "Nom *" : ""} className={getInputClass(errors.nom)} disabled={status === 'loading'}
                {...register('nom')} />
              {errors.nom && <span className="text-xs text-red-500 font-semibold">{errors.nom.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              {!isSection && <label className="text-sm font-medium text-primary">Prénom *</label>}
              <input type="text" placeholder={isSection ? "Prénom *" : ""} className={getInputClass(errors.prenom)} disabled={status === 'loading'}
                {...register('prenom')} />
              {errors.prenom && <span className="text-xs text-red-500 font-semibold">{errors.prenom.message}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              {!isSection && <label className="text-sm font-medium text-primary">Email *</label>}
              <input type="email" placeholder={isSection ? "Email *" : ""} className={getInputClass(errors.email)} disabled={status === 'loading'}
                {...register('email')} />
              {errors.email && <span className="text-xs text-red-500 font-semibold">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              {!isSection && <label className="text-sm font-medium text-primary">Téléphone</label>}
              <input type="tel" placeholder={isSection ? "Téléphone" : ""} className={getInputClass(errors.telephone)} disabled={status === 'loading'}
                {...register('telephone')} />
              {errors.telephone && <span className="text-xs text-red-500 font-semibold">{errors.telephone.message}</span>}
            </div>

            {!isSection && (
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-primary">Sujet *</label>
                <input type="text" className={getInputClass(errors.sujet)} disabled={status === 'loading'}
                  {...register('sujet')} />
                {errors.sujet && <span className="text-xs text-red-500 font-semibold">{errors.sujet.message}</span>}
              </div>
            )}

            <div className="flex flex-col gap-1 md:col-span-2">
              {!isSection && <label className="text-sm font-medium text-primary">Message *</label>}
              <textarea placeholder={isSection ? "Votre message *" : ""} className={getInputClass(errors.message) + (isSection ? " h-[120px]" : " h-[160px]") + " resize-none"} disabled={status === 'loading'}
                {...register('message')} />
              {errors.message && <span className="text-xs text-red-500 font-semibold">{errors.message.message}</span>}
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={status === 'loading'} className={buttonClass}>
                {status === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ouverture du client mail...
                  </>
                ) : "Ouvrir mon client mail"}
              </button>
            </div>
          </form>
        )}
      </div>
    </FormWrapper>
  );
}