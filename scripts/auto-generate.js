const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_ID = process.env.AMAZON_TRACKING_ID || '';
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

const KEYWORDS = [
  {kw:"COSRX \u304a\u3059\u3059\u3081 \u4eba\u6c17\u5546\u54c1",genre:"cosme"},
  {kw:"\u97d3\u56fd\u65e5\u713c\u3051\u6b62\u3081 \u304a\u3059\u3059\u3081",genre:"skincare"},
  {kw:"\u97d3\u56fd\u30af\u30c3\u30b7\u30e7\u30f3\u30d5\u30a1\u30f3\u30c7 \u6bd4\u8f03",genre:"makeup"},
  {kw:"innisfree \u4eba\u6c17\u5546\u54c1 \u30e9\u30f3\u30ad\u30f3\u30b0",genre:"brand"},
  {kw:"\u97d3\u56fd\u30b3\u30b9\u30e1 \u30d7\u30c1\u30d7\u30e9 \u304a\u3059\u3059\u3081",genre:"cosme"},
  {kw:"LANEIGE \u30ea\u30c3\u30d7 \u4f7f\u3044\u65b9",genre:"brand"},
  {kw:"\u97d3\u56fd\u30b3\u30b9\u30e1 \u30cb\u30ad\u30d3\u808c \u304a\u3059\u3059\u3081",genre:"skincare"},
  {kw:"Qoo10 \u30e1\u30ac\u5272 \u304a\u3059\u3059\u3081",genre:"shopping"},
  {kw:"\u97d3\u56fd\u30af\u30ea\u30fc\u30e0 \u304a\u3059\u3059\u3081 \u4fdd\u6e7f",genre:"skincare"},
  {kw:"\u97d3\u56fd\u30b3\u30b9\u30e1 \u654f\u611f\u808c \u304a\u3059\u3059\u3081",genre:"skincare"}
];

const SYS = `あなたは韓国コスメ・K-Beauty専門ライターです。読者目線で分かりやすく、SEOに強い記事を書きます。見出しはH2/H3を使ってください。文字数2000字以上。Markdown形式で出力。記事内でおすすめ商品を紹介する箇所には[AMAZON:商品名]と[RAKUTEN:商品名]を合計5箇所挿入してください。`;

function insertLinks(text) {
  text = text.replace(/\[AMAZON:([^\]]+)\]/g, (_, p) => `[🛒 ${p}をAmazonでチェック](https://www.amazon.co.jp/s?k=${encodeURIComponent(p)}&tag=${AMAZON_ID})`);
  text = text.replace(/\[RAKUTEN:([^\]]+)\]/g, (_, p) => `[🛍 ${p}を楽天でチェック](https://search.rakuten.co.jp/search/mall/${encodeURIComponent(p)}/?rafcid=${RAKUTEN_ID})`);
  return text;
}

function toSlug(kw) {
  return kw.replace(/[\s\u3000]+/g, '-').replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '') + '-' + Date.now();
}

async function generateArticle(kw, genre) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01'},
    body: JSON.stringify({model: 'claude-sonnet-4-20250514', max_tokens: 3000, system: SYS, messages: [{role: 'user', content: `ジャンル：${genre}\nキーワード：「${kw}」\n\nSEO記事をMarkdownで書いてください。`}]}),
  });
  const data = await res.json();
  return data.content?.map(c => c.text || '').join('') || '';
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
  const targets = KEYWORDS.sort(() => Math.random() - 0.5).slice(0, 5);
  for (const { kw, genre } of targets) {
    console.log(`生成中: ${kw}`);
    try {
      let text = await generateArticle(kw, genre);
      text = insertLinks(text);
      const slug = toSlug(kw);
      const content = `---\ntitle: "${kw}"\ndate: "${new Date().toISOString().split('T')[0]}"\ngenre: "${genre}"\ntags: [${genre}]\n---\n\n${text}\n`;
      fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), content);
      console.log(`完了: ${slug}.mdx`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) { console.error(`エラー: ${kw}`, e.message); }
  }
  console.log('全記事生成完了！');
}
main();
