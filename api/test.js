export default async function handler(req, res) {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ status: 'NO_API_KEY' });
  }

  // 利用可能なモデル一覧を取得
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: 'GET' }
    );
    const data = await response.json();
    // generateContentをサポートするモデルだけ抽出
    const models = (data.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name);
    return res.status(200).json({ available_models: models });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
