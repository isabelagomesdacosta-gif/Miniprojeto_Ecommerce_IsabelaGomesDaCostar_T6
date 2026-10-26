import { clientesIniciais } from "./dados";
import { Cliente } from "./types";
import { validarId, validarTexto } from "./validacoes";
const clientes: Cliente[] = clientesIniciais.map(cliente => ({ ...cliente }));
export function cadastrarCliente(cliente: Cliente): Cliente {
  validarId(cliente.id);
  validarTexto(cliente.nome, "Nome");
  validarTexto(cliente.email, "E-mail");
  const email = cliente.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido.");
  if (clientes.find(atual => atual.id === cliente.id)) throw new Error("Identificador de cliente já utilizado.");
  if (clientes.find(atual => atual.email === email)) throw new Error("E-mail já utilizado.");
  const novo: Cliente = { ...cliente, nome: cliente.nome.trim(), email };
  clientes.push(novo);
  return { ...novo };
}
export function listarClientes(): Cliente[] {
  return clientes.map(cliente => ({ ...cliente }));
}
export function buscarClientePorId(id: number): Cliente | undefined {
  const cliente = clientes.find(cliente => cliente.id === id);
  return cliente ? { ...cliente } : undefined;
}
