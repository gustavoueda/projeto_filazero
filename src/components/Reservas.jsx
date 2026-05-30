import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const STATUS_CONFIG = {
  pendente:   { label: 'Pendente',   color: '#d97706', bg: '#fef3c7' },
  confirmada: { label: 'Confirmada', color: '#16a34a', bg: '#dcfce7' },
  cancelada:  { label: 'Cancelada',  color: '#dc2626', bg: '#fee2e2' },
};

export default function Reservas({ reservas, nomeUsuario, onAdicionar, produtos }) {
  const [modo, setModo] = useState('lista');
  const [carrinho, setCarrinho] = useState({});
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [nomeRetirada, setNomeRetirada] = useState('');
  const [obs, setObs] = useState('');
  const [erro, setErro] = useState('');
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  const minhas = reservas.filter(r => r.cliente === nomeUsuario);
  const hoje = new Date().toISOString().split('T')[0];

  const produtosDisponiveis = produtos.filter(p => p.disponivel !== false && p.estoque > 0);

  const itensCarrinho = Object.entries(carrinho)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const p = produtos.find(p => p.id === parseInt(id));
      return { produtoId: p.id, nome: p.nome, preco: p.preco, imagem: p.imagem, qtd: qty };
    });

  const total = itensCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);

  function alterarQtd(produtoId, delta) {
    setCarrinho(prev => {
      const atual = prev[produtoId] || 0;
      const nova = Math.max(0, atual + delta);
      return { ...prev, [produtoId]: nova };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (itensCarrinho.length === 0) { setErro('Selecione ao menos um item.'); return; }
    if (!data) { setErro('Informe a data.'); return; }
    if (data < hoje) { setErro('A data não pode ser no passado.'); return; }
    if (!hora) { setErro('Informe o horário.'); return; }
    if (!nomeRetirada.trim()) { setErro('Informe o nome de quem vai retirar.'); return; }

    onAdicionar({
      data, hora,
      nomeRetirada: nomeRetirada.trim(),
      obs: obs.trim(),
      cliente: nomeUsuario,
      itens: itensCarrinho,
      total,
    });

    setCarrinho({}); setData(''); setHora(''); setNomeRetirada(''); setObs('');
    setModo('lista');
  }

  function formatarData(iso) {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>📅 Reservas</h2>
        <p style={styles.headerSub}>Olá, {nomeUsuario}!</p>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 0' }}>
        <button
          style={{ ...styles.abaBtn, ...(modo === 'lista' ? styles.abaBtnAtivo : { background: t.abaInativo, border: `1.5px solid ${t.border}`, color: t.muted }) }}
          onClick={() => setModo('lista')}
        >
          Minhas reservas
        </button>
        <button
          style={{ ...styles.abaBtn, ...(modo === 'nova' ? styles.abaBtnAtivo : { background: t.abaInativo, border: `1.5px solid ${t.border}`, color: t.muted }) }}
          onClick={() => setModo('nova')}
        >
          + Nova reserva
        </button>
      </div>

      {modo === 'lista' && (
        <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {minhas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 48 }}>📅</div>
              <p style={{ color: t.muted, marginTop: 12, fontSize: 15 }}>Nenhuma reserva ainda.</p>
              <button style={styles.btnNova} onClick={() => setModo('nova')}>Fazer reserva</button>
            </div>
          ) : (
            minhas.map(r => {
              const cfg = STATUS_CONFIG[r.status];
              return (
                <div key={r.id} style={{ ...styles.card, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, color: t.text, fontSize: 15 }}>
                        {formatarData(r.data)} às {r.hora}
                      </p>
                      <p style={{ margin: 0, color: t.muted, fontSize: 13 }}>👤 {r.nomeRetirada}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, color: cfg.color, background: cfg.bg }}>
                      {cfg.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {r.itens?.map((item, i) => (
                      <span key={i} style={{ ...styles.chip, background: t.chipBg, border: `1px solid ${t.chipBorder}`, color: t.chipText }}>
                        {item.qtd}× {item.nome}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#ea580c' }}>
                      R$ {r.total?.toFixed(2).replace('.', ',')}
                    </span>
                    <span style={{ fontSize: 11, color: t.muted }}>pago na reserva</span>
                  </div>

                  <div style={styles.codigoBox}>
                    <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>Código de retirada</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#ea580c', letterSpacing: 3 }}>{r.codigo}</span>
                    <span style={{ fontSize: 11, color: '#92400e' }}>Apresente ao atendente</span>
                  </div>

                  {r.obs && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: t.muted, fontStyle: 'italic' }}>"{r.obs}"</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {modo === 'nova' && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ ...styles.card, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
            <h3 style={{ margin: '0 0 4px', color: t.text, fontSize: 16, fontWeight: 700 }}>Nova reserva</h3>
            <p style={{ margin: '0 0 14px', color: t.muted, fontSize: 13 }}>Escolha os itens e agende a retirada</p>

            <form onSubmit={handleSubmit}>
              <label style={{ ...styles.label, color: t.text2 }}>Itens do pedido</label>
              <div style={{ borderRadius: 10, border: `1.5px solid ${t.inputBorder}`, overflow: 'hidden', marginBottom: 4 }}>
                {produtosDisponiveis.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderTop: i > 0 ? `1px solid ${t.inputBorder}` : 'none',
                      background: t.inputBg,
                    }}
                  >
                    {p.imagem
                      ? <img src={p.imagem} alt={p.nome} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                      : <span style={{ fontSize: 20, width: 32, textAlign: 'center', flexShrink: 0 }}>🍽️</span>
                    }
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: t.text }}>{p.nome}</p>
                      <p style={{ margin: 0, fontSize: 12, color: t.muted }}>R$ {p.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button type="button" style={styles.qtdBtn} onClick={() => alterarQtd(p.id, -1)}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: t.text, minWidth: 18, textAlign: 'center' }}>
                        {carrinho[p.id] || 0}
                      </span>
                      <button type="button" style={styles.qtdBtn} onClick={() => alterarQtd(p.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {total > 0 && (
                <p style={{ textAlign: 'right', fontSize: 14, fontWeight: 800, color: '#ea580c', margin: '6px 0 0' }}>
                  Total: R$ {total.toFixed(2).replace('.', ',')}
                </p>
              )}

              <label style={{ ...styles.label, color: t.text2 }}>Data de retirada</label>
              <input
                type="date"
                min={hoje}
                value={data}
                onChange={e => setData(e.target.value)}
                style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
              />

              <label style={{ ...styles.label, color: t.text2 }}>Horário</label>
              <input
                type="time"
                value={hora}
                onChange={e => setHora(e.target.value)}
                style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
              />

              <label style={{ ...styles.label, color: t.text2 }}>Nome de quem vai retirar</label>
              <input
                placeholder="Nome completo"
                value={nomeRetirada}
                onChange={e => setNomeRetirada(e.target.value)}
                style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
              />

              <label style={{ ...styles.label, color: t.text2 }}>Observação (opcional)</label>
              <textarea
                placeholder="Ex: sem cebola, embrulhar separado..."
                value={obs}
                onChange={e => setObs(e.target.value)}
                rows={2}
                style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text, resize: 'none' }}
              />

              {erro && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0', fontWeight: 500 }}>{erro}</p>}
              <button type="submit" style={styles.btnSubmit}>
                💳 Pagar e Reservar {total > 0 ? `· R$ ${total.toFixed(2).replace('.', ',')}` : ''}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const LIGHT = {
  bg: '#fafaf9', card: '#fff', cardBorder: '#f0e8d8', border: '#e5e7eb',
  text: '#1c1917', text2: '#374151', muted: '#6b7280', abaInativo: '#fff',
  inputBg: '#fafafa', inputBorder: '#e5e7eb',
  chipBg: '#fff7ed', chipBorder: '#fed7aa', chipText: '#9a3412',
};

const DARK = {
  bg: '#111827', card: '#1f2937', cardBorder: '#374151', border: '#374151',
  text: '#f1f5f9', text2: '#d1d5db', muted: '#9ca3af', abaInativo: '#1f2937',
  inputBg: '#374151', inputBorder: '#4b5563',
  chipBg: '#2d2010', chipBorder: '#78350f', chipText: '#fed7aa',
};

const styles = {
  container: { paddingBottom: 90, minHeight: '100dvh' },
  header: { background: 'linear-gradient(135deg, #ea580c, #f97316)', padding: '20px 20px 18px' },
  headerTitle: { margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 },
  headerSub: { margin: '4px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  abaBtn: { flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  abaBtnAtivo: { background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#ea580c' },
  card: { borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
  chip: { borderRadius: 8, padding: '3px 8px', fontSize: 12, fontWeight: 600 },
  codigoBox: {
    background: '#fff7ed', border: '1.5px dashed #f97316', borderRadius: 10,
    padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
  },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, marginTop: 12 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  qtdBtn: {
    width: 28, height: 28, borderRadius: 8, border: '1.5px solid #fed7aa',
    background: '#fff7ed', color: '#ea580c', fontSize: 16, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  btnSubmit: {
    width: '100%', padding: '13px', marginTop: 16, borderRadius: 12,
    background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff',
    border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  btnNova: {
    marginTop: 16, padding: '10px 24px', borderRadius: 10,
    background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff',
    border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
};
