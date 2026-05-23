export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { prompt } = req.body;

  const fullPrompt = `あなたはSalesforceのマーケティング戦略AIアドバイザーです。
以下のADSスコアデータを分析し、JSON形式で回答してください。

${prompt}

以下のJSON形式のみで返してください（簡潔に、各フィールドは短く）：
{"diagnosis":"診断（1文）","priority":"最優先課題（1文）","actions":[{"title":"施策1","type":"stop","detail":"詳細（1文）","kpi":"KPI"},{"title":"施策2","type":"start","detail":"詳細（1文）","kpi":"KPI"},{"title":"施策3","type":"start","detail":"詳細（1文）","kpi":"KPI"}],"warning":"注意（1文）"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({ error: 'Gemini API error', detail: errData });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // コードブロック内のJSONを優先抽出、なければ直接JSONを抽出
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonStr = codeBlockMatch ? codeBlockMatch[1] : text.match(/\{[\s\S]*\}/)?.[0];

    if (!jsonStr) {
      return res.status(500).json({ error: 'JSON not found', raw: text });
    }
    
    const parsed = JSON.parse(jsonStr);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
