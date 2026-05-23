export default async function handler(req, res) {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  const fullPrompt = `あなたはSalesforceのマーケティング戦略AIアドバイザーです。
以下のADSスコアデータを分析し、必ずJSON形式のみで回答してください。
説明文・マークダウン・コードブロックは一切不要です。JSONだけ返してください。

セグメント：全顧客
ADSスコア：45（好意ユーザー）
- IS（非代替性）：58
- IDS（同一化）：34 ⚠ 要改善
- NS（物語参加度）：47

以下のJSON形式で返してください：
{"diagnosis":"現状の診断","priority":"最優先課題","actions":[{"title":"施策1","type":"stop","detail":"詳細","kpi":"KPI"},{"title":"施策2","type":"start","detail":"詳細","kpi":"KPI"},{"title":"施策3","type":"start","detail":"詳細","kpi":"KPI"}],"warning":"注意事項"}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // raw_textをそのまま返す（JSONパースしない）
  return res.status(200).json({ raw_text: text });
}
