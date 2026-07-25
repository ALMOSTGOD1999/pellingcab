import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = "PellingCab <welcome@pellingcab.com>";

export function buildWelcomeEmailHtml(userName: string): string {
  const firstName = userName.split(" ")[0] || userName;
  return `<!doctype html>
<html lang="en" xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to PellingCab</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#1E1A14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1E1A14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- LOGO -->
          <tr>
            <td align="center" style="padding:0 0 32px 0;">
              <img src="https://www.pellingcab.com/logo.png" alt="PellingCab" width="56" height="56" style="display:block;border-radius:50%;box-shadow:0 8px 32px rgba(212,175,55,0.25);">
            </td>
          </tr>

          <!-- HEADLINE -->
          <tr>
            <td align="center" style="padding:0 0 8px 0;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:400;line-height:1.15;background:linear-gradient(135deg,#F5D77A,#D4AF37);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:transparent;">
                Welcome to PellingCab
              </h1>
            </td>
          </tr>

          <!-- TAGLINE -->
          <tr>
            <td align="center" style="padding:0 0 28px 0;">
              <p style="margin:0;font-size:15px;color:#B8A98A;letter-spacing:0.04em;text-transform:uppercase;">
                Chauffeured luxury, on your schedule.
              </p>
            </td>
          </tr>

          <!-- CARD -->
          <tr>
            <td style="background-color:rgba(30,26,20,0.6);backdrop-filter:blur(20px);border:1px solid rgba(212,175,55,0.12);border-radius:24px;padding:40px 32px;">

              <!-- GREETING -->
              <tr>
                <td style="padding:0 0 24px 0;">
                  <p style="margin:0 0 8px 0;font-size:20px;color:#F5F0E8;">Hi <strong>${firstName}</strong>,</p>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#A89F8E;">
                    Thank you for joining <strong style="color:#D4AF37;">PellingCab</strong> &mdash; premium chauffeured travel across India. We're thrilled to have you on board.
                  </p>
                </td>
              </tr>

              <!-- HIGHLIGHTS -->
              <tr>
                <td style="padding:0 0 28px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size:15px;color:#D4AF37;padding-right:8px;">&#10003;</td>
                            <td style="font-size:14px;color:#B8A98A;">Shared shuttles Pelling &harr; Bagdogra from ₹1,299</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size:15px;color:#D4AF37;padding-right:8px;">&#10003;</td>
                            <td style="font-size:14px;color:#B8A98A;">Half-day &amp; full-day private chauffeur rentals</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size:15px;color:#D4AF37;padding-right:8px;">&#10003;</td>
                            <td style="font-size:14px;color:#B8A98A;">Transparent fares &mdash; no surge, no surprises</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="font-size:15px;color:#D4AF37;padding-right:8px;">&#10003;</td>
                            <td style="font-size:14px;color:#B8A98A;">Live tracking &amp; 24/7 concierge support</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA BUTTON -->
              <tr>
                <td align="center" style="padding:0 0 24px 0;">
                  <a href="https://www.pellingcab.com/book" style="display:inline-block;background:linear-gradient(135deg,#F5D77A,#C9A235 60%,#B8912E);color:#1E1A14;text-decoration:none;padding:14px 36px;border-radius:16px;font-size:15px;font-weight:600;letter-spacing:0.02em;">
                    Book your first ride
                  </a>
                </td>
              </tr>

              <!-- DIVIDER -->
              <tr>
                <td style="padding:0 0 20px 0;">
                  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);">
                </td>
              </tr>

              <!-- FOOTER TEXT -->
              <tr>
                <td style="padding:0;">
                  <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:#6B6356;">
                    Book a seat on a scheduled shuttle, or rent a private chauffeured car for half a day or a full day &mdash; across India.
                  </p>
                  <p style="margin:0;font-size:12px;color:#5A5348;">
                    &copy; ${new Date().getFullYear()} PellingCab. All rights reserved.
                  </p>
                </td>
              </tr>
            </td>
          </tr>

          <!-- BOTTOM LINKS -->
          <tr>
            <td align="center" style="padding:24px 0 0 0;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#5A5348;">
                <a href="https://www.pellingcab.com/about" style="color:#8A7E6B;text-decoration:none;">About</a>
                &nbsp;&middot;&nbsp;
                <a href="https://www.pellingcab.com/support" style="color:#8A7E6B;text-decoration:none;">Support</a>
                &nbsp;&middot;&nbsp;
                <a href="https://www.pellingcab.com/settings" style="color:#8A7E6B;text-decoration:none;">Settings</a>
              </p>
              <p style="margin:0;font-size:11px;color:#4A453C;">
                You received this email because you signed up at PellingCab.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, userName: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping welcome email for", to);
    return { skipped: true };
  }

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Welcome to PellingCab, ${userName.split(" ")[0] || userName}!`,
    html: buildWelcomeEmailHtml(userName),
  });

  if (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error(`Welcome email failed: ${error.message}`);
  }

  return data;
}

// ── Booking confirmation email ──────────────────────────────────────────────

export function buildBookingConfirmationHtml(booking: {
  id: string;
  name: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  vehicle: string;
  total: number;
  mode: string;
}): string {
  const firstName = booking.name.split(" ")[0] || booking.name;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#1E1A14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1E1A14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td align="center" style="padding:0 0 32px 0;">
              <img src="https://www.pellingcab.com/logo.png" alt="PellingCab" width="56" height="56" style="display:block;border-radius:50%;box-shadow:0 8px 32px rgba(212,175,55,0.25);">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 0 8px 0;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;background:linear-gradient(135deg,#F5D77A,#D4AF37);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:transparent;">
                Booking Confirmed
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 0 28px 0;">
              <p style="margin:0;font-size:15px;color:#B8A98A;letter-spacing:0.04em;text-transform:uppercase;">
                Your ride is all set
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:rgba(30,26,20,0.6);border:1px solid rgba(212,175,55,0.12);border-radius:24px;padding:40px 32px;">
              <p style="margin:0 0 8px 0;font-size:20px;color:#F5F0E8;">Hi <strong>${firstName}</strong>,</p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#A89F8E;">
                Your booking with <strong style="color:#D4AF37;">PellingCab</strong> has been confirmed. Here are the details:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin-bottom:24px;">
                <tr><td style="padding:8px 0;font-size:14px;color:#A89F8E;">Booking ID</td><td style="padding:8px 0;font-size:14px;color:#F5F0E8;text-align:right;font-family:monospace;">${booking.id}</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#A89F8E;">Vehicle</td><td style="padding:8px 0;font-size:14px;color:#F5F0E8;text-align:right;">${booking.vehicle}</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#A89F8E;">Pickup</td><td style="padding:8px 0;font-size:14px;color:#F5F0E8;text-align:right;">${booking.pickup}</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#A89F8E;">Destination</td><td style="padding:8px 0;font-size:14px;color:#F5F0E8;text-align:right;">${booking.destination}</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#A89F8E;">Date & Time</td><td style="padding:8px 0;font-size:14px;color:#F5F0E8;text-align:right;">${booking.date} · ${booking.time}</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#A89F8E;">Type</td><td style="padding:8px 0;font-size:14px;color:#F5F0E8;text-align:right;">${booking.mode === "shuttle" ? "Shared shuttle" : "Private rental"}</td></tr>
                <tr><td style="padding:12px 0 0 0;font-size:16px;color:#F5F0E8;font-weight:600;border-top:1px solid rgba(255,255,255,0.08);">Total</td><td style="padding:12px 0 0 0;font-size:18px;color:#D4AF37;text-align:right;font-weight:600;border-top:1px solid rgba(255,255,255,0.08);">\u20B9${booking.total.toLocaleString("en-IN")}</td></tr>
              </table>
              <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#A89F8E;">
                Our team will reach out shortly with your chauffeur details. You can track your ride once it's on the way.
              </p>
              <div align="center" style="padding:0 0 20px 0;">
                <a href="https://www.pellingcab.com/history" style="display:inline-block;background:linear-gradient(135deg,#F5D77A,#C9A235 60%,#B8912E);color:#1E1A14;text-decoration:none;padding:14px 36px;border-radius:16px;font-size:15px;font-weight:600;">
                  View booking
                </a>
              </div>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 20px 0;">
              <p style="margin:0;font-size:13px;color:#6B6356;">
                Need help? Reply to this email or contact us at <a href="mailto:support@pellingcab.com" style="color:#D4AF37;">support@pellingcab.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 0 0 0;">
              <p style="margin:0;font-size:11px;color:#4A453C;">
                &copy; ${new Date().getFullYear()} PellingCab. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendBookingConfirmationEmail(
  to: string,
  booking: {
    id: string;
    name: string;
    pickup: string;
    destination: string;
    date: string;
    time: string;
    vehicle: string;
    total: number;
    mode: string;
  },
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping booking email for", to);
    return { skipped: true };
  }

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Booking confirmed · ${booking.id} · PellingCab`,
    html: buildBookingConfirmationHtml(booking),
  });

  if (error) {
    console.error("Failed to send booking email:", error);
    throw new Error(`Booking email failed: ${error.message}`);
  }

  return data;
}
