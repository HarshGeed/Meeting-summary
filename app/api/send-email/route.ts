import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { summary, recipients, message } = await request.json();

    if (!summary || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Summary and recipients are required' },
        { status: 400 }
      );
    }

    // Create transporter for Brevo (formerly Sendinblue)
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY, // Use Brevo API key as password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.BREVO_USER,
      to: recipients.join(', '),
      subject: 'Meeting Summary - AI Generated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Meeting Summary</h2>
          ${message ? `<p style="color: #666; margin-bottom: 20px;"><em>${message}</em></p>` : ''}
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
            ${summary}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This summary was generated using AI technology.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
