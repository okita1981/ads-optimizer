import { useState } from "react";
import { getADSLabel } from "../utils/scoring.js";

const SYSTEM_PROMPT = `あなたはADS Optimizer for Salesforceのマーケティング戦略AIアドバイザーです。
ADSスコア（IS：非代替性、IDS：同一化、NS：物語参加度）を分析し、Salesforceで実行すべき具体的な施策を提案します。

回答はJSON形式で、以下の構造にしてください：
{
  "diagnosis": "現状の診断（2-3文、核心を突く辛口な分析）",
  "priority": "最優先で解決すべき課題（1文）",
  "actions": [
    {
      "title": "施策タイトル",
      "type": "stop|start",
      "detail": "具体的なSalesforceシナリオの内容（2-3文）",
      "kpi": "効果測定のKPI"
    }
  ],
  "warning": "このセグメントへのMA配信で特に注意すべきこと（1文）"
}

actionsは必ず3つ。stopとstartを適切に混在させる。
JSONのみ返答し、マークダウン記法や前後の説明文は不要です。`;

export default function AISuggest({ adsData, segment, ltvData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { label: adsLabel } = getADSLabel(adsData.total);

  const bottleneck = ltvData ? (() => {
    let maxDrop = 0, b = null;
    for (let i = 1; i < ltvData.length; i++) {
      const drop = ltvData[i - 1].rate - ltvData[i].rate;
      if (drop > maxDrop) { maxDrop = drop; b = ltvData[i]; }
    }
    return b;
  })() : null;

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
セグメント：${segment}
ADSスコア：${adsData.total}（${adsLabel}）
- IS（非代替性）：${adsData.IS} ${adsData.IS < 40 ? "⚠ 要改善" : ""}
- IDS（同一化）：${adsData.IDS} ${adsData.IDS < 40 ? "⚠ 要改善" : ""}
- NS（物語参加度）：${adsData.NS} ${adsData.NS < 30 ? "⚠ 要改善" : ""}

LTVファネル最大ボトルネック：${bottleneck ? `${bottleneck.layer}（${bottleneck.rate}%）` : "データなし"}

このセグメントへの具体的なSalesforce施策を提案してください。`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("AIの応答取得に失敗しました。しばらく待ってから再試行してください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#4FC3F7", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>AI ADVISOR</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>AIサジェスト</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>
          ADSスコアの弱点を分析し、Salesforceで実行すべき具体的な施策をAIが動的生成します
        </p>
      </div>

      {/* Input summary */}
      <div style={{ marginTop: 24, display: "flex", gap: 14 }}>
        {[
          ["セグメント", segment, "#4FC3F7"],
          ["ADS総合", adsData.total, getADSLabel(adsData.total).color],
          ["IS", adsData.IS, adsData.IS < 40 ? "#EF5350" : "#4FC3F7"],
          ["IDS", adsData.IDS, adsData.IDS < 40 ? "#EF5350" : "#F06292"],
          ["NS", adsData.NS, adsData.NS < 30 ? "#EF5350" : "#81C784"],
        ].map(([label, val, color]) => (
          <div key={label} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace", color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Generate button */}
      <button onClick={generate} disabled={loading} style={{
        marginTop: 24, width: "100%", padding: "14px",
        background: loading ? "rgba(79,195,247,0.1)" : "linear-gradient(135deg, rgba(79,195,247,0.2), rgba(240,98,146,0.2))",
        border: "1px solid rgba(79,195,247,0.4)", borderRadius: 12,
        color: loading ? "rgba(255,255,255,0.4)" : "#fff",
        fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer",
        transition: "all 0.3s", letterSpacing: "0.02em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        {loading ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◎</span>
            AIが分析中...
          </>
        ) : (
          <>⚡ このセグメントの施策をAIが生成する</>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 16, padding: "12px 18px", background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.3)", borderRadius: 10 }}>
          <span style={{ color: "#EF5350" }}>✕ </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: 24 }}>
          {/* Diagnosis */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 10 }}>DIAGNOSIS</div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>{result.diagnosis}</div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(79,195,247,0.08)", borderRadius: 8, border: "1px solid rgba(79,195,247,0.2)" }}>
              <span style={{ color: "#4FC3F7", fontSize: 11, fontWeight: 600 }}>最優先課題：</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{result.priority}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {result.actions?.map((action, i) => (
              <div key={i} style={{
                background: action.type === "stop" ? "rgba(239,83,80,0.06)" : "rgba(129,199,132,0.06)",
                border: `1px solid ${action.type === "stop" ? "rgba(239,83,80,0.25)" : "rgba(129,199,132,0.25)"}`,
                borderRadius: 12, padding: "18px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4,
                    background: action.type === "stop" ? "rgba(239,83,80,0.2)" : "rgba(129,199,132,0.2)",
                    color: action.type === "stop" ? "#EF5350" : "#81C784",
                    letterSpacing: "0.1em",
                  }}>
                    {action.type === "stop" ? "✕ STOP" : "✓ START"}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{action.title}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 10 }}>{action.detail}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>KPI：</span>{action.kpi}
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          {result.warning && (
            <div style={{ padding: "12px 16px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: 10 }}>
              <span style={{ color: "#F5A623" }}>⚠ 注意：</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{result.warning}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
