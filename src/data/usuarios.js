export const USUARIOS = [
  { id: 1, nome: 'Admin', email: 'admin@filazero.com', senha: 'admin123', role: 'admin' },
  { id: 2, nome: 'João Silva', email: 'joao@email.com', senha: '123456', role: 'usuario' },
  { id: 3, nome: 'Gustavo', email: 'gusstavoandrad3@gmail.com', senha: '123456', role: 'usuario' },
];

let proximoId = 10;

export function buscarUsuario(email, senha) {
  return (
    USUARIOS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    ) || null
  );
}

export function buscarPorEmail(email) {
  return USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function alterarSenha(email, novaSenha) {
  const usuario = USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!usuario) return false;
  usuario.senha = novaSenha;
  return true;
}

export function cadastrarUsuario(nome, email, senha) {
  if (USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { erro: 'Este e-mail já está cadastrado.' };
  }
  const novo = { id: ++proximoId, nome, email, senha, role: 'usuario' };
  USUARIOS.push(novo);
  return { usuario: novo };
}
