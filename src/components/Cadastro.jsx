import { useState } from 'react';
import { cadastrarUsuario } from '../data/usuarios';
import { useTheme } from '../context/ThemeContext';
import LogoFilaZero from './LogoFilaZero';

export default function Cadastro({ onCadastro, onIrLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  function handleCadastro(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) { setErro('Informe seu nome completo.'); return; }
    if (nome.trim().length < 3) { setErro('Nome deve ter ao menos 3 caracteres.'); return; }
    if (!email.trim()) { setErro('Informe seu e-mail.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErro('E-mail inválido.'); return; }
    if (senha.length < 6) { setErro('Senha deve ter ao menos 6 caracteres.'); return; }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return; }

    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      const resultado = cadastrarUsuario(nome.trim(), email.trim(), senha);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      onCadastro(resultado.usuario);
    }, 700);
  }

  const forca = calcularForca(senha);

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.topo}>
        <div style={styles.circleOrange} />
        <div style={styles.circleBlue} />
      </div>

      <div style={styles.logoArea}>
        <LogoFilaZero size={160} darkMode={darkMode} />
      </div>

      <div style={{ ...styles.card, background: t.card, border: `1.5px solid ${t.border}` }}>
        <h2 style={{ ...styles.titulo, color: t.text }}>Criar conta</h2>
        <p style={{ ...styles.subtitulo, color: t.muted }}>Preencha os dados para se cadastrar</p>

        <form onSubmit={handleCadastro} noValidate>
          <label style={{ ...styles.label, color: t.text2 }}>Nome completo</label>
          <div style={{ ...styles.inputWrap, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
            <IconPerson />
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              style={{ ...styles.input, color: t.inputText }}
              autoComplete="name"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              style={{ ...styles.input, color: t.inputText }}
              autoComplete="new-password"
            />
            <button type="button" style={styles.eyeBtn} onClick={() => setSenhaVisivel(v => !v)}>
              {senhaVisivel ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          {senha.length > 0 && (
            <div style={styles.forcaWrap}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    ...styles.forcaBar,
                    background: i < forca.nivel ? forca.cor : t.forcaEmpty,
                  }}
                />
              ))}
              <span style={{ ...styles.forcaLabel, color: forca.cor }}>{forca.texto}</span>
            </div>
          )}

          <label style={{ ...styles.label, color: t.text2 }}>Confirmar senha</label>
          <div style={{
            ...styles.inputWrap,
            background: t.inputBg,
            borderColor: confirmarSenha && confirmarSenha !== senha ? '#DC2626' : t.inputBorder,
            border: `1.5px solid ${confirmarSenha && confirmarSenha !== senha ? '#DC2626' : t.inputBorder}`,
          }}>
            <IconLock />
            <input
              type={senhaVisivel ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
              style={{ ...styles.input, color: t.inputText }}
              autoComplete="new-password"
            />
            {confirmarSenha.length > 0 && (
              <span style={{ fontSize: 16 }}>
                {confirmarSenha === senha ? '✓' : '✗'}
              </span>
            )}
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button
            type="submit"
            style={{ ...styles.btnPrimary, opacity: carregando ? 0.7 : 1 }}
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div style={{ ...styles.divider, borderTop: `1px solid ${t.border}` }}>
          <span style={{ ...styles.dividerText, background: t.card, color: t.muted }}>ou</span>
        </div>

        <p style={{ ...styles.linkRow, color: t.muted }}>
          Já tem conta?{' '}
          <button style={styles.linkBtn} onClick={onIrLogin}>
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}

function calcularForca(senha) {
  if (senha.length < 6) return { nivel: 1, cor: '#DC2626', texto: 'Fraca' };
  const temNum = /\d/.test(senha);
  const temEsp = /[!@#$%^&*]/.test(senha);
  const temMaius = /[A-Z]/.test(senha);
  const pontos = [temNum, temEsp, temMaius].filter(Boolean).length;
  if (pontos === 0) return { nivel: 1, cor: '#DC2626', texto: 'Fraca' };
  if (pontos === 1) return { nivel: 2, cor: '#F97316', texto: 'Média' };
  return { nivel: 3, cor: '#16A34A', texto: 'Forte' };
}

function IconPerson() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="4" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
  forcaEmpty: '#E5E7EB',
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
  forcaEmpty: '#4b5563',
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
  circleOrange: {
    position: 'absolute',
    top: -100,
    right: -70,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #FFEDD5 0%, #FED7AA 100%)',
    opacity: 0.7,
  },
  circleBlue: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #DBEAFE 0%, #BFDBFE 100%)',
    opacity: 0.6,
  },
  logoArea: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 36,
    paddingBottom: 4,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    margin: '16px 20px 32px',
    borderRadius: 24,
    padding: '24px 24px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    position: 'relative',
    zIndex: 1,
  },
  titulo: { margin: '0 0 4px', fontSize: 22, fontWeight: 800 },
  subtitulo: { margin: '0 0 20px', fontSize: 13 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: '0 14px',
    marginBottom: 14,
    transition: 'border-color 0.2s',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 15,
    padding: '12px 0',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  forcaWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 14,
  },
  forcaBar: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    transition: 'background 0.3s',
  },
  forcaLabel: {
    fontSize: 11,
    fontWeight: 700,
    minWidth: 36,
    textAlign: 'right',
  },
  erro: {
    color: '#DC2626',
    fontSize: 13,
    margin: '-6px 0 12px',
    fontWeight: 500,
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    background: 'linear-gradient(135deg, #F97316, #EA580C)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
    marginTop: 4,
    transition: 'opacity 0.2s',
  },
  divider: {
    textAlign: 'center',
    margin: '18px 0 14px',
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
    color: '#1D4ED8',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
};
