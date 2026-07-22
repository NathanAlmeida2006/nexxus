/*
 * Todo o copy da landing page, centralizado.
 * Tom de voz: jovem, caloroso, coloquial, autodepreciativo — gerenciamento/Briefing.md.
 *
 * TODO(nexxus): trocar os contatos placeholder pelos oficiais quando existirem:
 *   - número do WhatsApp Business
 *   - e-mail (depende do Google Workspace pós-CNPJ)
 *   - URLs das redes sociais
 *   - cargos nominais de cada integrante (campo `cargo` em equipe.roster)
 */

export const site = {
  name: 'Nexxus Hub EJ',
  wordmark: 'nexxus.',
  claim: '1ª Empresa Júnior de Marketing da FURB',
  email: 'contato@nexxusjr.com.br',
  whatsapp: 'https://wa.me/5547900000000',
}

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'cases', label: 'Cases' },
  { id: 'servicos', label: 'O que fazemos' },
  { to: '/equipe', label: 'As Nozes' },
  { id: 'jogo-rapido', label: 'Jogo rápido' },
  { id: 'contato', label: 'Contato' },
]

export const preloader = {
  line: 'somos a nexxus.',
  repeats: 4,
}

export const hero = {
  kicker: 'Nexxus Hub EJ — Blumenau, SC',
  titleLines: ['Primeiramente,', 'um sorriso :)'],
  lead:
    'Somos a Nexxus — a primeira empresa júnior de marketing da FURB. Social media, vídeo, identidade visual e tráfego pago para negócios reais do Vale do Itajaí, feitos por gente nova. Literalmente.',
  cta: { label: 'bora conversar?', href: '#orcamento' },
  scrollCue: 'role para conhecer ↓',
}

export const stats = {
  kicker: 'quem somos, em dados',
  title: 'Números honestos.',
  items: [
    { value: 1, suffix: 'ª', label: 'empresa júnior de marketing da FURB' },
    { value: 11, label: 'fundadoras e fundadores' },
    { value: 0, label: 'prêmios (por enquanto)' },
    { value: 3, label: 'primeiros clientes que procuramos. é você?' },
  ],
  aside:
    'Fundada em 2026, dentro da FURB e do Movimento Empresa Júnior, ao lado do Núcleo Vale Boreal. Sem histórico para mostrar — então mostramos método, cultura e uma vontade absurda de fazer acontecer.',
  cta: { label: 'quer fazer parte?', href: '#orcamento' },
}

export const marqueeWords = ['social media', 'vídeo', 'identidade visual', 'tráfego pago', 'gestão de redes']

export const cases = {
  kicker: 'portfólio em construção — como toda boa história',
  title: 'Cases.',
  items: [
    {
      number: '001',
      name: 'Esta landing page',
      tagline: 'nosso primeiro case somos nós.',
      services: 'Identidade · Web · Copy',
      type: 'self',
      href: '#servicos',
    },
    {
      number: '002',
      name: 'Seu negócio aqui',
      tagline: 'sério, a vaga existe.',
      services: 'Social Media · Vídeo · Tráfego',
      type: 'slot',
      href: '#contato',
    },
    {
      number: '003',
      name: 'Ou aqui',
      tagline: 'contamos sua história direitinho.',
      services: 'Identidade Visual · Conteúdo',
      type: 'slot',
      href: '#contato',
    },
  ],
  note:
    'Sem cases inventados, sem depoimentos de banco de imagem. O que temos é método, supervisão e a régua alta de quem precisa provar — a começar por esta página.',
}

export const manifesto = {
  kicker: 'os princípios que a gente leva a sério, sem letra miúda',
  title: 'Nossa cultura.',
  items: [
    'Aqui, perguntar não é vergonha. Ninguém nasce sabendo marketing.',
    'Toda reunião começa com cinco minutos de conversa sem pauta nenhuma.',
    'A gente acredita que uma mensagem educada resolve mais do que dez cobranças.',
    'Prazo é compromisso. Avisar que ele não vai fechar também é.',
    'Pedir ajuda é legítimo por aqui — devolver ajuda é obrigatório.',
    'Se a Nexxus atrapalhar suas notas, seu trabalho ou sua vida, a gente revê o combinado.',
    'Primeiramente, um sorriso :)',
  ],
}

export const services = {
  kicker: 'sem jargão: o que entregamos de verdade',
  title: 'O que a gente faz.',
  items: [
    {
      title: 'Social Media',
      items: [
        'Gestão de redes sociais',
        'Planejamento de conteúdo',
        'Calendário editorial',
        'Textos e legendas que soam gente',
      ],
    },
    {
      title: 'Vídeo',
      items: [
        'Captação no seu negócio',
        'Edição ritmada, com intenção',
        'Reels e vídeos curtos',
        'Cobertura de eventos',
      ],
    },
    {
      title: 'Identidade Visual',
      items: [
        'Logotipo e variações',
        'Paleta e tipografia',
        'Papelaria e templates',
        'Mini manual de marca',
      ],
    },
    {
      title: 'Tráfego Pago',
      items: [
        'Anúncios no Instagram e Facebook',
        'Segmentação local (Vale do Itajaí)',
        'Relatórios que você entende',
        'Otimização contínua',
      ],
    },
  ],
}

/*
 * Bloco-manifesto da Home: statement + uma foto + CTA. Os setores não vivem
 * mais aqui — viraram os capítulos do roster em /equipe.
 */
export const team = {
  kicker: 'onze pessoas fundando algo que nunca existiu na FURB',
  title: 'As Nozes.',
  statement: [
    '“Nozes” vem de “nós”. A gente avisou que o humor era assim.',
    'Ferramenta boa qualquer um contrata. O que muda o jogo são as onze pessoas que sentam do seu lado para entender o seu negócio — e que precisam que ele dê certo tanto quanto você.',
  ],
  photo: {
    base: '/fotos/equipe/time-h1',
    alt: 'A equipe da Nexxus reunida no estúdio',
  },
  cta: { label: 'conhecer as 11 nozes', to: '/equipe' },
}

/*
 * Subpágina /equipe. `cargo` e `instagram` ficam vazios de propósito: os dados
 * confirmados são nome e setor, e título nominal em português carrega gênero
 * gramatical que não cabe inferir. O componente cai no setor quando não há cargo.
 * `focus` é o object-position do recorte 3:4 — ajuste de enquadramento por aqui.
 */
export const equipe = {
  meta: {
    title: 'As Nozes — Nexxus Hub EJ',
    description:
      'As onze pessoas que fundaram a primeira empresa júnior de marketing da FURB. Sem foto de banco de imagem: somos nós mesmos.',
  },
  hero: {
    kicker: 'blumenau · vale do itajaí · sc',
    titleLines: ['As Nozes.'],
    lead:
      'Onze estudantes que decidiram fundar uma empresa júnior do zero, dentro da FURB. Sem case herdado, sem sócio investidor, sem histórico para inflar: método, supervisão e uma vontade absurda de fazer acontecer.',
    counter: { value: 11, label: 'nozes' },
    cta: { label: 'ver a equipe', href: '#lista' },
  },
  mosaic: [
    { base: '/fotos/equipe/time-h2', alt: 'Parte da equipe da Nexxus durante o ensaio', orientacao: 'h' },
    { base: '/fotos/equipe/time-h3', alt: 'A equipe da Nexxus rindo entre uma foto e outra', orientacao: 'h' },
    { base: '/fotos/equipe/time-v1', alt: 'Três integrantes da Nexxus posando no estúdio', orientacao: 'v' },
    { base: '/fotos/equipe/time-v2', alt: 'Integrantes da Nexxus em foto de grupo vertical', orientacao: 'v' },
    { base: '/fotos/equipe/time-v3', alt: 'A equipe da Nexxus reunida ao final do ensaio', orientacao: 'v' },
  ],
  culture: {
    kicker: 'como é trabalhar com a gente',
    title: 'Gente antes de ferramenta.',
    paragraphs: [
      'A Nexxus nasceu de uma pergunta simples: e se a gente parasse de esperar experiência para começar a ter experiência? A resposta foram onze pessoas, sete setores e uma associação sem fins lucrativos dentro da FURB.',
      'Aqui perguntar não é vergonha — ninguém nasceu sabendo marketing, e quem finge que nasceu costuma entregar pior. Toda reunião começa com cinco minutos de conversa sem pauta nenhuma. Pedir ajuda é legítimo; devolver ajuda é obrigatório.',
      'E se a Nexxus atrapalhar as notas, o trabalho ou a vida de alguém, a gente revê o combinado. É o tipo de acordo que não cabe em contrato, mas segura uma equipe inteira de pé.',
    ],
  },
  roster: {
    kicker: 'os onze, um por um',
    title: 'Quem faz.',
    setores: [
      {
        setor: 'Presidência',
        slug: 'presidencia',
        membros: [
          {
            nome: 'Júlia',
            slug: 'julia',
            fotos: ['/fotos/julia-1', '/fotos/julia-2'],
            focus: '50% 20%',
            alt: 'Júlia, da presidência da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Coordenação',
        slug: 'coordenacao',
        membros: [
          {
            nome: 'Lara',
            slug: 'lara',
            fotos: ['/fotos/lara-1', '/fotos/lara-2'],
            focus: '50% 12%',
            alt: 'Lara, da coordenação da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Vendas',
        slug: 'vendas',
        membros: [
          {
            nome: 'Ísis',
            slug: 'isis',
            fotos: ['/fotos/isis-1', '/fotos/isis-2'],
            focus: '50% 15%',
            alt: 'Ísis, do setor de vendas da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Recursos Humanos',
        slug: 'recursos-humanos',
        membros: [
          {
            nome: 'Leandro',
            slug: 'leandro',
            fotos: ['/fotos/leandro-1', '/fotos/leandro-2'],
            focus: '50% 12%',
            alt: 'Leandro, de recursos humanos da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Financeiro',
        slug: 'financeiro',
        membros: [
          {
            nome: 'Lavínia',
            slug: 'lavinia',
            fotos: ['/fotos/lavinia-1', '/fotos/lavinia-2'],
            focus: '55% 12%',
            alt: 'Lavínia, do financeiro da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Marketing Interno',
        slug: 'marketing-interno',
        membros: [
          {
            nome: 'Lucas',
            slug: 'lucas',
            fotos: ['/fotos/lucas-1'],
            focus: '50% 25%',
            alt: 'Lucas, do marketing interno da Nexxus, em retrato',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Área Técnica',
        slug: 'area-tecnica',
        membros: [
          {
            nome: 'Ana',
            slug: 'ana',
            fotos: ['/fotos/ana-1', '/fotos/ana-2'],
            focus: '55% 15%',
            alt: 'Ana, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Otávio',
            slug: 'otavio',
            fotos: ['/fotos/otavio-1', '/fotos/otavio-2'],
            focus: '50% 15%',
            alt: 'Otávio, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Kauã',
            slug: 'kaua',
            fotos: ['/fotos/kaua-1', '/fotos/kaua-2'],
            focus: '50% 15%',
            alt: 'Kauã, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Luan',
            slug: 'luan',
            fotos: ['/fotos/luan-1', '/fotos/luan-2'],
            focus: '50% 12%',
            alt: 'Luan, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Kamilly',
            slug: 'kamilly',
            fotos: ['/fotos/kamilly-1'],
            focus: '50% 18%',
            alt: 'Kamilly, da área técnica da Nexxus, em retrato',
            cargo: '',
            instagram: '',
          },
        ],
      },
    ],
  },
  join: {
    kicker: 'a mesa ainda tem cadeira sobrando',
    title: 'Quer ser a 12ª noz?',
    lead:
      'A gente abre processo seletivo para estudantes da FURB e vive de olho em gente boa. Se você chegou até aqui rolando a página inteira, já é um bom sinal.',
    cta: { label: 'chama a gente', to: '/#orcamento' },
  },
}

export const faq = {
  kicker: 'as perguntas que todo mundo faz (com razão)',
  title: 'Jogo rápido.',
  items: [
    {
      q: 'O que é uma empresa júnior?',
      a: 'Uma associação sem fins lucrativos formada e gerida por estudantes universitários, que presta serviços reais — com contrato, nota fiscal e supervisão. Existe um movimento nacional inteiro disso, e a gente faz parte dele.',
    },
    {
      q: 'Vocês são uma agência “de verdade”?',
      a: 'Somos uma EJ de verdade: estatuto, CNPJ, diretoria eleita e responsabilidade jurídica. A diferença para uma agência tradicional? O preço acessível e a fome de provar nosso trabalho.',
    },
    {
      q: 'Quanto custa?',
      a: 'Menos do que você imagina. Por sermos sem fins lucrativos, o valor cobre o projeto — não a margem de sócio. Chama no WhatsApp que a gente monta um orçamento sem compromisso (e sem enrolação).',
    },
    {
      q: 'Quem cuida do meu projeto?',
      a: 'Estudantes de marketing da FURB, com método, supervisão e prazo combinado. Você fala direto com quem executa — sem telefone sem fio, sem “vou verificar com a equipe”.',
    },
    {
      q: 'Por que contratar quem está começando?',
      a: 'Porque o seu projeto não será o 47º da nossa carteira: será um dos primeiros da nossa história. E ninguém cuida melhor de um projeto do que quem precisa que ele dê certo.',
    },
  ],
  prev: '← anterior',
  next: 'próxima →',
}

export const leadForm = {
  kicker: 'orçamento sem compromisso',
  title: 'Conta pra gente.',
  lead:
    'Preencha em um minuto e a gente volta em até um dia útil — com ideias de verdade, não proposta de gaveta. Prometido: zero jargão na resposta.',
  whatsappCta: 'prefere conversar? chama no whats',
  fields: {
    empresa: 'Nome da empresa',
    contato: 'Nome do contato',
    telefone: 'Telefone (com DDD)',
    email: 'E-mail',
    segmento: 'Segmento da empresa',
    necessidade: 'Necessidade atual',
    obs: 'Observações',
  },
  segmentos: ['Restaurante ou café', 'Comércio / loja', 'Clínica ou saúde', 'Serviços', 'Indústria', 'Outro'],
  necessidades: ['Social media', 'Vídeo', 'Identidade visual', 'Tráfego pago', 'Um pouco de tudo', 'Ainda não sei :)'],
  submit: 'quero uma proposta :)',
  privacy: 'Seus dados servem só para a gente responder. Nada de spam — a gente nem teria tempo.',
}

export const mundo = {
  kicker: 'blumenau · vale do itajaí · sc',
  title: 'Do Vale pro mundo.',
  home: { label: 'a gente tá aqui :)', location: [-26.9155, -49.0709] },
  dreams: [
    { id: 'ny', label: 'um dia', location: [40.7128, -74.006] },
    { id: 'lisboa', label: 'quem sabe', location: [38.7223, -9.1393] },
    { id: 'toquio', label: 'por que não?', location: [35.6762, 139.6503] },
  ],
  note: 'Por enquanto, do Vale pro resto do Vale. Mas gira aí — sonhar é de graça :)',
}

export const footer = {
  titleLines: ['Deu match?', '↓'],
  contact: {
    kicker: 'novos negócios',
    lead: 'Conta pra gente o que o seu negócio precisa. Respondemos rápido — e com um sorriso.',
    emailLabel: 'manda um e-mail',
    whatsappLabel: 'chama no whats',
  },
  socials: {
    kicker: 'redes',
    items: [
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Behance', href: '#' },
      { label: 'Facebook', href: '#' },
    ],
  },
  address: {
    kicker: 'onde',
    lines: ['FURB — Campus I', 'Rua Antônio da Veiga, 140', 'Blumenau — SC, Brasil'],
    gps: { label: '26°54′11″S 49°04′40″W', href: 'https://maps.google.com/?q=-26.90305,-49.07775' },
  },
  bottom: {
    copyright: '© 2026 Nexxus Hub EJ — feita por nós mesmos, é claro.',
    claim: '1ª Empresa Júnior de Marketing da FURB',
    backToTop: 'voltar ao topo ↑',
  },
}
