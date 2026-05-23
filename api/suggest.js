export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { prompt } = req.body;

  const systemPrompt = `あなたはADS Optimizer for Salesforceのマーケティング戦略AIアドバイザーです。
必ずJSON形式のみで回答してください。説明文・マークダウン・コードブロックは一切不要です。
以下の形式で返してください：
{"diagnosis":"診断文","priority":"最優先課題","actions":[{"title":"タイトル","type":"stop","detail":"詳細","kpi":"KPI"},{"title":"タイトル","type":"start","detail":"詳細","kpi":"KPI"},{"title":"タイトル","type":"start","detail":"詳細","kpi":"KPI"}],"warning":"注意事項"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({ error: 'Gemini API error', detail: errData });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // JSON部分だけを抽出（```json ... ``` や余分なテキストを除去）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'JSON not found in response', raw: text });
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('suggest error:', err);
    return res.status(500).json({ error: err.message });
  }
}
