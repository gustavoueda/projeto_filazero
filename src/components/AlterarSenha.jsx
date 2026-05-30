import { useState } from 'react';
import { buscarUsuario, alterarSenha } from '../data/usuarios';
import { useTheme } from '../context/ThemeContext';

export default function AlterarSenha({ usuario, onVoltar }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [visivelAtual, setVisivelAtual] = useState(false);
  const [visivelNova, setVisivelNova] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    if (!senhaAtual) { setErro('Informe sua senha atual.'); return; }
    if (!buscarUsuario(usuario.email, senhaAtual)) { setErro('Senha atual incorreta.'); return; }
    if (novaSenha.length < 6) { setErro('Nova senha deve ter ao menos 6 caracteres.'); return; }
    if (novaSenha === senhaAtual) { setErro('A nova senha deve ser diferente da atual.'); return; }
    if (novaSenha !== confirmar) { setErro('As senhas não coincidem.'); return; }

    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      alterarSenha(usuario.email, novaSenha);
      setSucesso(true);
    }, 700);
  }

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.header}>
        <button style={styles.voltarBtn} onClick={onVoltar}>
          <IconArrow />
        </button>
        <h2 style={styles.headerTitle}>Alterar senha</h2>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.body}>
        {sucesso ? (
          <div style={{ ...styles.sucessoBox, background: t.card, border: `1.5px solid ${t.border}` }}>
            <div style={styles.sucessoIcon}>✅</div>
            <h3 style={{ ...styles.sucessoTitulo, color: t.text }}>Senha alterada!</h3>
            <p style={{ ...styles.sucessoSub, color: t.muted }}>Sua senha foi atualizada com sucesso.</p>
            <button style={styles.btnPrimary} onClick={onVoltar}>
              Voltar
            </button>
          </div>
        ) : (
          <>
            <div style={{ ...styles.userInfo, background: t.card, border: `1.5px solid ${t.border}` }}>
              <div style={styles.avatar}>
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ ...styles.userName, color: t.text }}>{usuario.nome}</p>
                <p style={{ ...styles.userEmail, color: t.muted }}>{usuario.email}</p>
              </div>
            </div>

            <form onSubmit={handleSalvar} noValidate style={{ ...styles.form, background: t.card, border: `1.5px solid ${t.border}` }}>
              <label style={{ ...styles.label, color: t.text2 }}>Senha atual</label>
              <div style={{ ...styles.inputWrap, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <IconLock />
                <input
                  type={visivelAtual ? 'text' : 'password'}
                  placeholder="••••••"
                  value={senhaAtual}
                  onChange={e => setSenhaAtual(e.target.value)}
                  style={{ ...styles.input, color: t.inputText }}
                  autoComplete="current-password"
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setVisivelAtual(v => !v)}>
                  {visivelAtual ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>

              <label style={{ ...styles.label, color: t.text2 }}>Nova senha</label>
              <div style={{ ...styles.inputWrap, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <IconLock />
                <input
                  type={visivelNova ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  style={{ ...styles.input, color: t.inputText }}
                  autoComplete="new-password"
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setVisivelNova(v => !v)}>
                  {visivelNova ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>

              <label style={{ ...styles.label, color: t.text2 }}>Confirmar nova senha</label>
              <div style={{
                ...styles.inputWrap,
                background: t.inputBg,
                border: `1.5px solid ${confirmar && confirmar !== novaSenha ? '#DC2626' : t.inputBorder}`,
              }}>
                <IconLock />
                <input
                  type={visivelNova ? 'text' : 'password'}
                  placeholder="Repita a nova senha"
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
                {carregando ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function IconArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  bg: '#fafaf9',
  card: '#fff',
  border: '#E5E7EB',
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
  container: { minHeight: '100dvh', paddingBottom: 90 },
  header: {
    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    padding: '20px 16px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voltarBtn: {
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 },
  body: { padding: '20px 16px 0' },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: 14,
    borderRadius: 16,
    padding: '14px 16px', marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    color: '#fff', fontSize: 20, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  userName: { margin: '0 0 2px', fontSize: 15, fontWeight: 700 },
  userEmail: { margin: 0, fontSize: 13 },
  form: {
    borderRadius: 16,
    padding: '20px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
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
    width: '100%', padding: '14px', borderRadius: 12,
    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    color: '#fff', border: 'none', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
    marginTop: 4, display: 'block', transition: 'opacity 0.2s',
  },
  sucessoBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', padding: '48px 16px',
    borderRadius: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sucessoIcon: { fontSize: 56, marginBottom: 16 },
  sucessoTitulo: { margin: '0 0 8px', fontSize: 22, fontWeight: 800 },
  sucessoSub: { margin: '0 0 24px', fontSize: 14 },
};
