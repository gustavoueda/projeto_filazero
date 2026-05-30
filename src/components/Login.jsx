import { useState } from 'react';
import { buscarUsuario } from '../data/usuarios';
import { useTheme } from '../context/ThemeContext';
import LogoFilaZero from './LogoFilaZero';

export default function Login({ onLogin, onIrCadastro, onEsqueceuSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  function handleLogin(e) {
    e.preventDefault();
    setErro('');

    if (!email.trim()) { setErro('Informe seu e-mail.'); return; }
    if (!senha.trim()) { setErro('Informe sua senha.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErro('E-mail inválido.'); return; }

    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      const usuario = buscarUsuario(email.trim(), senha);
      if (!usuario) {
        setErro('E-mail ou senha incorretos.');
        return;
      }
      onLogin(usuario);
    }, 700);
  }

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.topo}>
        <div style={styles.circleBlue} />
        <div style={styles.circleOrange} />
      </div>

      <div style={styles.logoArea}>
        <LogoFilaZero size={180} darkMode={darkMode} />
        <p style={{ ...styles.tagline, color: t.muted }}>Cantina sem fila, pedido na palma da mão.</p>
      </div>

      <div style={{ ...styles.card, background: t.card, border: `1.5px solid ${t.border}` }}>
        <h2 style={{ ...styles.titulo, color: t.text }}>Entrar</h2>
        <p style={{ ...styles.subtitulo, color: t.muted }}>Acesse sua conta para fazer pedidos</p>

        <form onSubmit={handleLogin} noValidate>
          <label style={{ ...styles.label, color: t.text2 }}>E-mail</label>
          <div style={{ ...styles.inputWrap, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
            <IconEmail />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...styles.input, color: t.inputText }}
              autoComplete="email"
            />
          </div>

          <label style={{ ...styles.label, color: t.text2 }}>Senha</label>
          <div style={{ ...styles.inputWrap, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
            <IconLock />
            <input
              type={senhaVisivel ? 'text' : 'password'}
              placeholder="••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              style={{ ...styles.input, color: t.inputText }}
              autoComplete="current-password"
            />
            <button type="button" style={styles.eyeBtn} onClick={() => setSenhaVisivel(v => !v)}>
              {senhaVisivel ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button
            type="submit"
            style={{ ...styles.btnPrimary, opacity: carregando ? 0.7 : 1 }}
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <button style={{ ...styles.linkEsqueceu, color: t.muted }} type="button" onClick={onEsqueceuSenha}>
              Esqueceu sua senha?
            </button>
          </div>
        </form>

        <div style={{ ...styles.divider, borderTop: `1px solid ${t.border}` }}>
          <span style={{ ...styles.dividerText, background: t.card, color: t.muted }}>ou</span>
        </div>

        <p style={{ ...styles.linkRow, color: t.muted }}>
          Ainda não tem conta?{' '}
          <button style={styles.linkBtn} onClick={onIrCadastro}>
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}


function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const LIGHT = {
  bg: '#fff',
  card: '#fff',
  border: '#F3F4F6',
  inputBg: '#FAFAFA',
  inputBorder: '#E5E7EB',
  inputText: '#111827',
  text: '#111827',
  text2: '#374151',
  muted: '#6B7280',
};

const DARK = {
  bg: '#111827',
  card: '#1f2937',
  border: '#374151',
  inputBg: '#374151',
  inputBorder: '#4b5563',
  inputText: '#f1f5f9',
  text: '#f1f5f9',
  text2: '#d1d5db',
  muted: '#9ca3af',
};

const styles = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  topo: {
    position: 'relative',
    height: 10,
    overflow: 'visible',
    pointerEvents: 'none',
  },
  circleBlue: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #DBEAFE 0%, #BFDBFE 100%)',
    opacity: 0.6,
  },
  circleOrange: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #FFEDD5 0%, #FED7AA 100%)',
    opacity: 0.7,
  },
  logoArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 8,
    gap: 8,
    position: 'relative',
    zIndex: 1,
  },
  tagline: { fontSize: 13, margin: 0, textAlign: 'center', padding: '0 32px' },
  card: {
    margin: '24px 20px 32px',
    borderRadius: 24,
    padding: '28px 24px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    position: 'relative',
    zIndex: 1,
  },
  titulo: { margin: '0 0 4px', fontSize: 22, fontWeight: 800 },
  subtitulo: { margin: '0 0 24px', fontSize: 13 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: '0 14px',
    marginBottom: 16,
    transition: 'border-color 0.2s',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 15,
    padding: '13px 0',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  erro: {
    color: '#DC2626',
    fontSize: 13,
    margin: '-8px 0 14px',
    fontWeight: 500,
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
    marginTop: 4,
    transition: 'opacity 0.2s',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0 16px',
    position: 'relative',
  },
  dividerText: {
    padding: '0 10px',
    fontSize: 12,
    position: 'relative',
    top: -10,
  },
  linkRow: { textAlign: 'center', fontSize: 14, margin: 0 },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#F97316',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
  linkEsqueceu: {
    background: 'none',
    border: 'none',
    fontSize: 13,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  },
};
