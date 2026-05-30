import { useState } from 'react';
import { buscarPorEmail, alterarSenha } from '../data/usuarios';
import { useTheme } from '../context/ThemeContext';

export default function EsqueceuSenha({ onVoltar }) {
  const [etapa, setEtapa] = useState('email');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  function handleVerificar(e) {
    e.preventDefault();
    setErro('');
    if (!email.trim()) { setErro('Informe seu e-mail.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErro('E-mail inválido.'); return; }
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      const encontrado = buscarPorEmail(email.trim());
      if (!encontrado) { setErro('E-mail não encontrado.'); return; }
      setEtapa('nova-senha');
    }, 700);
  }

  function handleRedefinir(e) {
    e.preventDefault();
    setErro('');
    if (novaSenha.length < 6) { setErro('Senha deve ter ao menos 6 caracteres.'); return; }
    if (novaSenha !== confirmar) { setErro('As senhas não coincidem.'); return; }
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      alterarSenha(email.trim(), novaSenha);
      setEtapa('sucesso');
    }, 700);
  }

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.topo}>
        <div style={styles.circleBlue} />
        <div style={styles.circleOrange} />
      </div>

      <div style={styles.logoArea}>
        <div style={styles.brandWrap}>
          <span style={styles.brandF}>FILA</span><span style={styles.brandZ}>ZERO</span>
        </div>
      </div>

      <div style={{ ...styles.card, background: t.card, border: `1.5px solid ${t.border}` }}>
        {etapa === 'email' && (
          <>
            <div style={styles.iconCircle}>🔑</div>
            <h2 style={{ ...styles.titulo, color: t.text }}>Redefinir senha</h2>
            <p style={{ ...styles.subtitulo, color: t.muted }}>Informe seu e-mail cadastrado</p>
            <form onSubmit={handleVerificar} noValidate>
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
              {erro && <p style={styles.erro}>{erro}</p>}
              <button
                type="submit"
                style={{ ...styles.btnPrimary, opacity: carregando ? 0.7 : 1 }}
                disabled={carregando}
              >
                {carregando ? 'Verificando...' : 'Verificar e-mail →'}
              </button>
            </form>
          </>
        )}

        {etapa === 'nova-senha' && (
          <>
            <div style={styles.iconCircle}>🔒</div>
            <h2 style={{ ...styles.titulo, color: t.text }}>Nova senha</h2>
            <p style={{ ...styles.subtitulo, color: t.muted }}>Crie uma nova senha para <strong>{email}</strong></p>
            <form onSubmit={handleRedefinir} noValidate>
              <label style={{ ...styles.label, color: t.text2 }}>Nova senha</label>
              <div style={{ ...styles.inputWrap, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <IconLock />
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  style={{ ...styles.input, color: t.inputText }}
                  autoComplete="new-password"
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setSenhaVisivel(v => !v)}>
                  {senhaVisivel ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              <label style={{ ...styles.label, color: t.text2 }}>Confirmar senha</label>
              <div style={{
                ...styles.inputWrap,
                background: t.inputBg,
                border: `1.5px solid ${confirmar && confirmar !== novaSenha ? '#DC2626' : t.inputBorder}`,
              }}>
                <IconLock />
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  style={{ ...styles.input, color: t.inputText }}
                  autoComplete="new-password"
                />
                {confirmar.length > 0 && (
                  <span style={{ fontSize: 16 }}>{confirmar === novaSenha ? '✓' : '✗'}</span>
                )}
              </div>
              {erro && <p style={styles.erro}>{erro}</p>}
              <button
                type="submit"
                style={{ ...styles.btnPrimary, opacity: carregando ? 0.7 : 1 }}
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}

        {etapa === 'sucesso' && (
          <div style={styles.sucessoBox}>
            <div style={styles.sucessoIcon}>✅</div>
            <h2 style={{ ...styles.titulo, color: t.text }}>Senha redefinida!</h2>
            <p style={{ ...styles.subtitulo, color: t.muted }}>Sua senha foi atualizada com sucesso.</p>
            <button style={styles.btnPrimary} onClick={onVoltar}>
              Fazer login
            </button>
          </div>
        )}

        {etapa !== 'sucesso' && (
          <button style={{ ...styles.voltarBtn, color: t.muted }} onClick={onVoltar}>
            ← Voltar ao login
          </button>
        )}
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
  topo: { position: 'relative', height: 10, overflow: 'visible', pointerEvents: 'none' },
  circleBlue: {
    position: 'absolute', top: -100, right: -60, width: 200, height: 200,
    borderRadius: '50%', background: 'radial-gradient(circle, #DBEAFE 0%, #BFDBFE 100%)', opacity: 0.6,
  },
  circleOrange: {
    position: 'absolute', top: -70, left: -70, width: 170, height: 170,
    borderRadius: '50%', background: 'radial-gradient(circle, #FFEDD5 0%, #FED7AA 100%)', opacity: 0.7,
  },
  logoArea: {
    display: 'flex', justifyContent: 'center',
    paddingTop: 52, paddingBottom: 4, position: 'relative', zIndex: 1,
  },
  brandWrap: { display: 'flex', letterSpacing: '-0.5px' },
  brandF: { fontSize: 28, fontWeight: 900, color: '#1D4ED8' },
  brandZ: { fontSize: 28, fontWeight: 900, color: '#F97316' },
  card: {
    margin: '16px 20px 32px',
    borderRadius: 24,
    padding: '28px 24px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    position: 'relative',
    zIndex: 1,
  },
  iconCircle: { fontSize: 36, textAlign: 'center', marginBottom: 12 },
  titulo: { margin: '0 0 4px', fontSize: 22, fontWeight: 800, textAlign: 'center' },
  subtitulo: { margin: '0 0 20px', fontSize: 13, textAlign: 'center' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    borderRadius: 12, padding: '0 14px',
    marginBottom: 14,
  },
  input: {
    flex: 1, border: 'none', outline: 'none',
    background: 'transparent', fontSize: 15, padding: '12px 0',
  },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' },
  erro: { color: '#DC2626', fontSize: 13, margin: '-4px 0 12px', fontWeight: 500 },
  btnPrimary: {
    width: '100%', padding: '14px', borderRadius: 14,
    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    color: '#fff', border: 'none', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
    marginTop: 4, transition: 'opacity 0.2s', display: 'block',
  },
  voltarBtn: {
    display: 'block', width: '100%', marginTop: 16,
    background: 'none', border: 'none',
    fontSize: 14, cursor: 'pointer', textAlign: 'center', fontWeight: 600,
  },
  sucessoBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  sucessoIcon: { fontSize: 52, marginBottom: 12 },
};
