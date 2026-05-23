export const SEGMENTS = ["全顧客", "エンタープライズ", "SMB", "スタートアップ"];

export const mockLTVData = {
  全顧客: [
    { layer: "需要発生", label: "Layer 1", value: 12400, rate: 100, metric: "課題コンテンツ流入数", color: "#F5A623" },
    { layer: "第一想起", label: "Layer 2", value: 7440, rate: 60, metric: "ブランド検索率 / 直接流入率", color: "#4FC3F7" },
    { layer: "選択", label: "Layer 3", value: 2976, rate: 24, metric: "CVR / 指名購入率", color: "#F06292" },
    { layer: "継続", label: "Layer 4", value: 1786, rate: 14.4, metric: "再購入率 / コホートLTV", color: "#81C784" },
  ],
  エンタープライズ: [
    { layer: "需要発生", label: "Layer 1", value: 3200, rate: 100, metric: "課題コンテンツ流入数", color: "#F5A623" },
    { layer: "第一想起", label: "Layer 2", value: 2240, rate: 70, metric: "ブランド検索率 / 直接流入率", color: "#4FC3F7" },
    { layer: "選択", label: "Layer 3", value: 1120, rate: 35, metric: "CVR / 指名購入率", color: "#F06292" },
    { layer: "継続", label: "Layer 4", value: 896, rate: 28, metric: "再購入率 / コホートLTV", color: "#81C784" },
  ],
  SMB: [
    { layer: "需要発生", label: "Layer 1", value: 6800, rate: 100, metric: "課題コンテンツ流入数", color: "#F5A623" },
    { layer: "第一想起", label: "Layer 2", value: 3740, rate: 55, metric: "ブランド検索率 / 直接流入率", color: "#4FC3F7" },
    { layer: "選択", label: "Layer 3", value: 1360, rate: 20, metric: "CVR / 指名購入率", color: "#F06292" },
    { layer: "継続", label: "Layer 4", value: 680, rate: 10, metric: "再購入率 / コホートLTV", color: "#81C784" },
  ],
  スタートアップ: [
    { layer: "需要発生", label: "Layer 1", value: 2400, rate: 100, metric: "課題コンテンツ流入数", color: "#F5A623" },
    { layer: "第一想起", label: "Layer 2", value: 1460, rate: 61, metric: "ブランド検索率 / 直接流入率", color: "#4FC3F7" },
    { layer: "選択", label: "Layer 3", value: 496, rate: 20.7, metric: "CVR / 指名購入率", color: "#F06292" },
    { layer: "継続", label: "Layer 4", value: 210, rate: 8.8, metric: "再購入率 / コホートLTV", color: "#81C784" },
  ],
};

export const mockADSData = {
  全顧客: { IS: 58, IDS: 34, NS: 47, total: 45 },
  エンタープライズ: { IS: 72, IDS: 55, NS: 68, total: 65 },
  SMB: { IS: 48, IDS: 28, NS: 38, total: 37 },
  スタートアップ: { IS: 35, IDS: 22, NS: 25, total: 27 },
};

export const mockDistribution = [
  { label: "コアファン", range: "80-100", count: 142, pct: 14.2, color: "#81C784" },
  { label: "準ファン", range: "60-79", count: 289, pct: 28.9, color: "#4FC3F7" },
  { label: "好意ユーザー", range: "40-59", count: 318, pct: 31.8, color: "#F5A623" },
  { label: "利便ユーザー", range: "20-39", count: 176, pct: 17.6, color: "#FF8A65" },
  { label: "単なる接触者", range: "0-19", count: 75, pct: 7.5, color: "#EF5350" },
];

export const mockTrend = [
  { month: "1月", IS: 48, IDS: 28, NS: 38, ADS: 37 },
  { month: "2月", IS: 50, IDS: 29, NS: 39, ADS: 39 },
  { month: "3月", IS: 52, IDS: 31, NS: 41, ADS: 41 },
  { month: "4月", IS: 54, IDS: 32, NS: 43, ADS: 43 },
  { month: "5月", IS: 55, IDS: 33, NS: 45, ADS: 44 },
  { month: "6月", IS: 58, IDS: 34, NS: 47, ADS: 45 },
];

export const ACTION_PATTERNS = [
  {
    pattern: "PATTERN 01", flow: "IS_BOOST",
    title: "IS不足対応", trigger: "IS < 40 AND Recall_Loss",
    issue: "需要発生時に思い出されない / 比較検討で埋もれる",
    stop: "価格・スペック比較訴求シナリオを停止",
    recommend: "ブランド独自語彙を浸透させるコンテンツ（名詞上書き設計）を配信",
    label: "指名想起の強化", color: "#4FC3F7", icon: "◎",
    check: (ads) => ads.IS < 40,
  },
  {
    pattern: "PATTERN 02", flow: "IDS_DEEPEN",
    title: "IDS不足対応", trigger: "IDS < 40 AND Active_User",
    issue: "好意的だが愛着がない / 自己表現に使われない",
    stop: "機能紹介メールの継続配信を停止",
    recommend: "ブランドのスタンスや自己表現の軸を伝えるストーリーメールを配信",
    label: "ブランドの人格化", color: "#F06292", icon: "♡",
    check: (ads) => ads.IDS < 40,
  },
  {
    pattern: "PATTERN 03", flow: "NS_ENGAGE",
    title: "NS不足対応", trigger: "NS < 30",
    issue: "関係が浅く、エピソードが蓄積されていない",
    stop: "単なる再購入リマインドを停止",
    recommend: "「初回購入から〇年記念」など時間軸に紐づいたイベント案内を配信",
    label: "物語への参加促進", color: "#81C784", icon: "◈",
    check: (ads) => ads.NS < 30,
  },
  {
    pattern: "PATTERN 04", flow: "VIP_AUTO",
    title: "高ADS顧客対応", trigger: "ADS ≥ 80",
    issue: "コアファン / 準ファン",
    stop: null,
    recommend: "VIP_Frictionlessフラグを付与し、サポート優先・購入簡略化・限定先行案内を適用",
    label: "摩擦の完全除去", color: "#F5A623", icon: "★",
    check: (ads) => ads.total >= 80,
  },
];
