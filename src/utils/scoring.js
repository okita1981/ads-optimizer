/**
 * ADS Score Calculation Engine
 * ADS = (IS × IDS × NS)^(1/3) — 幾何平均
 *
 * いずれかがゼロなら全体もゼロ（偽のロイヤルティを排除）
 */

export function calcADS(IS, IDS, NS) {
  if (IS <= 0 || IDS <= 0 || NS <= 0) return 0;
  return Math.round(Math.pow(IS * IDS * NS, 1 / 3));
}

/**
 * GA4 + CRM の行動ログから IS（非代替性）を算出
 *
 * IS = 指名行動スコア + 回帰行動スコア − 比較行動スコア
 * 各要素は 0-100 に正規化してから加重平均
 */
export function calcIS({ brandedSearchRate, directRate, bookmarkRate, returnRate, comparisonPageRate }) {
  // 指名行動（重み 0.4）
  const namedAction = normalize(brandedSearchRate + directRate * 0.5 + bookmarkRate * 0.3, 0, 100);
  // 回帰行動（重み 0.4）
  const returnAction = normalize(returnRate, 0, 100);
  // 比較回避（重み 0.2）：比較ページ閲覧率が低いほど高スコア
  const comparisonAvoid = normalize(100 - comparisonPageRate, 0, 100);

  return Math.round(namedAction * 0.4 + returnAction * 0.4 + comparisonAvoid * 0.2);
}

/**
 * CRM の時間軸ログから NS（物語参加度）を算出
 *
 * NS = 継続年数スコア + 規則性スコア + ライフイベント接続スコア
 */
export function calcNS({ continuationYears, purchaseRegularityScore, lifeEventContinuation }) {
  const yearsScore = normalize(continuationYears, 0, 10) * 100; // 10年以上 = 満点
  const regularityScore = normalize(purchaseRegularityScore, 0, 100);
  const lifeScore = lifeEventContinuation ? 100 : 0;

  return Math.round(yearsScore * 0.5 + regularityScore * 0.3 + lifeScore * 0.2);
}

/**
 * CSV データから LTV 分解ファネルを生成
 */
export function buildLTVFunnel(rows) {
  const total = rows.length;
  if (total === 0) return null;

  const layer1 = total; // 全行 = 需要発生済み
  const layer2 = rows.filter(r => r.branded_search === "1" || r.direct === "1").length;
  const layer3 = rows.filter(r => r.converted === "1").length;
  const layer4 = rows.filter(r => r.repurchased === "1").length;

  const colors = ["#F5A623", "#4FC3F7", "#F06292", "#81C784"];
  const metrics = ["課題コンテンツ流入数", "ブランド検索率 / 直接流入率", "CVR / 指名購入率", "再購入率 / コホートLTV"];

  return [
    { layer: "需要発生", label: "Layer 1", value: layer1, rate: 100, metric: metrics[0], color: colors[0] },
    { layer: "第一想起", label: "Layer 2", value: layer2, rate: +(layer2 / layer1 * 100).toFixed(1), metric: metrics[1], color: colors[1] },
    { layer: "選択", label: "Layer 3", value: layer3, rate: +(layer3 / layer1 * 100).toFixed(1), metric: metrics[2], color: colors[2] },
    { layer: "継続", label: "Layer 4", value: layer4, rate: +(layer4 / layer1 * 100).toFixed(1), metric: metrics[3], color: colors[3] },
  ];
}

/**
 * CSV データから ADS スコアをセグメント集計
 */
export function buildADSFromCSV(rows) {
  if (rows.length === 0) return null;

  const avg = (key) => rows.reduce((s, r) => s + (parseFloat(r[key]) || 0), 0) / rows.length;

  const IS = Math.round(avg("is_score"));
  const IDS = Math.round(avg("ids_score"));
  const NS = Math.round(avg("ns_score"));
  const total = calcADS(IS, IDS, NS);

  return { IS, IDS, NS, total };
}

/**
 * ボトルネック検出（最大ドロップ層を返す）
 */
export function detectBottleneck(ltvData) {
  let maxDrop = 0;
  let bottleneck = null;
  for (let i = 1; i < ltvData.length; i++) {
    const drop = ltvData[i - 1].rate - ltvData[i].rate;
    if (drop > maxDrop) {
      maxDrop = drop;
      bottleneck = ltvData[i];
    }
  }
  return bottleneck;
}

export function getADSLabel(score) {
  if (score >= 80) return { label: "コアファン", color: "#81C784" };
  if (score >= 60) return { label: "準ファン", color: "#4FC3F7" };
  if (score >= 40) return { label: "好意ユーザー", color: "#F5A623" };
  if (score >= 20) return { label: "利便ユーザー", color: "#FF8A65" };
  return { label: "単なる接触者", color: "#EF5350" };
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function normalize(value, min, max) {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}
