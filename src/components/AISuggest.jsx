import { useState } from "react";
import { getADSLabel } from "../utils/scoring.js";

export default function AISuggest({ adsData, segment, ltvData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { label: adsLabel, color } = getADSLabel(adsData.total);

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
- IS（非代替性）：${adsData.IS}${adsData.IS < 40 ? " ⚠ 要改善" : ""}
- IDS（同一化）：${adsData.IDS}${adsData.IDS < 40 ? " ⚠ 要改善" : ""}
- NS（物語参加度）：${adsData.NS}${adsData.NS < 30 ? " ⚠ 要改善" : ""}
LTVファネル最大ボトルネック：${bottleneck ? `${bottleneck.layer}（${bottleneck.rate}%）` : "データなし"}

このセグメントへの具体的なSalesforce施策をJSONで提案してください。`;

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'API error');
      }

      const parsed = await response.json();
      setResult(parsed);
    } catch (err) {
      setError("AIの応答取得に失敗しました：" + err.message);
      console.error(err);
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

      {/* スコアサマリー */}
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        {[
          ["セグメント", segment, "#4FC3F7"],
          ["ADS総合", adsData.total, color],
          ["IS", adsData.IS, adsData.IS < 40 ? "#EF5350" : "#4FC3F7"],
          ["IDS", adsData.IDS, adsData.IDS < 40 ? "#EF5350" : "#F06292"],
          ["NS", adsData.NS, adsData.NS < 30 ? "#EF5350" : "#81C784"],
        ].map(([lbl, val, c]) => (
          <div key={lbl} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{lbl}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: c }}>{val}</div>
          </div>
        ))}
      </div>

      {/* 生成ボタン */}
      <button onClick={generate} disabled={loading} style={{
        marginTop: 24, width: "100%", padding: "14px",
        background: loading ? "rgba(79,195,247,0.08)" : "linear-gradient(135deg, rgba(79,195,247,0.15), rgba(240,98,146,0.15))",
        border: "1px solid rgba(79,195,247,0.4)", borderRadius: 12,
        color: loading ? "rgba(255,255,255,0.4)" : "#fff",
        fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer",
        transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        {loading
          ? <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◎</span> AIが分析中...</>
          : <>⚡ このセグメントの施策をAIが生成する</>
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {error && (
        <div style={{ marginTop: 16, padding: "12px 18px", background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.3)", borderRadius: 10 }}>
          <span style={{ color: "#EF5350" }}>✕ </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{error}</span>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 10 }}>DIAGNOSIS</div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>{result.diagnosis}</div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(79,195,247,0.08)", borderRadius: 8, border: "1px solid rgba(79,195,247,0.2)" }}>
              <span style={{ color: "#4FC3F7", fontSize: 11, fontWeight: 600 }}>最優先課題：</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{result.priority}</span>
            </div>
          </div>

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
                    color: action.type === "stop" ? "#EF5350" : "#81C784", letterSpacing: "0.1em",
                  }}>
                    {action.type === "stop" ? "✕ STOP" : "✓ START"}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{action.title}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 8 }}>{action.detail}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>KPI：</span>{action.kpi}
                </div>
              </div>
            ))}
          </div>

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
