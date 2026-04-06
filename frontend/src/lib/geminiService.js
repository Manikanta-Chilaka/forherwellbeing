const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/* ─── Detect MIME type from URL/filename ─────────────────── */
function getMimeType(url) {
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
  return map[ext] || 'image/jpeg';
}

/* ─── Analyze Lab Report Images ──────────────────────────── */
export async function analyzeLabReports(reportUrls) {
  const prompt = `You are a clinical nutritionist analyzing lab reports.
Look at the provided lab report image(s) and extract ALL lab markers you can find.

Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "marker": "Hemoglobin",
    "value": "10.2 g/dL",
    "status": "LOW",
    "significance": "Anemic. Target >12.0 g/dL before conception. Increase iron-rich foods."
  }
]

Status must be one of: "OPTIMAL", "HIGH", "LOW", "LOW-NORMAL", "HIGH-NORMAL", "BORDERLINE"
Be concise but clinically accurate in the significance field.
Extract every marker visible in the report.`;

  // Fetch each image and convert to base64 inline data
  const imageDataParts = await Promise.all(
    reportUrls.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();

        // Prefer MIME from URL extension — blob.type is often empty from Supabase
        const mimeType = getMimeType(url) || blob.type || 'image/jpeg';

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            // result is like "data:image/jpeg;base64,/9j/..."
            const b64 = result.split(',')[1];
            if (!b64) reject(new Error('Empty base64'));
            else resolve(b64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        return { inlineData: { mimeType, data: base64 } };
      } catch (err) {
        console.warn('Could not load image:', url, err.message);
        return null;
      }
    })
  );

  const validParts = imageDataParts.filter(Boolean);
  if (validParts.length === 0) {
    throw new Error('Could not load report images. Make sure they are JPG or PNG files.');
  }

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        ...validParts,
      ],
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Show the actual Gemini error message
    let errMsg = `Gemini API error: ${res.status}`;
    try {
      const errBody = await res.json();
      errMsg = errBody?.error?.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

  // Clean and parse JSON
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}


/* ─── Generate Diet Plan from Lab Results + Patient Data ─
   Generates a complete structured diet plan.
──────────────────────────────────────────────────────── */
export async function generateAIDietPlan(patient, labMarkers) {
  const labSummary = labMarkers.length > 0
    ? labMarkers.map(m => `${m.marker}: ${m.value} (${m.status})`).join('\n')
    : 'No lab markers provided.';

  const prompt = `You are Dr. Raga Deepthi, a specialist in women's health and nutrition at ForHerWellbeing clinic.

PATIENT PROFILE:
- Name: ${patient.name || 'Patient'}
- Age: ${patient.age || 'Unknown'} years
- Condition: ${patient.condition || 'General wellness'}
- Diet Type: ${patient.dietType || 'Non-Vegetarian'}
- Food Dislikes / Avoidances: ${patient.foodDislikes || 'None'}
- Known Allergies: ${patient.allergies || 'None'}
- Medications: ${patient.medications || 'None'}
- Menstrual Health: ${patient.menstrual || 'Not specified'}
- Stress Level: ${patient.stress || 'Not specified'}
- Sleep: ${patient.sleep || 'Not specified'}
- Activity Level: ${patient.activity || 'Not specified'}
- Weekly Budget: ${patient.budget || 'Not specified'}

LAB RESULTS:
${labSummary}

Create a PERSONALIZED 14-day diet plan that specifically addresses the lab deficiencies and the patient's condition.
Food suggestions must respect: diet type (${patient.dietType}), allergies, and food dislikes.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "planTitle": "string",
  "calorieTarget": "number as string",
  "dietType": "string",
  "duration": "14",
  "meals": {
    "earlyMorning": { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "breakfast":    { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "midMorning":   { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "lunch":        { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "eveningSnack": { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "dinner":       { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "bedtime":      { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" }
  },
  "restrictions": {
    "avoid":       "string",
    "recommended": "string",
    "lifestyle":   "string",
    "water":       "string",
    "exercise":    "string"
  },
  "doctorNotes": "string"
}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
