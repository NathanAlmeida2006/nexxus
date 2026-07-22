/*
 * Todo o copy da landing page, centralizado.
 * Tom de voz: jovem, caloroso, coloquial, autodepreciativo — gerenciamento/Briefing.md.
 *
 * TODO(nexxus): trocar os contatos placeholder pelos oficiais quando existirem:
 *   - número do WhatsApp Business
 *   - e-mail (depende do Google Workspace pós-CNPJ)
 *   - URLs das redes sociais
 *   - nomes reais dos 11 fundadores na seção "As Nozes"
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

export const team = {
  kicker: 'onze pessoas fundando algo que nunca existiu na FURB',
  title: 'As Nozes.',
  note: '“Nozes” é como a gente se chama. Vem de “nós”. A gente avisou que o humor era assim.',
  areas: [
    'Presidência',
    'Coordenação',
    'Vendas',
    'Recursos Humanos',
    'Financeiro',
    'Marketing Interno',
    'Área Técnica',
  ],
  namesNote:
    'Os onze nomes entram aqui assim que a papelada de fundação sair do forno. Burocracia é assim mesmo — a gente entende do assunto :)',
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
