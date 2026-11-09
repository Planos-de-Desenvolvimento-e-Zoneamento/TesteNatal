/* =====================================================================
   Geoportal do Porto de Natal — catálogo de camadas
   ---------------------------------------------------------------------
   Grupos, nomes e campos seguem a Portaria SEP nº 3/2014 (Anexos II e III);
   "item" é o número do item no Anexo II (só referência: não aparece na tela).
   Itens que não se aplicam ao Porto de Natal não entram no catálogo.
   Cada camada aponta para um arquivo .geojson da pasta do Geoportal.
   Camadas com "horizonte: true" usam o arquivo "<arquivo> - <sufixo>",
   onde o sufixo vem do horizonte de planejamento selecionado.
   Tipos: 'poligono', 'linha' e 'ponto'.
   "contorno" desenha um halo sob a linha principal para destacá-la sobre
   qualquer mapa de fundo.
   ===================================================================== */
// Cor fixa de cada categoria de produto movimentado (mesmas cores usadas no Geoportal do Rio de Janeiro)
const CORES_CATEGORIA = {
  'Multipropósito': '#0891b2',
  'Passageiros': '#db2777',
  'Não informado': '#ff7a00'   // laranja vivo: visível sobre satélite, mapa claro e ruas
};
const POR_CATEGORIA = { campo: 'Categoria', cores: CORES_CATEGORIA };

// Opacidade única do preenchimento dos polígonos (0,45 = 45%): mostra a cor da
// categoria e ainda deixa ver o mapa de fundo; o contorno fica sempre opaco.
const OPACIDADE_PADRAO = 0.45;

window.GEOPORTAL_CONFIG = {
  titulo: 'Zoneamento do Porto de Natal',
  subtitulo: 'Zoneamento, infraestrutura e acessos portuários',
  orgao: { linha1: 'Ministério de', linha2: 'Portos e Aeroportos' },
  opacidadePadrao: OPACIDADE_PADRAO,
  dataAtualizacao: '06/11/2026', // exibida no "Sobre"
  // Versão do plano exibida no "Sobre". Vazio: não aparece.
  versaoPlano: 'PDZ do Porto Organizado de Natal, com alteração aprovada pela Portaria nº 402, de 24 de agosto de 2026',
  linkPdz: 'https://www.gov.br/portos-e-aeroportos/pt-br/assuntos/transporte-aquaviario/planejamento-portuario/plano-de-desenvolvimento-e-zoneamento-pdz',

  // Fontes exibidas no "Sobre". As camadas do porto vêm da base georreferenciada do PDZ (site em linkPdz).
  fontes: {
    limites: {
      texto: 'Municípios: IBGE — Malha Municipal Digital 2025. Unidades da Federação: IBGE — Malha Territorial, março de 2026.'
    }
  },

  horizontes: [
    { id: 'atual', nome: 'Situação Atual', curto: 'Atual', sufixo: 'Situação Atual' },
    { id: 'curto', nome: 'Curto Prazo', curto: 'Curto', sufixo: 'Curto Prazo' },
    { id: 'medio', nome: 'Médio Prazo', curto: 'Médio', sufixo: 'Médio Prazo' },
    { id: 'longo', nome: 'Longo Prazo', curto: 'Longo', sufixo: 'Longo Prazo' }
  ],

  // Três mapas de fundo (serviços públicos Esri, sem chave de API)
  baseInicial: 'satelite',
  basemaps: [
    {
      id: 'cinza',
      nome: 'Cinza claro',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      rotulos: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      maxNativo: 16,
      atribuicao: 'Mapa base &copy; Esri, HERE, Garmin, &copy; colaboradores do OpenStreetMap',
      miniatura: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/13/4227/3295'
    },
    {
      id: 'satelite',
      nome: 'Satélite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      rotulos: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      maxNativo: 19,
      atribuicao: 'Imagens &copy; Esri, Maxar, Earthstar Geographics',
      miniatura: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/4227/3295'
    },
    {
      id: 'ruas',
      nome: 'Ruas',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      maxNativo: 19,
      atribuicao: 'Mapa base &copy; Esri, HERE, Garmin, USGS, &copy; colaboradores do OpenStreetMap',
      miniatura: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/13/4227/3295'
    }
  ],

  // Painel estatístico do zoneamento
  estatisticas: {
    campoPerfil: 'Categoria',
    camadaAreas: 'zoneamento',
    camadaCais: 'acostagem',
    camadaArmazenagem: 'armazenagem',
    camadaArrendadas: 'arrendaveis',   // tabela do painel (localizar no mapa)
    camadaDisponiveis: 'arrendaveis',
    sinonimos: {}
  },

  grupos: [
    { id: 'ref', nome: 'Poligonal e Limites' },
    { id: 'ace', nome: 'Acessos' },
    { id: 'aqua', nome: 'Acessos Aquaviários' },
    { id: 'int', nome: 'Acessos Internos do Porto' },
    { id: 'zon', nome: 'Zoneamento e Áreas' },
    { id: 'inst', nome: 'Instalações e Serviços' },
    { id: 'amb', nome: 'Meio Ambiente' }
  ],

  camadas: [
    /* ---------------- Poligonal e limites ---------------- */
    {
      id: 'poligonal', item: '4.1', grupo: 'ref', tipo: 'poligono', visivel: true,
      nome: 'Poligonal do Porto Organizado',
      arquivo: 'Poligonal da Área do Porto Organizado de Natal',
      painel: 'pn-poligonal', rotulo: ['Tipo'],
      personalizavel: true,    // cor, opacidade e largura do traço editáveis no menu ⋯
      rotuloZoom: 13,          // zoom mínimo para mostrar rótulos (padrão por grupo em geoportal.js)
      rotuloPadrao: false,     // os polígonos cobrem as demais camadas: esta fica sem rótulos
      identificarPorUltimo: true,
      // Sempre vermelha, com halo branco para destacar em qualquer mapa
      estilo: { cor: '#e52207', espessura: 3, semPreenchimento: true, contorno: { cor: '#ffffff', espessura: 7 } }
    },
    {
      id: 'municipios', grupo: 'ref', tipo: 'poligono',
      nome: 'Municípios do Rio Grande do Norte',
      arquivo: 'Malha Municipal RN JSON',
      painel: 'pn-limites', rotulo: ['Município'], semTooltip: true,
      // Linha escura com halo branco; preenchimento claro para não escurecer o satélite
      estilo: { cor: '#334155', preenchimento: '#e2e8f0', tracoProprio: true, espessura: 2, opacidadePreenchimento: OPACIDADE_PADRAO, contorno: { cor: '#ffffff', espessura: 5 } }
    },
    {
      id: 'uf', grupo: 'ref', tipo: 'poligono',
      nome: 'Unidades da Federação',
      arquivo: 'UF BR JSON',
      painel: 'pn-limites', rotulo: ['Unidade da Federação', 'Sigla da UF'], semTooltip: true, rotuloZoom: 5,
      estilo: { cor: '#0f172a', preenchimento: '#cbd5e1', tracoProprio: true, espessura: 3, opacidadePreenchimento: OPACIDADE_PADRAO, contorno: { cor: '#ffffff', espessura: 7 } }
    },

    /* ---------------- Acessos ---------------- */
    {
      id: 'rod_ext', item: '4.2.1', grupo: 'ace', tipo: 'linha',
      nome: 'Acessos rodoviários',
      arquivo: 'Acessos Rodoviários',
      painel: 'pn-acessos', rotulo: ['Nome'],
      estilo: { cor: '#f97316', espessura: 3.5, contorno: { cor: '#7c2d12', espessura: 6 } }
    },

    /* ---------------- Acessos aquaviários ---------------- */
    {
      id: 'canais', item: '4.2.5.1', grupo: 'aqua', tipo: 'poligono',
      nome: 'Canal de acesso',
      arquivo: 'Canal de Acesso',
      painel: 'pn-aquaviario', rotulo: ['Trecho'],
      estilo: { cor: '#0369a1', preenchimento: '#38bdf8', espessura: 1.2, opacidadePreenchimento: 0.35 }
    },
    {
      id: 'bacias', item: '4.2.5.2', grupo: 'aqua', tipo: 'poligono',
      nome: 'Bacia de evolução',
      arquivo: 'Bacia de Evolução',
      painel: 'pn-aquaviario',
      estilo: { cor: '#0e7490', preenchimento: '#22d3ee', espessura: 1.8, opacidadePreenchimento: 0.25 }
    },
    {
      id: 'fundeadouros', item: '4.2.5.3', grupo: 'aqua', tipo: 'poligono',
      nome: 'Fundeadouros',
      arquivo: 'Fundeadouros',
      painel: 'pn-aquaviario', rotulo: ['Número de Identificação'],
      estilo: { cor: '#3730a3', preenchimento: '#6366f1', espessura: 1.6, opacidadePreenchimento: 0.15 }
    },

    /* ---------------- Acessos internos do porto ---------------- */
    {
      id: 'rod_int', item: '4.3.1', grupo: 'int', tipo: 'linha',
      nome: 'Acessos internos rodoviários',
      arquivo: 'Acessos Internos Rodoviários',
      painel: 'pn-acessos', rotulo: ['Nome'],
      estilo: { cor: '#fdba74', espessura: 2.5, contorno: { cor: '#9a3412', espessura: 4.5 } }
    },

    /* ---------------- Zoneamento e áreas ---------------- */
    {
      id: 'zoneamento', item: '4.4', grupo: 'zon', tipo: 'poligono', horizonte: true,
      nome: 'Zoneamento',
      arquivo: 'Zoneamento',
      painel: 'pn-zoneamento', rotulo: ['Categoria'],
      estilo: { cor: '#1e3a8a', espessura: 2.5, opacidadePreenchimento: 0.45 },
      categorias: POR_CATEGORIA
    },
    {
      id: 'arrendaveis', item: '4.6', grupo: 'zon', tipo: 'poligono',
      nome: 'Áreas arrendáveis',
      arquivo: 'Áreas Arrendáveis',
      painel: 'pn-zoneamento', rotulo: ['Nome da Área'],
      estilo: { cor: '#15803d', espessura: 2.5, opacidadePreenchimento: 0.45 }
    },
    {
      id: 'alfandegadas', item: '4.8', grupo: 'zon', tipo: 'poligono',
      nome: 'Áreas e instalações alfandegadas',
      arquivo: 'Áreas e Instalações Alfandegadas do Porto',
      painel: 'pn-instalacoes', rotulo: ['Nome'],
      // Amarelo com halo escuro: contorno visível sobre satélite e sobre o mapa claro
      estilo: { cor: '#facc15', espessura: 2.5, padrao: { cor: '#facc15', espaco: 6, espessura: 1.5, angulo: -45 }, contorno: { cor: '#1f2937', espessura: 5.5 } }
    },
    {
      id: 'nao_operacionais', item: '4.9', grupo: 'zon', tipo: 'poligono',
      nome: 'Instalações não operacionais',
      arquivo: 'Instalações Não Operacionais',
      painel: 'pn-zoneamento', rotulo: ['Tipo da Instalação'],
      estilo: { cor: '#c2410c', preenchimento: '#fb923c', espessura: 1.5, opacidadePreenchimento: 0.35 }
    },

    /* ---------------- Instalações e serviços ---------------- */
    {
      id: 'armazenagem', item: '4.10', grupo: 'inst', tipo: 'poligono',
      nome: 'Armazenagem',
      arquivo: 'Armazenagem',
      painel: 'pn-instalacoes', rotulo: ['Tipo da Instalação'],
      estilo: { cor: '#92400e', preenchimento: '#f59e0b', espessura: 1.2, opacidadePreenchimento: 0.55 }
    },
    {
      id: 'acostagem', item: '4.11', grupo: 'inst', tipo: 'linha',
      nome: 'Acostagem (berços)',
      arquivo: 'Acostagem',
      painel: 'pn-instalacoes', rotulo: ['Identificador do Berço'],
      estilo: { cor: '#be123c', espessura: 4.5, contorno: { cor: '#ffffff', espessura: 7.5 } }
    },
    {
      id: 'terminais', item: '4.12', grupo: 'inst', tipo: 'poligono',
      nome: 'Terminais de passageiros',
      arquivo: 'Terminais de Passageiros',
      painel: 'pn-instalacoes', rotulo: ['Nome'],
      estilo: { cor: '#1d4ed8', preenchimento: '#3b82f6', espessura: 1.5, opacidadePreenchimento: 0.5 }
    },
    {
      id: 'equipamentos', item: '4.15', grupo: 'inst', tipo: 'poligono',
      nome: 'Equipamentos',
      arquivo: 'Equipamentos',
      painel: 'pn-instalacoes', rotulo: ['Tipo de Equipamento'],
      estilo: { cor: '#854d0e', preenchimento: '#facc15', espessura: 1.5, opacidadePreenchimento: 0.6 }
    },
    {
      id: 'servicos', item: '4.16', grupo: 'inst', tipo: 'ponto',
      nome: 'Serviços de apoio',
      arquivo: 'Serviços de Apoio',
      painel: 'pn-acessos', rotulo: ['Serviço Oferecido'],
      estilo: { cor: '#ffffff', preenchimento: '#c026d3', espessura: 2, raio: 7 }
    },

    /* ---------------- Meio ambiente ---------------- */
    {
      id: 'prioritarias', item: '4.17.5', grupo: 'amb', tipo: 'poligono',
      nome: 'Áreas prioritárias para conservação',
      arquivo: 'Áreas Prioritárias para Conservação',
      painel: 'pn-ambiental', rotulo: ['Nome'],
      estilo: { cor: '#15803d', espessura: 2, padrao: { cor: '#16a34a', espaco: 8, espessura: 1.5, fundo: '#bbf7d0', opacidadeFundo: 0.35 } }
    }
  ]
};
