export const CATEGORIAS = ['Salgados', 'Bebidas', 'Doces'];

export const DATA_VERSION = '5';

export const PRODUTOS_INICIAIS = [
  // ── BEBIDAS ──────────────────────────────────────────────────────────
  { id: 1,  nome: 'Latas',              categoria: 'Bebidas', preco: 6.00,  estoque: 40, imagem: '/produtos/coca-cola.jpg',      cor: ['#FCE4EC','#F8BBD9'], descricao: 'Lata de refrigerante gelada',         disponivel: true },
  { id: 2,  nome: 'Garrafa 200ml',      categoria: 'Bebidas', preco: 3.50,  estoque: 50, imagem: '/produtos/agua.jpg',           cor: ['#E1F5FE','#B3E5FC'], descricao: 'Garrafinha 200ml gelada',              disponivel: true },
  { id: 3,  nome: 'Água s/ Gás',        categoria: 'Bebidas', preco: 3.00,  estoque: 60, imagem: '/produtos/agua.jpg',           cor: ['#E1F5FE','#B3E5FC'], descricao: 'Água mineral sem gás 500ml',          disponivel: true },
  { id: 4,  nome: 'Água c/ Gás',        categoria: 'Bebidas', preco: 3.50,  estoque: 40, imagem: '/produtos/agua.jpg',           cor: ['#E8EAF6','#C5CAE9'], descricao: 'Água mineral com gás 500ml',          disponivel: true },
  { id: 5,  nome: 'Energético',         categoria: 'Bebidas', preco: 12.00, estoque: 20, imagem: '/produtos/energetico.jpg',     cor: ['#E8F5E9','#C8E6C9'], descricao: 'Bebida energética gelada',            disponivel: true },
  { id: 6,  nome: 'Chá Matte',          categoria: 'Bebidas', preco: 5.00,  estoque: 30, imagem: '/produtos/cha-matte.jpg',      cor: ['#F9FBE7','#F0F4C3'], descricao: 'Chá matte gelado',                    disponivel: true },
  { id: 7,  nome: 'Todynho',            categoria: 'Bebidas', preco: 3.00,  estoque: 35, imagem: '/produtos/todynho.jpg',        cor: ['#EFEBE9','#D7CCC8'], descricao: 'Achocolatado Todynho 200ml',           disponivel: true },
  { id: 8,  nome: 'Suco',               categoria: 'Bebidas', preco: 8.00,  estoque: 25, imagem: '/produtos/suco-de-laranja.jpg',cor: ['#FFF8E1','#FFECB3'], descricao: 'Suco natural gelado',                 disponivel: true },
  { id: 9,  nome: 'Água Cristal',       categoria: 'Bebidas', preco: 5.00,  estoque: 45, imagem: '/produtos/agua.jpg',           cor: ['#E1F5FE','#B3E5FC'], descricao: 'Água Cristal 510ml',                  disponivel: true },
  { id: 10, nome: 'Power',              categoria: 'Bebidas', preco: 7.00,  estoque: 20, imagem: '/produtos/power.jpg',          cor: ['#E8F5E9','#A5D6A7'], descricao: 'Isotônico Power gelado',               disponivel: true },
  { id: 11, nome: 'Gatorade',           categoria: 'Bebidas', preco: 8.00,  estoque: 20, imagem: '/produtos/gatorade.jpg',       cor: ['#E8F5E9','#C8E6C9'], descricao: 'Gatorade isotônico gelado',            disponivel: true },
  { id: 12, nome: 'Coca 600ml',         categoria: 'Bebidas', preco: 9.00,  estoque: 30, imagem: '/produtos/coca-600ml.jpg',     cor: ['#FCE4EC','#F8BBD9'], descricao: 'Coca-Cola garrafa 600ml',             disponivel: true },
  { id: 13, nome: 'Coca 1L',            categoria: 'Bebidas', preco: 10.00, estoque: 20, imagem: '/produtos/coca-1l.jpg',        cor: ['#FCE4EC','#F8BBD9'], descricao: 'Coca-Cola garrafa 1 litro',           disponivel: true },
  { id: 14, nome: 'Coca 2L',            categoria: 'Bebidas', preco: 16.00, estoque: 15, imagem: '/produtos/coca-2l.jpg',        cor: ['#FCE4EC','#F8BBD9'], descricao: 'Coca-Cola garrafa 2 litros',          disponivel: true },
  { id: 15, nome: 'Gold 2L',            categoria: 'Bebidas', preco: 12.00, estoque: 15, imagem: '/produtos/agua.jpg',           cor: ['#E1F5FE','#B3E5FC'], descricao: 'Água Gold garrafa 2 litros',          disponivel: true },
  { id: 16, nome: 'H2O Limão',          categoria: 'Bebidas', preco: 8.00,  estoque: 20, imagem: '/produtos/agua.jpg',           cor: ['#F9FBE7','#F0F4C3'], descricao: 'H2O sabor limão gelada',              disponivel: true },
  { id: 17, nome: 'Água de Coco',       categoria: 'Bebidas', preco: 5.00,  estoque: 25, imagem: '/produtos/agua-de-coco.jpg',   cor: ['#F1F8E9','#DCEDC8'], descricao: 'Água de coco gelada',                 disponivel: true },

  // ── SALGADOS ─────────────────────────────────────────────────────────
  { id: 18, nome: 'Salgado Assado',        categoria: 'Salgados', preco: 11.00, estoque: 30, imagem: '/produtos/salgado-frito.jpg',  cor: ['#FFF3E0','#FFE0B2'], descricao: 'Salgado assado artesanal',             disponivel: true },
  { id: 19, nome: 'Salgado Frito',         categoria: 'Salgados', preco: 10.00, estoque: 30, imagem: '/produtos/salgado-frito.jpg',  cor: ['#FFF8E1','#FFECB3'], descricao: 'Salgado frito crocante',              disponivel: true },
  { id: 20, nome: 'Cachorro Quente',       categoria: 'Salgados', preco: 10.00, estoque: 25, imagem: '/produtos/cachorro-quente.jpg',cor: ['#FCE4EC','#F8BBD9'], descricao: 'Hot dog completo com molhos',         disponivel: true },
  { id: 21, nome: 'Esfiha',                categoria: 'Salgados', preco: 9.00,  estoque: 28, imagem: '/produtos/esfiha.jpg',         cor: ['#E8F5E9','#C8E6C9'], descricao: 'Esfiha de carne com temperos',        disponivel: true },
  { id: 22, nome: 'Prensado',              categoria: 'Salgados', preco: 11.00, estoque: 20, imagem: '/produtos/prensado.jpg',       cor: ['#F3E5F5','#E1BEE7'], descricao: 'Misto quente prensado',               disponivel: true },
  { id: 23, nome: 'Prensado c/ Frango',    categoria: 'Salgados', preco: 14.00, estoque: 20, imagem: '/produtos/prensado.jpg',       cor: ['#F3E5F5','#E1BEE7'], descricao: 'Prensado de frango desfiado',         disponivel: true },
  { id: 24, nome: 'Prensado c/ Bacon',     categoria: 'Salgados', preco: 14.00, estoque: 20, imagem: '/produtos/prensado.jpg',       cor: ['#FCE4EC','#F8BBD9'], descricao: 'Prensado com bacon crocante',         disponivel: true },
  { id: 25, nome: 'Prensado c/ Calabresa', categoria: 'Salgados', preco: 14.00, estoque: 20, imagem: '/produtos/prensado.jpg',       cor: ['#FCE4EC','#F8BBD9'], descricao: 'Prensado com calabresa acebolada',    disponivel: true },
  { id: 26, nome: 'Prensado Completo',     categoria: 'Salgados', preco: 22.00, estoque: 15, imagem: '/produtos/prensado.jpg',       cor: ['#FFF3E0','#FFE0B2'], descricao: 'Frango, bacon e calabresa',           disponivel: true },
  { id: 27, nome: 'Prensado Frango Cremoso', categoria: 'Salgados', preco: 20.00, estoque: 15, imagem: '/produtos/prensado.jpg',    cor: ['#F3E5F5','#E1BEE7'], descricao: 'Prensado de frango com catupiry',     disponivel: true },
  { id: 28, nome: 'Pastel',                categoria: 'Salgados', preco: 11.00, estoque: 20, imagem: '/produtos/pastel-de-carne.jpg',cor: ['#FFF3E0','#FFE0B2'], descricao: 'Pastel frito com recheio',            disponivel: true },
  { id: 29, nome: 'Coxinha Especial',      categoria: 'Salgados', preco: 11.00, estoque: 20, imagem: '/produtos/coxinha.jpg',        cor: ['#FFF8E1','#FFECB3'], descricao: 'Coxinha especial da cantina',         disponivel: true },
  { id: 30, nome: 'Pão de Queijo',         categoria: 'Salgados', preco: 5.00,  estoque: 50, imagem: '/produtos/pao-de-queijo.jpg', cor: ['#FFF3E0','#FFE0B2'], descricao: 'Pão de queijo mineiro artesanal',     disponivel: true },
  { id: 31, nome: 'Lanche Natural',        categoria: 'Salgados', preco: 10.00, estoque: 20, imagem: '/produtos/lanche-natural.jpg', cor: ['#E8F5E9','#C8E6C9'], descricao: 'Lanche natural com salada',           disponivel: true },

  // ── DOCES E SALGADINHOS ───────────────────────────────────────────────
  { id: 32, nome: 'Batata Chips',       categoria: 'Doces', preco: 6.00,  estoque: 40, imagem: '/produtos/batata-chips.jpg',    cor: ['#FFF8E1','#FFECB3'], descricao: 'Batata chips crocante',               disponivel: true },
  { id: 33, nome: 'Flay',               categoria: 'Doces', preco: 4.50,  estoque: 30, imagem: '/produtos/bombom.jpg',          cor: ['#FCE4EC','#F8BBD9'], descricao: 'Chocolate Flay',                      disponivel: true },
  { id: 34, nome: 'Bolacha',            categoria: 'Doces', preco: 4.00,  estoque: 35, imagem: '/produtos/cookies.jpg',         cor: ['#EFEBE9','#D7CCC8'], descricao: 'Bolacha recheada',                    disponivel: true },
  { id: 35, nome: 'Look',               categoria: 'Doces', preco: 5.00,  estoque: 30, imagem: '/produtos/bombom.jpg',          cor: ['#FCE4EC','#F8BBD9'], descricao: 'Chocolate Look',                      disponivel: true },
  { id: 36, nome: 'Barrinha de Cereal', categoria: 'Doces', preco: 4.00,  estoque: 40, imagem: '/produtos/barrinha-cereal.jpg', cor: ['#FFF8E1','#FFECB3'], descricao: 'Barrinha de cereal integral',          disponivel: true },
  { id: 37, nome: 'Barra de Chocolate', categoria: 'Doces', preco: 10.00, estoque: 20, imagem: '/produtos/barra-chocolate.jpg', cor: ['#EFEBE9','#D7CCC8'], descricao: 'Barra de chocolate ao leite',          disponivel: true },
  { id: 38, nome: 'Trento',             categoria: 'Doces', preco: 5.00,  estoque: 30, imagem: '/produtos/trento.jpg',          cor: ['#EFEBE9','#D7CCC8'], descricao: 'Wafer Trento sabor chocolate',         disponivel: true },
  { id: 39, nome: 'Trident',            categoria: 'Doces', preco: 3.50,  estoque: 40, imagem: '/produtos/trident.jpg',         cor: ['#E8F5E9','#C8E6C9'], descricao: 'Chiclete Trident menta',              disponivel: true },
  { id: 40, nome: 'Halls',              categoria: 'Doces', preco: 3.00,  estoque: 50, imagem: '/produtos/halls.jpg',           cor: ['#263238','#37474F'], descricao: 'Bala Halls extra forte',              disponivel: true },
  { id: 41, nome: 'Brownie',            categoria: 'Doces', preco: 10.00, estoque: 15, imagem: '/produtos/brownie.jpg',         cor: ['#EFEBE9','#D7CCC8'], descricao: 'Brownie de chocolate',                disponivel: true },
  { id: 42, nome: 'Pão de Mel',         categoria: 'Doces', preco: 10.00, estoque: 15, imagem: '/produtos/pao-de-mel.jpg',      cor: ['#FFF8E1','#FFECB3'], descricao: 'Pão de mel recheado com doce de leite', disponivel: true },
  { id: 43, nome: 'Bombom',             categoria: 'Doces', preco: 4.50,  estoque: 30, imagem: '/produtos/bombom.jpg',          cor: ['#EFEBE9','#D7CCC8'], descricao: 'Bombom de chocolate recheado',        disponivel: true },
  { id: 44, nome: 'Ouro Branco',        categoria: 'Doces', preco: 2.00,  estoque: 60, imagem: '/produtos/ouro-branco.jpg',     cor: ['#FFFDE7','#FFF9C4'], descricao: 'Bombom Ouro Branco Lacta',            disponivel: true },
  { id: 45, nome: 'Amendoim',           categoria: 'Doces', preco: 6.00,  estoque: 30, imagem: '/produtos/amendoim.jpg',        cor: ['#FFF8E1','#FFECB3'], descricao: 'Amendoim torrado e salgado',          disponivel: true },
  { id: 46, nome: 'Bis',                categoria: 'Doces', preco: 8.00,  estoque: 25, imagem: '/produtos/bis.jpg',             cor: ['#EFEBE9','#D7CCC8'], descricao: 'Bis chocolate ao leite',              disponivel: true },
  { id: 47, nome: 'Cookies',            categoria: 'Doces', preco: 10.00, estoque: 20, imagem: '/produtos/cookies.jpg',         cor: ['#EFEBE9','#D7CCC8'], descricao: 'Cookies de chocolate chip',           disponivel: true },
  { id: 48, nome: 'Kit Kat',            categoria: 'Doces', preco: 7.00,  estoque: 25, imagem: '/produtos/kit-kat.jpg',         cor: ['#FCE4EC','#F8BBD9'], descricao: 'Kit Kat wafer com chocolate',         disponivel: true },
];

export const PEDIDOS_INICIAIS = [];
