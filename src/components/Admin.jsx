import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIAS } from '../data/produtos';

const STATUS_ORDEM = ['aguardando', 'preparando', 'pronto', 'entregue'];
const STATUS_CONFIG = {
  aguardando: { label: 'Aguardando', color: '#d97706', bg: '#fef3c7', proximo: 'preparando', acaoLabel: 'Iniciar preparo' },
  preparando:  { label: 'Preparando',  color: '#2563eb', bg: '#dbeafe', proximo: 'pronto',     acaoLabel: 'Marcar como pronto' },
  pronto:      { label: 'Pronto',      color: '#16a34a', bg: '#dcfce7', proximo: 'entregue',   acaoLabel: 'Confirmar entrega' },
  entregue:    { label: 'Entregue',    color: '#6b7280', bg: '#f3f4f6', proximo: null,          acaoLabel: null },
};

const PAGAMENTO_CONFIG = {
  dinheiro: { label: '💵 Dinheiro', color: '#15803d', bg: '#dcfce7' },
  cartao:   { label: '💳 Cartão',   color: '#1d4ed8', bg: '#dbeafe' },
  pix:      { label: '📱 PIX',      color: '#7c3aed', bg: '#ede9fe' },
};

const STATUS_RESERVA = {
  pendente:   { label: 'Pendente',   color: '#d97706', bg: '#fef3c7' },
  confirmada: { label: 'Confirmada', color: '#16a34a', bg: '#dcfce7' },
  cancelada:  { label: 'Cancelada',  color: '#dc2626', bg: '#fee2e2' },
};

const COR_CATEGORIA = {
  Salgados: ['#FFF3E0', '#FFE0B2'],
  Bebidas:  ['#E3F2FD', '#BBDEFB'],
  Doces:    ['#FCE4EC', '#F8BBD9'],
};

const ABAS = [
  { id: 'pedidos',   label: '📋 Pedidos' },
  { id: 'estoque',   label: '📦 Estoque' },
  { id: 'cardapio',  label: '🍽️ Cardápio' },
  { id: 'reservas',  label: '📅 Reservas' },
  { id: 'relatorio', label: '📊 Relatório' },
];

export default function Admin({ pedidos, onAvancarStatus, produtos, onEditarEstoque, onToggleDisponivel, onSair, onAdicionarProduto, onRemoverProduto, reservas, onAtualizarReserva }) {
  const [aba, setAba] = useState('pedidos');
  const [estoqueEdit, setEstoqueEdit] = useState({});
  const [novoItem, setNovoItem] = useState({ nome: '', imagem: null, categoria: 'Salgados', preco: '', estoque: '', descricao: '' });
  const [erroItem, setErroItem] = useState('');
  const { darkMode } = useTheme();
  const t = darkMode ? DARK : LIGHT;

  const pedidosAtivos = pedidos.filter(p => p.status !== 'entregue');
  const pedidosEntregues = pedidos.filter(p => p.status === 'entregue');

  function handleEstoqueChange(id, val) {
    setEstoqueEdit(prev => ({ ...prev, [id]: val }));
  }

  function handleSalvarEstoque(produto) {
    const novoVal = parseInt(estoqueEdit[produto.id]);
    if (!isNaN(novoVal) && novoVal >= 0) {
      onEditarEstoque(produto.id, novoVal);
      setEstoqueEdit(prev => { const n = { ...prev }; delete n[produto.id]; return n; });
    }
  }

  function handleImagem(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 480;
      let w = img.width, h = img.height;
      if (w > h) { if (w > max) { h = Math.round(h * max / w); w = max; } }
      else { if (h > max) { w = Math.round(w * max / h); h = max; } }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      setNovoItem(p => ({ ...p, imagem: canvas.toDataURL('image/jpeg', 0.75) }));
    };
    img.src = url;
  }

  function handleAdicionarItem(e) {
    e.preventDefault();
    setErroItem('');
    if (!novoItem.nome.trim()) { setErroItem('Informe o nome.'); return; }
    if (!novoItem.imagem) { setErroItem('Adicione uma foto do produto.'); return; }
    const preco = parseFloat(novoItem.preco.replace(',', '.'));
    const estoque = parseInt(novoItem.estoque);
    if (isNaN(preco) || preco <= 0) { setErroItem('Preço inválido.'); return; }
    if (isNaN(estoque) || estoque < 0) { setErroItem('Estoque inválido.'); return; }

    onAdicionarProduto({
      nome: novoItem.nome.trim(),
      imagem: novoItem.imagem,
      categoria: novoItem.categoria,
      preco,
      estoque,
      descricao: novoItem.descricao.trim() || novoItem.nome.trim(),
      disponivel: true,
      cor: COR_CATEGORIA[novoItem.categoria] || ['#F3F4F6', '#E5E7EB'],
    });
    setNovoItem({ nome: '', imagem: null, categoria: 'Salgados', preco: '', estoque: '', descricao: '' });
  }

  const totalFaturado = pedidosEntregues.reduce((s, p) => s + p.total, 0);
  const contadores = STATUS_ORDEM.reduce((acc, s) => ({ ...acc, [s]: pedidos.filter(p => p.status === s).length }), {});
  const itemCounts = {};
  pedidos.forEach(p => p.itens.forEach(item => {
    itemCounts[item.nome] = (itemCounts[item.nome] || 0) + item.qtd;
  }));
  const topItens = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxQtd = topItens[0]?.[1] || 1;

  function formatarData(iso) {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>⚙️ Painel Admin</h2>
          <p style={styles.headerSub}>Cantina Universitária</p>
        </div>
        <button style={styles.sairBtn} onClick={onSair}>Sair</button>
      </div>

      <div style={styles.statsRow}>
        {[
          { label: 'Em Aberto', val: pedidosAtivos.length, color: '#ea580c' },
          { label: 'Aguardando', val: contadores.aguardando, color: '#d97706' },
          { label: 'Preparando', val: contadores.preparando, color: '#2563eb' },
          { label: 'Prontos', val: contadores.pronto, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
            <span style={{ ...styles.statVal, color: s.color }}>{s.val}</span>
            <span style={{ ...styles.statLabel, color: t.muted }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={styles.abasScroll}>
        {ABAS.map(({ id, label }) => (
          <button
            key={id}
            style={{ ...styles.abaBtn, background: t.abaInativo, border: `1.5px solid ${t.border}`, color: t.muted, ...(aba === id ? styles.abaBtnAtivo : {}) }}
            onClick={() => setAba(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {aba === 'pedidos' && (
        <div style={styles.section}>
          {pedidosAtivos.length === 0 && (
            <p style={{ ...styles.vazio, color: t.muted }}>Nenhum pedido em aberto.</p>
          )}
          {pedidosAtivos.map(pedido => {
            const cfg = STATUS_CONFIG[pedido.status];
            return (
              <div key={pedido.id} style={{ ...styles.pedidoCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
                <div style={styles.pedidoTop}>
                  <div>
                    <span style={{ ...styles.pedidoId, color: t.text }}>{pedido.id}</span>
                    <span style={{ ...styles.pedidoCliente, color: t.text2 }}> · {pedido.cliente}</span>
                    <span style={{ ...styles.pedidoHora, color: t.muted }}> · {pedido.horario}</span>
                  </div>
                  <span style={{ ...styles.statusBadge, color: cfg.color, background: cfg.bg }}>
                    {cfg.label}
                  </span>
                </div>
                <div style={styles.itensList}>
                  {pedido.itens.map((item, i) => (
                    <span key={i} style={{ ...styles.itemChip, background: t.chipBg, border: `1px solid ${t.chipBorder}`, color: t.chipText }}>
                      {item.qtd}× {item.nome}
                    </span>
                  ))}
                </div>
                <div style={styles.pedidoFooter}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={styles.totalVal}>R$ {pedido.total.toFixed(2).replace('.', ',')}</span>
                    {pedido.pagamento && PAGAMENTO_CONFIG[pedido.pagamento] && (
                      <span style={{ ...styles.statusBadge, color: PAGAMENTO_CONFIG[pedido.pagamento].color, background: PAGAMENTO_CONFIG[pedido.pagamento].bg }}>
                        {PAGAMENTO_CONFIG[pedido.pagamento].label}
                      </span>
                    )}
                  </div>
                  {cfg.proximo && (
                    <button style={styles.avancarBtn} onClick={() => onAvancarStatus(pedido.id, cfg.proximo)}>
                      {cfg.acaoLabel} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {pedidosEntregues.length > 0 && (
            <>
              <p style={{ ...styles.secTitle, color: t.muted }}>Concluídos</p>
              {pedidosEntregues.map(pedido => (
                <div key={pedido.id} style={{ ...styles.pedidoCard, background: t.card, border: `1.5px solid ${t.cardBorder}`, opacity: 0.55 }}>
                  <div style={styles.pedidoTop}>
                    <div>
                      <span style={{ ...styles.pedidoId, color: t.text }}>{pedido.id}</span>
                      <span style={{ ...styles.pedidoCliente, color: t.text2 }}> · {pedido.cliente}</span>
                    </div>
                    <span style={{ ...styles.statusBadge, color: '#6b7280', background: darkMode ? '#374151' : '#f3f4f6' }}>
                      Entregue
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {aba === 'estoque' && (
        <div style={styles.section}>
          {produtos.map(p => {
            const editando = estoqueEdit[p.id] !== undefined;
            const semEstoque = p.estoque === 0;
            const pouco = p.estoque > 0 && p.estoque <= 5;
            const disponivel = p.disponivel !== false;
            return (
              <div key={p.id} style={{ ...styles.estoqueCard, background: t.card, border: `1.5px solid ${t.cardBorder}`, opacity: disponivel ? 1 : 0.65 }}>
                {p.imagem
                  ? <img src={p.imagem} alt={p.nome} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  : <span style={styles.estoqueEmoji}>🍽️</span>
                }
                <div style={styles.estoqueInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ ...styles.estoqueNome, color: t.text }}>{p.nome}</p>
                    {!disponivel && <span style={styles.indispBadge}>Fora de venda</span>}
                  </div>
                  <p style={{ ...styles.estoqueQtd, color: semEstoque ? '#dc2626' : pouco ? '#d97706' : '#16a34a' }}>
                    {semEstoque ? 'Esgotado' : `${p.estoque} unidades`}
                  </p>
                </div>
                <div style={styles.estoqueControls}>
                  {editando ? (
                    <>
                      <input
                        style={{ ...styles.estoqueInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                        type="number"
                        min="0"
                        value={estoqueEdit[p.id]}
                        onChange={e => handleEstoqueChange(p.id, e.target.value)}
                      />
                      <button style={styles.salvarBtn} onClick={() => handleSalvarEstoque(p)}>✓</button>
                      <button style={styles.cancelBtn} onClick={() => setEstoqueEdit(prev => { const n = { ...prev }; delete n[p.id]; return n; })}>✕</button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      <button style={styles.editBtn} onClick={() => handleEstoqueChange(p.id, p.estoque)}>Editar</button>
                      <button
                        style={disponivel ? styles.tirarVendaBtn : styles.colocarVendaBtn}
                        onClick={() => onToggleDisponivel(p.id)}
                      >
                        {disponivel ? 'Tirar da venda' : 'Colocar à venda'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {aba === 'cardapio' && (
        <div style={styles.section}>
          <div style={{ ...styles.formCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
            <p style={{ ...styles.formTitulo, color: t.text }}>Adicionar novo item</p>
            <form onSubmit={handleAdicionarItem}>
              <label style={{ ...styles.formLabel, color: t.text2 }}>Foto do produto</label>
              {novoItem.imagem ? (
                <div style={{ position: 'relative', marginBottom: 4 }}>
                  <img src={novoItem.imagem} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 10 }} />
                  <button
                    type="button"
                    onClick={() => setNovoItem(p => ({ ...p, imagem: null }))}
                    style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: 6, color: '#fff', width: 26, height: 26, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                  >✕</button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', borderRadius: 10, border: `1.5px dashed ${t.inputBorder}`, background: t.inputBg, cursor: 'pointer', marginBottom: 4 }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagem} />
                  <span style={{ fontSize: 22 }}>📷</span>
                  <span style={{ fontSize: 13, color: t.muted, fontWeight: 600 }}>Selecionar foto</span>
                </label>
              )}

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={{ ...styles.formLabel, color: t.text2 }}>Nome</label>
                  <input
                    placeholder="Ex: Esfiha"
                    value={novoItem.nome}
                    onChange={e => setNovoItem(p => ({ ...p, nome: e.target.value }))}
                    style={{ ...styles.formInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={{ ...styles.formLabel, color: t.text2 }}>Categoria</label>
                  <select
                    value={novoItem.categoria}
                    onChange={e => setNovoItem(p => ({ ...p, categoria: e.target.value }))}
                    style={{ ...styles.formInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                  >
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ width: 90 }}>
                  <label style={{ ...styles.formLabel, color: t.text2 }}>Preço (R$)</label>
                  <input
                    placeholder="0,00"
                    value={novoItem.preco}
                    onChange={e => setNovoItem(p => ({ ...p, preco: e.target.value }))}
                    style={{ ...styles.formInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                  />
                </div>
                <div style={{ width: 72 }}>
                  <label style={{ ...styles.formLabel, color: t.text2 }}>Estoque</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={novoItem.estoque}
                    onChange={e => setNovoItem(p => ({ ...p, estoque: e.target.value }))}
                    style={{ ...styles.formInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                  />
                </div>
              </div>

              <label style={{ ...styles.formLabel, color: t.text2 }}>Descrição (opcional)</label>
              <input
                placeholder="Breve descrição do item"
                value={novoItem.descricao}
                onChange={e => setNovoItem(p => ({ ...p, descricao: e.target.value }))}
                style={{ ...styles.formInput, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
              />

              {erroItem && <p style={{ color: '#dc2626', fontSize: 13, margin: '6px 0 0', fontWeight: 500 }}>{erroItem}</p>}
              <button type="submit" style={styles.addItemBtn}>+ Adicionar ao cardápio</button>
            </form>
          </div>

          <p style={{ ...styles.secTitle, color: t.muted }}>Itens no cardápio ({produtos.length})</p>
          {produtos.map(p => (
            <div key={p.id} style={{ ...styles.estoqueCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
              {p.imagem
                ? <img src={p.imagem} alt={p.nome} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                : <span style={styles.estoqueEmoji}>{p.emoji}</span>
              }
              <div style={styles.estoqueInfo}>
                <p style={{ ...styles.estoqueNome, color: t.text }}>{p.nome}</p>
                <p style={{ ...styles.estoqueQtd, color: t.muted }}>{p.categoria} · R$ {p.preco.toFixed(2).replace('.', ',')}</p>
              </div>
              <button style={styles.removerBtn} onClick={() => onRemoverProduto(p.id)}>Remover</button>
            </div>
          ))}
        </div>
      )}

      {aba === 'reservas' && (
        <div style={styles.section}>
          {reservas.length === 0 && (
            <p style={{ ...styles.vazio, color: t.muted }}>Nenhuma reserva registrada.</p>
          )}

          {reservas.filter(r => r.status === 'pendente').length > 0 && (
            <>
              <p style={{ ...styles.secTitle, color: t.muted }}>Aguardando confirmação</p>
              {reservas.filter(r => r.status === 'pendente').map(r => (
                <div key={r.id} style={{ ...styles.pedidoCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
                  <div style={styles.pedidoTop}>
                    <div>
                      <span style={{ ...styles.pedidoId, color: t.text }}>{r.cliente}</span>
                      <span style={{ ...styles.pedidoHora, color: t.muted }}> · {formatarData(r.data)} às {r.hora}</span>
                    </div>
                    <span style={{ ...styles.statusBadge, color: '#d97706', background: '#fef3c7' }}>Pendente</span>
                  </div>
                  <p style={{ margin: '0 0 8px', color: t.muted, fontSize: 13 }}>
                    👤 {r.nomeRetirada}{r.obs ? ` · "${r.obs}"` : ''}
                  </p>
                  {r.itens?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {r.itens.map((item, i) => (
                        <span key={i} style={{ ...styles.itemChip, background: t.chipBg, border: `1px solid ${t.chipBorder}`, color: t.chipText }}>
                          {item.qtd}× {item.nome}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#ea580c' }}>
                      R$ {r.total?.toFixed(2).replace('.', ',')}
                    </span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff7ed', border: '1.5px dashed #f97316', borderRadius: 8, padding: '4px 10px' }}>
                      <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>Código:</span>
                      <span style={{ fontSize: 15, fontWeight: 900, color: '#ea580c', letterSpacing: 2 }}>{r.codigo}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.confirmarReservaBtn} onClick={() => onAtualizarReserva(r.id, 'confirmada')}>✓ Confirmar → criar pedido</button>
                    <button style={styles.cancelarReservaBtn} onClick={() => onAtualizarReserva(r.id, 'cancelada')}>✕ Cancelar</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {reservas.filter(r => r.status !== 'pendente').length > 0 && (
            <>
              <p style={{ ...styles.secTitle, color: t.muted }}>Processadas</p>
              {reservas.filter(r => r.status !== 'pendente').map(r => {
                const cfg = STATUS_RESERVA[r.status];
                return (
                  <div key={r.id} style={{ ...styles.pedidoCard, background: t.card, border: `1.5px solid ${t.cardBorder}`, opacity: 0.55 }}>
                    <div style={styles.pedidoTop}>
                      <div>
                        <span style={{ ...styles.pedidoId, color: t.text }}>{r.cliente}</span>
                        <span style={{ ...styles.pedidoHora, color: t.muted }}> · {formatarData(r.data)} às {r.hora}</span>
                      </div>
                      <span style={{ ...styles.statusBadge, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                    </div>
                    <p style={{ margin: 0, color: t.muted, fontSize: 13 }}>
                      👤 {r.nomeRetirada} · R$ {r.total?.toFixed(2).replace('.', ',')}
                      {r.status === 'confirmada' ? ' · pedido criado na fila' : ''}
                    </p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {aba === 'relatorio' && (
        <div style={styles.section}>
          <div style={{ ...styles.relCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
            <p style={{ ...styles.relTitulo, color: t.text }}>Resumo geral</p>
            <div style={styles.relStatsRow}>
              <div style={styles.relStatItem}>
                <span style={{ ...styles.relStatVal, color: '#ea580c' }}>{pedidos.length}</span>
                <span style={{ ...styles.relStatLabel, color: t.muted }}>Total pedidos</span>
              </div>
              <div style={styles.relStatItem}>
                <span style={{ ...styles.relStatVal, color: '#16a34a', fontSize: 16 }}>R$ {totalFaturado.toFixed(2).replace('.', ',')}</span>
                <span style={{ ...styles.relStatLabel, color: t.muted }}>Faturado</span>
              </div>
              <div style={styles.relStatItem}>
                <span style={{ ...styles.relStatVal, color: '#2563eb' }}>{pedidosEntregues.length}</span>
                <span style={{ ...styles.relStatLabel, color: t.muted }}>Entregues</span>
              </div>
            </div>
          </div>

          <div style={{ ...styles.relCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
            <p style={{ ...styles.relTitulo, color: t.text }}>Status dos pedidos</p>
            {STATUS_ORDEM.map(s => {
              const cfg = STATUS_CONFIG[s];
              const qty = contadores[s];
              const pct = pedidos.length > 0 ? (qty / pedidos.length) * 100 : 0;
              return (
                <div key={s} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: t.text2 }}>{cfg.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{qty}</span>
                  </div>
                  <div style={{ background: t.cardBorder, borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${pct}%`, height: 6, borderRadius: 4, background: cfg.color, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {topItens.length > 0 && (
            <div style={{ ...styles.relCard, background: t.card, border: `1.5px solid ${t.cardBorder}` }}>
              <p style={{ ...styles.relTitulo, color: t.text }}>Top itens pedidos</p>
              {topItens.map(([nome, qtd], i) => (
                <div key={nome} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#ea580c', width: 18 }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, color: t.text2 }}>{nome}</span>
                  <div style={{ width: 80, background: t.cardBorder, borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${(qtd / maxQtd) * 100}%`, height: 6, borderRadius: 4, background: '#ea580c' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.text, width: 24, textAlign: 'right' }}>{qtd}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const LIGHT = {
  bg: '#fafaf9',
  card: '#fff',
  cardBorder: '#f0e8d8',
  border: '#e5e7eb',
  text: '#1c1917',
  text2: '#374151',
  muted: '#9ca3af',
  abaInativo: '#fff',
  chipBg: '#fff7ed',
  chipBorder: '#fed7aa',
  chipText: '#9a3412',
  inputBg: '#fff',
  inputBorder: '#fed7aa',
};

const DARK = {
  bg: '#111827',
  card: '#1f2937',
  cardBorder: '#374151',
  border: '#374151',
  text: '#f1f5f9',
  text2: '#d1d5db',
  muted: '#9ca3af',
  abaInativo: '#1f2937',
  chipBg: '#2d2010',
  chipBorder: '#78350f',
  chipText: '#fed7aa',
  inputBg: '#374151',
  inputBorder: '#4b5563',
};

const styles = {
  container: { paddingBottom: 90, minHeight: '100dvh' },
  header: {
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    padding: '20px 20px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 },
  headerSub: { margin: '4px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  sairBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '1.5px solid rgba(255,255,255,0.5)',
    color: '#fff',
    borderRadius: 10,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    padding: '14px 16px 0',
  },
  statCard: {
    borderRadius: 12,
    padding: '10px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  statVal: { fontSize: 22, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 10, fontWeight: 500, textAlign: 'center' },
  abasScroll: {
    display: 'flex',
    gap: 8,
    padding: '14px 16px 0',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  abaBtn: {
    flexShrink: 0,
    padding: '8px 12px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  abaBtnAtivo: { background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#ea580c' },
  section: { padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 },
  vazio: { textAlign: 'center', padding: 24 },
  secTitle: { fontSize: 13, fontWeight: 700, margin: '8px 0 0' },
  pedidoCard: { borderRadius: 14, padding: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
  pedidoTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pedidoId: { fontWeight: 800, fontSize: 14 },
  pedidoCliente: { fontSize: 13 },
  pedidoHora: { fontSize: 12 },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 },
  itensList: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  itemChip: { borderRadius: 8, padding: '3px 8px', fontSize: 12, fontWeight: 600 },
  pedidoFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalVal: { fontSize: 16, fontWeight: 800, color: '#ea580c' },
  avancarBtn: {
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  estoqueCard: { borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 },
  estoqueEmoji: { fontSize: 24, width: 36, textAlign: 'center' },
  estoqueInfo: { flex: 1 },
  estoqueNome: { margin: '0 0 2px', fontSize: 14, fontWeight: 600 },
  estoqueQtd: { margin: 0, fontSize: 12, fontWeight: 600 },
  estoqueControls: { display: 'flex', gap: 6, alignItems: 'center' },
  estoqueInput: { width: 56, padding: '6px 8px', borderRadius: 8, fontSize: 14, textAlign: 'center', outline: 'none' },
  editBtn: {
    padding: '6px 12px', borderRadius: 8, background: '#fff7ed',
    border: '1.5px solid #fed7aa', color: '#ea580c', fontSize: 12, fontWeight: 700, cursor: 'pointer',
  },
  salvarBtn: {
    width: 30, height: 30, borderRadius: 8, background: '#dcfce7',
    border: '1.5px solid #bbf7d0', color: '#16a34a', fontSize: 16, fontWeight: 700, cursor: 'pointer',
  },
  cancelBtn: {
    width: 30, height: 30, borderRadius: 8, background: '#fff1f2',
    border: '1.5px solid #fecdd3', color: '#dc2626', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  indispBadge: {
    fontSize: 10, fontWeight: 700, color: '#dc2626',
    background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 6, padding: '2px 6px',
  },
  tirarVendaBtn: {
    padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
    background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#dc2626', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  colocarVendaBtn: {
    padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
    background: '#dcfce7', border: '1.5px solid #bbf7d0', color: '#16a34a', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  formCard: { borderRadius: 14, padding: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
  formTitulo: { margin: '0 0 12px', fontSize: 15, fontWeight: 700 },
  formRow: { display: 'flex', gap: 8 },
  formLabel: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, marginTop: 10 },
  formInput: {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  addItemBtn: {
    width: '100%', marginTop: 12, padding: '11px', borderRadius: 10,
    background: 'linear-gradient(135deg, #F97316, #EA580C)',
    color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  removerBtn: {
    padding: '6px 10px', borderRadius: 8, background: '#fff1f2',
    border: '1.5px solid #fecdd3', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
  },
  confirmarReservaBtn: {
    flex: 1, padding: '8px', borderRadius: 8, background: '#dcfce7',
    border: '1.5px solid #bbf7d0', color: '#16a34a', fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  cancelarReservaBtn: {
    flex: 1, padding: '8px', borderRadius: 8, background: '#fff1f2',
    border: '1.5px solid #fecdd3', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
  relCard: { borderRadius: 14, padding: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
  relTitulo: { margin: '0 0 14px', fontSize: 15, fontWeight: 700 },
  relStatsRow: { display: 'flex', justifyContent: 'space-around' },
  relStatItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  relStatVal: { fontSize: 22, fontWeight: 800 },
  relStatLabel: { fontSize: 11, fontWeight: 500, textAlign: 'center' },
};
