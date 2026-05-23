export default async function handler(req, res) {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  const prompt = `あなたはSalesforceのマーケティング戦略AIアドバイザーです。
以下のADSスコアデータを分析し、JSON形式で回答してください。

セグメント：全顧客
ADSスコア：45（好意ユーザー）
- IS（非代替性）：58
- IDS（同一化）：34 要改善
- NS（物語参加度）：47

以下のJSON形式で返してください：
{"diagnosis":"現状の診断（2-3文）","priority":"最優先課題（1文）","actions":[{"title":"施策1タイトル","type":"stop","detail":"詳細（2文）","kpi":"KPI"},{"title":"施策2タイトル","type":"start","detail":"詳細（2文）","kpi":"KPI"},{"title":"施策3タイトル","type":"start","detail":"詳細（2文）","kpi":"KPI"}],"warning":"注意事項（1文）"}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // 抽出テスト
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1] : text.match(/\{[\s\S]*\}/)?.[0];

  return res.status(200).json({ 
    raw_text: text,
    code_block_found: !!codeBlockMatch,
    json_str: jsonStr || 'NOT FOUND'
  });
}
