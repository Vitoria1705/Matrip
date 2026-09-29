// Chaves usadas no localStorage.
const STORAGE_KEYS = {
  usuario: "usuarioLogado"
};

// Base de dados simulada da área do cliente.
// A estrutura foi aproximada do banco real para evitar retrabalho depois.
const reservasMock = [
  {
    idReserva: 101,
    statusReserva: "confirmada",
    passeio: {
      id: 1,
      nome: "Passeio de Barco no Rio Tocantins + Pôr do Sol",
      categoria: "aventuras",
      local: "Rio Tocantins",
      cidade: "Imperatriz",
      estado: "MA",
      descricao: "Passeio guiado de barco com contemplação do pôr do sol e paradas para banho.",
      valorAdulto: 340.0,
      valorEstudante: 280.0,
      valorCrianca: 220.0,
      valorFinal: 340.0,
      dataPasseio: "2026-03-28",
      horarios: ["16:00"],
      locaisEmbarque: ["Beira Rio"],
      inclui: ["Passeio de barco", "Guia local"],
      classificacao: "livre",
      imagem: "../../img/passeios/barco-tocantins.jpeg"
    },
    pagamento: {
      status: "aprovado",
      valor: 680.0,
      metodo: "pix",
      parcelas: 1,
      transactionId: "PIX-2026-000101"
    },
    participantes: [
      {
        nome: "Francielson Sousa",
        idade: 32,
        documento: "RG final 2345",
        tipoTarifa: "adulto"
      },
      {
        nome: "Acompanhante 1",
        idade: 29,
        documento: "RG final 9123",
        tipoTarifa: "adulto"
      }
    ]
  },
  {
    idReserva: 102,
    statusReserva: "pendente",
    passeio: {
      id: 2,
      nome: "Cachoeira São Romão + Cachoeira da Prata",
      categoria: "aventuras",
      local: "Parque Nacional da Chapada das Mesas",
      cidade: "Carolina",
      estado: "MA",
      descricao: "Excursão guiada com caminhada moderada até duas cachoeiras do parque.",
      valorAdulto: 420.0,
      valorEstudante: 360.0,
      valorCrianca: 300.0,
      valorFinal: 420.0,
      dataPasseio: "2026-04-05",
      horarios: ["07:30"],
      locaisEmbarque: ["Centro de Carolina", "Hotel parceiro"],
      inclui: ["Transporte", "Guia", "Visita às cachoeiras"],
      classificacao: "10 anos",
      imagem: "../../img/passeios/cachoeira-sao-romao.jpg"
    },
    pagamento: {
      status: "pendente",
      valor: 780.0,
      metodo: "cartao",
      parcelas: 3,
      transactionId: "CARD-2026-000102"
    },
    participantes: [
      {
        nome: "Francielson Sousa",
        idade: 32,
        documento: "RG final 2345",
        tipoTarifa: "adulto"
      },
      {
        nome: "Participante 2",
        idade: 18,
        documento: "RG final 5566",
        tipoTarifa: "estudante"
      }
    ]
  },
  {
    idReserva: 103,
    statusReserva: "cancelada",
    passeio: {
      id: 3,
      nome: "Circuito Quadriciclo + Lancha (Combo)",
      categoria: "aventuras",
      local: "Lençóis Maranhenses",
      cidade: "Barreirinhas",
      estado: "MA",
      descricao: "Passeio combinando quadriciclo nas dunas e trajeto de lancha pelo rio.",
      valorAdulto: 550.0,
      valorEstudante: 450.0,
      valorCrianca: 0,
      valorFinal: 550.0,
      dataPasseio: "2026-02-17",
      horarios: ["09:00"],
      locaisEmbarque: ["Agência central"],
      inclui: ["Quadriciclo", "Lancha", "Guia"],
      classificacao: "12 anos",
      imagem: "../../img/passeios/quadriciclo-lancha.jpg"
    },
    pagamento: {
      status: "estornado",
      valor: 550.0,
      metodo: "pix",
      parcelas: 1,
      transactionId: "PIX-2026-000103"
    },
    participantes: [
      {
        nome: "Francielson Sousa",
        idade: 32,
        documento: "RG final 2345",
        tipoTarifa: "adulto"
      }
    ]
  },
  {
    idReserva: 104,
    statusReserva: "confirmada",
    passeio: {
      id: 4,
      nome: "Degustação Gastronômica pelo Centro Histórico de São Luís",
      categoria: "culinaria",
      local: "Centro Histórico",
      cidade: "São Luís",
      estado: "MA",
      descricao: "Tour guiado por mercados históricos e restaurantes típicos com experiências gastronômicas.",
      valorAdulto: 320.0,
      valorEstudante: 260.0,
      valorCrianca: 180.0,
      valorFinal: 320.0,
      dataPasseio: "2026-04-18",
      horarios: ["18:00"],
      locaisEmbarque: ["Praça Dom Pedro II"],
      inclui: ["Guia", "Degustações selecionadas"],
      classificacao: "livre",
      imagem: "../../img/passeios/gastronomia-sao-luis.jpg"
    },
    pagamento: {
      status: "aprovado",
      valor: 580.0,
      metodo: "cartao",
      parcelas: 2,
      transactionId: "CARD-2026-000104"
    },
    participantes: [
      {
        nome: "Francielson Sousa",
        idade: 32,
        documento: "RG final 2345",
        tipoTarifa: "adulto"
      },
      {
        nome: "Participante 3",
        idade: 14,
        documento: "RG final 7744",
        tipoTarifa: "crianca"
      }
    ]
  }
];

const favoritosMock = [
  {
    id: 201,
    nome: "Centro Histórico de São Luís",
    cidade: "São Luís",
    estado: "MA"
  },
  
  
  
  
  
  
  
  
  
  
// Reserva usada para alimentar corretamente o card do favorito.
// O id do passeio precisa bater com o id do favorito.
{
  idReserva: 105,
  statusReserva: "confirmada",
  passeio: {
    id: 201,
    nome: "Lençóis Maranhenses",
    categoria: "Passeio",
    local: "Parque Nacional dos Lençóis Maranhenses",
    cidade: "Barreirinhas",
    estado: "MA",
    descricao: "Passeio salvo para consulta futura.",
    valorAdulto: 0,
    valorEstudante: 0,
    valorCrianca: 0,
    valorFinal: 0,
    dataPasseio: "2026-05-10",
    horarios: ["08:00"],
    locaisEmbarque: ["Centro de Barreirinhas"],
    inclui: ["Passeio guiado"],
    classificacao: "livre",

    // Imagem local do protótipo.
    imagem: "../../img/passeios/barco-tocantins.jpg"
  },
  pagamento: {
    status: "pendente",
    valor: 0,
    metodo: "pix",
    parcelas: 1,
    transactionId: "FAV-2026-000105"
  },
  participantes: [
    {
      nome: "Francielson Sousa",
      idade: 32,
      documento: "RG final 2345",
      tipoTarifa: "adulto"
    }
  ]
},





  {
    id: 203,
    nome: "Atins Gastronômico",
    cidade: "Atins",
    estado: "MA"
  }
];

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);
}

function formatarData(dataISO) {
  if (!dataISO) return "Data não informada";

  const data = new Date(`${dataISO}T12:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(data);
}

function obterPrimeiroNome(nomeCompleto) {
  if (!nomeCompleto || typeof nomeCompleto !== "string") return "Usuário";
  return nomeCompleto.trim().split(" ")[0];
}

function obterUsuarioLogado() {
  try {
    const usuarioSalvo = localStorage.getItem(STORAGE_KEYS.usuario);

    if (!usuarioSalvo) {
    return {
      nome: "Visitante Matrip",
      email: "visitante@matrip.com",
      tipo: "usuario",
      provider: "local",
      provider_id: ""
    };
}
    const usuario = JSON.parse(usuarioSalvo);

    return {
      nome: usuario.nome || usuario.name || "Cliente Matrip",
      email: usuario.email || "cliente@matrip.com",
      tipo: usuario.tipo || usuario.role || "usuario",
      provider: usuario.provider || "local",
      provider_id: usuario.provider_id || usuario.providerId || ""
  };
  } catch (error) {
    console.error("Erro ao ler usuário do localStorage:", error);

    return {
      nome: "Cliente Matrip",
      email: "cliente@matrip.com",
      tipo: "usuario",
      provider: "local",
      provider_id: ""
    };
  }
}

function obterStatusClass(statusReserva) {
  const mapa = {
    confirmada: "status-badge status-badge--confirmada",
    pendente: "status-badge status-badge--pendente",
    cancelada: "status-badge status-badge--cancelada"
  };

  return mapa[statusReserva] || "status-badge";
}

function obterStatusLabel(statusReserva) {
  const mapa = {
    confirmada: "Confirmada",
    pendente: "Pendente",
    cancelada: "Cancelada"
  };

  return mapa[statusReserva] || "Status";
}

function obterStatusPagamentoLabel(statusPagamento) {
  const mapa = {
    aprovado: "Pagamento aprovado",
    pendente: "Pagamento pendente",
    estornado: "Pagamento estornado"
  };

  return mapa[statusPagamento] || "Pagamento";
}

function obterIconeAtividade(statusReserva) {
  const mapa = {
    confirmada: "fa-calendar-check",
    pendente: "fa-clock",
    cancelada: "fa-ban"
  };

  return mapa[statusReserva] || "fa-ticket";
}

function ordenarReservasPorDataFutura(lista) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return [...lista]
    .filter((item) => new Date(`${item.passeio.dataPasseio}T12:00:00`) >= hoje)
    .sort(
      (a, b) =>
        new Date(`${a.passeio.dataPasseio}T12:00:00`) -
        new Date(`${b.passeio.dataPasseio}T12:00:00`)
    );
}

function contarParticipantes(reserva) {
  return Array.isArray(reserva.participantes) ? reserva.participantes.length : 0;
}

function obterImagemPasseio(reserva) {
  return reserva?.passeio?.imagem || "";
}


/* controle de sessão e logout da área do cliente
   centralizado aqui para ser reutilizado em todas as páginas */
function configurarLogout() {
  const btnLogout = document.getElementById("btnLogout");

  if (!btnLogout) return;

  btnLogout.addEventListener("click", function (event) {
    event.preventDefault();

    try {
      // remove todos os dados de sessão conhecidos
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("usuario");
      localStorage.removeItem("tipo");
      localStorage.removeItem("redirectAfterLogin");

      // opcional: limpa tudo (use se quiser reset total)
      // localStorage.clear();

    } catch (erro) {
      console.error("Erro ao limpar sessão:", erro);
    }

    // redireciona para a home principal do site
    window.location.href = "../../index.html";
  });
}