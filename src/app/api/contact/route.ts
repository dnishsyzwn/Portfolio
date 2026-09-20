import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, subject, message } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Please provide your name." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Please provide your email address." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Please write a message describing your project." },
        { status: 400 }
      );
    }

    // SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465;
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "");
    const recipientEmail =
      process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;

    // Check if credentials are present
    if (!smtpUser || !smtpPass) {
      console.warn(
        "[Contact API] SMTP credentials not set. Set SMTP_USER and SMTP_PASS in .env.local"
      );
      return NextResponse.json(
        {
          error:
            "SMTP service is not configured yet. Please configure SMTP_USER and SMTP_PASS in your environment (.env.local).",
        },
        { status: 503 }
      );
    }

    // Initialize transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailSubject = subject?.trim()
      ? `[Portfolio Contact] ${subject.trim()} - from ${name.trim()}`
      : `[Portfolio Contact] New Project Inquiry from ${name.trim()}`;

    const textContent = `New contact submission from portfolio website:

From: ${name.trim()} (${email.trim()})
${phone?.trim() ? `Phone: ${phone.trim()}\n` : ""}To: ${recipientEmail}
Service Interest: ${service || "Not specified"}
Subject: ${subject || "General Inquiry"}

Message:
${message.trim()}

------------------------------------
Sent via Danish Syazwan Portfolio Contact Gateway
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0b1c2e; padding: 24px; color: #ffffff; border-bottom: 2px solid #38bdf8; }
    .header h2 { margin: 0; font-size: 20px; color: #ffffff; }
    .badge { display: inline-block; font-family: monospace; font-size: 11px; padding: 3px 8px; border-radius: 4px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; margin-top: 8px; }
    .content { padding: 28px 24px; }
    .field { margin-bottom: 18px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 600; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .message-box { background: #f1f5f9; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 4px; margin-top: 16px; white-space: pre-wrap; font-size: 14px; color: #334155; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Transmission Received: System Inquiry</h2>
      <div class="badge">RECIPIENT: ${recipientEmail}</div>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Sender Name</div>
        <div class="value">${name.trim()}</div>
      </div>
      <div class="field">
        <div class="label">Sender Email</div>
        <div class="value"><a href="mailto:${email.trim()}" style="color: #0284c7;">${email.trim()}</a></div>
      </div>
      ${
        phone?.trim()
          ? `
      <div class="field">
        <div class="label">Phone Number</div>
        <div class="value"><a href="tel:${phone.trim()}" style="color: #0284c7;">${phone.trim()}</a></div>
      </div>`
          : ""
      }
      ${
        service
          ? `
      <div class="field">
        <div class="label">Selected Service / System Architecture</div>
        <div class="value">${service}</div>
      </div>`
          : ""
      }
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${subject?.trim() || "General Inquiry"}</div>
      </div>
      <div class="field">
        <div class="label">Project Specifications & Message</div>
        <div class="message-box">${message.trim()}</div>
      </div>
    </div>
    <div class="footer">
      Dispatched via Danish Syazwan Portfolio • Reply directly to this email to contact ${name.trim()}.
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"${name.trim()}" <${smtpUser}>`,
      replyTo: email.trim(),
      to: recipientEmail,
      subject: mailSubject,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message successfully dispatched.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Contact API Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email message.";
    return NextResponse.json(
      {
        error: `Failed to dispatch email: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
