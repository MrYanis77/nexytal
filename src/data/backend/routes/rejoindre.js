import express from 'express';
import { Buffer } from 'node:buffer';
import { escapeHtml, clean } from '../utils.js';
import { getSmtpTransport, getDefaultFrom, getAdminRecipient } from '../mail/smtp.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const transport = getSmtpTransport();
    if (!transport) {
      return res.status(503).json({ success: false, error: 'Service email non configuré' });
    }

    const { prenom, nom, email, telephone, specificField, message, type, attachment } = req.body;
    const from = getDefaultFrom();
    const to = getAdminRecipient();

    const safe = (v, max) => escapeHtml(clean(v, max));
    const typeStr = String(type || '');

    const html = `
        <div style="font-family: sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #fca311; text-transform: uppercase;">Nouvelle Candidature : ${safe(typeStr, 50)}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Candidat :</strong></td><td>${safe(prenom, 50)} ${safe(nom, 50)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email :</strong></td><td><a href="mailto:${escapeHtml(clean(email, 100))}">${safe(email, 100)}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone :</strong></td><td>${safe(telephone || '', 30)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>${type === 'formateur' ? 'Expertise' : 'Contrat'} :</strong></td><td>${safe(specificField || '', 200)}</td></tr>
          </table>
          <div style="margin-top: 25px;">
            <strong>Message / Motivation :</strong>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message ? escapeHtml(clean(message, 5000)).replace(/\n/g, '<br/>') : 'Aucun message.'}</div>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #718096;">Le CV est joint à cet email.</p>
        </div>
      `;

    const mailOpts = {
      from,
      to,
      replyTo: clean(email, 100),
      subject: `[CANDIDATURE] ${String(type || '').toUpperCase()} - ${clean(prenom, 50)} ${clean(nom, 50)}`,
      html,
    };

    if (attachment?.content && attachment?.filename) {
      try {
        const buf = Buffer.from(String(attachment.content), 'base64');
        mailOpts.attachments = [{ filename: clean(attachment.filename, 200), content: buf }];
      } catch (attErr) {
        console.error('Attachment decode error:', attErr);
        return res.status(400).json({ success: false, error: 'Pièce jointe invalide' });
      }
    }

    const info = await transport.sendMail(mailOpts);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('rejoindre error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

export default router;
