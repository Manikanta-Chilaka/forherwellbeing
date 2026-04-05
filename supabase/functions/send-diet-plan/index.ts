import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { to, patientName, planTitle, pdfBase64 } = await req.json();

    if (!to || !pdfBase64) {
      return new Response(JSON.stringify({ error: 'Missing to or pdfBase64' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: 'forherwellbeing.official@gmail.com',
          password: Deno.env.get('GMAIL_APP_PASSWORD')!,
        },
      },
    });

    await client.send({
      from: 'ForHerWellbeing <forherwellbeing.official@gmail.com>',
      to,
      subject: `Your Personalised Diet Plan — ${planTitle || 'Diet Plan'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:10px;overflow:hidden;border:1px solid #e8dff0;">
          <div style="background:#7c3f7b;padding:28px 32px;">
            <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:2px;">FORHERWELLBEING</h1>
            <p style="color:rgba(255,255,255,0.65);margin:4px 0 0;font-size:12px;">Women's Health & Nutrition</p>
          </div>
          <div style="padding:28px 32px;background:#fff;">
            <p style="font-size:16px;color:#1e1e2e;margin-top:0;">Dear <strong>${patientName}</strong>,</p>
            <p style="color:#555570;line-height:1.7;font-size:14px;">
              Please find your <strong>personalised diet plan</strong> attached to this email.
              This plan has been specially prepared for you by your doctor at ForHerWellbeing.
            </p>
            <p style="color:#555570;line-height:1.7;font-size:14px;">
              Follow the plan consistently and feel free to reach out if you have any questions.
            </p>
            <div style="background:#f3e8f3;border-left:4px solid #7c3f7b;padding:14px 18px;border-radius:6px;margin:24px 0;">
              <p style="margin:0;font-size:13px;color:#555570;">Plan attached</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:bold;color:#7c3f7b;">${planTitle || 'Personalised Diet Plan'}</p>
            </div>
            <p style="color:#888899;font-size:13px;margin-top:28px;border-top:1px solid #f0e8f0;padding-top:18px;">
              With care,<br/>
              <strong style="color:#1e1e2e;">ForHerWellbeing Team</strong><br/>
              <span style="color:#7c3f7b;">forherwellbeing.official@gmail.com</span>
            </p>
          </div>
          <div style="background:#f8f0f8;padding:12px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#b57aa8;">
              This plan was prepared exclusively for ${patientName}. Please do not share.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          contentType: 'application/pdf',
          encoding: 'base64',
          filename: `DietPlan-${(patientName || 'patient').replace(/\s+/g, '-')}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Email error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
