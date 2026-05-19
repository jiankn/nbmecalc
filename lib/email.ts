import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type EmailRecipient = string | string[];

export interface EmailMessage {
  to: EmailRecipient;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

let smtpTransporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSmtpPort(): number {
  const rawPort = requireEnv("SMTP_PORT");
  const port = Number.parseInt(rawPort, 10);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port number");
  }

  return port;
}

function getSmtpTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  if (smtpTransporter) {
    return smtpTransporter;
  }

  const port = getSmtpPort();
  const secure = port === 465;

  smtpTransporter = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port,
    secure,
    requireTLS: !secure,
    auth: {
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASSWORD"),
    },
  });

  return smtpTransporter;
}

export async function sendEmail(
  message: EmailMessage
): Promise<SMTPTransport.SentMessageInfo> {
  return getSmtpTransporter().sendMail({
    from: requireEnv("SMTP_FROM"),
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
    headers: message.headers,
  });
}

export async function sendMagicLinkEmail(
  message: EmailMessage
): Promise<SMTPTransport.SentMessageInfo> {
  return sendEmail(message);
}
