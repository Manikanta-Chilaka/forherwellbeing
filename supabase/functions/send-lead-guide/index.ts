import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Public download links for each guide (upload PDFs to Supabase Storage > public bucket)
const GUIDE_LINKS: Record<string, { title: string; url: string }> = {
  'meal-guide': {
    title: '7-Day Hormone-Balancing Meal Guide',
    url: 'https://ofzslbmftnkrmdepohsb.supabase.co/storage/v1/object/public/guides/7-day-meal-guide.pdf',
  },
  'hormone-checklist': {
    title: 'Hormone Health Symptom Checklist',
    url: 'https://ofzslbmftnkrmdepohsb.supabase.co/storage/v1/object/public/guides/hormone-checklist.pdf',
  },
  'grocery-list': {
    title: 'The Healthy Grocery List for Women',
    url: 'https://ofzslbmftnkrmdepohsb.supabase.co/storage/v1/object/public/guides/healthy-grocery-list.pdf',
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { name, email, phone, guideId } = await req.json();

    if (!name || !email || !phone || !guideId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const guide = GUIDE_LINKS[guideId];
    if (!guide) {
      return new Response(JSON.stringify({ error: 'Unknown guide ID' }), {
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
      to: email,
      subject: `Your Free Guide: ${guide.title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #DFD5C6;">
          <div style="background:#2E4D38;padding:28px 32px;">
            <h1 style="color:#fff;margin:0;font-size:18px;letter-spacing:2px;">FOR HER WELLBEING</h1>
            <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">Women's Health & Nutrition</p>
          </div>
          <div style="padding:32px;background:#fff;">
            <p style="font-size:16px;color:#1C2B20;margin-top:0;">Hi <strong>${name}</strong>,</p>
            <p style="color:#4A6151;line-height:1.75;font-size:14px;">
              Thank you for your interest in <strong>${guide.title}</strong>.
              Your free guide is ready — click the button below to download it.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${guide.url}"
                style="display:inline-block;background:#2E4D38;color:#fff;text-decoration:none;
                       padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600;
                       letter-spacing:0.04em;">
                Download Your Free Guide
              </a>
            </div>
            <div style="background:#FDF1DB;border-left:4px solid #597B60;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
              <p style="margin:0;font-size:13px;color:#4A6151;line-height:1.7;">
                <strong>${guide.title}</strong><br/>
                Created by Dr. Ragadeepthi Ediga — Women's Health & Nutrition Specialist
              </p>
            </div>
            <p style="color:#4A6151;line-height:1.75;font-size:14px;">
              When you're ready for a personalised consultation, our care coordinator
              will be in touch. You can also book directly at
              <a href="https://forherwellbeing.com/contact" style="color:#597B60;">forherwellbeing.com/contact</a>.
            </p>
            <p style="color:#7A9280;font-size:13px;margin-top:28px;border-top:1px solid #DFD5C6;padding-top:18px;">
              With care,<br/>
              <strong style="color:#1C2B20;">Dr. Ragadeepthi Ediga</strong><br/>
              <span style="color:#597B60;">ForHerWellbeing</span>
            </p>
          </div>
          <div style="background:#F5EDE0;padding:12px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#7A9280;">
              You received this because you requested a free guide at forherwellbeing.com.
            </p>
          </div>
        </div>
      `,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Lead guide email error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
