import { useState, useCallback } from "react";

const INITIAL_SOURCES = [
  { id: 'reuters',      name: 'Reuters',                 desc: 'Internationaal persbureau',                     cat: 'nieuws',  selected: true  },
  { id: 'aljazeera',   name: 'Al Jazeera English',      desc: 'Midden-Oosten & Global South',                  cat: 'nieuws',  selected: true  },
  { id: 'guardian',    name: 'The Guardian',             desc: 'Links-liberaal, brede dekking',                 cat: 'nieuws',  selected: false },
  { id: 'democracynow',name: 'Democracy Now!',           desc: 'Onafhankelijk, internationaal',                 cat: 'nieuws',  selected: false },
  { id: 'intercept',   name: 'The Intercept',            desc: 'Onderzoeksjournalistiek, anti-macht',           cat: 'nieuws',  selected: false },
  { id: 'mee',         name: 'Middle East Eye',          desc: 'Onafhankelijk, Midden-Oosten exclusieven',      cat: 'nieuws',  selected: false },
  { id: 'mondoweiss',  name: 'Mondoweiss',               desc: 'Palestina/Israël, progressief-Joods',           cat: 'nieuws',  selected: false },
  { id: 'truthout',    name: 'Truthout',                 desc: 'Amerikaans onafhankelijk progressief',          cat: 'nieuws',  selected: false },
  { id: 'canary',      name: 'The Canary',               desc: 'Brits links, kritisch op establishment',        cat: 'nieuws',  selected: false },
  { id: 'nikkei',      name: 'Nikkei Asia',              desc: 'Onafhankelijk Aziatisch perspectief',           cat: 'nieuws',  selected: false },
  { id: 'thewire',     name: 'The Wire (India)',          desc: 'Kritisch onafhankelijk, India',                 cat: 'nieuws',  selected: false },
  { id: 'newbloom',    name: 'New Bloom',                desc: 'Links perspectief Taiwan & Oost-Azië',          cat: 'nieuws',  selected: false },
  { id: 'meduza',      name: 'Meduza',                   desc: 'Onafhankelijk Russisch medium in ballingschap', cat: 'nieuws',  selected: false },
  { id: 'istories',    name: 'iStories',                 desc: 'Onderzoeksjournalistiek Rusland, ballingschap', cat: 'nieuws',  selected: false },
  { id: 'thecontinent',name: 'The Continent',            desc: 'Pan-Afrikaans, Afrikaans gemaakt',              cat: 'nieuws',  selected: false },
  { id: 'jacobin',     name: 'Jacobin',                  desc: 'Uitgesproken links, geopolitiek & essays',      cat: 'analyse', selected: false },
  { id: 'bellingcat',  name: 'Bellingcat',               desc: 'Open-source onderzoeksjournalistiek',           cat: 'analyse', selected: true  },
  { id: 'rscraft',     name: 'Responsible Statecraft',   desc: 'Progressief, anti-interventionistisch',         cat: 'analyse', selected: false },
  { id: 'fpif',        name: 'Foreign Policy in Focus',  desc: 'Analyses vanuit progressief perspectief',       cat: 'analyse', selected: false },
  { id: 'merip',       name: 'MERIP',                    desc: 'Academisch-links, Midden-Oosten focus',         cat: 'analyse', selected: false },
  { id: 'phenomenal',  name: 'Phenomenal World',         desc: 'Links economisch-geopolitiek',                  cat: 'analyse', selected: false },
  { id: 'newlines',    name: 'New Lines Magazine',       desc: 'Onafhankelijke geopolitieke longform',          cat: 'analyse', selected: false },
  { id: 'africaisa',   name: 'Africa Is a Country',      desc: 'Tegenwicht tegen westerse Afrika-framing',      cat: 'analyse', selected: false },
  { id: 'nacla',       name: 'NACLA',                    desc: 'Latijns-Amerika specialist, sinds 1967',        cat: 'analyse', selected: false },
  { id: 'novara',      name: 'Novara Media',             desc: 'Brits links, longform & analyses',              cat: 'analyse', selected: false },
  { id: 'tni',         name: 'Transnational Institute',  desc: 'Progressief beleidsonderzoek, Amsterdam',       cat: 'analyse', selected: false },
  { id: 'cadtm',       name: 'CADTM',                    desc: 'Schulden & mondiale rechtvaardigheid',          cat: 'analyse', selected: false },
  { id: 'coha',        name: 'COHA',                     desc: 'Onafhankelijke Latijns-Amerika analyses',       cat: 'analyse', selected: false },
  { id: 'brasildefato',name: 'Brasil de Fato',           desc: 'Braziliaans links, Engelstalig',                cat: 'analyse', selected: false },
  { id: 'pambazuka',   name: 'Pambazuka News',           desc: 'Links-progressief, mensenrechten Afrika',       cat: 'analyse', selected: false },
  { id: 'tribune',     name: 'Tribune Magazine',         desc: 'Brits links-economisch, geopolitiek',           cat: 'analyse', selected: false },
  { id: 'globalpolicy',name: 'Global Policy Forum',      desc: 'Kritische analyses VN & mondiale governance',   cat: 'analyse', selected: false },
  { id: 'carbonbrief', name: 'Carbon Brief',             desc: 'Klimaat als geopolitiek onderwerp',             cat: 'analyse', selected: false },
  { id: 'climatehome', name: 'Climate Home News',        desc: 'Onafhankelijk klimaatdiplomatie nieuws',        cat: 'analyse', selected: false },
  { id: 'jacobinnl',   name: 'Jacobin Nederland',        desc: 'Links, geopolitiek & essays NL',                cat: 'nl',      selected: false },
  { id: 'decorr',      name: 'De Correspondent',         desc: 'Onafhankelijk, diepgravend',                    cat: 'nl',      selected: false },
  { id: 'ftm',         name: 'Follow the Money',         desc: 'Onderzoeksjournalistiek NL',                    cat: 'nl',      selected: false },
  { id: 'oneworld',    name: 'OneWorld',                 desc: 'Internationaal & progressief NL',               cat: 'nl',      selected: false },
  { id: 'investico',   name: 'Investico',                desc: 'Samenwerkingsplatform onderzoeksjournalistiek', cat: 'nl',      selected: false },
  { id: 'groene',      name: 'De Groene Amsterdammer',   desc: 'Progressief weekblad, buitenlandrubriek',       cat: 'nl',      selected: false },
  { id: 'versbeton',   name: 'Vers Beton',               desc: 'Lokaal & links, Rotterdam',                     cat: 'nl',      selected: false },
  { id: 'doorbraak',   name: 'Doorbraak',                desc: 'Vlaams links, onafhankelijk',                   cat: 'nl',      selected: false },
];

const TOPICS = [
  { label: '🇪🇺 Europa',           query: 'Laatste geopolitieke ontwikkelingen Europa' },
  { label: '🕌 Midden-Oosten',     query: 'Geopolitieke situatie Midden-Oosten nieuws' },
  { label: '🌏 China & VS',        query: 'China VS relaties geopolitiek spanningen' },
  { label: '⚔️ Rusland / Oekraïne',query: 'Rusland Oekraïne oorlog nieuws' },
  { label: '🛡️ NAVO',              query: 'NAVO geopolitieke ontwikkelingen defensie' },
  { label: '📊 Handel & Sancties', query: 'Handelspolitiek economische sancties nieuws' },
  { label: '🌱 Klimaatdiplomatie', query: 'Klimaatdiplomatie internationale politiek' },
  { label: '🌍 Afrika',            query: 'Afrika geopolitiek conflicten nieuws' },
];

const CAT_LABELS = { nieuws: 'Internationaal nieuws', analyse: 'Analyses & Essays', nl: 'Nederlandstalig' };
const CAT_COLORS = {
  nieuws:  { bg: 'rgba(61,74,92,0.12)',   text: '#3d4a5c' },
  analyse: { bg: 'rgba(179,74,42,0.12)', text: '#b34a2a' },
  nl:      { bg: 'rgba(200,168,75,0.18)',text: '#7a5e10' },
};

const SIG_STYLES = {
  hoog:   { bg: 'rgba(179,74,42,0.1)',  text: '#b34a2a', border: 'rgba(179,74,42,0.3)',  label: '⚑ Hoog'   },
  middel: { bg: 'rgba(200,168,75,0.1)', text: '#8a6e1a', border: 'rgba(200,168,75,0.3)', label: '◆ Middel' },
  laag:   { bg: 'rgba(61,74,92,0.08)',  text: '#3d4a5c', border: 'rgba(61,74,92,0.2)',   label: '● Laag'   },
};

export default function GeoWatch() {
  const [sources, setSources]         = useState(INITIAL_SOURCES);
  const [filter, setFilter]           = useState('alle');
  const [customInput, setCustomInput] = useState('');
  const [activeTopic, setActiveTopic] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading]         = useState(false);
  const [tickerMsg, setTickerMsg]     = useState('');
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');

  const today = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const selectedSources = sources.filter(s => s.selected).map(s => s.name);

  const toggleSource = (id) => setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));

  const addCustomSource = () => {
    const val = customInput.trim();
    if (!val) return;
    if (!sources.find(s => s.name.toLowerCase() === val.toLowerCase())) {
      setSources(prev => [...prev, { id: 'custom_' + Date.now(), name: val, desc: 'Eigen bron', cat: 'nieuws', selected: true }]);
    }
    setCustomInput('');
  };

  const fetchNews = useCallback(async (topic) => {
    setLoading(true);
    setResult(null);
    setError('');

    const tickerMsgs = ['Actueel nieuws ophalen…', 'Voorkeursbronnen doorzoeken…', 'Geopolitieke context analyseren…', 'Significantie beoordelen…', 'Briefing samenstellen…'];
    let ti = 0;
    setTickerMsg(tickerMsgs[0]);
    const interval = setInterval(() => { ti = (ti + 1) % tickerMsgs.length; setTickerMsg(tickerMsgs[ti]); }, 2000);

    const sourcesStr = selectedSources.length
      ? '\n\nVOORKEURSBRONNEN — zoek actief naar content van deze bronnen en geef ze prioriteit:\n' +
        selectedSources.map(s => '- ' + s).join('\n') +
        '\n\nMarkeer "isVoorkeursbron": true als een artikel van één van deze bronnen komt.'
      : '';

    const systemPrompt = `Je bent een geopolitiek analist met voorkeur voor onafhankelijke, onderzoeksgerichte en progressieve media.
Gebruik websearch om het meest actuele nieuws te vinden, analyseer dit en geef een gestructureerd overzicht terug.${sourcesStr}

Geef ALLEEN een geldig JSON-object terug, zonder uitleg of markdown-blokken. Exact dit formaat:
{
  "onderwerp": "kort label",
  "artikelen": [
    {
      "regio": "geografische regio of land",
      "kop": "nieuwskop max 12 woorden",
      "samenvatting": "2-3 zinnen samenvatting",
      "significantie": "hoog",
      "bron": "exacte bronnaam",
      "isVoorkeursbron": false
    }
  ],
  "analyse": "2-3 alineas geopolitieke duiding: internationale verhoudingen, drijvende krachten, belangen, mogelijke gevolgen"
}
Zoek minimaal 5 recente berichten. Schrijf alles in het Nederlands.`;

    try {
      const messages = [{ role: 'user', content: 'Zoek actueel nieuws over: ' + topic }];
      let finalText = '';

      for (let round = 0; round < 8; round++) {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            system: systemPrompt,
            tools: [{ type: 'web_search_20250305', name: 'web_search' }],
            messages,
          }),
        });

        if (!resp.ok) {
          const body = await resp.text();
          throw new Error('API fout ' + resp.status + ': ' + body);
        }

        const data = await resp.json();
        messages.push({ role: 'assistant', content: data.content });

        if (data.stop_reason !== 'tool_use') {
          finalText = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
          break;
        }

        // Stuur zoekresultaten correct terug
        const toolResults = (data.content || [])
          .filter(b => b.type === 'tool_use')
          .map(b => ({
            type: 'tool_result',
            tool_use_id: b.id,
            content: Array.isArray(b.content) ? b.content : [{ type: 'text', text: String(b.content || '') }],
          }));

        if (!toolResults.length) break;
        messages.push({ role: 'user', content: toolResults });
      }

      if (!finalText) throw new Error('Geen tekst ontvangen van de API.');

      const clean = finalText.replace(/```json\s*/g, '').replace(/```/g, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Geen JSON gevonden in het antwoord.');
      const parsed = JSON.parse(match[0]);
      setResult(parsed);

    } catch (e) {
      setError(e.message || 'Er is iets misgegaan.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [selectedSources]);

  const handleTopic = (t) => { setActiveTopic(t.label); setCustomQuery(''); fetchNews(t.query); };
  const handleCustom = () => { if (!customQuery.trim()) return; setActiveTopic(null); fetchNews(customQuery); };

  // Grouped sources for sidebar
  const groups = ['nieuws', 'analyse', 'nl'].map(cat => ({
    cat,
    label: CAT_LABELS[cat],
    sources: sources.filter(s => s.cat === cat && (filter === 'alle' || filter === cat)),
  })).filter(g => filter === 'alle' || g.cat === filter);

  const sig = (s) => SIG_STYLES[s] || SIG_STYLES.laag;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: '#f4f0e8', minHeight: '100vh', color: '#0d0d0d' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* MASTHEAD */}
      <div style={{ borderBottom: '3px double #0d0d0d', padding: '16px 28px', display: 'flex', alignItems: 'baseline', gap: 20, background: '#f4f0e8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 900, letterSpacing: -1 }}>
          Geo<span style={{ color: '#b34a2a' }}>Watch</span>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#8a8070', borderLeft: '2px solid #c8bfaa', paddingLeft: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          AI Geopolitiek Monitor
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#8a8070' }}>{today}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', minHeight: 'calc(100vh - 72px)' }}>

        {/* SIDEBAR */}
        <aside style={{ borderRight: '1px solid #c8bfaa', padding: '20px 16px', background: '#ede8db', overflowY: 'auto' }}>

          {/* Topics */}
          <div style={{ marginBottom: 24 }}>
            <div style={labelStyle}>Snelle onderwerpen</div>
            {TOPICS.map(t => (
              <button key={t.label} onClick={() => handleTopic(t)} style={{
                display: 'block', width: '100%', textAlign: 'left', background: activeTopic === t.label ? '#0d0d0d' : 'none',
                border: 'none', borderLeft: `2px solid ${activeTopic === t.label ? '#b34a2a' : 'transparent'}`,
                padding: '6px 10px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8rem',
                color: activeTopic === t.label ? '#f4f0e8' : '#0d0d0d', cursor: 'pointer', borderRadius: 3, marginBottom: 2,
                transition: 'all 0.15s',
              }}>{t.label}</button>
            ))}
          </div>

          {/* Source library */}
          <div style={{ marginBottom: 24 }}>
            <div style={labelStyle}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#c8a84b', marginRight: 5, verticalAlign: 'middle' }} />
              Bronnen
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: '#c8a84b', marginLeft: 6 }}>
                {selectedSources.length} actief
              </span>
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {['alle', 'nieuws', 'analyse', 'nl'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#0d0d0d' : 'none', border: '1px solid',
                  borderColor: filter === f ? '#0d0d0d' : '#c8bfaa', borderRadius: 2,
                  padding: '2px 8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  color: filter === f ? '#f4f0e8' : '#8a8070', cursor: 'pointer',
                }}>{f}</button>
              ))}
            </div>

            {/* Source list */}
            <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 8 }}>
              {groups.map(g => (
                <div key={g.cat}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8070', padding: '6px 6px 2px', borderBottom: '1px solid #c8bfaa', marginBottom: 2 }}>
                    {g.label}
                  </div>
                  {g.sources.map(s => (
                    <div key={s.id} onClick={() => toggleSource(s.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 7, padding: '5px 6px', borderRadius: 3,
                      cursor: 'pointer', borderLeft: `2px solid ${s.selected ? '#c8a84b' : 'transparent'}`,
                      background: s.selected ? 'rgba(200,168,75,0.1)' : 'transparent',
                      transition: 'all 0.12s',
                    }}>
                      <div style={{
                        width: 13, height: 13, borderRadius: 2, flexShrink: 0,
                        border: `1.5px solid ${s.selected ? '#c8a84b' : '#c8bfaa'}`,
                        background: s.selected ? '#c8a84b' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {s.selected && <span style={{ color: 'white', fontSize: '0.6rem', lineHeight: 1 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.76rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: '#8a8070', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.desc}</div>
                      </div>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem', textTransform: 'uppercase', padding: '1px 4px', borderRadius: 2, flexShrink: 0, background: CAT_COLORS[s.cat].bg, color: CAT_COLORS[s.cat].text }}>
                        {s.cat}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Add custom source */}
            <div style={{ display: 'flex', gap: 5 }}>
              <input value={customInput} onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomSource()}
                placeholder="Eigen bron toevoegen…"
                style={{ flex: 1, background: 'white', border: '1px solid #c8bfaa', padding: '5px 8px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.76rem', borderRadius: 3, outline: 'none', minWidth: 0 }} />
              <button onClick={addCustomSource} style={{ background: '#3d4a5c', color: 'white', border: 'none', padding: '5px 9px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', cursor: 'pointer', borderRadius: 3 }}>+</button>
            </div>
          </div>

          {/* Custom query */}
          <div>
            <div style={labelStyle}>Eigen zoekopdracht</div>
            <textarea value={customQuery} onChange={e => setCustomQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleCustom()}
              placeholder="Bijv: Spanningen Taiwan straat, verkiezingen in…"
              style={{ width: '100%', background: 'white', border: '1px solid #c8bfaa', padding: '7px 9px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8rem', borderRadius: 3, resize: 'vertical', minHeight: 68, outline: 'none', marginBottom: 7 }} />
            <button onClick={handleCustom} disabled={loading} style={{
              width: '100%', background: loading ? '#8a8070' : '#0d0d0d', color: '#f4f0e8', border: 'none',
              padding: 9, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 3,
            }}>Analyseer nieuws →</button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ padding: '28px 36px', overflowY: 'auto' }}>

          {error && (
            <div style={{ background: 'rgba(179,74,42,0.08)', border: '1px solid rgba(179,74,42,0.3)', color: '#b34a2a', padding: '12px 16px', borderRadius: 3, fontSize: '0.83rem', marginBottom: 20 }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: '#8a8070', letterSpacing: '0.08em', marginBottom: 18 }}>{tickerMsg}</div>
              <div style={{ display: 'inline-flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: i === 0 ? '#b34a2a' : i === 1 ? '#c8a84b' : '#3d4a5c',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.5);opacity:1} }`}</style>
            </div>
          )}

          {!loading && !result && !error && (
            <div style={{ textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', color: '#c8bfaa', marginBottom: 20 }}>⊕</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#3d4a5c', fontStyle: 'italic', marginBottom: 10 }}>Kies een onderwerp</h2>
              <p style={{ fontSize: '0.83rem', color: '#8a8070', maxWidth: 300, margin: '0 auto', lineHeight: 1.6 }}>
                Selecteer een regio links, of typ een eigen zoekopdracht om actueel geopolitiek nieuws te analyseren.
              </p>
            </div>
          )}

          {!loading && result && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                  {result.onderwerp || 'Geopolitiek Nieuws'}
                </h2>
                <div style={{ flex: 1, height: 1, background: '#c8bfaa' }} />
              </div>

              {/* Articles */}
              {(result.artikelen || []).map((art, i) => {
                const s = sig(art.significantie);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, padding: '20px 0', borderBottom: '1px solid #c8bfaa' }}>
                    <div>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b34a2a', marginBottom: 5 }}>
                        {art.regio}
                      </div>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35, marginBottom: 7 }}>
                        {art.kop}
                      </div>
                      <div style={{ fontSize: '0.83rem', lineHeight: 1.65, color: '#3d3830', marginBottom: 9 }}>
                        {art.samenvatting}
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 2, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                          {s.label}
                        </span>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: '#8a8070' }}>
                          {art.isVoorkeursbron && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#c8a84b', marginRight: 4, verticalAlign: 'middle' }} />}
                          {art.bron}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 900, color: '#c8bfaa', lineHeight: 1, minWidth: 44, textAlign: 'right', userSelect: 'none' }}>
                      0{i + 1}
                    </div>
                  </div>
                );
              })}

              {/* Analysis */}
              {result.analyse && (
                <div style={{ marginTop: 28, background: '#0d0d0d', color: '#f4f0e8', padding: '24px 28px', borderRadius: 4 }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c8a84b', marginBottom: 12 }}>
                    ◈ Geopolitieke analyse
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.88rem', lineHeight: 1.75, color: '#e8e0d0' }}>
                    {result.analyse.split('\n').filter(Boolean).map((p, i) => <p key={i} style={{ marginBottom: 12 }}>{p}</p>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase',
  letterSpacing: '0.12em', color: '#8a8070', marginBottom: 8, paddingBottom: 5,
  borderBottom: '1px solid #c8bfaa',
};
