import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.isConfigured = true;
    }
  }

  public sendEmailAsync(options: EmailOptions): void {
    setImmediate(async () => {
      try {
        if (this.isConfigured && this.transporter) {
          await this.transporter.sendMail({
            from: process.env.EMAIL_FROM || 'SocietyOS <notifications@societyos.app>',
            to: options.to,
            subject: options.subject,
            html: options.html,
          });
          console.log(`[EmailService] Email successfully sent to ${options.to}: "${options.subject}"`);
        } else {
          console.log(`[EmailService - DEV MODE LOG] To: ${options.to} | Subject: "${options.subject}"`);
          console.log(`[Email Content]:\n${options.html}\n----------------------------------`);
        }
      } catch (error) {
        console.error(`[EmailService Error] Failed to send email to ${options.to}:`, error);
      }
    });
  }

  public notifyStatusChange(
    residentEmail: string,
    residentName: string,
    complaintTitle: string,
    oldStatus: string,
    newStatus: string,
    note?: string
  ): void {
    const subject = `[SocietyOS] Complaint Status Updated: ${complaintTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4F46E5;">SocietyOS Complaint Update</h2>
        <p>Dear <strong>${residentName}</strong>,</p>
        <p>Your maintenance complaint status has been updated.</p>
        <div style="background-color: #f7f8fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p><strong>Complaint:</strong> ${complaintTitle}</p>
          <p><strong>Previous Status:</strong> ${oldStatus}</p>
          <p><strong>New Status:</strong> <span style="color: #4F46E5; font-weight: bold;">${newStatus}</span></p>
          ${note ? `<p><strong>Update Note:</strong> "${note}"</p>` : ''}
        </div>
        <p>Log in to your SocietyOS portal to view full complaint timeline and details.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">SocietyOS • Smarter maintenance. Stronger communities.</p>
      </div>
    `;
    this.sendEmailAsync({ to: residentEmail, subject, html });
  }

  public notifyImportantNotice(
    residentEmail: string,
    residentName: string,
    noticeTitle: string,
    noticeContent: string
  ): void {
    const subject = `[SocietyOS IMPORTANT NOTICE] ${noticeTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #DC2626;">📌 Important Society Notice</h2>
        <p>Dear <strong>${residentName}</strong>,</p>
        <p>An important notice has been posted by the administration:</p>
        <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #991B1B;">${noticeTitle}</h3>
          <p style="white-space: pre-line; color: #7F1D1D;">${noticeContent}</p>
        </div>
        <p>Please log in to your SocietyOS dashboard to review the notice board.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">SocietyOS • Smarter maintenance. Stronger communities.</p>
      </div>
    `;
    this.sendEmailAsync({ to: residentEmail, subject, html });
  }
}

export const emailService = new EmailService();
