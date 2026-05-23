export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { prompt } = req.body;

  // システムプロンプトをユーザープロンプトに組み込む形式に変更
  const fullPrompt = `あなたはSalesforceのマーケティング戦略AIアドバイザーです。
以下のADSスコアデータを分析し、必ずJSON形式のみで回答してください。
説明文・マークダウン・コードブロックは一切不要です。JSONだけ返してください。

${prompt}

以下のJSON形式で返してください：
{"diagnosis":"現状の診断（2-3文）","priority":"最優先課題（1文）","actions":[{"title":"施策1タイトル","type":"stop","detail":"詳細（2文）","kpi":"KPI"},{"title":"施策2タイトル","type":"start","detail":"詳細（2文）","kpi":"KPI"},{"title":"施策3タイトル","type":"start","detail":"詳細（2文）","kpi":"KPI"}],"warning":"注意事項（1文）"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: { 
            temperature: 0.7, 
            maxOutputTokens: 1000,
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
    
    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'JSON not found', raw: text });
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
