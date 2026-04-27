import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import hpp from 'hpp';

// Charger les variables de .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security Hardening - Couche Sécurité
app.use(helmet()); // Protection des headers HTTP
app.use(hpp());    // Protection contre la pollution des paramètres HTTP
app.disable('x-powered-by'); // Cache l'identité du serveur (Express)

// Protection contre le Bruteforce et les attaques DDOS sur les formulaires
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limite chaque IP à 10 requêtes par fenêtre (pour les formulaires)
  message: { success: false, error: "Trop de tentatives. Veuillez réessayer dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuration des middlewares - Limite augmentée pour les CV en Base64
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Appliquer le limiter uniquement sur les routes sensibles (formulaires)
app.use('/api/', limiter);

// Initialisation de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Route POST pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, sujet, message, destinataire } = req.body;

    // IMPORTANT : Avec la version gratuite de Resend (sans domaine configuré),
    // - l'expéditeur (from) DOIT être 'onboarding@resend.dev'
    // - le destinataire (to) DOIT être l'email de votre compte Resend.
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: destinataire || process.env.EMAIL_DESTINATAIRE || 'contact@Nexytal.com', // Cible
      subject: `Nouveau message du site: ${sujet}`,
      html: `
        <div style="font-family: sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #fca311; text-transform: uppercase;">Nouveau Contact</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Nom:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${prenom} ${nom}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email du contact:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${telephone || 'Non renseigné'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Sujet:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${sujet}</td></tr>
          </table>
          <div style="margin-top: 25px;">
            <strong style="display: block; margin-bottom: 10px; font-size: 16px;">Message :</strong>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// Route POST pour les candidatures (Nous Rejoindre)
app.post('/api/rejoindre', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, specificField, message, type, attachment } = req.body;

    const emailOptions = {
      from: 'onboarding@resend.dev',
      to: process.env.EMAIL_DESTINATAIRE || 'yanislaldjipro@gmail.com',
      subject: `[CANDIDATURE] ${type.toUpperCase()} - ${prenom} ${nom}`,
      html: `
        <div style="font-family: sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #fca311; text-transform: uppercase;">Nouvelle Candidature : ${type}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Candidat:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${prenom} ${nom}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${telephone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>${type === 'formateur' ? 'Expertise' : 'Contrat'}:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${specificField}</td></tr>
          </table>
          <div style="margin-top: 25px;">
            <strong style="display: block; margin-bottom: 10px; font-size: 16px;">Message / Motivation :</strong>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message ? message.replace(/\n/g, '<br/>') : 'Aucun message.'}</div>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #718096;">Le CV est joint à cet email.</p>
        </div>
      `
    };

    // Ajouter l'attachment si présent
    if (attachment && attachment.content && attachment.filename) {
      emailOptions.attachments = [
        {
          filename: attachment.filename,
          content: attachment.content, // Doit être en base64
        }
      ];
    }

    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error("Resend API Error (Candidature):", error);
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Server Error (Candidature):", error);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur lors de la candidature' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur Express backend lancé sur http://localhost:${port}`);
  console.log(`📧 API Resend initialisée avec succès.`);
});
