// 1. CARREGAR DADOS DO LOCALSTORAGE
let dados = JSON.parse(localStorage.getItem("registros")) || [
  {
    id: 1,
    titulo: "Caminhada Matinal",
    categoria: "Exercício",
    data: "2025-01-05",
    descricao: "30 minutos de caminhada leve.",
    curtidas: 0,
  },
  {
    id: 2,
    titulo: "Café da Manhã Saudável",
    categoria: "Alimentação",
    data: "2025-01-06",
    descricao: "Mamão com aveia.",
    curtidas: 2,
  },
];

// salva no localStorage
function salvarLocal() {
  localStorage.setItem("registros", JSON.stringify(dados));
}