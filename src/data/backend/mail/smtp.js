import nodemailer from 'nodemailer';

/**
 * Transport SMTP (ex. IONOS : smtp.ionos.fr, port 465 ou 587).
 * Variables : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, optionnel SMTP_SECURE.
 */
export function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 465);
  let secure;
  if (process.env.SMTP_SECURE === 'true') secure = true;
  else if (process.env.SMTP_SECURE === 'false') secure = false;
  else secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export function getDefaultFrom() {
  return (
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    'noreply@localhost'
  );
}

export function getAdminRecipient() {
  return process.env.EMAIL_DESTINATAIRE || 'contact@nexytal.com';
}
