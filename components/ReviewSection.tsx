
"use client";
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://ofplelhbmbueetvqxppt.supabase.co";
const SUPABASE_KEY = "sb_publishable_KPZnAxrvulyK4jfxZbYjjQ_8qD3FAXX";

async function sbFetch(path: string, options: any = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "",
      ...options.headers,
    },
  });
  return res.json();
}

export default function ReviewSection({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ avg: 0, count: 0, recommend: 0 });
  const [form, setForm] = useState({ rating: 5, skinType: "乾燥肌", body: "", nickname: "", tags: [] as string[] });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const TAGS = ["保湿力が高い", "コスパ最高", "リピート予定", "敏感肌OK", "発色が良い", "使いやすい"];
  const SKIN_TYPES = ["乾燥肌", "普通肌", "脂性肌", "混合肌", "敏感肌"];

  useEffect(() => { loadReviews(); }, [productName]);

  async function loadReviews() {
    const data = await sbFetch(
      `/rest/v1/reviews?site_id=eq.kcos-review-jp&product_name=eq.${encodeURIComponent(productName)}&approved=eq.true&order=created_at.desc&limit=10`
    );
    if (Array.isArray(data)) {
      setReviews(data);
      if (data.length > 0) {
        const avg = data.reduce((s: number, r: any) => s + r.rating, 0) / data.length;
        const recommend = data.filter((r: any) => r.rating >= 4).length / data.length * 100;
        setStats({ avg: Math.round(avg * 10) / 10, count: data.length, recommend: Math.round(recommend) });
      }
    }
  }

  async function submitReview() {
    if (form.body.length < 20) { alert("レビューは20文字以上入力してください"); return; }
    setLoading(true);
    await sbFetch("/rest/v1/reviews", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        site_id: "kcos-review-jp",
        product_name: productName,
        rating: form.rating,
        skin_type: form.skinType,
        body: form.body,
        nickname: form.nickname || "匿名",
        tags: form.tags,
      }),
    });
    setLoading(false);
    setSubmitted(true);
    loadReviews();
  }

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  }

  const starDist = [5,4,3,2,1].map(n => ({
    n, count: reviews.filter(r => r.rating === n).length
  }));

  const s = { fontFamily: "sans-serif", maxWidth: "680px", margin: "2rem auto", padding: "0 1rem" };
  const card = { background: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" };
  const surface = { background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" };
  const statBox = { textAlign: "center" as const, flex: 1, background: "#fff", borderRadius: "8px", padding: "1rem" };
  const input = { width: "100%", padding: "8px", border: "1px solid #eee", borderRadius: "6px", fontSize: "13px" };
  const btn = { background: "#1D9E75", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", cursor: "pointer", width: "100%" };

  return (
    <div style={s}>
      <div style={surface}>
        <h2 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "1rem" }}>ユーザーレビュー</h2>
        <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
          <div style={statBox}><div style={{ fontSize: "28px", fontWeight: 500 }}>{stats.avg || "—"}</div><div style={{ fontSize: "12px", color: "#888" }}>総合評価</div></div>
          <div style={statBox}><div style={{ fontSize: "28px", fontWeight: 500 }}>{stats.count}</div><div style={{ fontSize: "12px", color: "#888" }}>レビュー数</div></div>
          <div style={statBox}><div style={{ fontSize: "28px", fontWeight: 500 }}>{stats.count > 0 ? stats.recommend + "%" : "—"}</div><div style={{ fontSize: "12px", color: "#888" }}>おすすめ率</div></div>
        </div>
        {starDist.map(d => (
          <div key={d.n} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", width: "12px", color: "#888" }}>{d.n}</span>
            <div style={{ flex: 1, height: "6px", background: "#e5e5e5", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#EF9F27", width: stats.count > 0 ? `${Math.round(d.count/stats.count*100)}%` : "0%" }}></div>
            </div>
            <span style={{ fontSize: "11px", color: "#aaa", width: "24px" }}>{d.count}</span>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: 500, marginBottom: "1rem" }}>レビューを投稿する</h3>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>評価</div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} onClick={() => setForm(f => ({...f, rating: n}))}
                  style={{ fontSize: "28px", cursor: "pointer", color: n <= form.rating ? "#EF9F27" : "#ddd" }}>★</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>お名前（任意）</div>
            <input value={form.nickname} onChange={e => setForm(f => ({...f, nickname: e.target.value}))}
              placeholder="匿名" style={input}/>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>肌タイプ</div>
            <select value={form.skinType} onChange={e => setForm(f => ({...f, skinType: e.target.value}))}
              style={{ padding: "8px", border: "1px solid #eee", borderRadius: "6px", fontSize: "13px" }}>
              {SKIN_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>レビュー本文（20文字以上）</div>
            <textarea value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))}
              placeholder="使用感・効果・おすすめポイントなど" rows={4}
              style={{ ...input, resize: "vertical" as const }}/>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>タグ（複数選択可）</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {TAGS.map(tag => (
                <span key={tag} onClick={() => toggleTag(tag)} style={{
                  fontSize: "12px", padding: "3px 10px", borderRadius: "20px", cursor: "pointer",
                  background: form.tags.includes(tag) ? "#FBEAF0" : "#f5f5f5",
                  color: form.tags.includes(tag) ? "#72243E" : "#666",
                  border: form.tags.includes(tag) ? "1px solid #ED93B1" : "1px solid #eee"
                }}>{tag}</span>
              ))}
            </div>
          </div>
          <button onClick={submitReview} disabled={loading} style={btn}>
            {loading ? "投稿中..." : "レビューを投稿する"}
          </button>
        </div>
      ) : (
        <div style={{ background: "#E1F5EE", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>✅</div>
          <div style={{ fontSize: "14px", color: "#0F6E56", fontWeight: 500 }}>レビューを投稿しました！ありがとうございます</div>
        </div>
      )}

      {reviews.length > 0 && (
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 500, marginBottom: "1rem" }}>みんなのレビュー（{reviews.length}件）</h3>
          {reviews.map(r => (
            <div key={r.id} style={{ background: "#f9f9f9", borderRadius: "10px", padding: "1rem", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#0F6E56", fontWeight: 500 }}>
                  {r.nickname?.[0] || "匿"}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500 }}>{r.nickname}</div>
                  <div style={{ fontSize: "11px", color: "#aaa" }}>{r.skin_type} • {new Date(r.created_at).toLocaleDateString("ja-JP")}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#EF9F27", fontSize: "14px" }}>
                  {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", marginBottom: "8px" }}>{r.body}</p>
              {r.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {r.tags.map((tag: string) => (
                    <span key={tag} style={{ fontSize: "11px", padding: "2px 8px", background: "#FBEAF0", color: "#72243E", borderRadius: "20px" }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#aaa", fontSize: "14px" }}>
          まだレビューがありません。最初のレビューを投稿してみましょう！
        </div>
      )}
    </div>
  );
}
