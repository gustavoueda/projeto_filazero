import { useTheme } from '../context/ThemeContext';

export default function NavBar({ tela, setTela, qtdCarrinho, qtdPedidosAtivos, usuario }) {
  const { darkMode } = useTheme();
  const abas = [
    { id: 'cardapio',  label: 'Início',   Icon: IconHome },
    { id: 'pedidos',   label: 'Pedidos',  Icon: IconReceipt, badge: qtdPedidosAtivos },
    { id: 'carrinho',  label: 'Carrinho', Icon: IconCart, badge: qtdCarrinho },
    ...(usuario?.role === 'admin'
      ? [{ id: 'admin',    label: 'Admin',    Icon: IconGear }]
      : [{ id: 'reservas', label: 'Reservas', Icon: IconCalendar }]),
  ];

  return (
    <nav style={{
      ...styles.nav,
      background: darkMode ? '#1a1b23' : '#fff',
      borderTop: `1px solid ${darkMode ? '#374151' : '#F3F4F6'}`,
    }}>
      {abas.map(aba => {
        const ativo = tela === aba.id;
        return (
          <button key={aba.id} onClick={() => setTela(aba.id)} style={styles.btn}>
            <span style={styles.iconWrap}>
              <aba.Icon color={ativo ? '#F97316' : '#9CA3AF'} />
              {aba.badge > 0 && (
                <span style={styles.badge}>{aba.badge > 9 ? '9+' : aba.badge}</span>
              )}
            </span>
            <span style={{ ...styles.label, color: ativo ? '#F97316' : '#9CA3AF', fontWeight: ativo ? 700 : 500 }}>
              {aba.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function IconHome({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={color === '#F97316' ? '#FFF7ED' : 'none'} />
    </svg>
  );
}

function IconReceipt({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2" fill={color === '#F97316' ? '#FFF7ED' : 'none'} />
      <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="15" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCart({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6V20a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={color === '#F97316' ? '#FFF7ED' : 'none'} />
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" />
      <path d="M16 10a4 4 0 01-8 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendar({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill={color === '#F97316' ? '#FFF7ED' : 'none'} />
      <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1.5" fill={color} />
      <circle cx="12" cy="14" r="1.5" fill={color} />
      <circle cx="16" cy="14" r="1.5" fill={color} />
    </svg>
  );
}

function IconGear({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 14px',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    zIndex: 100,
    boxSizing: 'border-box',
  },
  btn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 0',
  },
  iconWrap: { position: 'relative', display: 'inline-flex' },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    background: '#F97316',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 99,
    padding: '1px 5px',
    lineHeight: '14px',
  },
  label: { fontSize: 11 },
};
