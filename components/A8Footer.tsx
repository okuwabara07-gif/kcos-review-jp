'use client';

export default function A8Footer() {
  const ql = { border: '#E8DDD8', text: '#2C2420', muted: '#9E8E86', hint: '#C4B5AD' };
  const programs = [
    { name: 'ファンケル 公式通販', desc: '美容・健康食品 最大8%', url: 'https://px.a8.net/svt/ejp?a8mat=3NKXXX+A8XXXX+XXXX+XXXXXX' },
    { name: 'DHC 公式通販',        desc: 'コスメ・サプリ 最大5%', url: 'https://px.a8.net/svt/ejp?a8mat=3NKXXX+B8XXXX+XXXX+XXXXXX' },
    { name: 'ドクターシーラボ',    desc: 'スキンケア 最大10%',   url: 'https://px.a8.net/svt/ejp?a8mat=3NKXXX+C8XXXX+XXXX+XXXXXX' },
  ];
  return (
    <div style={{ marginTop: 32, paddingTop: 16, borderTop: `0.5px solid ${ql.border}` }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '3px', color: ql.hint, marginBottom: 10 }}>
        SPONSORED
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {programs.map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="nofollow sponsored noopener"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', border: `0.5px solid ${ql.border}`, textDecoration: 'none' }}>
            <div>
              <div style={{ fontSize: 12, color: ql.text, fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: 10, color: ql.muted, marginTop: 2 }}>{p.desc}</div>
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '1px', color: ql.hint }}>
              CHECK →
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
