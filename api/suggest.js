export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { prompt } = req.body;

  const systemPrompt = `あなたはADS Optimizer for Salesforceのマーケティング戦略AIアドバイザーです。
ADSスコア（IS：非代替性、IDS：同一化、NS：物語参加度）を分析し、Salesforceで実行すべき具体的な施策を提案します。

回答はJSON形式のみで返してください。前後の説明文やマークダウン記法は不要です：
{
  "diagnosis": "現状の診断（2-3文、核心を突く分析）",
  "priority": "最優先で解決すべき課題（1文）",
  "actions": [
    {
      "title": "施策タイトル",
      "type": "stop or start",
      "detail": "具体的なSalesforceシナリオの内容（2-3文）",
      "kpi": "効果測定のKPI"
    }
  ],
  "warning": "このセグメントへのMA配信で特に注意すべきこと（1文）"
}
actionsは必ず3つ。stopとstartを適切に混在させる。`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'AI generation failed', detail: err.message });
  }
}
