export default function About() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 860 }}>
      <style>{`
        .about-section { margin-bottom: 48px; }
        .about-label { font-size: 11px; color: #4FC3F7; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px; }
        .about-h2 { font-size: 24px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.02em; }
        .about-p { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.9; margin: 0 0 12px; }
        .about-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px 28px; margin-bottom: 14px; }
        .about-card-title { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
        .about-card-desc { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.8; }
        .about-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 48px 0; }
        .about-formula { font-family: 'DM Mono', monospace; font-size: 16px; color: #F5A623; background: rgba(245,166,35,0.08); border: 1px solid rgba(245,166,35,0.2); border-radius: 10px; padding: 16px 24px; margin: 16px 0; }
        .about-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 4px; margin-right: 8px; font-family: 'DM Mono', monospace; }
        .about-step { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
        .about-step-num { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; font-family: 'DM Mono', monospace; }
      `}</style>

      {/* ヘッダー */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, color: "#4FC3F7", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>ABOUT ADS OPTIMIZER</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          ADS Optimizerとは
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: 0 }}>
          顧客との「関係の深さ」を数値化し、Salesforceの施策を最適化するツールです。
        </p>
      </div>

      <div className="about-divider" />

      {/* 1. このツールが解く問題 */}
      <div className="about-section">
        <div className="about-label">01 — PROBLEM</div>
        <h2 className="about-h2">このツールが解く問題</h2>
        <p className="about-p">
          多くの企業がCRM/MAを「売上を伸ばすアクセル」だと誤解しています。しかし実際には、CRM/MAは<strong style={{color:"#fff"}}>「既に発生した需要を取りこぼさない」</strong>ための装置です。需要がない顧客に大量配信しても、ノイズにしかなりません。
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
          <div style={{ background: "rgba(239,83,80,0.07)", border: "1px solid rgba(239,83,80,0.25)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, color: "#EF5350", letterSpacing: "0.1em", marginBottom: 10 }}>✕ よくある誤解</div>
            {["CRM/MAで「成長」できる", "施策量を増やせば売上が上がる", "LTV = 囲い込みの結果", "行動ログ（開封率・クリック率）を追えば十分"].map(t => (
              <div key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 6, display: "flex", gap: 8 }}>
                <span style={{ color: "#EF5350", flexShrink: 0 }}>✕</span>{t}
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(129,199,132,0.07)", border: "1px solid rgba(129,199,132,0.25)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, color: "#81C784", letterSpacing: "0.1em", marginBottom: 10 }}>✓ 正しい理解</div>
            {["CRMは「損失防止装置」", "需要×選択の制御が成長の主戦場", "LTV = 顧客が選び続ける構造", "「なぜ選ばれているか」の理由を測る"].map(t => (
              <div key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 6, display: "flex", gap: 8 }}>
                <span style={{ color: "#81C784", flexShrink: 0 }}>✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="about-divider" />

      {/* 2. LTVの見方を変える */}
      <div className="about-section">
        <div className="about-label">02 — LTV MODEL</div>
        <h2 className="about-h2">LTVの見方を変える</h2>
        <p className="about-p">
          LTVを「累計売上」として見るのをやめ、<strong style={{color:"#fff"}}>4つの確率の積</strong>として分解します。どこで顧客を失っているかが一目でわかります。
        </p>

        <div className="about-formula">
          LTV = 需要発生率 × 想起率 × 選択率 × 継続率 × 単価
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          {[
            { layer: "01", label: "需要発生", desc: "そもそも「使いたい」という状況が生まれているか", color: "#F5A623", sphere: "ADS SPHERE" },
            { layer: "02", label: "第一想起", desc: "需要が発生した瞬間に、自社が思い出されるか", color: "#4FC3F7", sphere: "ADS SPHERE" },
            { layer: "03", label: "選択", desc: "比較検討の場面で、競合に勝てているか", color: "#F06292", sphere: "CRM SPHERE" },
            { layer: "04", label: "継続", desc: "一度選んだ顧客が、次も選び続けるか", color: "#81C784", sphere: "CRM SPHERE" },
          ].map(item => (
            <div key={item.layer} style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 20px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: item.color + "22", border: `1px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: item.color, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{item.layer}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginLeft: 12 }}>{item.desc}</span>
              </div>
              <div style={{ fontSize: 10, color: item.color, background: item.color + "18", padding: "3px 10px", borderRadius: 4, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{item.sphere}</div>
            </div>
          ))}
        </div>

        <p className="about-p" style={{ marginTop: 16 }}>
          CRM/MAが触れられるのは「想起」と「継続」のみ。「需要」と「選択」はブランド設計・コンテンツ・体験の領域です。<strong style={{color:"#fff"}}>ADSはCRMが触れられない領域も含めて、関係の深さを測ります。</strong>
        </p>
      </div>

      <div className="about-divider" />

      {/* 3. ADSとは */}
      <div className="about-section">
        <div className="about-label">03 — ADS</div>
        <h2 className="about-h2">ADS（Affinity Depth Score）とは</h2>
        <p className="about-p">
          従来のツールは「クリックした」「開封した」という<strong style={{color:"#fff"}}>行動の結果</strong>しか見ていません。しかし本当に重要なのは、<strong style={{color:"#fff"}}>「なぜその行動をしたか」</strong>という理由です。
        </p>
        <p className="about-p">
          ADSは顧客の行動ログ・言語データ・時間軸データを解析し、「ブランドが顧客の意思決定構造にどれだけ深く根付いているか」を0〜100のスコアで表します。
        </p>

        <div className="about-formula">
          ADS = ( IS × IDS × NS )^(1/3) — 幾何平均
        </div>

        <p className="about-p">
          幾何平均を使う理由：3つの要素のうち<strong style={{color:"#fff"}}>いずれかがゼロなら全体もゼロ</strong>になります。「便利だから使っているだけで愛着はない」という偽のロイヤルティを排除するための設計です。
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[
            { score: "80-100", label: "コアファン", desc: "ブランドが自己表現の一部。他社を検討する選択肢自体が存在しない", color: "#81C784" },
            { score: "60-79", label: "準ファン", desc: "他社比較をせずに回帰する。ブランドへの信頼が確立されている", color: "#4FC3F7" },
            { score: "40-59", label: "好意ユーザー", desc: "好意的だが代替可能。習慣化・固定化が不十分な段階", color: "#F5A623" },
            { score: "20-39", label: "利便ユーザー", desc: "価格や機能の便利さで選ばれている。第一想起されにくい", color: "#FF8A65" },
            { score: "0-19", label: "単なる接触者", desc: "関係性なし。偶然の接触や意味を伴わない行動ログ", color: "#EF5350" },
          ].map(item => (
            <div key={item.score} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <div style={{ width: 60, fontFamily: "'DM Mono', monospace", fontSize: 12, color: item.color }}>{item.score}</div>
              <div style={{ width: 90, fontWeight: 600, fontSize: 13 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-divider" />

      {/* 4. IS / IDS / NS */}
      <div className="about-section">
        <div className="about-label">04 — THREE AXES</div>
        <h2 className="about-h2">IS / IDS / NS — 3軸の意味</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            {
              key: "IS", full: "Irreplaceability Score", label: "非代替性", color: "#4FC3F7",
              concept: "思考のショートカット",
              desc: "他社と比較せず、迷わず選ぶ状態。ブランド名で直接検索し、比較記事を読まずに購入する。",
              signals: ["指名検索・直接流入・ブックマーク", "比較記事の閲覧率の低さ", "休眠後の自発的復帰"],
              source: "GA4",
              threshold: "< 40 で要改善"
            },
            {
              key: "IDS", full: "Identification Score", label: "同一化", color: "#F06292",
              concept: "人格の一部化",
              desc: "ブランドが顧客の自己表現の一部になっている状態。「自分らしい」「ここじゃないとダメ」という語彙が出現する。",
              signals: ["レビュー・アンケートの自己表現語彙", "SNSでの公開選択・擁護行動", "ブランドへの帰属意識"],
              source: "SNS/アンケート",
              threshold: "< 40 で要改善"
            },
            {
              key: "NS", full: "Narrative Score", label: "物語参加", color: "#81C784",
              concept: "人生への浸透",
              desc: "ブランドが顧客の人生の記憶と結びついている状態。「初めて使ったのは〜」「あの時助かった」というエピソードが蓄積されている。",
              signals: ["継続年数・購入周期の規則性", "エピソード言語の出現率", "ライフイベントを跨いだ継続"],
              source: "CRM",
              threshold: "< 30 で要改善"
            },
          ].map(ax => (
            <div key={ax.key} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ax.color}33`, borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: ax.color, background: ax.color + "20", padding: "3px 10px", borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>{ax.key}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{ax.full}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{ax.label}</div>
              <div style={{ fontSize: 11, color: ax.color, marginBottom: 12 }}>{ax.concept}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 14 }}>{ax.desc}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>観測シグナル：</div>
              {ax.signals.map(s => (
                <div key={s} style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, display: "flex", gap: 6 }}>
                  <span style={{ color: ax.color }}>·</span>{s}
                </div>
              ))}
              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: ax.color, background: ax.color + "15", padding: "2px 8px", borderRadius: 4 }}>データ元：{ax.source}</span>
                <span style={{ fontSize: 10, color: "#EF5350" }}>{ax.threshold}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-divider" />

      {/* 5. AIサジェストのロジック */}
      <div className="about-section">
        <div className="about-label">05 — AI LOGIC</div>
        <h2 className="about-h2">AIサジェストのロジック</h2>
        <p className="about-p">
          AIサジェスト画面では、各セグメントのIS・IDS・NSスコアをGemini AIに渡し、<strong style={{color:"#fff"}}>「何を止めて、何を始めるべきか」を3つの施策として動的に生成</strong>します。
        </p>

        <div style={{ background: "rgba(79,195,247,0.05)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>AIに渡すデータ（例）</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 2 }}>
            セグメント：全顧客<br/>
            ADSスコア：45（好意ユーザー）<br/>
            IS（非代替性）：58<br/>
            IDS（同一化）：34 ⚠ 要改善<br/>
            NS（物語参加度）：47<br/>
            LTVボトルネック：第一想起（60%）
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { trigger: "IS < 40", action: "STOP", content: "価格・スペック比較訴求シナリオを停止", reason: "比較を促すコンテンツは非代替性をさらに下げる", color: "#EF5350" },
            { trigger: "IS < 40", action: "START", content: "ブランド独自語彙を浸透させるコンテンツを配信", reason: "「指名想起」を固定するための名詞上書き設計", color: "#81C784" },
            { trigger: "IDS < 40", action: "STOP", content: "機能紹介・スペック訴求メールを停止", reason: "機能比較は同一化ではなく利便性判断を促進する", color: "#EF5350" },
            { trigger: "IDS < 40", action: "START", content: "ブランドのスタンスや自己表現を伝えるストーリーメールを配信", reason: "顧客が「自分ごと」と感じるコンテンツが同一化を促進", color: "#81C784" },
            { trigger: "NS < 30", action: "STOP", content: "単なる再購入リマインドを停止", reason: "事務的な通知はエピソードの蓄積を阻害する", color: "#EF5350" },
            { trigger: "NS < 30", action: "START", content: "「初回購入から〇年記念」など時間軸イベントを配信", reason: "記憶と結びついた接点が物語参加度を高める", color: "#81C784" },
            { trigger: "ADS ≥ 80", action: "START", content: "VIP_Frictionlessフラグを付与し摩擦を完全除去", reason: "コアファンへの最大の投資は「邪魔をしない」こと", color: "#F5A623" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: item.color + "20", color: item.color, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", marginTop: 2 }}>{item.action}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{item.content}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.reason}</div>
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{item.trigger}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="about-divider" />

      {/* 6. 使い方 */}
      <div className="about-section">
        <div className="about-label">06 — HOW TO USE</div>
        <h2 className="about-h2">使い方の流れ</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
          {[
            { num: "01", label: "LTV分解で全体を把握する", desc: "まず「LTV分解」画面を開き、4層のファネルでどこに最大のボトルネックがあるかを確認します。赤い警告が出ている層が優先改善ポイントです。", color: "#F5A623" },
            { num: "02", label: "ADS診断で原因を特定する", desc: "「ADS診断」画面でIS・IDS・NSの3軸を確認します。40を下回っているスコアが、ボトルネックの根本原因です。", color: "#F06292" },
            { num: "03", label: "AIアドバイスで施策を生成する", desc: "「AIアドバイス」画面でボタンを押すと、そのセグメントのスコアに基づいた具体的なSalesforce施策をAIが動的に生成します。", color: "#4FC3F7" },
            { num: "04", label: "アクションをSalesforceに反映する", desc: "「アクション」画面でTRIGGEREDになっている施策を確認し、「Salesforceへ反映」ボタンで実行します。", color: "#81C784" },
            { num: "05", label: "実データでCSVを読み込む", desc: "「データ入力」画面からGA4・CRMデータをCSVでアップロードすると、モックデータから実データに切り替わります。", color: "#B39DDB" },
          ].map(step => (
            <div key={step.num} className="about-step">
              <div className="about-step-num" style={{ background: step.color + "22", border: `1px solid ${step.color}44`, color: step.color }}>{step.num}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{step.label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* フッター */}
      <div style={{ padding: "24px 28px", background: "rgba(79,195,247,0.05)", border: "1px solid rgba(79,195,247,0.15)", borderRadius: 14, marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>ADS PROJECT 2026 — POC v0.2</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
          現在はモックデータで動作しています。Phase 4ではGA4・Salesforce APIとの直接連携により、リアルタイムのスコアリングが可能になります。
        </div>
      </div>
    </div>
  );
}
