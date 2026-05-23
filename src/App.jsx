import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
} from "recharts";
import {
  SEGMENTS, mockLTVData, mockADSData, mockDistribution, mockTrend, ACTION_PATTERNS
} from "./data/mockData.js";
import { detectBottleneck, getADSLabel } from "./utils/scoring.js";
import CSVUpload from "./components/CSVUpload.jsx";
import AISuggest from "./components/AISuggest.jsx";
import About from "./components/About.jsx";

// ─── SHARED UI ────────────────────────────────────────────────────────────────

function AlertBadge({ message }) {
  return (
    <div style={{ background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.35)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12 }}>
      <span style={{ color: "#EF5350", fontSize: 15 }}>⚠</span>
      <span style={{ color: "#ffcdd2", fontSize: 12, lineHeight: 1.6 }}>{message}</span>
    </div>
  );
}

// ─── SCREEN A: LTV Funnel ─────────────────────────────────────────────────────

function ScreenLTV({ ltvData }) {
  const bottleneck = detectBottleneck(ltvData);
  const showAlert = ltvData[1].rate < 50;

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#F5A623", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>LTV BREAKDOWN</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>LTV分解ダッシュボード</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>
          売上を4つの確率の積に分解し、どの層で損失が発生しているかを特定する
        </p>
      </div>

      {showAlert && (
        <AlertBadge message="警告：第一想起率（Layer 2）が極端に低い状態です。セールスフォースのシナリオ配信量だけが多い場合、価値未到達のユーザーへの過剰なMA配信は離脱を加速させます。" />
      )}

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        {ltvData.map((d, i) => {
          const drop = i > 0 ? ltvData[i - 1].rate - d.rate : 0;
          const isBottleneck = bottleneck?.layer === d.layer;
          return (
            <div key={d.layer}>
              {i > 0 && drop > 20 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", marginBottom: 4 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(239,83,80,0.3)" }} />
                  <span style={{ color: "#EF5350", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>▼ {drop.toFixed(1)}% ロス</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(239,83,80,0.3)" }} />
                </div>
              )}
              <div style={{
                background: isBottleneck ? "rgba(239,83,80,0.07)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isBottleneck ? "rgba(239,83,80,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 12, padding: "18px 24px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: d.color + "22", border: `1px solid ${d.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: d.color, fontFamily: "'DM Mono', monospace" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{d.layer}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{d.metric}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: isBottleneck ? "#EF5350" : d.color }}>{d.rate.toFixed(1)}%</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{d.value.toLocaleString()} セッション</div>
                  </div>
                </div>
                <div style={{ position: "relative", height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${d.rate}%`, background: isBottleneck ? "#EF5350" : d.color, borderRadius: 3, boxShadow: `0 0 10px ${d.color}55` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, padding: "18px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>総合転換率</div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#81C784" }}>{ltvData[ltvData.length - 1].rate.toFixed(1)}%</div>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>最大ボトルネック</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#EF5350" }}>{bottleneck?.layer}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>優先改善レイヤー</div>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>LTV分解式</div>
          <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>需要 × 想起 × 選択 × 継続 × 単価</div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN B: ADS Radar ─────────────────────────────────────────────────────

function ScreenADS({ adsData }) {
  const radarData = [
    { axis: "IS 非代替性", value: adsData.IS },
    { axis: "IDS 同一化", value: adsData.IDS },
    { axis: "NS 物語参加", value: adsData.NS },
  ];
  const axes = [
    { key: "IS", label: "非代替性", desc: "指名行動・比較回避・回帰行動", value: adsData.IS, color: "#4FC3F7" },
    { key: "IDS", label: "同一化", desc: "自己表現語彙・公開選択・擁護行動", value: adsData.IDS, color: "#F06292" },
    { key: "NS", label: "物語参加", desc: "継続年数・エピソード言語・ライフ接続", value: adsData.NS, color: "#81C784" },
  ];
  const { label, color } = getADSLabel(adsData.total);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#F06292", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>AFFINITY DEPTH SCORE</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>深層ADS診断レーダー</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>顧客心理の3軸構造を可視化し、ブランドの意思決定への根張り度を測定する</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 28 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Score ring */}
          <div style={{ position: "relative", width: 120, height: 120, marginBottom: 8 }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - adsData.total / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono', monospace", color }}>{adsData.total}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>ADS</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color, fontWeight: 600, marginBottom: 16 }}>{label}</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "'DM Mono', monospace" }} />
              <Radar dataKey="value" stroke="#F06292" fill="#F06292" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#F06292", r: 4 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {axes.map((ax) => {
            const isWeak = ax.value < 40;
            return (
              <div key={ax.key} style={{ background: isWeak ? "rgba(239,83,80,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${isWeak ? "rgba(239,83,80,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: ax.color, background: ax.color + "20", padding: "2px 8px", borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>{ax.key}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{ax.label}</span>
                      {isWeak && <span style={{ fontSize: 10, color: "#EF5350", background: "rgba(239,83,80,0.15)", padding: "1px 6px", borderRadius: 4 }}>要改善</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{ax.desc}</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: isWeak ? "#EF5350" : ax.color }}>{ax.value}</div>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${ax.value}%`, background: isWeak ? "#EF5350" : ax.color, borderRadius: 2, boxShadow: `0 0 8px ${isWeak ? "#EF5350" : ax.color}55` }} />
                </div>
              </div>
            );
          })}

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>スコアリングロジック</div>
            <div style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.7)" }}>ADS = (IS × IDS × NS)^(1/3)</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>幾何平均 — いずれかがゼロなら全体もゼロ。偽のロイヤルティを排除。</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>月次ADSトレンド（直近6ヶ月）</div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={mockTrend}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="IS" stroke="#4FC3F7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="IDS" stroke="#F06292" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="NS" stroke="#81C784" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ADS" stroke="#F5A623" strokeWidth={2.5} dot={{ r: 3, fill: "#F5A623" }} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          {[["IS", "#4FC3F7"], ["IDS", "#F06292"], ["NS", "#81C784"], ["ADS総合", "#F5A623"]].map(([k, c]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 2, background: c }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN C: Actions ────────────────────────────────────────────────────────

function ScreenActions({ adsData }) {
  const [applied, setApplied] = useState({});

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#81C784", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>STRATEGY ACTION</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>戦略アクション・サジェスト</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>ADSの弱点スコアに応じて、Salesforceで動かすべきシナリオを自動提案する</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
        {ACTION_PATTERNS.map((action) => {
          const isTriggered = action.check(adsData);
          const isApplied = applied[action.flow];
          return (
            <div key={action.flow} style={{
              background: isTriggered ? action.color + "0a" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isTriggered ? action.color + "44" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14, padding: "20px 22px",
              opacity: isTriggered ? 1 : 0.4, transition: "all 0.3s",
              position: "relative", overflow: "hidden",
            }}>
              {isTriggered && (
                <div style={{ position: "absolute", top: 0, right: 0, background: action.color, color: "#000", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderBottomLeftRadius: 8, letterSpacing: "0.08em" }}>
                  TRIGGERED
                </div>
              )}
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: action.color + "20", border: `1px solid ${action.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: action.color, flexShrink: 0 }}>{action.icon}</div>
                <div>
                  <div style={{ fontSize: 9, color: action.color, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>{action.pattern}</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{action.title}</div>
                </div>
              </div>

              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>TRIGGER: {action.trigger}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 12, lineHeight: 1.6 }}>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>課題：</span>{action.issue}
              </div>

              {action.stop && (
                <div style={{ display: "flex", gap: 8, marginBottom: 8, padding: "8px 12px", background: "rgba(239,83,80,0.08)", borderRadius: 8, border: "1px solid rgba(239,83,80,0.2)" }}>
                  <span style={{ color: "#EF5350", fontSize: 12 }}>✕ 停止：</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{action.stop}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, padding: "8px 12px", background: action.color + "10", borderRadius: 8, border: `1px solid ${action.color}20` }}>
                <span style={{ color: action.color, fontSize: 12 }}>✓ 推奨：</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{action.recommend}</span>
              </div>

              <button
                onClick={() => setApplied(p => ({ ...p, [action.flow]: !p[action.flow] }))}
                disabled={!isTriggered}
                style={{
                  width: "100%", padding: "9px 0",
                  background: isApplied ? action.color : "transparent",
                  border: `1px solid ${action.color}`,
                  borderRadius: 8, color: isApplied ? "#000" : action.color,
                  fontSize: 12, fontWeight: 700, cursor: isTriggered ? "pointer" : "default",
                  transition: "all 0.2s",
                }}>
                {isApplied ? "✓ Salesforceに反映済み" : "Salesforceへ反映"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SCREEN D: Distribution ───────────────────────────────────────────────────

function ScreenDistribution() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#F5A623", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>BRAND RISK</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>顧客ポートフォリオ分布</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>ブランドリスク判定 — 価格競争に巻き込まれやすい層の割合を可視化する</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 28 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>ADSスコア別分布（全1,000名）</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockDistribution} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={80} tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}名`]} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#4FC3F7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mockDistribution.map((d) => (
            <div key={d.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{d.label}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginLeft: 8, fontFamily: "'DM Mono', monospace" }}>ADS {d.range}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: d.color }}>{d.pct}%</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>{d.count}名</span>
                  </div>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${d.pct * 3}%`, background: d.color, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ background: "rgba(239,83,80,0.07)", border: "1px solid rgba(239,83,80,0.25)", borderRadius: 12, padding: "14px 16px", marginTop: 6 }}>
            <div style={{ fontSize: 12, color: "#EF5350", fontWeight: 600, marginBottom: 6 }}>ブランドリスク判定</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#FF8A65" }}>25.1%</span> が広告依存・価格競争リスク層（ADS 0-39）
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
              Layer1・Layer2の強化を優先してください。
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}>
        {[
          { label: "コアファン比率", value: "14.2%", sub: "80+ ADS", color: "#81C784" },
          { label: "広告依存リスク層", value: "25.1%", sub: "0-39 ADS", color: "#EF5350" },
          { label: "12ヶ月LTV（高ADS群）", value: "¥104K", sub: "+30% vs 平均", color: "#4FC3F7" },
          { label: "CAC/LTV比率", value: "1 : 4.2", sub: "導入後予測", color: "#F5A623" },
        ].map((k) => (
          <div key={k.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const NAV = [
  { id: "ltv", label: "LTV分解", icon: "▽", sub: "ファネル可視化" },
  { id: "ads", label: "ADS診断", icon: "◎", sub: "レーダーチャート" },
  { id: "actions", label: "アクション", icon: "⚡", sub: "施策サジェスト" },
  { id: "ai", label: "AIアドバイス", icon: "✦", sub: "動的施策生成" },
  { id: "dist", label: "分布分析", icon: "◈", sub: "ブランドリスク" },
  { id: "csv", label: "データ入力", icon: "↑", sub: "CSVアップロード" },
  { id: "about", label: "ADSについて", icon: "?", sub: "概念・使い方" },
];

export default function App() {
  const [screen, setScreen] = useState("ltv");
  const [segment, setSegment] = useState("全顧客");
  const [csvData, setCsvData] = useState(null); // { rows, ltv, ads }

  const ltvData = csvData?.ltv || mockLTVData[segment];
  const adsData = csvData?.ads || mockADSData[segment];
  const { label: adsLabel, color: adsColor } = getADSLabel(adsData.total);

  return (
    <div style={{ minHeight: "100vh", background: "#070d17", color: "#f0f4ff", fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        button { font-family: inherit; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: "24px 0" }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #4FC3F7, #F06292)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.02em" }}>ADS Optimizer</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>FOR SALESFORCE</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 20px 18px" }} />

        {/* Segment (hidden when CSV loaded) */}
        {!csvData && (
          <div style={{ padding: "0 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>SEGMENT</div>
            {SEGMENTS.map(s => (
              <button key={s} onClick={() => setSegment(s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 12px", borderRadius: 8, marginBottom: 2, background: segment === s ? "rgba(79,195,247,0.12)" : "transparent", border: `1px solid ${segment === s ? "rgba(79,195,247,0.3)" : "transparent"}`, color: segment === s ? "#4FC3F7" : "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        )}

        {csvData && (
          <div style={{ padding: "0 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>DATA SOURCE</div>
            <div style={{ fontSize: 11, color: "#81C784", background: "rgba(129,199,132,0.1)", border: "1px solid rgba(129,199,132,0.25)", borderRadius: 8, padding: "6px 10px" }}>
              ✓ CSV読み込み済み<br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{csvData.rows.length}件</span>
            </div>
            <button onClick={() => setCsvData(null)} style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
              モックデータに戻す
            </button>
          </div>
        )}

        {/* ADS mini */}
        <div style={{ padding: "0 16px", marginBottom: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>ADS SCORE</div>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: adsColor }}>{adsData.total}</div>
            <div style={{ fontSize: 11, color: adsColor, marginTop: 2 }}>{adsLabel}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {[["IS", adsData.IS, "#4FC3F7"], ["IDS", adsData.IDS, "#F06292"], ["NS", adsData.NS, "#81C784"]].map(([k, v, c]) => (
                <div key={k} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: v < 40 ? "#EF5350" : c }}>{v}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "0 16px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>SCREENS</div>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setScreen(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, marginBottom: 3, background: screen === item.id ? "rgba(255,255,255,0.08)" : "transparent", border: `1px solid ${screen === item.id ? "rgba(255,255,255,0.12)" : "transparent"}`, color: screen === item.id ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              <span style={{ width: 16, textAlign: "center" }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: screen === item.id ? 600 : 400 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{item.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: "14px 20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)" }}>ADS PROJECT 2026<br />POC v0.2</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {screen === "ltv" && <ScreenLTV ltvData={ltvData} />}
        {screen === "ads" && <ScreenADS adsData={adsData} />}
        {screen === "actions" && <ScreenActions adsData={adsData} />}
        {screen === "ai" && <AISuggest adsData={adsData} segment={csvData ? "CSVデータ" : segment} ltvData={ltvData} />}
        {screen === "dist" && <ScreenDistribution />}
        {screen === "csv" && <CSVUpload onDataLoaded={(data) => { setCsvData(data); setScreen("ltv"); }} />}
        {screen === "about" && <About />}
      </div>
    </div>
  );
}
