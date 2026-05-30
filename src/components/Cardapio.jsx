import { useState } from 'react';
import { CATEGORIAS } from '../data/produtos';
import heroImg from '../assets/hero.png';
import { useTheme } from '../context/ThemeContext';
import LogoFilaZero from './LogoFilaZero';

const CAT_ICONS = {
  Todos:    <IconTodos />,
  Salgados: <IconSalgados />,
  Bebidas:  <IconBebidas />,
  Doces:    <IconDoces />,
};

export default function Cardapio({ produtos, onAdicionar, nomeUsuario, onSair, onAlterarSenha }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Salgados');
  const [busca, setBusca] = useState('');
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  const disponiveis = produtos.filter(p => p.disponivel !== false);
  const filtrados = busca.trim()
    ? disponiveis.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : categoriaAtiva === 'Todos'
      ? disponiveis
      : disponiveis.filter(p => p.categoria === categoriaAtiva);

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {/* Header */}
      <div style={{ ...styles.header, background: t.bg, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.logoRow}>
          <LogoFilaZero size={44} darkMode={darkMode} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button style={styles.notifBtn} onClick={onAlterarSenha} title="Minha conta">
            <IconUser dark={darkMode} />
          </button>
          <button style={{ ...styles.sairBtn, border: `1.5px solid ${t.border}`, color: t.muted }}>
            <span onClick={onSair}>Sair</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <img src={heroImg} alt="cantina" style={styles.heroImg} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <p style={styles.heroSub}>
            Bem-vindo,{' '}
            <span style={styles.heroAccent}>FILAZERO</span>
          </p>
          <p style={styles.heroUser}>{nomeUsuario || 'Estudante'}</p>
        </div>
      </div>

      {/* Busca */}
      <div style={{ padding: '12px 16px 0', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: t.inputBg, border: `1.5px solid ${t.border}`,
          borderRadius: 12, padding: '0 14px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" stroke={t.muted} strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke={t.muted} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', fontSize: 14,
              padding: '11px 0', color: t.text,
            }}
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.muted, fontSize: 20, lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Categorias */}
      <div style={{ ...styles.categoriasWrap, display: busca ? 'none' : 'flex' }}>
        {['Todos', ...CATEGORIAS].map(cat => {
          const ativo = cat === categoriaAtiva;
          return (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              style={{
                ...styles.catBtn,
                ...(ativo
                  ? styles.catBtnAtivo
                  : { ...styles.catBtnInativo, background: t.catInativoBg, border: `1.5px solid ${t.catInativoBorder}` }),
              }}
            >
              <span style={{ color: ativo ? '#fff' : '#2563EB' }}>
                {CAT_ICONS[cat]}
              </span>
              <span style={{ color: ativo ? '#fff' : '#2563EB', fontSize: 13, fontWeight: 600 }}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section label */}
      {!busca && categoriaAtiva !== 'Todos' && (
        <div style={styles.sectionRow}>
          <span style={styles.sectionBadge}>{categoriaAtiva}</span>
        </div>
      )}

      {/* Grid */}
      <div style={styles.grid}>
        {filtrados.length === 0 ? (
          <p style={{ ...styles.vazio, color: t.muted }}>Nenhum item encontrado.</p>
        ) : (
          filtrados.map(p => (
            <ProdutoCard key={p.id} produto={p} onAdicionar={onAdicionar} t={t} />
          ))
        )}
      </div>

      {/* Background pattern */}
      <CircuitPattern />
    </div>
  );
}

function ProdutoCard({ produto, onAdicionar, t }) {
  const semEstoque = produto.estoque === 0;
  const [cor1, cor2] = produto.cor || ['#FFF3E0', '#FFE0B2'];

  return (
    <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.cardBorder}`, opacity: semEstoque ? 0.55 : 1 }}>
      <div style={{ ...styles.cardImg, background: produto.imagem ? '#111' : `linear-gradient(145deg, ${cor1}, ${cor2})`, overflow: 'hidden' }}>
        {produto.imagem
          ? <img src={produto.imagem} alt={produto.nome} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={styles.cardEmoji}>{produto.emoji}</span>
        }
        {semEstoque && <span style={styles.esgotadoBadge}>Esgotado</span>}
      </div>

      <div style={styles.cardInfo}>
        <p style={{ ...styles.cardNome, color: t.text }}>{produto.nome}</p>
        <div style={styles.cardFooter}>
          <span style={styles.cardPreco}>R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
          <button
            style={{ ...styles.addBtn, ...(semEstoque ? styles.addBtnDis : {}) }}
            disabled={semEstoque}
            onClick={() => onAdicionar(produto)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}


function IconUser({ dark }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={dark ? '#d1d5db' : '#374151'} strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={dark ? '#d1d5db' : '#374151'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTodos() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconSalgados() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 8 Q4 5 8 8 Q12 11 15 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function IconBebidas() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 2h6l-1 10H6L5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="8" cy="14" rx="3" ry="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconDoces() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4 Q10 1 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CircuitPattern() {
  return (
    <div style={styles.circuit} aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" opacity="0.04">
        <g stroke="#F97316" strokeWidth="1.5" fill="none">
          <line x1="20" y1="0" x2="20" y2="60" /><circle cx="20" cy="60" r="4" />
          <line x1="20" y1="60" x2="80" y2="60" /><circle cx="80" cy="60" r="4" />
          <line x1="80" y1="60" x2="80" y2="120" />
          <line x1="80" y1="120" x2="160" y2="120" /><circle cx="160" cy="120" r="4" />
          <line x1="160" y1="120" x2="160" y2="180" />
          <line x1="160" y1="180" x2="240" y2="180" /><circle cx="240" cy="180" r="4" />
          <line x1="240" y1="180" x2="240" y2="240" /><circle cx="240" cy="240" r="4" />
          <line x1="100" y1="0" x2="100" y2="40" /><circle cx="100" cy="40" r="4" />
          <line x1="100" y1="40" x2="200" y2="40" /><circle cx="200" cy="40" r="4" />
          <line x1="200" y1="40" x2="200" y2="100" />
          <line x1="40" y1="200" x2="40" y2="280" /><circle cx="40" cy="200" r="4" />
          <line x1="40" y1="280" x2="120" y2="280" /><circle cx="120" cy="280" r="4" />
          <line x1="120" y1="280" x2="120" y2="360" />
          <line x1="120" y1="360" x2="200" y2="360" /><circle cx="200" cy="360" r="4" />
          <line x1="260" y1="260" x2="260" y2="340" /><circle cx="260" cy="260" r="4" />
          <line x1="260" y1="340" x2="300" y2="340" />
          <circle cx="20" cy="200" r="6" fill="none" />
          <circle cx="140" cy="60" r="6" fill="none" />
          <circle cx="220" cy="280" r="6" fill="none" />
        </g>
      </svg>
    </div>
  );
}

const LIGHT = {
  bg: '#fff',
  card: '#fff',
  cardBorder: '#F3F4F6',
  border: '#F3F4F6',
  text: '#111827',
  muted: '#6B7280',
  catInativoBg: '#EFF6FF',
  catInativoBorder: '#BFDBFE',
  inputBg: '#F9FAFB',
};

const DARK = {
  bg: '#111827',
  card: '#1f2937',
  cardBorder: '#374151',
  border: '#374151',
  text: '#f1f5f9',
  muted: '#9ca3af',
  catInativoBg: '#1e2a3a',
  catInativoBorder: '#2d4a6e',
  inputBg: '#1f2937',
};

const styles = {
  container: { paddingBottom: 90, minHeight: '100dvh', position: 'relative', overflow: 'hidden' },
  circuit: { position: 'absolute', bottom: 80, left: 0, right: 0, height: 420, pointerEvents: 'none', zIndex: 0 },

  header: {
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logoRow: { display: 'flex', alignItems: 'center' },
  notifBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 8 },
  sairBtn: {
    background: 'none',
    borderRadius: 8,
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  hero: { position: 'relative', height: 160, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 100%)',
  },
  heroContent: { position: 'absolute', bottom: 16, left: 20 },
  heroSub: { color: '#fff', fontSize: 14, margin: '0 0 2px', fontWeight: 500 },
  heroAccent: { color: '#FB923C', fontWeight: 800 },
  heroUser: { color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 },

  categoriasWrap: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    padding: '16px 16px 4px',
    scrollbarWidth: 'none',
  },
  catBtn: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 99,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  catBtnAtivo: {
    background: '#2563EB',
    border: '1.5px solid #2563EB',
  },
  catBtnInativo: {
    background: '#EFF6FF',
    border: '1.5px solid #BFDBFE',
  },

  sectionRow: { padding: '12px 16px 4px', position: 'relative', zIndex: 1 },
  sectionBadge: {
    background: '#F97316',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    padding: '4px 14px',
    display: 'inline-block',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '10px 16px 16px',
    position: 'relative',
    zIndex: 1,
  },
  vazio: { textAlign: 'center', padding: 24, gridColumn: '1/-1', fontSize: 15 },

  card: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cardImg: {
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardEmoji: { fontSize: 52, lineHeight: 1 },
  esgotadoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(220,38,38,0.85)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 6,
    padding: '2px 7px',
  },
  cardInfo: { padding: '10px 12px 12px' },
  cardNome: { margin: '0 0 8px', fontSize: 13, fontWeight: 700, lineHeight: 1.3 },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardPreco: { fontSize: 14, fontWeight: 800, color: '#F97316' },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
    flexShrink: 0,
  },
  addBtnDis: { background: '#E5E7EB', boxShadow: 'none', cursor: 'not-allowed' },
};
