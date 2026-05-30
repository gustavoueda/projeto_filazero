import { useTheme } from '../context/ThemeContext';

const STATUS_CONFIG = {
  aguardando: { label: 'Aguardando', color: '#d97706', bg: '#fef3c7', icon: '⏳' },
  preparando:  { label: 'Preparando',  color: '#2563eb', bg: '#dbeafe', icon: '👨‍🍳' },
  pronto:      { label: 'Pronto!',      color: '#16a34a', bg: '#dcfce7', icon: '✅' },
  entregue:    { label: 'Entregue',    color: '#6b7280', bg: '#f3f4f6', icon: '📦' },
};

const ORDEM_STATUS = ['aguardando', 'preparando', 'pronto', 'entregue'];

export default function MeusPedidos({ pedidos, nomeUsuario }) {
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  const meus = pedidos
    .filter(p => !nomeUsuario || p.cliente === nomeUsuario)
    .sort((a, b) => ORDEM_STATUS.indexOf(a.status) - ORDEM_STATUS.indexOf(b.status));

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>📋 Meus Pedidos</h2>
        {nomeUsuario && <p style={styles.headerSub}>Olá, {nomeUsuario}!</p>}
      </div>

      {meus.length === 0 ? (
        <div style={styles.vazio}>
          <div style={{ fontSize: 56 }}>📋</div>
          <p style={{ color: t.muted, marginTop: 12, fontSize: 15 }}>
            Você ainda não fez nenhum pedido.
          </p>
        </div>
      ) : (
        <div style={styles.lista}>
          {meus.map(pedido => <PedidoCard key={pedido.id} pedido={pedido} t={t} />)}
        </div>
      )}
    </div>
  );
}

function PedidoCard({ pedido, t }) {
  const cfg = STATUS_CONFIG[pedido.status];
  const passos = ORDEM_STATUS.slice(0, -1);
  const idxAtual = ORDEM_STATUS.indexOf(pedido.status);

  return (
    <div style={{ ...styles.card, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
      <div style={styles.cardTop}>
        <div>
          <span style={{ ...styles.pedidoId, color: t.text }}>{pedido.id}</span>
          <span style={{ ...styles.pedidoHora, color: t.muted }}>· {pedido.horario}</span>
        </div>
        <span style={{ ...styles.statusBadge, color: cfg.color, background: cfg.bg }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      <div style={styles.progressBar}>
        {passos.map((s, i) => {
          const concluido = i < idxAtual;
          const atual = i === idxAtual;
          return (
            <div key={s} style={styles.progressStep}>
              <div style={{
                ...styles.progressDot,
                background: concluido || atual ? '#ea580c' : t.progressEmpty,
                boxShadow: atual ? '0 0 0 3px rgba(234,88,12,0.25)' : 'none',
              }} />
              {i < passos.length - 1 && (
                <div style={{ ...styles.progressLine, background: concluido ? '#ea580c' : t.progressEmpty }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={styles.progressLabels}>
        {passos.map(s => (
          <span key={s} style={{ ...styles.progressLabel, color: t.muted }}>{STATUS_CONFIG[s].label}</span>
        ))}
      </div>

      <div style={{ ...styles.itensList, borderTop: `1px solid ${t.cardBorder}` }}>
        {pedido.itens.map((item, i) => (
          <div key={i} style={styles.itemRow}>
            <span style={styles.itemQtd}>{item.qtd}×</span>
            <span style={{ ...styles.itemNome, color: t.text2 }}>{item.nome}</span>
            <span style={{ ...styles.itemPreco, color: t.muted }}>R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
      </div>
      <div style={{ ...styles.totalRow, borderTop: `1px solid ${t.cardBorder}` }}>
        <span style={{ ...styles.totalLabel, color: t.muted }}>Total</span>
        <span style={styles.totalVal}>R$ {pedido.total.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  );
}

const LIGHT = {
  bg: '#fafaf9',
  card: '#fff',
  cardBorder: '#f0e8d8',
  text: '#1c1917',
  text2: '#374151',
  muted: '#6b7280',
  progressEmpty: '#e5e7eb',
};

const DARK = {
  bg: '#111827',
  card: '#1f2937',
  cardBorder: '#374151',
  text: '#f1f5f9',
  text2: '#d1d5db',
  muted: '#9ca3af',
  progressEmpty: '#4b5563',
};

const styles = {
  container: { paddingBottom: 90, minHeight: '100dvh' },
  header: {
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    padding: '20px 20px 18px',
  },
  headerTitle: { margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 },
  headerSub: { margin: '4px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  vazio: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' },
  lista: { padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 },
  card: {
    borderRadius: 16,
    padding: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  pedidoId: { fontWeight: 800, fontSize: 15 },
  pedidoHora: { fontSize: 13, marginLeft: 6 },
  statusBadge: {
    fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 99,
  },
  progressBar: { display: 'flex', alignItems: 'center', marginBottom: 4 },
  progressStep: { display: 'flex', flex: 1, alignItems: 'center' },
  progressDot: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0, transition: 'all 0.3s' },
  progressLine: { flex: 1, height: 3, borderRadius: 2, transition: 'all 0.3s' },
  progressLabels: { display: 'flex', justifyContent: 'space-between', marginBottom: 14 },
  progressLabel: { fontSize: 10, flex: 1, textAlign: 'center' },
  itensList: { paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 },
  itemRow: { display: 'flex', alignItems: 'center', gap: 8 },
  itemQtd: { fontSize: 13, color: '#ea580c', fontWeight: 700, minWidth: 24 },
  itemNome: { flex: 1, fontSize: 13 },
  itemPreco: { fontSize: 13, fontWeight: 600 },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10 },
  totalLabel: { fontSize: 14, fontWeight: 600 },
  totalVal: { fontSize: 16, color: '#ea580c', fontWeight: 800 },
};
