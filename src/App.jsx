import { useState, useEffect } from 'react';
import { PRODUTOS_INICIAIS, PEDIDOS_INICIAIS, DATA_VERSION } from './data/produtos';
import Cardapio from './components/Cardapio';
import Carrinho from './components/Carrinho';
import MeusPedidos from './components/MeusPedidos';
import Admin from './components/Admin';
import NavBar from './components/NavBar';
import Splash from './components/Splash';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import EsqueceuSenha from './components/EsqueceuSenha';
import AlterarSenha from './components/AlterarSenha';
import Reservas from './components/Reservas';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

let proximoId = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem('fz_pedidos') || '[]');
    const nums = saved.map(p => parseInt((p.id || '').replace('PED-', ''))).filter(n => !isNaN(n));
    return nums.length > 0 ? Math.max(100, ...nums) : 100;
  } catch { return 100; }
})();

let proximoProdutoId = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem('fz_produtos') || '[]');
    const nums = saved.map(p => typeof p.id === 'number' ? p.id : 0);
    return nums.length > 0 ? Math.max(48, ...nums) : 48;
  } catch { return 48; }
})();

export default function App() {
  const { darkMode, toggleDark } = useTheme();
  const { addToast } = useToast();

  const [usuario, setUsuario] = useLocalStorage('fz_usuario', null);
  const [pedidos, setPedidos] = useLocalStorage('fz_pedidos', PEDIDOS_INICIAIS);
  const [produtos, setProdutos] = useLocalStorage('fz_produtos', PRODUTOS_INICIAIS);

  useEffect(() => {
    const storedVersion = localStorage.getItem('fz_data_version');
    if (storedVersion !== DATA_VERSION) {
      setProdutos(PRODUTOS_INICIAIS);
      localStorage.setItem('fz_data_version', DATA_VERSION);
    } else if (produtos.some(p => !p.imagem)) {
      setProdutos(prev =>
        prev.map(p => {
          const base = PRODUTOS_INICIAIS.find(b => b.id === p.id);
          return base ? { ...p, imagem: p.imagem || base.imagem, cor: p.cor || base.cor } : p;
        })
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [carrinho, setCarrinho] = useLocalStorage('fz_carrinho', []);
  const [reservas, setReservas] = useLocalStorage('fz_reservas', []);

  const [fase, setFase] = useState('splash');
  const [tela, setTela] = useState('cardapio');

  const telaSegura = tela === 'admin' && usuario?.role !== 'admin' ? 'cardapio' : tela;
  const qtdCarrinho = carrinho.reduce((s, i) => s + i.qtd, 0);
  const qtdPedidosAtivos = usuario
    ? pedidos.filter(p => p.cliente === usuario.nome && p.status !== 'entregue').length
    : 0;

  function handleLogout() {
    setUsuario(null);
    setCarrinho([]);
    setFase('login');
    setTela('cardapio');
  }

  function adicionarAoCarrinho(produto) {
    setCarrinho(prev => {
      const existe = prev.find(i => i.produtoId === produto.id);
      if (existe) {
        return prev.map(i =>
          i.produtoId === produto.id ? { ...i, qtd: i.qtd + 1 } : i
        );
      }
      return [...prev, {
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        qtd: 1,
      }];
    });
    addToast(`${produto.nome} adicionado ao carrinho!`);
  }

  function removerDoCarrinho(produtoId) {
    setCarrinho(prev => prev.filter(i => i.produtoId !== produtoId));
  }

  function alterarQtd(produtoId, delta) {
    setCarrinho(prev =>
      prev
        .map(i => i.produtoId === produtoId ? { ...i, qtd: i.qtd + delta } : i)
        .filter(i => i.qtd > 0)
    );
  }

  function finalizarPedido(nomeCliente, pagamento) {
    const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    const agora = new Date();
    const horario = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
    const novoPedido = {
      id: `PED-${String(++proximoId).padStart(3, '0')}`,
      itens: carrinho.map(i => ({ produtoId: i.produtoId, nome: i.nome, preco: i.preco, qtd: i.qtd })),
      total,
      status: 'aguardando',
      horario,
      cliente: nomeCliente,
      pagamento,
    };
    setPedidos(prev => [novoPedido, ...prev]);
    setProdutos(prev =>
      prev.map(p => {
        const noCarrinho = carrinho.find(i => i.produtoId === p.id);
        return noCarrinho ? { ...p, estoque: Math.max(0, p.estoque - noCarrinho.qtd) } : p;
      })
    );
    setCarrinho([]);
  }

  function avancarStatus(pedidoId, novoStatus) {
    setPedidos(prev =>
      prev.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p)
    );
    const labels = { preparando: 'Em preparo', pronto: 'Pronto!', entregue: 'Entregue' };
    addToast(`${pedidoId} → ${labels[novoStatus]}`, 'info');
  }

  function editarEstoque(produtoId, novoEstoque) {
    setProdutos(prev =>
      prev.map(p => p.id === produtoId ? { ...p, estoque: novoEstoque } : p)
    );
    addToast('Estoque atualizado!');
  }

  function adicionarProduto(produto) {
    setProdutos(prev => [...prev, { ...produto, id: ++proximoProdutoId }]);
    addToast(`${produto.nome} adicionado ao cardápio!`, 'success');
  }

  function removerProduto(id) {
    setProdutos(prev => prev.filter(p => p.id !== id));
    addToast('Item removido do cardápio.', 'info');
  }

  function adicionarReserva(reserva) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const codigo = 'RES-' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setReservas(prev => {
      const novoId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
      return [...prev, { ...reserva, id: novoId, status: 'pendente', codigo }];
    });
    addToast('Reserva realizada! Guarde seu código de retirada.', 'success');
  }

  function atualizarReserva(id, status) {
    const reserva = reservas.find(r => r.id === id);
    setReservas(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    if (status === 'confirmada' && reserva?.itens) {
      const agora = new Date();
      const horario = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
      const novoPedido = {
        id: `PED-${String(++proximoId).padStart(3, '0')}`,
        itens: reserva.itens,
        total: reserva.total,
        status: 'aguardando',
        horario,
        cliente: reserva.nomeRetirada,
      };
      setPedidos(prev => [novoPedido, ...prev]);
      setProdutos(prev =>
        prev.map(p => {
          const item = reserva.itens.find(i => i.produtoId === p.id);
          return item ? { ...p, estoque: Math.max(0, p.estoque - item.qtd) } : p;
        })
      );
      addToast('Reserva confirmada! Pedido criado na fila.', 'success');
    } else {
      addToast('Reserva cancelada.', 'info');
    }
  }

  function toggleDisponivel(produtoId) {
    setProdutos(prev =>
      prev.map(p => {
        if (p.id !== produtoId) return p;
        const next = !( p.disponivel !== false);
        addToast(next ? `${p.nome} colocado à venda` : `${p.nome} retirado da venda`, next ? 'success' : 'info');
        return { ...p, disponivel: next };
      })
    );
  }

  return (
    <div style={{ ...styles.app, background: darkMode ? '#0d0f14' : '#F3F4F6' }}>
      <div style={{ ...styles.screen, background: darkMode ? '#111827' : '#fff' }}>
        {fase === 'splash' && <Splash onEnd={() => setFase('login')} />}
        {fase === 'login' && (
          <Login
            onLogin={usr => { setUsuario(usr); setFase('app'); }}
            onIrCadastro={() => setFase('cadastro')}
            onEsqueceuSenha={() => setFase('esqueceu')}
          />
        )}
        {fase === 'cadastro' && (
          <Cadastro
            onCadastro={usr => { setUsuario(usr); setFase('app'); }}
            onIrLogin={() => setFase('login')}
          />
        )}
        {fase === 'esqueceu' && <EsqueceuSenha onVoltar={() => setFase('login')} />}
        {fase === 'app' && tela === 'alterar-senha' && (
          <AlterarSenha usuario={usuario} onVoltar={() => setTela('cardapio')} />
        )}
        {fase === 'app' && tela !== 'alterar-senha' && (
          <>
            {telaSegura === 'cardapio' && (
              <Cardapio
                produtos={produtos}
                onAdicionar={adicionarAoCarrinho}
                nomeUsuario={usuario?.nome || ''}
                onSair={handleLogout}
                onAlterarSenha={() => setTela('alterar-senha')}
              />
            )}
            {telaSegura === 'carrinho' && (
              <Carrinho
                itens={carrinho}
                onRemover={removerDoCarrinho}
                onAltQtd={alterarQtd}
                onFinalizar={finalizarPedido}
                nomeUsuario={usuario?.nome || ''}
                setTela={setTela}
              />
            )}
            {telaSegura === 'pedidos' && (
              <MeusPedidos pedidos={pedidos} nomeUsuario={usuario?.nome || ''} />
            )}
            {telaSegura === 'reservas' && (
              <Reservas
                reservas={reservas}
                nomeUsuario={usuario?.nome || ''}
                onAdicionar={adicionarReserva}
                produtos={produtos}
              />
            )}
            {telaSegura === 'admin' && (
              <Admin
                pedidos={pedidos}
                onAvancarStatus={avancarStatus}
                produtos={produtos}
                onEditarEstoque={editarEstoque}
                onToggleDisponivel={toggleDisponivel}
                onSair={handleLogout}
                onAdicionarProduto={adicionarProduto}
                onRemoverProduto={removerProduto}
                reservas={reservas}
                onAtualizarReserva={atualizarReserva}
              />
            )}
            <NavBar
              tela={telaSegura}
              setTela={setTela}
              qtdCarrinho={qtdCarrinho}
              qtdPedidosAtivos={qtdPedidosAtivos}
              usuario={usuario}
            />
          </>
        )}
      </div>

      <button
        onClick={toggleDark}
        title={darkMode ? 'Modo claro' : 'Modo escuro'}
        style={{
          position: 'fixed',
          bottom: 90,
          right: 'max(12px, calc(50vw - 228px))',
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)',
          border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)',
          fontSize: 17,
          cursor: 'pointer',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.4)' : '0 2px 10px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(6px)',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  screen: {
    width: '100%',
    maxWidth: 480,
    minHeight: '100dvh',
    position: 'relative',
    boxShadow: '0 0 40px rgba(0,0,0,0.12)',
  },
};
