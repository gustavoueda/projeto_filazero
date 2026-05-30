import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const PAGAMENTOS = [
  { id: 'dinheiro', label: 'Dinheiro', sub: 'Pague em espécie no balcão', icon: '💵' },
  { id: 'cartao',   label: 'Cartão',   sub: 'Débito ou crédito', icon: '💳' },
  { id: 'pix',      label: 'PIX',      sub: 'QR Code instantâneo', icon: '📱' },
];

function gerarChavePix() {
  const h = () => Math.floor(Math.random() * 16).toString(16);
  const s = (n) => Array.from({ length: n }, h).join('');
  return `${s(8)}-${s(4)}-4${s(3)}-${s(4)}-${s(12)}`;
}

function mascaraCartao(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');
}

function mascaraValidade(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function detectarBandeira(numero) {
  const n = numero.replace(/\s/g, '');
  if (/^4/.test(n)) return { nome: 'Visa', cor: '#1a1f71' };
  if (/^5[1-5]/.test(n) || /^2[2-7]\d{2}/.test(n)) return { nome: 'Mastercard', cor: '#eb001b' };
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(n)) return { nome: 'Elo', cor: '#00a4e0' };
  if (/^3[47]/.test(n)) return { nome: 'Amex', cor: '#007bc1' };
  return { nome: '', cor: '#9ca3af' };
}

export default function Carrinho({ itens, onRemover, onAltQtd, onFinalizar, nomeUsuario, setTela }) {
  const [nome, setNome] = useState(nomeUsuario || '');
  const [pagamento, setPagamento] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  const [pixKey] = useState(gerarChavePix);
  const [copiado, setCopiado] = useState(false);

  const [cartoesSalvos, setCartoesSalvos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fz_cartoes') || '[]'); } catch { return []; }
  });
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ numero: '', nome: '', validade: '', cvv: '' });

  const { darkMode } = useTheme();
  const { addToast } = useToast();
  const t = darkMode ? DARK : LIGHT;

  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  function copiarChave() {
    navigator.clipboard.writeText(pixKey)
      .then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 2500); })
      .catch(() => addToast('Não foi possível copiar.', 'error'));
  }

  function adicionarCartao() {
    if (form.numero.replace(/\s/g, '').length < 16) { addToast('Número de cartão inválido.', 'error'); return; }
    if (!form.nome.trim()) { addToast('Informe o nome do titular.', 'error'); return; }
    if (form.validade.length < 5) { addToast('Validade inválida.', 'error'); return; }
    if (form.cvv.length < 3) { addToast('CVV inválido.', 'error'); return; }
    const novo = {
      id: Date.now().toString(),
      ultimos4: form.numero.replace(/\s/g, '').slice(-4),
      nomeT: form.nome.trim(),
      validade: form.validade,
      bandeira: detectarBandeira(form.numero),
    };
    const lista = [...cartoesSalvos, novo];
    setCartoesSalvos(lista);
    localStorage.setItem('fz_cartoes', JSON.stringify(lista));
    setCartaoSelecionado(novo.id);
    setMostrarForm(false);
    setForm({ numero: '', nome: '', validade: '', cvv: '' });
    addToast('Cartão salvo!', 'success');
  }

  function removerCartao(e, id) {
    e.stopPropagation();
    const lista = cartoesSalvos.filter(c => c.id !== id);
    setCartoesSalvos(lista);
    localStorage.setItem('fz_cartoes', JSON.stringify(lista));
    if (cartaoSelecionado === id) setCartaoSelecionado(null);
  }

  function handleFinalizar() {
    if (!nome.trim()) { addToast('Informe seu nome para finalizar o pedido.', 'error'); return; }
    if (!pagamento) { addToast('Selecione a forma de pagamento.', 'error'); return; }
    if (pagamento === 'cartao' && !cartaoSelecionado) {
      addToast('Selecione ou adicione um cartão.', 'error'); return;
    }
    onFinalizar(nome.trim(), pagamento);
    setConfirmado(true);
  }

  if (confirmado) {
    return (
      <div style={{ ...styles.container, background: t.bg }}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={{ ...styles.successTitle, color: t.text }}>Pedido enviado!</h2>
          <p style={{ ...styles.successSub, color: t.muted }}>Acompanhe em <strong>Meus Pedidos</strong></p>
          <button style={styles.btnPrimary} onClick={() => { setConfirmado(false); setTela('pedidos'); }}>
            Ver Meus Pedidos
          </button>
          <button style={{ ...styles.btnSecondary, background: t.card, border: `1.5px solid ${t.cardBorder}`, color: '#ea580c' }}
            onClick={() => { setConfirmado(false); setTela('cardapio'); }}>
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div style={{ ...styles.container, background: t.bg }}>
        <div style={styles.header}><h2 style={styles.headerTitle}>🛒 Carrinho</h2></div>
        <div style={styles.vazio}>
          <div style={{ fontSize: 56 }}>🛒</div>
          <p style={{ color: t.muted, marginTop: 12 }}>Seu carrinho está vazio.</p>
          <button style={styles.btnPrimary} onClick={() => setTela('cardapio')}>Ver Cardápio</button>
        </div>
      </div>
    );
  }

  const bandeiraForm = detectarBandeira(form.numero);
  const mostrarListaCartoes = pagamento === 'cartao';
  const semCartoes = cartoesSalvos.length === 0;

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>Carrinho</h2>
          <span style={styles.headerSub}>{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
        </div>
      </div>

      <div style={styles.lista}>
        {itens.map(item => (
          <div key={item.produtoId} style={{ ...styles.itemCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
            <img src={item.imagem} alt={item.nome} style={styles.itemImg} />
            <div style={styles.itemInfo}>
              <p style={{ ...styles.itemNome, color: t.text }}>{item.nome}</p>
              <p style={styles.itemPreco}>R$ {item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            <div style={styles.itemControls}>
              <button style={{ ...styles.ctrlBtn, background: t.ctrlBg, border: `1.5px solid ${t.ctrlBorder}` }}
                onClick={() => onAltQtd(item.produtoId, -1)}>−</button>
              <span style={{ ...styles.ctrlQtd, color: t.text }}>{item.qtd}</span>
              <button style={{ ...styles.ctrlBtn, background: t.ctrlBg, border: `1.5px solid ${t.ctrlBorder}` }}
                onClick={() => onAltQtd(item.produtoId, +1)}>+</button>
              <button style={styles.removeBtn} onClick={() => onRemover(item.produtoId)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...styles.resumo, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
        <div style={styles.totalRow}>
          <span style={{ ...styles.totalLabel, color: t.muted }}>Total</span>
          <span style={styles.totalVal}>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>

        <input
          style={{ ...styles.nomeInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
          placeholder="Seu nome para retirada"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        <p style={{ ...styles.pagLabel, color: t.muted }}>Forma de pagamento</p>
        <div style={styles.pagGrid}>
          {PAGAMENTOS.map(op => {
            const ativo = pagamento === op.id;
            return (
              <button
                key={op.id}
                onClick={() => { setPagamento(op.id); if (op.id !== 'cartao') { setMostrarForm(false); } }}
                style={{
                  ...styles.pagBtn,
                  background: ativo ? '#fff7ed' : t.card,
                  border: `2px solid ${ativo ? '#ea580c' : t.cardBorder}`,
                  color: ativo ? '#ea580c' : t.text,
                }}
              >
                <span style={styles.pagIcon}>{op.icon}</span>
                <span style={styles.pagBtnLabel}>{op.label}</span>
                <span style={{ ...styles.pagSub, color: ativo ? '#f97316' : t.muted }}>{op.sub}</span>
              </button>
            );
          })}
        </div>

        {/* PIX */}
        {pagamento === 'pix' && (
          <div style={{ ...styles.pixBox, background: t.inputBg, borderColor: '#32d583' }}>
            <p style={styles.pixTitulo}>Pague com PIX</p>
            <div style={styles.pixQRWrap}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('FILAZERO:' + pixKey)}&margin=2&bgcolor=ffffff&color=000000`}
                alt="QR Code PIX"
                style={styles.pixQR}
              />
            </div>
            <p style={{ ...styles.pixKeyLabel, color: t.muted }}>Chave aleatória do pedido</p>
            <div style={{ ...styles.pixKeyRow, background: darkMode ? '#1a2332' : '#f0fdf4' }}>
              <span style={{ ...styles.pixKeyText, color: t.text }}>{pixKey}</span>
              <button
                onClick={copiarChave}
                style={{ ...styles.copiarBtn, background: copiado ? '#16a34a' : '#ea580c' }}
              >
                {copiado ? '✓' : 'Copiar'}
              </button>
            </div>
            <p style={{ ...styles.pixDica, color: t.muted }}>
              Escaneie o QR Code ou copie a chave no app do seu banco
            </p>
          </div>
        )}

        {/* CARTÃO */}
        {mostrarListaCartoes && (
          <div style={styles.cartaoBox}>
            {cartoesSalvos.map(c => (
              <div
                key={c.id}
                onClick={() => { setCartaoSelecionado(c.id); setMostrarForm(false); }}
                style={{
                  ...styles.cartaoSalvo,
                  background: cartaoSelecionado === c.id ? '#fff7ed' : t.card,
                  border: `2px solid ${cartaoSelecionado === c.id ? '#ea580c' : t.cardBorder}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ ...styles.bandeiraTag, background: c.bandeira.cor }}>
                  {c.bandeira.nome || '💳'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ ...styles.cartaoNum, color: t.text }}>•••• •••• •••• {c.ultimos4}</p>
                  <p style={{ ...styles.cartaoMeta, color: t.muted }}>{c.nomeT} · {c.validade}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {cartaoSelecionado === c.id && (
                    <span style={styles.checkmark}>✓</span>
                  )}
                  <button
                    onClick={e => removerCartao(e, c.id)}
                    style={styles.btnRemoverCartao}
                  >✕</button>
                </div>
              </div>
            ))}

            {!mostrarForm && (
              <button
                onClick={() => { setMostrarForm(true); setCartaoSelecionado(null); }}
                style={{ ...styles.btnAdicionarCartao, border: `2px dashed ${t.cardBorder}`, color: '#ea580c' }}
              >
                + {semCartoes ? 'Adicionar cartão' : 'Novo cartão'}
              </button>
            )}

            {mostrarForm && (
              <div style={{ ...styles.formCartao, background: t.inputBg, border: `1.5px solid ${t.cardBorder}` }}>
                <p style={{ ...styles.formTitulo, color: t.text }}>Dados do cartão</p>

                <label style={{ ...styles.inputLabel, color: t.muted }}>Número do cartão</label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{ ...styles.cardInput, background: t.card, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                    placeholder="0000 0000 0000 0000"
                    value={form.numero}
                    onChange={e => setForm(f => ({ ...f, numero: mascaraCartao(e.target.value) }))}
                  />
                  {form.numero && (
                    <span style={{ ...styles.bandeiraDetect, color: bandeiraForm.cor }}>
                      {bandeiraForm.nome || '💳'}
                    </span>
                  )}
                </div>

                <label style={{ ...styles.inputLabel, color: t.muted }}>Nome no cartão</label>
                <input
                  style={{ ...styles.cardInput, background: t.card, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                  placeholder="NOME SOBRENOME"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value.toUpperCase() }))}
                />

                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...styles.inputLabel, color: t.muted }}>Validade</label>
                    <input
                      style={{ ...styles.cardInput, background: t.card, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                      placeholder="MM/AA"
                      value={form.validade}
                      onChange={e => setForm(f => ({ ...f, validade: mascaraValidade(e.target.value) }))}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...styles.inputLabel, color: t.muted }}>CVV</label>
                    <input
                      style={{ ...styles.cardInput, background: t.card, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={form.cvv}
                      onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => { setMostrarForm(false); setForm({ numero: '', nome: '', validade: '', cvv: '' }); }}
                    style={{ ...styles.btnCancelarForm, border: `1.5px solid ${t.cardBorder}`, color: t.muted, background: t.card }}
                  >
                    Cancelar
                  </button>
                  <button onClick={adicionarCartao} style={styles.btnSalvarCartao}>
                    Salvar cartão
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button style={styles.btnFinalizar} onClick={handleFinalizar}>
          Finalizar Pedido →
        </button>
      </div>
    </div>
  );
}

const LIGHT = {
  bg: '#fafaf9',
  card: '#fff',
  cardBorder: '#f0e8d8',
  text: '#1c1917',
  muted: '#6b7280',
  ctrlBg: '#fff7ed',
  ctrlBorder: '#fed7aa',
  inputBg: '#fff',
  inputBorder: '#fed7aa',
};

const DARK = {
  bg: '#111827',
  card: '#1f2937',
  cardBorder: '#374151',
  text: '#f1f5f9',
  muted: '#9ca3af',
  ctrlBg: '#2d3748',
  ctrlBorder: '#4b5563',
  inputBg: '#374151',
  inputBorder: '#4b5563',
};

const styles = {
  container: { paddingBottom: 100, minHeight: '100dvh' },
  header: {
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    padding: '20px 20px 18px',
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  },
  headerTitle: { margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  vazio: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 8 },
  lista: { padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 },
  itemCard: {
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px',
    gap: 12,
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  },
  itemImg: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemNome: { margin: '0 0 3px', fontSize: 14, fontWeight: 700 },
  itemPreco: { margin: 0, fontSize: 13, color: '#ea580c', fontWeight: 600 },
  itemControls: { display: 'flex', alignItems: 'center', gap: 6 },
  ctrlBtn: {
    width: 28, height: 28, borderRadius: 8,
    color: '#ea580c', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  ctrlQtd: { fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' },
  removeBtn: {
    marginLeft: 4, background: '#fff1f2', border: '1.5px solid #fecdd3',
    borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 13,
  },
  resumo: {
    margin: '20px 16px',
    borderRadius: 16,
    padding: '18px 18px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 14 },
  totalLabel: { fontSize: 16, fontWeight: 600 },
  totalVal: { fontSize: 22, fontWeight: 800, color: '#ea580c' },
  nomeInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box',
  },
  pagLabel: { margin: '0 0 8px', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  pagGrid: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 },
  pagBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.15s',
  },
  pagIcon: { fontSize: 20, flexShrink: 0 },
  pagBtnLabel: { fontSize: 14, fontWeight: 700, flex: 1 },
  pagSub: { fontSize: 11, fontWeight: 400, textAlign: 'right' },

  // PIX
  pixBox: {
    borderRadius: 14,
    border: '1.5px solid',
    padding: '18px 16px',
    marginBottom: 14,
    textAlign: 'center',
  },
  pixTitulo: {
    margin: '0 0 14px',
    fontSize: 15,
    fontWeight: 700,
    color: '#16a34a',
  },
  pixQRWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pixQR: {
    width: 160,
    height: 160,
    borderRadius: 12,
    border: '3px solid #dcfce7',
  },
  pixKeyLabel: { margin: '0 0 8px', fontSize: 12, fontWeight: 600 },
  pixKeyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 10,
    marginBottom: 10,
  },
  pixKeyText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    textAlign: 'left',
  },
  copiarBtn: {
    flexShrink: 0,
    padding: '6px 12px',
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  pixDica: { margin: 0, fontSize: 11 },

  // CARTÃO
  cartaoBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 14,
  },
  cartaoSalvo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 12,
    transition: 'border-color 0.15s',
  },
  bandeiraTag: {
    padding: '4px 8px',
    borderRadius: 6,
    color: '#fff',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  cartaoNum: { margin: '0 0 2px', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em' },
  cartaoMeta: { margin: 0, fontSize: 12 },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#ea580c',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },
  btnRemoverCartao: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#fee2e2',
    border: 'none',
    color: '#dc2626',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdicionarCartao: {
    width: '100%',
    padding: '12px',
    borderRadius: 12,
    background: 'transparent',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
  },
  formCartao: {
    borderRadius: 12,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  formTitulo: { margin: '0 0 4px', fontSize: 14, fontWeight: 700 },
  inputLabel: { display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  cardInput: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  bandeiraDetect: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 12,
    fontWeight: 800,
  },
  btnCancelarForm: {
    flex: 1,
    padding: '10px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSalvarCartao: {
    flex: 2,
    padding: '10px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    color: '#fff',
    border: 'none',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },

  btnFinalizar: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(234,88,12,0.35)',
  },
  btnPrimary: {
    marginTop: 16,
    padding: '12px 24px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'block',
    width: '100%',
  },
  btnSecondary: {
    marginTop: 8,
    padding: '12px 24px',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'block',
    width: '100%',
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 32px',
    textAlign: 'center',
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 800 },
  successSub: { margin: '0 0 24px' },
};
