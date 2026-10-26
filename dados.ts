import { Cliente, Produto } from "./types";
// Dados fictícios: os arrays serão recriados a cada execução do Node.
export const produtosIniciais: Produto[] = [
  { id: 1, nome: "Caderno", categoria: "Papelaria", preco: 25.50, estoque: 10 },
  { id: 2, nome: "Caneta", categoria: "Papelaria", preco: 3.20, estoque: 20 },
  { id: 3, nome: "Mochila", categoria: "Acessórios", preco: 120, estoque: 5 }
];
export const clientesIniciais: Cliente[] = [
  { id: 1, nome: "Ana Souza", email: "ana@example.com" },
  { id: 2, nome: "Bruno Silva", email: "bruno@example.com" },
  { id: 3, nome: "Carla Lima", email: "carla@example.com" }
];
