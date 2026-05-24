import { useRef, useState } from "react";
import Papa from "papaparse";
import { buildLTVFunnel, buildADSFromCSV, buildDistributionFromCSV } from "../utils/scoring.js";

const SAMPLE_CSV = `customer_id,segment,branded_search,direct,converted,repurchased,is_score,ids_score,ns_score,continuation_years
C001,エンタープライズ,1,1,1,1,72,55,68,5
C002,SMB,0,1,1,0,48,28,38,2
C003,スタートアップ,0,0,0,0,22,18,20,0
C004,エンタープライズ,1,1,1,1,80,70,75,8
C005,SMB,1,0,1,1,55,32,45,3
C006,スタートアップ,0,1,1,0,35,22,28,1
C007,全顧客,1,1,1,1,65,48,60,4
C008,SMB,0,0,0,0,18,12,15,0
C009,エンタープライズ,1,1,1,1,78,62,70,7
C010,スタートアップ,1,0,1,0,42,25,35,2`;

const REQUIRED_COLS = ["customer_id", "branded_search", "direct", "converted", "repurchased", "is_score", "ids_score", "ns_score"];

export default function CSVUpload({ onDataLoaded }) {
  const fileRef = useRef();
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setErrorMsg("CSVファイルのみ対応しています（.csv）");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cols = result.meta.fields || [];
        const missing = REQUIRED_COLS.filter(c => !cols.includes(c));
        if (missing.length > 0) {
          setStatus("error");
          setErrorMsg(`必須列が不足しています: ${missing.join(", ")}`);
          return;
        }
        const rows = result.data;
        const ltv = buildLTVFunnel(rows);
        const ads = buildADSFromCSV(rows);
        const distribution = buildDistributionFromCSV(rows);
        setPreview({ rows: rows.slice(0, 3), total: rows.length, ltv, ads });
        setStatus("success");
        onDataLoaded({ rows, ltv, ads, distribution });
      },
      error: (err) => {
        setStatus("error");
        setErrorMsg("CSVの解析に失敗しました: " + err.message);
      },
    });
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ads_sample_data.csv";
    a.click();
  }

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#F5A623", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>DATA INPUT</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>CSVデータアップロード</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>
          GA4・CRMからエクスポートしたCSVを読み込み、実データでADSスコアを算出します
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current.click()}
        style={{
          marginTop: 28, border: `2px dashed ${dragging ? "#4FC3F7" : "rgba(255,255,255,0.15)"}`,
          borderRadius: 16, padding: "48px 24px", textAlign: "center",
          cursor: "pointer", transition: "all 0.2s",
          background: dragging ? "rgba(79,195,247,0.05)" : "rgba(255,255,255,0.02)",
        }}
      >
        <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>CSVファイルをドロップ、またはクリックして選択</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          対応フォーマット: GA4エクスポート / Salesforceレポート / 手動作成CSV
        </div>
      </div>

      {/* Status */}
      {status === "error" && (
        <div style={{ marginTop: 16, padding: "12px 18px", background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.3)", borderRadius: 10 }}>
          <span style={{ color: "#EF5350" }}>✕ エラー：</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{errorMsg}</span>
        </div>
      )}
      {status === "success" && preview && (
        <div style={{ marginTop: 16, padding: "12px 18px", background: "rgba(129,199,132,0.08)", border: "1px solid rgba(129,199,132,0.3)", borderRadius: 10 }}>
          <span style={{ color: "#81C784" }}>✓ 読み込み完了：</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{preview.total}件のデータを解析しました。各画面に反映されます。</span>
        </div>
      )}

      {/* Preview table */}
      {preview && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>プレビュー（先頭3件）</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {Object.keys(preview.rows[0] || {}).map(k => (
                    <th key={k} style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontWeight: 500, whiteSpace: "nowrap" }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Mono', monospace" }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Required columns spec */}
      <div style={{ marginTop: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14 }}>必須列の仕様</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["customer_id", "顧客ID（ユニーク）", "#4FC3F7"],
            ["branded_search", "指名検索流入: 1=あり 0=なし", "#4FC3F7"],
            ["direct", "直接流入: 1=あり 0=なし", "#4FC3F7"],
            ["converted", "購入完了: 1=あり 0=なし", "#F06292"],
            ["repurchased", "再購入: 1=あり 0=なし", "#F06292"],
            ["is_score", "非代替性スコア（0-100）", "#81C784"],
            ["ids_score", "同一化スコア（0-100）", "#81C784"],
            ["ns_score", "物語参加スコア（0-100）", "#81C784"],
          ].map(([col, desc, color]) => (
            <div key={col} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <code style={{ fontSize: 11, color, background: color + "18", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace" }}>{col}</code>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample download */}
      <button onClick={downloadSample} style={{
        marginTop: 20, padding: "11px 24px",
        background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 10, color: "rgba(255,255,255,0.7)", fontSize: 13,
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>↓</span> サンプルCSVをダウンロード
      </button>
    </div>
  );
}
