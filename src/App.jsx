import { useState, useCallback, useEffect, useRef } from "react";

const STORAGE_KEY_SOURCES = 'thebrief_sources';
const STORAGE_KEY_HISTORY = 'thebrief_history';
const STORAGE_KEY_BOOKMARKS = 'thebrief_bookmarks';

const INITIAL_SOURCES = [
  { id: 'reuters',      name: 'Reuters',                desc: 'Internationaal persbureau',                     cat: 'nieuws',  selected: true  },
  { id: 'sovereignmedia', name: 'Sovereign Media',         desc: 'sovereignmedia.online',                         cat: 'nieuws',  selected: false },
  { id: 'aljazeera',   name: 'Al Jazeera English',      desc: 'Midden-Oosten & Global South',                  cat: 'nieuws',  selected: true  },
  { id: 'guardian',    name: 'The Guardian',             desc: 'Links-liberaal, brede dekking',                 cat: 'nieuws',  selected: false },
  { id: 'democracynow',name: 'Democracy Now!',           desc: 'Onafhankelijk, internationaal',                 cat: 'nieuws',  selected: false },
  { id: 'intercept',   name: 'The Intercept',            desc: 'Onderzoeksjournalistiek, anti-macht',           cat: 'nieuws',  selected: false },
  { id: 'mee',         name: 'Middle East Eye',          desc: 'Onafhankelijk, Midden-Oosten exclusieven',      cat: 'nieuws',  selected: false },
  { id: 'mondoweiss',  name: 'Mondoweiss',               desc: 'Palestina en Israel, progressief-Joods',        cat: 'nieuws',  selected: false },
  { id: 'truthout',    name: 'Truthout',                 desc: 'Amerikaans onafhankelijk progressief',          cat: 'nieuws',  selected: false },
  { id: 'canary',      name: 'The Canary',               desc: 'Brits links, kritisch op establishment',        cat: 'nieuws',  selected: false },
  { id: 'nikkei',      name: 'Nikkei Asia',              desc: 'Onafhankelijk Aziatisch perspectief',           cat: 'nieuws',  selected: false },
  { id: 'thewire',     name: 'The Wire India',           desc: 'Kritisch onafhankelijk, India',                 cat: 'nieuws',  selected: false },
  { id: 'newbloom',    name: 'New Bloom',                desc: 'Links perspectief Taiwan en Oost-Azie',         cat: 'nieuws',  selected: false },
  { id: 'meduza',      name: 'Meduza',                   desc: 'Onafhankelijk Russisch medium in ballingschap', cat: 'nieuws',  selected: false },
  { id: 'istories',    name: 'iStories',                 desc: 'Onderzoeksjournalistiek Rusland, ballingschap', cat: 'nieuws',  selected: false },
  { id: 'thecontinent',name: 'The Continent',            desc: 'Pan-Afrikaans, Afrikaans gemaakt',              cat: 'nieuws',  selected: false },
  { id: 'jacobin',     name: 'Jacobin',                  desc: 'Uitgesproken links, geopolitiek en essays',     cat: 'analyse', selected: false },
  { id: 'bellingcat',  name: 'Bellingcat',               desc: 'Open-source onderzoeksjournalistiek',           cat: 'analyse', selected: true  },
  { id: 'rscraft',     name: 'Responsible Statecraft',   desc: 'Progressief, anti-interventionistisch',         cat: 'analyse', selected: false },
  { id: 'fpif',        name: 'Foreign Policy in Focus',  desc: 'Analyses vanuit progressief perspectief',       cat: 'analyse', selected: false },
  { id: 'merip',       name: 'MERIP',                    desc: 'Academisch-links, Midden-Oosten focus',         cat: 'analyse', selected: false },
  { id: 'phenomenal',  name: 'Phenomenal World',         desc: 'Links economisch-geopolitiek',                  cat: 'analyse', selected: false },
  { id: 'newlines',    name: 'New Lines Magazine',       desc: 'Onafhankelijke geopolitieke longform',          cat: 'analyse', selected: false },
  { id: 'africaisa',   name: 'Africa Is a Country',      desc: 'Tegenwicht tegen westerse Afrika-framing',      cat: 'analyse', selected: false },
  { id: 'nacla',       name: 'NACLA',                    desc: 'Latijns-Amerika specialist, sinds 1967',        cat: 'analyse', selected: false },
  { id: 'novara',      name: 'Novara Media',             desc: 'Brits links, longform en analyses',             cat: 'analyse', selected: false },
  { id: 'tni',         name: 'Transnational Institute',  desc: 'Progressief beleidsonderzoek, Amsterdam',       cat: 'analyse', selected: false },
  { id: 'cadtm',       name: 'CADTM',                    desc: 'Schulden en mondiale rechtvaardigheid',         cat: 'analyse', selected: false },
  { id: 'coha',        name: 'COHA',                     desc: 'Onafhankelijke Latijns-Amerika analyses',       cat: 'analyse', selected: false },
  { id: 'brasildefato',name: 'Brasil de Fato',           desc: 'Braziliaans links, Engelstalig',                cat: 'analyse', selected: false },
  { id: 'pambazuka',   name: 'Pambazuka News',           desc: 'Links-progressief, mensenrechten Afrika',       cat: 'analyse', selected: false },
  { id: 'tribune',     name: 'Tribune Magazine',         desc: 'Brits links-economisch, geopolitiek',           cat: 'analyse', selected: false },
  { id: 'globalpolicy',name: 'Global Policy Forum',      desc: 'Kritische analyses VN en mondiale governance',  cat: 'analyse', selected: false },
  { id: 'carbonbrief', name: 'Carbon Brief',             desc: 'Klimaat als geopolitiek onderwerp',             cat: 'analyse', selected: false },
  { id: 'climatehome', name: 'Climate Home News',        desc: 'Onafhankelijk klimaatdiplomatie nieuws',        cat: 'analyse', selected: false },
  { id: 'vrijnl',      name: 'Vrij Nederland',           desc: 'Progressief weekblad, politiek en buitenland',  cat: 'nl',      selected: false },
  { id: 'jacobinnl',   name: 'Jacobin Nederland',        desc: 'Links, geopolitiek en essays NL',               cat: 'nl',      selected: false },
  { id: 'decorr',      name: 'De Correspondent',         desc: 'Onafhankelijk, diepgravend',                    cat: 'nl',      selected: false },
  { id: 'ftm',         name: 'Follow the Money',         desc: 'Onderzoeksjournalistiek NL',                    cat: 'nl',      selected: false },
  { id: 'oneworld',    name: 'OneWorld',                 desc: 'Internationaal en progressief NL',              cat: 'nl',      selected: false },
  { id: 'investico',   name: 'Investico',                desc: 'Samenwerkingsplatform onderzoeksjournalistiek', cat: 'nl',      selected: false },
  { id: 'groene',      name: 'De Groene Amsterdammer',   desc: 'Progressief weekblad, buitenlandrubriek',       cat: 'nl',      selected: false },
  { id: 'versbeton',   name: 'Vers Beton',               desc: 'Lokaal en links, Rotterdam',                    cat: 'nl',      selected: false },
  { id: 'doorbraak',   name: 'Doorbraak',                desc: 'Vlaams links, onafhankelijk',                   cat: 'nl',      selected: false },
];

const TOPIC_GROUPS = [
  {
    groep: "Regio's",
    topics: [
      { label: 'Europa',             query: 'Laatste geopolitieke ontwikkelingen Europa',         dagQuery: 'Belangrijkste geopolitieke nieuws Europa van vandaag' },
      { label: 'Midden-Oosten',      query: 'Geopolitieke situatie Midden-Oosten nieuws',         dagQuery: 'Belangrijkste nieuws Midden-Oosten van vandaag' },
      { label: 'China & VS',         query: 'China VS relaties geopolitiek spanningen',            dagQuery: 'Belangrijkste ontwikkeling China VS relatie van vandaag' },
      { label: 'Rusland / Oekraine', query: 'Rusland Oekraine oorlog nieuws',                     dagQuery: 'Belangrijkste nieuws Rusland Oekraine van vandaag' },
      { label: 'Afrika',             query: 'Afrika geopolitiek conflicten nieuws',               dagQuery: 'Belangrijkste geopolitieke nieuws Afrika van vandaag' },
      { label: 'Latijns-Amerika',    query: 'Latijns-Amerika geopolitiek nieuws',                 dagQuery: 'Belangrijkste geopolitieke nieuws Latijns-Amerika van vandaag' },
      { label: 'Azie & Pacific',     query: 'Azie Pacific geopolitiek nieuws spanningen',         dagQuery: 'Belangrijkste geopolitieke nieuws Azie Pacific van vandaag' },
    ]
  },
  {
    groep: "Thema's",
    topics: [
      { label: 'Conflicten',         query: 'Actieve gewapende conflicten wereldwijd nieuws',     dagQuery: 'Belangrijkste conflictnieuws wereldwijd van vandaag' },
      { label: 'Diplomatie',         query: 'Internationale diplomatieke ontwikkelingen nieuws',  dagQuery: 'Belangrijkste diplomatieke nieuws van vandaag' },
      { label: 'NAVO & Defensie',    query: 'NAVO defensie geopolitieke ontwikkelingen',          dagQuery: 'Belangrijkste NAVO en defensienieuws van vandaag' },
      { label: 'Handel & Sancties',  query: 'Handelspolitiek economische sancties nieuws',        dagQuery: 'Belangrijkste handels- en sanctienieuws van vandaag' },
      { label: 'Klimaatdiplomatie',  query: 'Klimaatdiplomatie internationale politiek',          dagQuery: 'Belangrijkste klimaatdiplomatie nieuws van vandaag' },
      { label: 'Mensenrechten',      query: 'Mensenrechten internationale politiek nieuws',       dagQuery: 'Belangrijkste mensenrechtennieuws van vandaag' },
    ]
  },
];
const TOPICS = TOPIC_GROUPS.flatMap(g => g.topics);

const CAT_LABELS = { nieuws: 'Internationaal nieuws', analyse: 'Analyses & Essays', nl: 'Nederlandstalig' };
const CAT_COLORS = {
  nieuws:  { bg: 'rgba(61,74,92,0.12)',  text: '#3d4a5c' },
  analyse: { bg: 'rgba(179,74,42,0.12)', text: '#b34a2a' },
  nl:      { bg: 'rgba(200,168,75,0.18)',text: '#7a5e10' },
};
const SIG_STYLES = {
  hoog:   { bg: 'rgba(179,74,42,0.1)',  text: '#b34a2a', border: 'rgba(179,74,42,0.3)',  label: 'Hoog'   },
  middel: { bg: 'rgba(200,168,75,0.1)', text: '#8a6e1a', border: 'rgba(200,168,75,0.3)', label: 'Middel' },
  laag:   { bg: 'rgba(61,74,92,0.08)',  text: '#3d4a5c', border: 'rgba(61,74,92,0.2)',   label: 'Laag'   },
};

function loadStorage(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export default function HetKompas() {
  const [sources, setSources] = useState(() => {
    const saved = loadStorage(STORAGE_KEY_SOURCES, null);
    if (!saved) return INITIAL_SOURCES;
    return INITIAL_SOURCES.map(s => ({ ...s, selected: saved[s.id] !== undefined ? saved[s.id] : s.selected }));
  });
  const [filter, setFilter]           = useState('alle');
  const [customInput, setCustomInput] = useState('');
  const [activeTopic, setActiveTopic] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading]         = useState(false);
  const [tickerMsg, setTickerMsg]     = useState('');
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');
  const [history, setHistory]         = useState(() => loadStorage(STORAGE_KEY_HISTORY, []));
  const [bookmarks, setBookmarks]     = useState(() => loadStorage(STORAGE_KEY_BOOKMARKS, []));
  const [activeTab, setActiveTab]     = useState('nieuws');
  const [copied, setCopied]           = useState(false);

  const today = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const selectedSources = sources.filter(s => s.selected).map(s => s.name);

  useEffect(() => {
    const map = {};
    sources.forEach(s => { map[s.id] = s.selected; });
    saveStorage(STORAGE_KEY_SOURCES, map);
  }, [sources]);
  useEffect(() => { saveStorage(STORAGE_KEY_HISTORY, history); }, [history]);
  useEffect(() => { saveStorage(STORAGE_KEY_BOOKMARKS, bookmarks); }, [bookmarks]);

  const toggleSource = (id) => setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  const selectAllInCat = (cat) => {
    const allSelected = sources.filter(s => s.cat === cat).every(s => s.selected);
    setSources(prev => prev.map(s => s.cat === cat ? { ...s, selected: !allSelected } : s));
  };
  const addCustomSource = () => {
    const val = customInput.trim();
    if (!val) return;
    if (!sources.find(s => s.name.toLowerCase() === val.toLowerCase())) {
      setSources(prev => [...prev, { id: 'custom_' + Date.now(), name: val, desc: 'Eigen bron', cat: 'nieuws', selected: true }]);
    }
    setCustomInput('');
  };
  const toggleBookmark = (art) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.url === art.url || b.kop === art.kop);
      if (exists) return prev.filter(b => b !== exists);
      return [{ ...art, savedAt: new Date().toLocaleDateString('nl-NL') }, ...prev];
    });
  };
  const isBookmarked = (art) => bookmarks.some(b => b.url === art.url || b.kop === art.kop);
  const copyAnalyse = () => {
    if (!result || !result.analyse) return;
    navigator.clipboard.writeText(result.analyse).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fetchNews = useCallback(async (topic) => {
    setLoading(true);
    setResult(null);
    setError('');
    setActiveTab('nieuws');

    const tickerMsgs = ['Actueel nieuws ophalen...', 'Voorkeursbronnen doorzoeken...', 'Geopolitieke context analyseren...', 'Significantie beoordelen...', 'Briefing samenstellen...'];
    let ti = 0;
    setTickerMsg(tickerMsgs[0]);
    const interval = setInterval(() => { ti = (ti + 1) % tickerMsgs.length; setTickerMsg(tickerMsgs[ti]); }, 2000);

    const sel = sources.filter(s => s.selected).map(s => s.name);
    const sourcesStr = sel.length
      ? '\n\nVOORKEURSBRONNEN - zoek actief naar content van deze bronnen en geef ze prioriteit:\n' +
        sel.map(s => '- ' + s).join('\n') +
        '\n\nMarkeer isVoorkeursbron true als een artikel van een van deze bronnen komt.'
      : '';

    const systemPrompt = `Je bent een geopolitiek analist met voorkeur voor onafhankelijke, onderzoeksgerichte en progressieve media.
Gebruik websearch om het meest actuele nieuws te vinden, analyseer dit en geef een gestructureerd overzicht terug.${sourcesStr}

Geef ALLEEN een geldig JSON-object terug, zonder uitleg of markdown. Exact dit formaat:
{
  "onderwerp": "kort label",
  "artikelen": [
    {
      "regio": "geografische regio of land",
      "kop": "nieuwskop max 12 woorden",
      "samenvatting": "4-6 zinnen uitgebreide samenvatting met context, achtergrond en betekenis",
      "significantie": "hoog",
      "bron": "exacte bronnaam",
      "url": "https://directe-url-naar-het-artikel",
      "datum": "publicatiedatum bijv 5 maart 2026",
      "isVoorkeursbron": false
    }
  ],
  "analyse": "2-3 alineas geopolitieke duiding: internationale verhoudingen, drijvende krachten, belangen, mogelijke gevolgen",
  "analyse_bronnen": [{"bron": "bronnaam", "url": "https://url", "citaat": "korte quote of parafrase waarop de duiding is gebaseerd"}],
  "gerelateerde_onderwerpen": ["onderwerp 1", "onderwerp 2", "onderwerp 3"]
}
Zoek minimaal 5 recente berichten. Voeg altijd een directe URL toe. Schrijf alles in het Nederlands.`;

    try {
      const messages = [{ role: 'user', content: 'Zoek actueel nieuws over: ' + topic }];
      let finalText = '';

      for (let round = 0; round < 8; round++) {
        const resp = await fetch('/api/chat', {
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

        if (!resp.ok) { const b = await resp.text(); throw new Error('API fout ' + resp.status + ': ' + b); }
        const data = await resp.json();
        messages.push({ role: 'assistant', content: data.content });

        if (data.stop_reason !== 'tool_use') {
          finalText = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
          break;
        }
        const toolResults = (data.content || []).filter(b => b.type === 'tool_use').map(b => ({
          type: 'tool_result', tool_use_id: b.id,
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

      const entry = {
        topic,
        label: parsed.onderwerp || topic,
        timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('nl-NL'),
      };
      setHistory(prev => [entry, ...prev.filter(h => h.topic !== topic)].slice(0, 8));

    } catch (e) {
      setError(e.message || 'Er is iets misgegaan.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [sources]);

  const handleTopic = (t) => { setActiveTopic(t.label); setCustomQuery(''); fetchNews(t.query); };
  const handleCustom = () => { if (!customQuery.trim()) return; setActiveTopic(null); fetchNews(customQuery); };
  const handleHistory = (h) => { setActiveTopic(null); setCustomQuery(h.topic); fetchNews(h.topic); };
  const handleRelated = (t) => { setActiveTopic(null); setCustomQuery(t); fetchNews(t); };
  const handleDagelijkse = () => {
    setActiveTopic('dagelijks');
    setCustomQuery('');
    fetchNews('De vijf belangrijkste geopolitieke ontwikkelingen van vandaag wereldwijd: conflicten, diplomatieke spanningen, verkiezingen, economische sancties en grote politieke verschuivingen');
  };

  const groups = ['nieuws', 'analyse', 'nl'].map(cat => ({
    cat, label: CAT_LABELS[cat],
    sources: sources.filter(s => s.cat === cat && (filter === 'alle' || filter === cat)),
  })).filter(g => filter === 'alle' || g.cat === filter);

  const sig = (s) => SIG_STYLES[s] || SIG_STYLES.laag;

  const lbl = { fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8a8070', marginBottom: 7, paddingBottom: 5, borderBottom: '1px solid #c8bfaa' };

  const ArticleCard = ({ art, showRemove }) => {
    const s = sig(art.significantie);
    const bookmarked = isBookmarked(art);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, padding: '18px 0', borderBottom: '1px solid #c8bfaa' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b34a2a' }}>{art.regio}</div>
            {art.datum && <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: '#8a8070' }}>· {art.datum}</div>}
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>
            {art.url
              ? <a href={art.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color='#b34a2a'}
                  onMouseLeave={e => e.currentTarget.style.color='inherit'}>
                  {art.kop} <span style={{ color: '#b34a2a', fontSize: '0.82em' }}>&#8599;</span>
                </a>
              : art.kop}
          </div>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.65, color: '#3d3830', marginBottom: 8 }}>{art.samenvatting}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 2, background: s.bg, color: s.text, border: '1px solid ' + s.border }}>{s.label}</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#8a8070' }}>
              {art.isVoorkeursbron && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c8a84b', marginRight: 3, verticalAlign: 'middle' }} />}
              {art.bron}
            </span>
            {art.url && <a href={art.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#3d4a5c', textDecoration: 'none', borderBottom: '1px solid #3d4a5c' }}>Lees artikel &#8594;</a>}
            <button onClick={() => showRemove ? toggleBookmark(art) : toggleBookmark(art)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: showRemove ? '#b34a2a' : bookmarked ? '#c8a84b' : '#8a8070', padding: 0, marginLeft: 'auto' }}>
              {showRemove ? 'x Verwijder' : bookmarked ? '* Opgeslagen' : 'o Bewaar'}
            </button>
          </div>
          {showRemove && art.savedAt && <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem', color: '#8a8070', marginTop: 4 }}>Opgeslagen op {art.savedAt}</div>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', background: '#f4f0e8', minHeight: '100vh', color: '#0d0d0d' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.5);opacity:1}}*{box-sizing:border-box}`}</style>

      {/* MASTHEAD */}
      <div style={{ borderBottom: '3px double #0d0d0d', padding: '14px 28px', display: 'flex', alignItems: 'baseline', gap: 20, background: '#f4f0e8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.9rem', fontWeight: 900, letterSpacing: -1 }}>
          Het <span style={{ color: '#b34a2a' }}>Kompas</span>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: '#8a8070', borderLeft: '2px solid #c8bfaa', paddingLeft: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          AI Geopolitiek Monitor
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: '#8a8070' }}>{today}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '265px 1fr', minHeight: 'calc(100vh - 65px)' }}>

        {/* SIDEBAR */}
        <aside style={{ borderRight: '1px solid #c8bfaa', padding: '18px 14px', background: '#ede8db', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Topics */}
          <div>
            <div style={lbl}>Snelle onderwerpen</div>
            {TOPIC_GROUPS.map(g => (
              <div key={g.groep} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.57rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8070', padding: '4px 6px 3px', borderBottom: '1px solid #c8bfaa', marginBottom: 3 }}>
                  {g.groep}
                </div>
                {g.topics.map(t => (
                  <div key={t.label} style={{ display: 'flex', gap: 3, marginBottom: 2 }}>
                    <button onClick={() => handleTopic(t)} style={{
                      flex: 1, textAlign: 'left',
                      background: activeTopic === t.label ? '#0d0d0d' : 'none',
                      border: 'none', borderLeft: '2px solid ' + (activeTopic === t.label ? '#b34a2a' : 'transparent'),
                      padding: '5px 10px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.77rem',
                      color: activeTopic === t.label ? '#f4f0e8' : '#0d0d0d',
                      cursor: 'pointer', borderRadius: 3,
                    }}>{t.label}</button>
                    <button
                      onClick={() => { setActiveTopic(t.label + '_dag'); setCustomQuery(''); fetchNews(t.dagQuery); }}
                      title={'Dagbriefing: ' + t.label}
                      style={{
                        background: activeTopic === t.label + '_dag' ? '#b34a2a' : 'rgba(0,0,0,0.06)',
                        border: 'none', borderRadius: 3, padding: '4px 7px',
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem',
                        color: activeTopic === t.label + '_dag' ? 'white' : '#8a8070',
                        cursor: 'pointer', flexShrink: 0, lineHeight: 1, transition: 'all 0.12s',
                      }}
                      onMouseEnter={e => { if (activeTopic !== t.label + '_dag') { e.currentTarget.style.background='rgba(179,74,42,0.15)'; e.currentTarget.style.color='#b34a2a'; }}}
                      onMouseLeave={e => { if (activeTopic !== t.label + '_dag') { e.currentTarget.style.background='rgba(0,0,0,0.06)'; e.currentTarget.style.color='#8a8070'; }}}
                    >vandaag</button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Dagelijkse briefing */}
          <button onClick={handleDagelijkse} disabled={loading} style={{
            width: '100%', background: activeTopic === 'dagelijks' ? '#b34a2a' : 'linear-gradient(135deg, #1a2535 0%, #3d4a5c 100%)',
            backgroundImage: activeTopic === 'dagelijks' ? 'none' : 'linear-gradient(135deg, #1a2535 0%, #3d4a5c 100%)',
            color: '#f4f0e8', border: 'none', padding: '10px 12px',
            fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.6 : 1,
          }}>
            <span style={{ fontSize: '1rem' }}>&#9728;</span>
            <div style={{ textAlign: 'left' }}>
              <div>Dagelijkse briefing</div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: 'rgba(248,240,232,0.6)', marginTop: 1 }}>Wat speelt er vandaag?</div>
            </div>
          </button>

          {/* History */}
          {history.length > 0 && (
            <div>
              <div style={lbl}>Recente zoekopdrachten</div>
              {history.map((h, i) => (
                <button key={i} onClick={() => handleHistory(h)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '5px 8px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.74rem',
                  color: '#3d4a5c', cursor: 'pointer', borderRadius: 3, marginBottom: 1,
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>&#8617; {h.label}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem', color: '#8a8070', flexShrink: 0, marginLeft: 6 }}>{h.timestamp}</span>
                </button>
              ))}
            </div>
          )}

          {/* Source library */}
          <div>
            <div style={lbl}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#c8a84b', marginRight: 5, verticalAlign: 'middle' }} />
              Bronnen
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#c8a84b', marginLeft: 5 }}>{selectedSources.length} actief</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {['alle', 'nieuws', 'analyse', 'nl'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? '#0d0d0d' : 'none', border: '1px solid',
                  borderColor: filter === f ? '#0d0d0d' : '#c8bfaa', borderRadius: 2,
                  padding: '2px 7px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  color: filter === f ? '#f4f0e8' : '#8a8070', cursor: 'pointer',
                }}>{f}</button>
              ))}
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 7 }}>
              {groups.map(g => (
                <div key={g.cat}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.57rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8070', padding: '5px 6px 2px', borderBottom: '1px solid #c8bfaa', marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{g.label}</span>
                    <button onClick={() => selectAllInCat(g.cat)} style={{ background: 'none', border: 'none', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.57rem', color: '#c8a84b', cursor: 'pointer', padding: 0 }}>
                      {sources.filter(s => s.cat === g.cat).every(s => s.selected) ? '- alles af' : '+ alles aan'}
                    </button>
                  </div>
                  {g.sources.map(s => (
                    <div key={s.id} onClick={() => toggleSource(s.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 3,
                      cursor: 'pointer', borderLeft: '2px solid ' + (s.selected ? '#c8a84b' : 'transparent'),
                      background: s.selected ? 'rgba(200,168,75,0.1)' : 'transparent',
                    }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, flexShrink: 0, border: '1.5px solid ' + (s.selected ? '#c8a84b' : '#c8bfaa'), background: s.selected ? '#c8a84b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.selected && <span style={{ color: 'white', fontSize: '0.55rem', lineHeight: 1 }}>v</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.74rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem', color: '#8a8070', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.desc}</div>
                      </div>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.54rem', textTransform: 'uppercase', padding: '1px 4px', borderRadius: 2, flexShrink: 0, background: CAT_COLORS[s.cat].bg, color: CAT_COLORS[s.cat].text }}>{s.cat}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              <input value={customInput} onChange={e => setCustomInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomSource()} placeholder="Eigen bron..."
                style={{ flex: 1, background: 'white', border: '1px solid #c8bfaa', padding: '4px 8px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.74rem', borderRadius: 3, outline: 'none', minWidth: 0 }} />
              <button onClick={addCustomSource} style={{ background: '#3d4a5c', color: 'white', border: 'none', padding: '4px 9px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', cursor: 'pointer', borderRadius: 3 }}>+</button>
            </div>
          </div>

          {/* Custom query */}
          <div>
            <div style={lbl}>Eigen zoekopdracht</div>
            <textarea value={customQuery} onChange={e => setCustomQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleCustom()}
              placeholder="Bijv: Spanningen Taiwan straat..."
              style={{ width: '100%', background: 'white', border: '1px solid #c8bfaa', padding: '6px 8px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.78rem', borderRadius: 3, resize: 'vertical', minHeight: 60, outline: 'none', marginBottom: 6 }} />
            <button onClick={handleCustom} disabled={loading} style={{ width: '100%', background: loading ? '#8a8070' : '#0d0d0d', color: '#f4f0e8', border: 'none', padding: 8, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 3 }}>
              Analyseer nieuws &rarr;
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ padding: '24px 32px', overflowY: 'auto' }}>
          {error && <div style={{ background: 'rgba(179,74,42,0.08)', border: '1px solid rgba(179,74,42,0.3)', color: '#b34a2a', padding: '11px 15px', borderRadius: 3, fontSize: '0.82rem', marginBottom: 18 }}>{error}</div>}

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: '#8a8070', letterSpacing: '0.08em', marginBottom: 18 }}>{tickerMsg}</div>
              <div style={{ display: 'inline-flex', gap: 6 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i===0?'#b34a2a':i===1?'#c8a84b':'#3d4a5c', animation: 'pulse 1.2s ease-in-out ' + (i*0.2) + 's infinite' }} />)}
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div style={{ textAlign: 'center', padding: '70px 40px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: '#c8bfaa', marginBottom: 16 }}>+</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#3d4a5c', fontStyle: 'italic', marginBottom: 8 }}>Kies een onderwerp</h2>
              <p style={{ fontSize: '0.82rem', color: '#8a8070', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>Selecteer een regio of typ een eigen zoekopdracht voor een actuele geopolitieke briefing.</p>
            </div>
          )}

          {!loading && result && (
            <div>
              {/* Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22, borderBottom: '1px solid #c8bfaa', paddingBottom: 0 }}>
                {['nieuws', 'leeslijst'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    background: 'none', border: 'none',
                    borderBottom: '2px solid ' + (activeTab === tab ? '#b34a2a' : 'transparent'),
                    padding: '8px 16px 8px 0', marginRight: 16,
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.63rem',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: activeTab === tab ? '#b34a2a' : '#8a8070',
                    cursor: 'pointer', marginBottom: -1,
                  }}>
                    {tab === 'nieuws' ? 'Briefing' : 'Leeslijst (' + bookmarks.length + ')'}
                  </button>
                ))}
                <div style={{ marginLeft: 'auto', fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, fontStyle: 'italic' }}>
                  {result.onderwerp}
                </div>
              </div>

              {/* NIEUWS TAB */}
              {activeTab === 'nieuws' && (
                <div>
                  {(result.artikelen || []).map((art, i) => <ArticleCard key={i} art={art} showRemove={false} />)}

                  {/* Analysis */}
                  {result.analyse && (
                    <div style={{ marginTop: 24, background: '#0d0d0d', color: '#f4f0e8', padding: '22px 26px', borderRadius: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c8a84b' }}>Geopolitieke analyse</div>
                        <button onClick={copyAnalyse} style={{ background: 'none', border: '1px solid rgba(200,168,75,0.4)', borderRadius: 3, padding: '3px 10px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: copied ? '#c8a84b' : '#8a8070', cursor: 'pointer' }}>
                          {copied ? 'Gekopieerd' : 'Kopieer analyse'}
                        </button>
                      </div>
                      <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.87rem', lineHeight: 1.75, color: '#e8e0d0' }}>
                        {result.analyse.split('\n').filter(Boolean).map((p, i) => <p key={i} style={{ marginBottom: 12 }}>{p}</p>)}
                      </div>
                      {result.analyse_bronnen && result.analyse_bronnen.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 16, paddingTop: 14 }}>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(200,168,75,0.7)', marginBottom: 8 }}>Gebaseerd op</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {result.analyse_bronnen.map((b, i) => (
                              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: '#c8a84b', flexShrink: 0, marginTop: 1 }}>{i+1}.</span>
                                <div>
                                  {b.url
                                    ? <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: '#c8a84b', textDecoration: 'none', borderBottom: '1px solid rgba(200,168,75,0.4)' }}>{b.bron}</a>
                                    : <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: '#c8a84b' }}>{b.bron}</span>
                                  }
                                  {b.citaat && <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(232,224,208,0.65)', marginLeft: 8, fontStyle: 'italic' }}>"{b.citaat}"</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Related topics */}
                  {result.gerelateerde_onderwerpen && result.gerelateerde_onderwerpen.length > 0 && (
                    <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid #c8bfaa' }}>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8a8070', marginBottom: 10 }}>Verdiep verder</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {result.gerelateerde_onderwerpen.map((t, i) => (
                          <button key={i} onClick={() => handleRelated(t)}
                            style={{ background: 'white', border: '1px solid #c8bfaa', borderRadius: 3, padding: '5px 12px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.78rem', color: '#3d4a5c', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#0d0d0d'; e.currentTarget.style.color='#f4f0e8'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.color='#3d4a5c'; }}>
                            {t} &rarr;
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LEESLIJST TAB */}
              {activeTab === 'leeslijst' && (
                <div>
                  {bookmarks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#8a8070', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1rem' }}>
                      Nog niets opgeslagen. Klik "Bewaar" bij een artikel.
                    </div>
                  ) : bookmarks.map((art, i) => <ArticleCard key={i} art={art} showRemove={true} />)}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
