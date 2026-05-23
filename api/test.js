export default async function handler(req, res) {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ status: 'NO_API_KEY', env_keys: Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('VITE')) });
  }

  // Gemini APIに最小限のリクエストを送る
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say "OK" in JSON: {"status":"OK"}' }] }],
        }),
      }
    );
    const data = await response.json();
    return res.status(200).json({ 
      status: response.ok ? 'SUCCESS' : 'GEMINI_ERROR',
      http_status: response.status,
      data 
    });
  } catch (err) {
    return res.status(200).json({ status: 'FETCH_ERROR', error: err.message });
  }
}
