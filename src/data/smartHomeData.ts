import { RoomConfig, SmartDeviceConfig } from '../types/game';

export const OVERVIEW_CAMERA = {
  position: [19.5, 16.5, 21.5] as [number, number, number],
  target: [0, 0.8, -0.5] as [number, number, number],
};

export const ROOMS: RoomConfig[] = [
  {
    id: 'living_room',
    name: 'Sala de Estar',
    zone: 'interior',
    description:
      'Centro de conectividade e entretenimento da casa, concentrando roteador principal, câmera interna, assistente de voz e TV.',
    cameraPosition: [-8.2, 6.2, 8.8],
    cameraTarget: [-2.6, 1.0, 2.0],
    floorBounds: { minX: -5.6, maxX: 0.5, minZ: -0.8, maxZ: 4.5 },
    mapRect: { x: 29.8, y: 51.8, w: 22, h: 13.5 },
  },
  {
    id: 'hallway',
    name: 'Hall & Corredor',
    zone: 'interior',
    description:
      'Acesso frontal interno com central de alarme conectada, campainha inteligente, aparador e iluminação de circulação.',
    cameraPosition: [-7.2, 5.8, 10.6],
    cameraTarget: [-2.5, 1.0, 5.6],
    floorBounds: { minX: -5.6, maxX: 0.5, minZ: 4.5, maxZ: 6.8 },
    mapRect: { x: 29.8, y: 65.5, w: 22, h: 6.5 },
  },
  {
    id: 'bedroom',
    name: 'Quarto Principal',
    zone: 'interior',
    description:
      'Suíte íntima com automação de iluminação, controle climático e assistente de cabeceira.',
    cameraPosition: [-8.4, 6.4, -7.8],
    cameraTarget: [-2.6, 1.1, -2.8],
    floorBounds: { minX: -5.6, maxX: 0.5, minZ: -4.9, maxZ: -0.8 },
    mapRect: { x: 29.8, y: 39.8, w: 22, h: 11.7 },
  },
  {
    id: 'kitchen',
    name: 'Cozinha',
    zone: 'interior',
    description:
      'Espaço com eletrodomésticos conectados, refrigeração inteligente e detectores de segurança doméstica.',
    cameraPosition: [8.4, 6.4, -7.8],
    cameraTarget: [2.8, 1.1, -2.4],
    floorBounds: { minX: 0.5, maxX: 5.8, minZ: -4.9, maxZ: 0.3 },
    mapRect: { x: 52, y: 39.8, w: 19, h: 13.6 },
  },
  {
    id: 'dining_room',
    name: 'Sala de Jantar',
    zone: 'interior',
    description:
      'Ambiente social integrado com iluminação pendente inteligente, aparador e sensor de presença.',
    cameraPosition: [14.5, 6.4, -6.4],
    cameraTarget: [8.45, 1.0, -2.3],
    floorBounds: { minX: 5.8, maxX: 11.2, minZ: -4.9, maxZ: 0.3 },
    mapRect: { x: 71, y: 39.8, w: 19.5, h: 13.6 },
  },
  {
    id: 'office',
    name: 'Escritório',
    zone: 'interior',
    description:
      'Estação de trabalho remoto com computador, dois monitores, impressora de rede e automação.',
    cameraPosition: [-14.8, 6.2, 6.8],
    cameraTarget: [-8.6, 0.9, 2.0],
    floorBounds: { minX: -11.2, maxX: -5.6, minZ: -0.8, maxZ: 4.5 },
    mapRect: { x: 9, y: 51.2, w: 20.5, h: 14.3 },
  },
  {
    id: 'bathroom',
    name: 'Banheiro',
    zone: 'interior',
    description:
      'Banheiro contemporâneo equipado com box de vidro, ventilação inteligente, sensor de umidade e detecção de vazamentos.',
    cameraPosition: [-14.5, 6.0, -6.2],
    cameraTarget: [-8.4, 0.9, -2.9],
    floorBounds: { minX: -11.2, maxX: -5.6, minZ: -4.9, maxZ: -0.8 },
    mapRect: { x: 9, y: 39.8, w: 20.5, h: 11 },
  },
  {
    id: 'guest_bedroom',
    name: 'Quarto Adicional',
    zone: 'interior',
    description:
      'Quarto de hóspedes com ar-condicionado conectado, escrivaninha, Smart TV e sensores térmicos.',
    cameraPosition: [-14.8, 6.4, -12.6],
    cameraTarget: [-8.4, 1.0, -7.2],
    floorBounds: { minX: -11.2, maxX: -5.6, minZ: -9.4, maxZ: -4.9 },
    mapRect: { x: 9, y: 27, w: 20.5, h: 12.3 },
  },
  {
    id: 'laundry',
    name: 'Lavanderia',
    zone: 'service',
    description:
      'Área de serviço equipada com lavadora/secadora conectadas, tomadas inteligentes e sensores hidráulicos.',
    cameraPosition: [14.5, 6.2, -12.2],
    cameraTarget: [8.6, 0.9, -6.8],
    floorBounds: { minX: 5.8, maxX: 11.2, minZ: -9.4, maxZ: -4.9 },
    mapRect: { x: 71, y: 27, w: 19.5, h: 12.3 },
  },
  {
    id: 'garage',
    name: 'Garagem',
    zone: 'service',
    description:
      'Garagem integrada com veículo estacionado, bancada de ferramentas, carregador EV e portão eletrônico inteligente.',
    cameraPosition: [15.0, 6.2, 10.2],
    cameraTarget: [8.5, 1.0, 3.4],
    floorBounds: { minX: 5.8, maxX: 11.2, minZ: 0.3, maxZ: 6.4 },
    mapRect: { x: 71, y: 53.6, w: 19.5, h: 16.7 },
  },
  {
    id: 'exterior',
    name: 'Terraço Frontal',
    zone: 'outdoor',
    description:
      'Perímetro de acesso frontal da residência com fechadura eletrônica, sensores de movimento e vigilância externa.',
    cameraPosition: [6.8, 5.8, 9.2],
    cameraTarget: [2.8, 0.9, 2.6],
    floorBounds: { minX: 0.5, maxX: 5.8, minZ: 0.3, maxZ: 4.8 },
    mapRect: { x: 52, y: 53.6, w: 19, h: 13.5 },
  },
  {
    id: 'gourmet',
    name: 'Área Gourmet',
    zone: 'outdoor',
    description:
      'Varanda gourmet com pergolado, churrasqueira, bancada em mármore e sistema de som conectado.',
    cameraPosition: [8.4, 6.0, -13.2],
    cameraTarget: [3.1, 0.9, -7.2],
    floorBounds: { minX: 0.5, maxX: 5.8, minZ: -9.4, maxZ: -4.9 },
    mapRect: { x: 52, y: 27, w: 19, h: 12.3 },
  },
  {
    id: 'pool',
    name: 'Piscina & Deck',
    zone: 'outdoor',
    description:
      'Área de lazer com piscina iluminada, deck de pedra, espreguiçadeiras e controlador digital de aquecimento/filtragem.',
    cameraPosition: [8.8, 6.8, -19.2],
    cameraTarget: [-0.2, 0.4, -13.0],
    floorBounds: { minX: -5.2, maxX: 4.8, minZ: -17.8, maxZ: -10.2 },
    mapRect: { x: 31, y: 10, w: 36, h: 16 },
  },
  {
    id: 'backyard',
    name: 'Quintal & Jardim',
    zone: 'outdoor',
    description:
      'Jardim perimetral amplo com árvores, irrigação automática, estação meteorológica e cortador robô.',
    cameraPosition: [-14.8, 7.6, -18.5],
    cameraTarget: [-9.2, 0.7, -13.2],
    floorBounds: { minX: -13.5, maxX: 13.5, minZ: -19.5, maxZ: -9.5 },
    mapRect: { x: 1, y: 1, w: 98, h: 25.5 },
  },
  {
    id: 'street',
    name: 'Rua Pública',
    zone: 'outdoor',
    description:
      'Via pública arborizada com tráfego de veículos, faixa de pedestres, calçadas e câmera perimetral voltada para a fachada.',
    cameraPosition: [10.5, 7.2, 19.2],
    cameraTarget: [-1.5, 0.8, 10.8],
    floorBounds: { minX: -28, maxX: 28, minZ: 7.2, maxZ: 17.5 },
    mapRect: { x: 1, y: 74, w: 98, h: 25 },
  },
];

export const SMART_DEVICES: SmartDeviceConfig[] = [
  // =========================================================================
  // 1. SALA DE ESTAR (4 dispositivos)
  // =========================================================================
  {
    id: 'cam_living',
    name: 'Câmera Inteligente da Sala',
    shortName: 'Câmera Sala',
    roomId: 'living_room',
    kind: 'camera',
    position: [-5.35, 2.35, -0.55],
    rotationY: Math.PI * 0.25,
    connectionType: 'Wi-Fi 2.4 GHz (DHCP)',
    ipAddress: '192.168.1.24',
    firmwareVersion: 'v2.4.1-cam',
    protocol: 'RTSP / HTTP (porta 8080)',
    summary:
      'Câmera IP interna com transmissão de vídeo em tempo real para o aplicativo dos moradores.',
    isInitiallyVulnerable: true,
    maxPoints: 50,
    securityWeight: 8,
    clues: [
      {
        id: 'cam_clue_1',
        label: 'Credencial de Acesso',
        value: 'Usuário "admin" com senha padrão de fábrica ("123456") ativa.',
        suspicious: true,
      },
      {
        id: 'cam_clue_2',
        label: 'Serviço de Vídeo',
        value: 'Porta RTSP 554 acessível na rede sem bloqueio após tentativas erradas.',
        suspicious: true,
      },
      {
        id: 'cam_clue_3',
        label: 'Registro Recente',
        value: '14 tentativas de login automatizadas detectadas nas últimas 2 horas.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Senha padrão de fábrica mantida',
      vulnerabilityCategory: 'Credenciais Inseguras',
      vulnerabilityQuestion:
        'Com base nos registros coletados, qual é a principal vulnerabilidade desta câmera?',
      vulnerabilityOptions: [
        {
          id: 'v_cam_1',
          text: 'O dispositivo ainda utiliza usuário e senha padrão de fábrica.',
          isCorrect: true,
          feedback:
            'Correto! Credenciais padrão são públicas em manuais e testadas automaticamente por invasores.',
        },
        {
          id: 'v_cam_2',
          text: 'A lente da câmera possui resolução incompatível com o Wi-Fi.',
          isCorrect: false,
          feedback:
            'Incorreto. Resolução de vídeo não causa tentativas de invasão nem expõe o painel de login.',
        },
        {
          id: 'v_cam_3',
          text: 'O equipamento está desconectado da energia elétrica.',
          isCorrect: false,
          feedback:
            'Incorreto. O dispositivo está online e registrando acessos ativos na rede local.',
        },
      ],
      threat: {
        id: 'threat_cam_living',
        title: 'Acesso não autorizado a imagens internas',
        description:
          'Atacantes ou scripts automatizados podem entrar usando a senha de fábrica e assumir o controle do vídeo.',
        severity: 'ALTO',
        consequences:
          'Espionagem da rotina dos moradores, captura de imagens privadas e recrutamento da câmera em redes botnet.',
        recommendation:
          'Substituir imediatamente a senha padrão por uma senha longa, exclusiva e ativar autenticação em duas etapas.',
        recognitionQuestion:
          'Qual ameaça direta decorre dessa vulnerabilidade na Câmera Inteligente?',
        recognitionOptions: [
          {
            id: 't_cam_1',
            text: 'Invasão da transmissão de vídeo, violação de privacidade e uso do aparelho em ataques.',
            isCorrect: true,
            feedback:
              'Exato! Câmeras com senha padrão são alvos frequentes para espionagem e botnets de IoT.',
          },
          {
            id: 't_cam_2',
            text: 'Aumento automático na conta de água da residência.',
            isCorrect: false,
            feedback:
              'Não faz sentido. Uma falha digital na câmera ameaça dados, privacidade e a rede.',
          },
          {
            id: 't_cam_3',
            text: 'Perda das cores originais da parede da sala.',
            isCorrect: false,
            feedback:
              'Incorreto. O impacto é digital e de privacidade dos moradores.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida de proteção você deve aplicar para corrigir definitivamente este problema?',
      protectionOptions: [
        {
          id: 'p_cam_a',
          label: 'A',
          text: 'Manter a senha original e apenas ocultar o ícone da câmera no aplicativo.',
          quality: 'incorrect',
          feedback:
            'Inadequada. Ocultar o ícone não altera a senha de acesso; invasores continuam entrando pela rede.',
        },
        {
          id: 'p_cam_b',
          label: 'B',
          text: 'Desligar a câmera da tomada permanentemente e descartar o monitoramento.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Elimina o risco imediato, mas inutiliza o recurso de segurança física da casa.',
          residualRisk: 'O ambiente fica sem vigilância e a causa raiz (má gestão de senhas) não foi resolvida.',
        },
        {
          id: 'p_cam_c',
          label: 'C',
          text: 'Configurar uma senha forte e exclusiva, alterar o usuário padrão e ativar 2FA.',
          quality: 'correct',
          feedback:
            'Excelente decisão! Senha forte exclusiva + 2FA bloqueia ataques de força bruta e credenciais vazadas.',
        },
        {
          id: 'p_cam_d',
          label: 'D',
          text: 'Compartilhar a mesma senha padrão no grupo público do condomínio.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Compartilhar credenciais amplia drasticamente a exposição da câmera a terceiros.',
        },
      ],
    },
    hintProgressive: [
      'Observe o primeiro registro de auditoria: o usuário "admin" e uma sequência numérica simples costumam vir gravados de fábrica.',
      'Uma proteção ideal mantém a câmera funcionando de forma segura, trocando a credencial padrão por uma combinação única e forte.',
    ],
  },

  {
    id: 'router_main',
    name: 'Roteador Wi-Fi Principal',
    shortName: 'Roteador Wi-Fi',
    roomId: 'living_room',
    kind: 'router',
    position: [0.16, 0.825, 0.95],
    rotationY: -Math.PI / 2,
    connectionType: 'Fibra WAN / Gateway Central',
    ipAddress: '192.168.1.1',
    firmwareVersion: 'v4.1.0-gw',
    protocol: '802.11ax / WPA-TKIP + WPS',
    summary:
      'Equipamento central que distribui internet e interliga todos os dispositivos da Smart Home.',
    isInitiallyVulnerable: true,
    maxPoints: 50,
    securityWeight: 9,
    clues: [
      {
        id: 'router_clue_1',
        label: 'Protocolo Wi-Fi',
        value: 'Rede configurada em modo legado WPA/TKIP, vulnerável à quebra de chave.',
        suspicious: true,
      },
      {
        id: 'router_clue_2',
        label: 'Recursos Automáticos',
        value: 'WPS por PIN e UPnP habilitados, abrindo portas automaticamente na internet.',
        suspicious: true,
      },
      {
        id: 'router_clue_3',
        label: 'Segmentação de Rede',
        value: 'Todos os dispositivos IoT compartilham a mesma rede dos notebooks pessoais.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Configuração de segurança inadequada no roteador',
      vulnerabilityCategory: 'Infraestrutura de Rede',
      vulnerabilityQuestion:
        'O que os sinais técnicos indicam sobre a segurança do Roteador Wi-Fi?',
      vulnerabilityOptions: [
        {
          id: 'v_rt_1',
          text: 'Uso de criptografia obsoleta (WPA/TKIP), WPS/UPnP ativos e ausência de rede isolada.',
          isCorrect: true,
          feedback:
            'Correto! O roteador é a porta de entrada da casa; criptografia fraca e UPnP expõem todos os aparelhos.',
        },
        {
          id: 'v_rt_2',
          text: 'As antenas externas estão apontadas para o teto em vez do chão.',
          isCorrect: false,
          feedback:
            'Incorreto. Posição física de antenas afeta alcance, não vulnerabilidades criptográficas.',
        },
        {
          id: 'v_rt_3',
          text: 'O endereço IP interno começa com 192.168.',
          isCorrect: false,
          feedback:
            'Incorreto. A faixa 192.168.x.x é padrão e segura para redes privadas locais.',
        },
      ],
      threat: {
        id: 'threat_router_main',
        title: 'Interceptação de tráfego e invasão lateral da rede',
        description:
          'Um atacante próximo pode quebrar o Wi-Fi fraco via WPS/TKIP e alcançar computadores e sensores internos.',
        severity: 'ALTO',
        consequences:
          'Interceptação de dados pessoais, redirecionamento de DNS para sites falsos e comprometimento em cascata dos dispositivos IoT.',
        recommendation:
          'Ativar WPA3 (ou WPA2-AES), desativar WPS/UPnP e criar uma rede separada para dispositivos IoT.',
        recognitionQuestion:
          'Qual é a principal ameaça gerada por essas configurações inseguras no roteador?',
        recognitionOptions: [
          {
            id: 't_rt_1',
            text: 'Invasão da rede Wi-Fi, espionagem do tráfego e acesso direto a todos os aparelhos conectados.',
            isCorrect: true,
            feedback:
              'Muito bem! Como tudo passa pelo roteador, uma brecha nele compromete toda a residência.',
          },
          {
            id: 't_rt_2',
            text: 'Redução permanente na voltagem das tomadas da sala.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é lógico e afeta a confidencialidade e integridade da rede.',
          },
          {
            id: 't_rt_3',
            text: 'Bloqueio automático da fechadura da geladeira.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça envolve invasão de rede e interceptação de dados.',
          },
        ],
      },
      protectionQuestion:
        'Qual conjunto de ações protege adequadamente o Roteador Wi-Fi?',
      protectionOptions: [
        {
          id: 'p_rt_a',
          label: 'A',
          text: 'Remover a senha do Wi-Fi para facilitar a conexão e apenas desligar os LEDs.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Rede aberta permite que qualquer pessoa na rua acesse a rede doméstica.',
        },
        {
          id: 'p_rt_b',
          label: 'B',
          text: 'Alterar apenas o nome da rede (SSID) para um nome difícil, mantendo WPA-TKIP e WPS.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Mudar o nome não impede ferramentas automáticas de detectar e explorar WPA/WPS.',
          residualRisk: 'A criptografia obsoleta e o PIN do WPS continuam vulneráveis.',
        },
        {
          id: 'p_rt_c',
          label: 'C',
          text: 'Ativar criptografia WPA3/WPA2-AES, desabilitar WPS e UPnP e segmentar dispositivos IoT em rede separada.',
          quality: 'correct',
          feedback:
            'Perfeito! WPA3/AES garante criptografia robusta, desativar WPS/UPnP fecha brechas automáticas e a rede isolada contém riscos.',
        },
        {
          id: 'p_rt_d',
          label: 'D',
          text: 'Liberar o acesso administrativo do roteador para toda a internet pública.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Expor o painel administrativo na internet permite invasões remotas de qualquer lugar do mundo.',
        },
      ],
    },
    hintProgressive: [
      'Verifique o padrão de criptografia (WPA/TKIP é antigo) e recursos como WPS e UPnP que facilitam conexões sem controle.',
      'A solução completa combina criptografia moderna (WPA3/WPA2-AES), desativação de WPS/UPnP e isolamento da rede IoT.',
    ],
  },

  {
    id: 'speaker_living',
    name: 'Smart Speaker da Sala',
    shortName: 'Smart Speaker',
    roomId: 'living_room',
    kind: 'speaker',
    position: [-4.72, 0.75, 2.55],
    connectionType: 'Wi-Fi 5 GHz',
    ipAddress: '192.168.1.38',
    firmwareVersion: 'v6.3.2',
    protocol: 'HTTPS / Cloud Voice API',
    summary:
      'Alto-falante inteligente ativado por voz integrado à agenda, compras online e controle de cenas.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 5,
    clues: [
      {
        id: 'spk_clue_1',
        label: 'Permissões de Aplicativo',
        value: 'Compras por voz habilitadas sem PIN e acesso irrestrito a contatos e e-mails.',
        suspicious: true,
      },
      {
        id: 'spk_clue_2',
        label: 'Histórico de Áudio',
        value: 'Gravações de voz armazenadas indefinidamente na nuvem e compartilhadas com 4 skills de terceiros.',
        suspicious: true,
      },
      {
        id: 'spk_clue_3',
        label: 'Microfone',
        value: 'Escuta contínua ativa mesmo durante reuniões ou quando não há ninguém no ambiente.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Permissões excessivas e privacidade inadequada',
      vulnerabilityCategory: 'Privacidade e Controle de Permissões',
      vulnerabilityQuestion:
        'Qual é o problema de segurança identificado no Smart Speaker?',
      vulnerabilityOptions: [
        {
          id: 'v_spk_1',
          text: 'O dispositivo acumula permissões excessivas (compras sem PIN, dados pessoais e apps terceiros).',
          isCorrect: true,
          feedback:
            'Correto! Conceder privilégios além do necessário aumenta o impacto caso haja abuso ou vazamento.',
        },
        {
          id: 'v_spk_2',
          text: 'O volume máximo do alto-falante ultrapassa 80 decibéis.',
          isCorrect: false,
          feedback:
            'Incorreto. Volume de áudio não configura uma vulnerabilidade cibernética.',
        },
        {
          id: 'v_spk_3',
          text: 'O cabo de energia utiliza plugue de dois pinos.',
          isCorrect: false,
          feedback:
            'Incorreto. O risco está nas permissões digitais e coleta de dados.',
        },
      ],
      threat: {
        id: 'threat_speaker_living',
        title: 'Exposição de dados pessoais e ações não autorizadas por voz',
        description:
          'Qualquer pessoa ou som próximo pode acionar compras/comandos sensíveis, além de vazar gravações para terceiros.',
        severity: 'MÉDIO',
        consequences:
          'Compras indevidas, vazamento de conversas privadas e exposição de agenda e contatos por skills externas.',
        recommendation:
          'Aplicar o princípio do menor privilégio: exigir PIN para compras, remover skills não usadas e limitar retenção de áudio.',
        recognitionQuestion:
          'Qual ameaça está associada às permissões excessivas do Smart Speaker?',
        recognitionOptions: [
          {
            id: 't_spk_1',
            text: 'Vazamento de informações pessoais/áudios e execução de compras ou comandos sem autorização do dono.',
            isCorrect: true,
            feedback:
              'Certo! Limitar permissões evita que terceiros ou integrações abusem dos dados da família.',
          },
          {
            id: 't_spk_2',
            text: 'Queima imediata da placa da televisão por ondas sonoras.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça envolve privacidade e transações financeiras/dados.',
          },
          {
            id: 't_spk_3',
            text: 'Desligamento automático do disjuntor do quarto.',
            isCorrect: false,
            feedback:
              'Incorreto. Trata-se de exposição de dados e comandos indevidos.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige melhor a privacidade e as permissões do Smart Speaker?',
      protectionOptions: [
        {
          id: 'p_spk_a',
          label: 'A',
          text: 'Revisar permissões, exigir PIN para compras, remover integrações desnecessárias e limitar histórico de áudio.',
          quality: 'correct',
          feedback:
            'Excelente! Você aplicou o princípio do menor privilégio sem perder a utilidade do assistente.',
        },
        {
          id: 'p_spk_b',
          label: 'B',
          text: 'Apenas diminuir o volume do alto-falante quando houver visitas em casa.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Volume baixo não impede coleta de dados na nuvem nem bloqueia comandos sem PIN.',
        },
        {
          id: 'p_spk_c',
          label: 'C',
          text: 'Ativar o botão de mudo apenas à noite, mantendo compras sem PIN e skills de terceiros ativas.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. O mudo físico ajuda em momentos específicos, mas as permissões excessivas seguem expostas durante o dia.',
          residualRisk: 'Compras sem PIN e apps de terceiros continuam com acesso amplo aos dados.',
        },
        {
          id: 'p_spk_d',
          label: 'D',
          text: 'Conectar o cartão de crédito principal como padrão para agilizar qualquer pedido por voz.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso aumenta o prejuízo financeiro caso alguém dê um comando indevido.',
        },
      ],
    },
    hintProgressive: [
      'Repare no acesso a compras sem confirmação e no compartilhamento de gravações com aplicativos externos.',
      'A proteção certa segue o princípio do menor privilégio: dê ao aparelho apenas o acesso estritamente necessário.',
    ],
  },

  {
    id: 'tv_living',
    name: 'Smart TV 4K da Sala',
    shortName: 'Smart TV Sala',
    roomId: 'living_room',
    kind: 'tv',
    position: [-3.35, 1.55, -0.66],
    connectionType: 'Wi-Fi IoT Isolado (VLAN)',
    ipAddress: '192.168.50.12',
    firmwareVersion: 'v12.0.8 (Assinado)',
    protocol: 'HTTPS / TLS 1.3',
    summary:
      'Televisão conectada usada para streaming e espelhamento local com controles de privacidade ativos.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'tv_clue_1',
        label: 'Atualizações',
        value: 'Sistema operacional e aplicativos atualizados automaticamente na versão mais recente.',
        suspicious: false,
      },
      {
        id: 'tv_clue_2',
        label: 'Segmentação & Telemetria',
        value: 'Conectada à sub-rede isolada de mídia; coleta de dados de visualização desativada.',
        suspicious: false,
      },
      {
        id: 'tv_clue_3',
        label: 'Controle de Acesso',
        value: 'Pareamento Bluetooth exige confirmação na tela e PIN configurado para instalação de apps.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Todos os indicadores da Smart TV estão conformes: firmware atualizado, rede segmentada e permissões restritas.',
    hintProgressive: [
      'Nem todos os aparelhos da casa estão vulneráveis! Leia os três registros com atenção.',
      'Os registros mostram boas práticas aplicadas: firmware em dia, privacidade ajustada e rede isolada.',
    ],
  },

  // =========================================================================
  // 2. HALL & CORREDOR (2 dispositivos)
  // =========================================================================
  {
    id: 'doorbell_hallway',
    name: 'Campainha Inteligente com Vídeo',
    shortName: 'Campainha Smart',
    roomId: 'hallway',
    kind: 'doorbell',
    position: [-1.58, 1.38, 6.91],
    connectionType: 'Wi-Fi 2.4 GHz + Cloud',
    ipAddress: '192.168.1.32',
    firmwareVersion: 'v2.1.4',
    protocol: 'HTTPS / Link Público',
    summary:
      'Campainha conectada na entrada principal com câmera frontal, áudio bidirecional e gravação em nuvem.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 5,
    clues: [
      {
        id: 'db_clue_1',
        label: 'Armazenamento em Nuvem',
        value: 'Clipes gravados na nuvem sem criptografia ponta a ponta e compartilháveis via link público.',
        suspicious: true,
      },
      {
        id: 'db_clue_2',
        label: 'Privacidade do Ângulo',
        value: 'Captura contínua da calçada vizinha sem máscara de zona de privacidade configurada.',
        suspicious: true,
      },
      {
        id: 'db_clue_3',
        label: 'Histórico de Acessos',
        value: 'Três acessos de dispositivos desconhecidos vinculados à conta familiar sem 2FA.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Exposição de gravações na nuvem e falta de privacidade',
      vulnerabilityCategory: 'Privacidade e Segurança em Nuvem',
      vulnerabilityQuestion:
        'Qual vulnerabilidade afeta a Campainha Inteligente instalada na entrada?',
      vulnerabilityOptions: [
        {
          id: 'v_db_1',
          text: 'Gravações expostas sem criptografia E2E, links compartilháveis públicos e ausência de 2FA.',
          isCorrect: true,
          feedback:
            'Correto! Imagens de entrada revelam exatamente quando moradores chegam e saem da casa.',
        },
        {
          id: 'v_db_2',
          text: 'O toque musical da campainha está configurado em volume médio.',
          isCorrect: false,
          feedback:
            'Incorreto. O som do toque não compromete dados nem gravações na nuvem.',
        },
        {
          id: 'v_db_3',
          text: 'A campainha está instalada ao lado direito da porta de madeira.',
          isCorrect: false,
          feedback:
            'Incorreto. O risco está na proteção da conta em nuvem e dos vídeos capturados.',
        },
      ],
      threat: {
        id: 'threat_doorbell',
        title: 'Monitoramento da rotina de entrada e vazamento de vídeos',
        description:
          'Pessoas não autorizadas podem acessar os vídeos e observar horários de ausência ou entregas na porta.',
        severity: 'MÉDIO',
        consequences:
          'Violação da privacidade dos moradores e visitantes, além de facilitar planejamento de invasões físicas.',
        recommendation:
          'Ativar criptografia ponta a ponta na nuvem, desativar links públicos, definir zonas de privacidade e habilitar 2FA.',
        recognitionQuestion:
          'Qual ameaça decorre da exposição dos vídeos e conta da Campainha Inteligente?',
        recognitionOptions: [
          {
            id: 't_db_1',
            text: 'Vazamento de gravações de visitantes e exposição dos horários em que a residência fica vazia.',
            isCorrect: true,
            feedback:
              'Certo! A campainha registra toda a movimentação da porta principal e precisa de proteção rígida.',
          },
          {
            id: 't_db_2',
            text: 'Queima automática do motor da geladeira.',
            isCorrect: false,
            feedback:
              'Incorreto. O impacto é de privacidade e segurança física da entrada.',
          },
          {
            id: 't_db_3',
            text: 'Desativação do sinal de TV aberta na sala.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça envolve gravações em nuvem e acesso indevido à conta.',
          },
        ],
      },
      protectionQuestion:
        'Qual ação protege corretamente a Campainha Inteligente?',
      protectionOptions: [
        {
          id: 'p_db_a',
          label: 'A',
          text: 'Ativar criptografia ponta a ponta, revogar acessos antigos, habilitar 2FA e configurar zonas de privacidade.',
          quality: 'correct',
          feedback:
            'Excelente! Você protegeu os vídeos na nuvem, bloqueou intrusos na conta e respeitou a privacidade externa.',
        },
        {
          id: 'p_db_b',
          label: 'B',
          text: 'Apenas trocar o toque da campainha mantendo a nuvem sem criptografia e sem 2FA.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Alterar o áudio não protege a conta nem os vídeos armazenados.',
        },
        {
          id: 'p_db_c',
          label: 'C',
          text: 'Apagar o histórico de ontem manualmente, mas deixar links públicos e conta sem 2FA.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Remove vídeos antigos, mas novas gravações continuam expostas.',
          residualRisk: 'Links públicos e ausência de 2FA permitem novos acessos indevidos.',
        },
        {
          id: 'p_db_d',
          label: 'D',
          text: 'Publicar o link ao vivo da campainha para que qualquer vizinho acompanhe a porta.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Tornar o feed público expõe ainda mais a segurança da casa.',
        },
      ],
    },
    hintProgressive: [
      'Verifique como os vídeos são armazenados na nuvem e se a conta usa verificação em duas etapas.',
      'A proteção ideal criptografa as gravações, revoga dispositivos estranhos e aplica 2FA.',
    ],
  },

  {
    id: 'alarm_hallway',
    name: 'Central de Alarme Conectada',
    shortName: 'Central Alarme',
    roomId: 'hallway',
    kind: 'alarm_hub',
    position: [0.38, 1.48, 4.88],
    rotationY: -Math.PI / 2,
    connectionType: 'Wi-Fi + GSM Backup',
    ipAddress: '192.168.1.15',
    firmwareVersion: 'v3.1.0',
    protocol: 'HTTP / Cloud API sem MFA',
    summary:
      'Painel central que arma e desarma sensores de intrusão, sirene e alertas de emergência.',
    isInitiallyVulnerable: true,
    maxPoints: 50,
    securityWeight: 8,
    clues: [
      {
        id: 'alm_clue_1',
        label: 'Autenticação Remota',
        value: 'Desarme do alarme via nuvem permitido com senha única fraca e sem confirmação 2FA.',
        suspicious: true,
      },
      {
        id: 'alm_clue_2',
        label: 'Comunicação do Painel',
        value: 'Integração com nuvem utiliza API legada sem validação estrita de certificado TLS.',
        suspicious: true,
      },
      {
        id: 'alm_clue_3',
        label: 'Logs de Auditoria',
        value: 'Notificações de desarme silenciadas no aplicativo principal.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Central de alarme exposta sem autenticação forte e TLS',
      vulnerabilityCategory: 'Segurança Crítica de Sistema',
      vulnerabilityQuestion:
        'Qual falha crítica foi detectada na Central de Alarme Conectada?',
      vulnerabilityOptions: [
        {
          id: 'v_alm_1',
          text: 'Controle remoto de desarme sem 2FA, senha fraca e comunicação sem validação TLS estrita.',
          isCorrect: true,
          feedback:
            'Correto! Um alarme fácil de desarmar pela nuvem anula a defesa perimetral da residência.',
        },
        {
          id: 'v_alm_2',
          text: 'A central possui bateria de backup para quedas de energia.',
          isCorrect: false,
          feedback:
            'Incorreto. Bateria interna é um recurso essencial de disponibilidade e segurança física.',
        },
        {
          id: 'v_alm_3',
          text: 'A tela mostra o horário local no formato 24 horas.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está na autenticação e criptografia da conta em nuvem.',
        },
      ],
      threat: {
        id: 'threat_alarm_hallway',
        title: 'Desativação silenciosa e não autorizada do alarme residencial',
        description:
          'Atacantes podem invadir a conta na nuvem ou interceptar comandos para desarmar todos os sensores sem gerar alerta.',
        severity: 'ALTO',
        consequences:
          'Desativação completa da proteção contra intrusão e entrada sem acionamento de sirene ou aviso aos moradores.',
        recommendation:
          'Exigir MFA e senha forte no painel/app, atualizar firmware para TLS validado e reativar alertas de desarme.',
        recognitionQuestion:
          'Qual é a ameaça principal dessa brecha na Central de Alarme?',
        recognitionOptions: [
          {
            id: 't_alm_1',
            text: 'Desarme remoto não autorizado da segurança da casa sem notificar os moradores.',
            isCorrect: true,
            feedback:
              'Exato! Sem MFA e notificações ativas, um invasor pode desligar o alarme silenciosamente.',
          },
          {
            id: 't_alm_2',
            text: 'Aumento da temperatura do chuveiro do banheiro.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça refere-se à desativação indevida do sistema de alarme.',
          },
          {
            id: 't_alm_3',
            text: 'Apagamento automático das receitas salvas na cozinha.',
            isCorrect: false,
            feedback:
              'Incorreto. O impacto crítico recai sobre o sistema de alarme residencial.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige definitivamente a segurança da Central de Alarme?',
      protectionOptions: [
        {
          id: 'p_alm_a',
          label: 'A',
          text: 'Aplicar senha forte, ativar MFA para desarme remoto, habilitar TLS atualizado e reativar alertas em tempo real.',
          quality: 'correct',
          feedback:
            'Perfeito! Autenticação multifator, transporte seguro e alertas ativos blindam o coração do alarme.',
        },
        {
          id: 'p_alm_b',
          label: 'B',
          text: 'Desativar apenas o som da sirene para não acordar os vizinhos.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso elimina a reação sonora sem resolver a vulnerabilidade de acesso.',
        },
        {
          id: 'p_alm_c',
          label: 'C',
          text: 'Trocar a senha para outra um pouco maior, mantendo notificações desligadas e sem MFA.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Melhora a senha, mas sem MFA nem alertas de desarme o monitoramento segue frágil.',
          residualRisk: 'Ausência de MFA e alertas silenciados dificultam detectar invasões na conta.',
        },
        {
          id: 'p_alm_d',
          label: 'D',
          text: 'Compartilhar o código mestre único com entregadores e prestadores temporários.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Sempre use códigos temporários individuais ou não exponha a senha mestre.',
        },
      ],
    },
    hintProgressive: [
      'Observe o que é necessário para desarmar o alarme pela internet e como os avisos chegam ao celular.',
      'Combine senha robusta, MFA, protocolo TLS validado e alertas imediatos de alteração de estado.',
    ],
  },

  // =========================================================================
  // 3. QUARTO PRINCIPAL (3 dispositivos)
  // =========================================================================
  {
    id: 'lighting_bedroom',
    name: 'Iluminação Inteligente do Quarto',
    shortName: 'Smart Lighting',
    roomId: 'bedroom',
    kind: 'lighting',
    position: [-5.0, 0.84, -4.45],
    connectionType: 'Wi-Fi 2.4 GHz + BLE',
    ipAddress: '192.168.1.44',
    firmwareVersion: 'v1.0.2 (Desatualizado)',
    protocol: 'HTTP / CoAP sem assinatura',
    summary:
      'Conjunto de luminárias dimerizáveis controladas por aplicativo e rotinas automáticas de sono.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 5,
    clues: [
      {
        id: 'light_clue_1',
        label: 'Versão de Firmware',
        value: 'Firmware v1.0.2 com 2 anos sem atualização; correção v2.3.0 disponível.',
        suspicious: true,
      },
      {
        id: 'light_clue_2',
        label: 'Boletim Técnico',
        value: 'Falha conhecida (CVE simulada) permite extrair a chave do Wi-Fi via pacotes malformados.',
        suspicious: true,
      },
      {
        id: 'light_clue_3',
        label: 'Atualização Automática',
        value: 'Opção de atualização automática desativada no painel do controlador.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Atualização de segurança (firmware) pendente',
      vulnerabilityCategory: 'Gestão de Atualizações',
      vulnerabilityQuestion:
        'Qual é a vulnerabilidade encontrada no sistema de Iluminação Inteligente?',
      vulnerabilityOptions: [
        {
          id: 'v_lt_1',
          text: 'Firmware desatualizado com falha conhecida pendente de correção.',
          isCorrect: true,
          feedback:
            'Correto! Lâmpadas e controladores desatualizados podem servir de ponte para atacar a rede doméstica.',
        },
        {
          id: 'v_lt_2',
          text: 'As lâmpadas usam temperatura de cor quente em vez de branca fria.',
          isCorrect: false,
          feedback:
            'Incorreto. A tonalidade da luz é uma preferência estética, não uma falha de segurança.',
        },
        {
          id: 'v_lt_3',
          text: 'O quarto possui duas luminárias sincronizadas no mesmo grupo.',
          isCorrect: false,
          feedback:
            'Incorreto. Agrupamento de luzes é uma funcionalidade normal da automação.',
        },
      ],
      threat: {
        id: 'threat_lighting_bedroom',
        title: 'Exploração de falha conhecida para acesso à rede local',
        description:
          'Brechas em firmwares antigos permitem que atacantes enviem comandos indevidos ou capturem credenciais armazenadas no chip Wi-Fi.',
        severity: 'MÉDIO',
        consequences:
          'Comprometimento da senha do Wi-Fi salva no dispositivo, controle indevido da iluminação e pivoteamento na rede.',
        recommendation:
          'Aplicar o firmware oficial mais recente e ativar verificações automáticas de segurança.',
        recognitionQuestion:
          'Por que ignorar atualizações de firmware em lâmpadas inteligentes representa uma ameaça real?',
        recognitionOptions: [
          {
            id: 't_lt_1',
            text: 'Falhas conhecidas são exploradas para controlar o aparelho e até extrair credenciais da rede Wi-Fi.',
            isCorrect: true,
            feedback:
              'Correto! Mesmo um dispositivo simples como uma lâmpada possui um minicomputador ligado à sua rede.',
          },
          {
            id: 't_lt_2',
            text: 'As lâmpadas podem queimar o colchão instantaneamente via aplicativo.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é a exploração de software para acesso indevido à rede e ao controle do dispositivo.',
          },
          {
            id: 't_lt_3',
            text: 'O aplicativo deixa de exibir a previsão do tempo.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça é o aproveitamento de falhas de segurança já documentadas.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida de proteção resolve o problema da Iluminação Inteligente?',
      protectionOptions: [
        {
          id: 'p_lt_a',
          label: 'A',
          text: 'Aplicar a atualização oficial de firmware v2.3.0 e habilitar atualizações automáticas.',
          quality: 'correct',
          feedback:
            'Excelente! Manter o firmware atualizado fecha vulnerabilidades já conhecidas e protege a rede.',
        },
        {
          id: 'p_lt_b',
          label: 'B',
          text: 'Baixar um firmware modificado de um fórum desconhecido para liberar cores extras.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Firmwares não oficiais podem conter malware oculto e comprometer toda a casa.',
        },
        {
          id: 'p_lt_c',
          label: 'C',
          text: 'Apenas reduzir o brilho máximo para 50% mantendo o firmware antigo.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Ajustar o brilho não corrige a falha de código presente no firmware v1.0.2.',
        },
        {
          id: 'p_lt_d',
          label: 'D',
          text: 'Remover a lâmpada da automação e usar apenas o interruptor comum sem atualizar.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Evita exposição enquanto desligada, mas perde a automação e mantém o chip vulnerável se religado.',
          residualRisk: 'Se alguém religar o interruptor, o firmware antigo volta a ficar exposto na rede.',
        },
      ],
    },
    hintProgressive: [
      'Confira a data e a versão do firmware instalada na luminária.',
      'Atualizações de segurança oficiais existem justamente para corrigir falhas descobertas após a fabricação.',
    ],
  },

  {
    id: 'thermostat_bedroom',
    name: 'Termostato Inteligente',
    shortName: 'Smart Thermostat',
    roomId: 'bedroom',
    kind: 'thermostat',
    position: [0.39, 1.52, -1.95],
    rotationY: -Math.PI / 2,
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.51',
    firmwareVersion: 'v3.2.0',
    protocol: 'HTTP (porta 80 sem criptografia)',
    summary:
      'Controlador digital de climatização com painel web local para ajuste de temperatura e horários.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 5,
    clues: [
      {
        id: 'therm_clue_1',
        label: 'Interface de Gerenciamento',
        value: 'Painel web acessível via HTTP sem senha de sessão nem criptografia TLS.',
        suspicious: true,
      },
      {
        id: 'therm_clue_2',
        label: 'Exposição de Rede',
        value: 'Acesso remoto habilitado diretamente para qualquer IP sem VPN ou lista de permissões.',
        suspicious: true,
      },
      {
        id: 'therm_clue_3',
        label: 'Registro de Alterações',
        value: 'Horários de presença da família visíveis publicamente na página de status.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Configuração de acesso inadequada e comunicação sem criptografia',
      vulnerabilityCategory: 'Controle de Acesso e Transporte',
      vulnerabilityQuestion:
        'Qual é o problema central identificado no Termostato Inteligente?',
      vulnerabilityOptions: [
        {
          id: 'v_th_1',
          text: 'Acesso administrativo exposto sem autenticação e tráfego em texto claro (HTTP).',
          isCorrect: true,
          feedback:
            'Correto! Sem autenticação e sem HTTPS, qualquer invasor pode ler horários da família e alterar ajustes.',
        },
        {
          id: 'v_th_2',
          text: 'O visor mostra a temperatura em graus Celsius em vez de Fahrenheit.',
          isCorrect: false,
          feedback:
            'Incorreto. Unidade de medida não interfere na segurança do acesso.',
        },
        {
          id: 'v_th_3',
          text: 'O termostato está fixado a 1,55m de altura na parede.',
          isCorrect: false,
          feedback:
            'Incorreto. A altura de instalação é ergonômica, não uma falha digital.',
        },
      ],
      threat: {
        id: 'threat_thermostat_bedroom',
        title: 'Manipulação remota e vazamento da rotina dos moradores',
        description:
          'Invasores podem descobrir quando a casa está vazia pela agenda térmica e alterar o equipamento sem autorização.',
        severity: 'MÉDIO',
        consequences:
          'Exposição dos horários em que os moradores estão fora, consumo excessivo de energia e possível ponto de entrada na rede.',
        recommendation:
          'Restringir o painel apenas à rede local, exigir login autenticado e habilitar comunicação criptografada (HTTPS).',
        recognitionQuestion:
          'Que ameaça surge quando o painel do termostato fica acessível sem proteção?',
        recognitionOptions: [
          {
            id: 't_th_1',
            text: 'Descoberta da rotina da casa (quando está vazia), manipulação da climatização e captura de dados em HTTP.',
            isCorrect: true,
            feedback:
              'Muito bem! Dados de sensores e agendas revelam hábitos valiosos para invasores físicos e digitais.',
          },
          {
            id: 't_th_2',
            text: 'Transformação do aparelho em antena de rádio AM.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco real é acesso não autorizado e vazamento de hábitos e dados.',
          },
          {
            id: 't_th_3',
            text: 'Apagamento automático das fotos da geladeira.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça refere-se ao controle do termostato e dados de presença.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige adequadamente o acesso e o gerenciamento do Termostato?',
      protectionOptions: [
        {
          id: 'p_th_a',
          label: 'A',
          text: 'Desabilitar o acesso remoto direto, exigir autenticação forte e ativar HTTPS/TLS no gerenciamento.',
          quality: 'correct',
          feedback:
            'Correto! Restringir o alcance, exigir login e criptografar a comunicação protege dados e controle.',
        },
        {
          id: 'p_th_b',
          label: 'B',
          text: 'Trocar apenas a porta HTTP de 80 para 8088 sem colocar senha nem HTTPS.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Mudar a porta apenas dificulta achados triviais, mas varreduras automáticas encontram a porta e ela continua sem senha.',
          residualRisk: 'Comunicação segue sem criptografia e sem controle de acesso.',
        },
        {
          id: 'p_th_c',
          label: 'C',
          text: 'Deixar o painel aberto para facilitar a visita técnica caso alguém precise ajustar da rua.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Painel aberto na internet é convite para acesso não autorizado.',
        },
        {
          id: 'p_th_d',
          label: 'D',
          text: 'Fixar a temperatura em 22 °C colando fita adesiva sobre a tela.',
          quality: 'incorrect',
          feedback:
            'Incorreta! O acesso digital pela rede continuaria totalmente aberto.',
        },
      ],
    },
    hintProgressive: [
      'Observe o protocolo usado pelo painel (HTTP sem o "S") e quem consegue abrir a página de status.',
      'Combine três camadas: restringir acesso externo, exigir login e usar comunicação criptografada (HTTPS).',
    ],
  },

  {
    id: 'assistant_bedroom',
    name: 'Assistente de Cabeceira',
    shortName: 'Assistente Quarto',
    roomId: 'bedroom',
    kind: 'assistant',
    position: [-2.1, 0.7, -4.45],
    connectionType: 'Wi-Fi 5 GHz (WPA3)',
    ipAddress: '192.168.50.28',
    firmwareVersion: 'v5.4.1 (Atualizado)',
    protocol: 'TLS 1.3 + MFA',
    summary:
      'Despertador e assistente compacto de cabeceira com trava física de privacidade no microfone.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'ast_clue_1',
        label: 'Autenticação da Conta',
        value: 'Conta vinculada protegida com autenticação multifator (MFA) ativa.',
        suspicious: false,
      },
      {
        id: 'ast_clue_2',
        label: 'Controles de Privacidade',
        value: 'Compras por voz desativadas e chave física de corte de microfone testada.',
        suspicious: false,
      },
      {
        id: 'ast_clue_3',
        label: 'Comunicação',
        value: 'Conexão criptografada via TLS 1.3 e atualizações automáticas habilitadas.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Assistente de Cabeceira validado com segurança: MFA ativo, TLS 1.3 e privacidade restrita.',
    hintProgressive: [
      'Verifique se há indícios de erro, permissões exageradas ou protocolo desatualizado neste equipamento.',
      'Este assistente já segue boas práticas de privacidade e autenticação forte.',
    ],
  },

  // =========================================================================
  // 4. COZINHA (3 dispositivos)
  // =========================================================================
  {
    id: 'fridge_kitchen',
    name: 'Geladeira Inteligente',
    shortName: 'Geladeira Smart',
    roomId: 'kitchen',
    kind: 'fridge',
    position: [1.0, 1.08, -4.35],
    rotationY: Math.PI / 2,
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.63',
    firmwareVersion: 'v3.0.4',
    protocol: 'HTTPS / Cloud Sync',
    summary:
      'Refrigerador conectado com tela frontal, controle de estoque de alimentos e integração com aplicativos.',
    isInitiallyVulnerable: true,
    maxPoints: 25,
    securityWeight: 4,
    clues: [
      {
        id: 'frg_clue_1',
        label: 'Sincronização de Conta',
        value: 'E-mail pessoal, calendário completo da família e localização salvos sem necessidade na tela.',
        suspicious: true,
      },
      {
        id: 'frg_clue_2',
        label: 'Apps de Terceiros',
        value: 'Permissão concedida a 3 aplicativos promocionais para ler lista de compras e dados da conta.',
        suspicious: true,
      },
      {
        id: 'frg_clue_3',
        label: 'Sessão na Tela',
        value: 'Conta principal permanece logada sem bloqueio de perfil mesmo para visitantes.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Equipamento conectado com permissões e dados desnecessários',
      vulnerabilityCategory: 'Exposição de Dados e Menor Privilégio',
      vulnerabilityQuestion:
        'Qual vulnerabilidade foi detectada na Geladeira Inteligente?',
      vulnerabilityOptions: [
        {
          id: 'v_frg_1',
          text: 'Excesso de permissões e dados pessoais sincronizados sem necessidade para a função do aparelho.',
          isCorrect: true,
          feedback:
            'Correto! Uma geladeira não precisa de calendário pessoal completo nem compartilhar dados com apps promocionais.',
        },
        {
          id: 'v_frg_2',
          text: 'A temperatura do congelador está configurada em -18 °C.',
          isCorrect: false,
          feedback:
            'Incorreto. -18 °C é a faixa térmica normal de conservação de alimentos.',
        },
        {
          id: 'v_frg_3',
          text: 'A porta possui acabamento em aço inoxidável escovado.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está nos dados e permissões digitais concedidos ao aparelho.',
        },
      ],
      threat: {
        id: 'threat_fridge_kitchen',
        title: 'Exposição indevida de dados pessoais e hábitos da família',
        description:
          'Se a conta do fabricante ou um app parceiro sofrer vazamento, informações pessoais armazenadas na geladeira são expostas.',
        severity: 'BAIXO',
        consequences:
          'Coleta abusiva de dados, recebimento de spam/phishing direcionado e exposição de compromissos da família.',
        recommendation:
          'Revogar permissões desnecessárias, desvincular e-mail/calendário pessoal e manter apenas funções essenciais.',
        recognitionQuestion:
          'Qual é o risco associado a manter permissões desnecessárias na Geladeira Inteligente?',
        recognitionOptions: [
          {
            id: 't_frg_1',
            text: 'Exposição de informações pessoais, rotina da casa e compartilhamento indevido com terceiros.',
            isCorrect: true,
            feedback:
              'Certo! Reduzir a superfície de dados expostos diminui muito o impacto de eventuais vazamentos.',
          },
          {
            id: 't_frg_2',
            text: 'Congelamento dos cabos de fibra óptica da rua.',
            isCorrect: false,
            feedback:
              'Incorreto. Trata-se de um risco de privacidade e exposição de dados pessoais.',
          },
          {
            id: 't_frg_3',
            text: 'Inversão da polaridade elétrica da cozinha.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco está nos dados pessoais sincronizados sem necessidade.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida de proteção é mais adequada para a Geladeira Inteligente?',
      protectionOptions: [
        {
          id: 'p_frg_a',
          label: 'A',
          text: 'Revogar permissões de apps de terceiros, remover sincronização de e-mail/calendário e usar conta dedicada.',
          quality: 'correct',
          feedback:
            'Excelente! A geladeira mantém sua função útil de refrigeração/lista sem expor dados sensíveis da família.',
        },
        {
          id: 'p_frg_b',
          label: 'B',
          text: 'Apenas diminuir o brilho da tela frontal mantendo todos os aplicativos conectados.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Os aplicativos continuam acessando seus dados em segundo plano pela nuvem.',
        },
        {
          id: 'p_frg_c',
          label: 'C',
          text: 'Desconectar a geladeira do Wi-Fi sem revogar os tokens dos aplicativos já autorizados na nuvem.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Interrompe novos envios do aparelho, mas os apps terceiros ainda mantêm permissões antigas na conta.',
          residualRisk: 'Tokens de aplicativos de terceiros continuam válidos na conta em nuvem.',
        },
        {
          id: 'p_frg_d',
          label: 'D',
          text: 'Cadastrar documentos bancários nas notas da tela da geladeira para lembrar de pagar contas.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Nunca armazene dados financeiros ou sensíveis em painéis compartilhados de eletrodomésticos.',
        },
      ],
    },
    hintProgressive: [
      'Pergunte-se: uma geladeira realmente precisa ler seu calendário completo, localização e compartilhar dados com apps promocionais?',
      'A melhor resposta remove permissões excessivas e separa dados pessoais sensíveis do eletrodoméstico.',
    ],
  },

  {
    id: 'smoke_kitchen',
    name: 'Sensor de Fumaça Conectado',
    shortName: 'Sensor Fumaça',
    roomId: 'kitchen',
    kind: 'smoke_sensor',
    position: [2.7, 2.75, -2.35],
    connectionType: 'Zigbee Criptografado',
    ipAddress: 'Nó Zigbee #04',
    firmwareVersion: 'v2.8.0 (Assinado)',
    protocol: 'Zigbee 3.0 AES-128',
    summary:
      'Detector inteligente de fumaça e incêndio com alertas em tempo real e comunicação cifrada.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'smk_clue_1',
        label: 'Criptografia de Rádio',
        value: 'Tráfego protegido com chave AES-128 exclusiva trocada durante pareamento seguro.',
        suspicious: false,
      },
      {
        id: 'smk_clue_2',
        label: 'Integridade do Firmware',
        value: 'Assinatura digital verificada; última checagem automática realizada hoje.',
        suspicious: false,
      },
      {
        id: 'smk_clue_3',
        label: 'Superfície de Ataque',
        value: 'Sem portas abertas para a internet externa; reporta apenas ao hub autenticado.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Sensor de Fumaça íntegro e protegido: criptografia AES-128 ativa e firmware assinado.',
    hintProgressive: [
      'Analise se o sensor usa criptografia robusta e se possui alguma porta aberta desnecessariamente.',
      'Os registros confirmam comunicação Zigbee cifrada e firmware atualizado: um exemplo de dispositivo seguro.',
    ],
  },

  {
    id: 'co_kitchen',
    name: 'Detector de Monóxido e Gás',
    shortName: 'Detector Gás/CO',
    roomId: 'kitchen',
    kind: 'co_sensor',
    position: [4.1, 2.75, -2.35],
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.68',
    firmwareVersion: 'v1.1.0 (Sem checagem)',
    protocol: 'HTTP sem heartbeat',
    summary:
      'Detector de vazamento de gás e monóxido de carbono próximo ao fogão e torre de forno.',
    isInitiallyVulnerable: true,
    maxPoints: 30,
    securityWeight: 4,
    clues: [
      {
        id: 'co_clue_1',
        label: 'Estado de Manutenção',
        value: 'Auto-teste mensal falhou há 6 meses; bateria de reserva em 9% sem aviso no celular.',
        suspicious: true,
      },
      {
        id: 'co_clue_2',
        label: 'Notificações Push',
        value: 'Canal de alertas críticos desligado após troca de senha da conta em nuvem.',
        suspicious: true,
      },
      {
        id: 'co_clue_3',
        label: 'Monitoramento de Disponibilidade',
        value: 'Sem verificação periódica de vida (heartbeat) com a central de segurança.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Falha de manutenção e alertas desconectados em detector crítico',
      vulnerabilityCategory: 'Disponibilidade e Manutenção Preventiva',
      vulnerabilityQuestion:
        'Qual é o problema encontrado no Detector de Monóxido e Gás?',
      vulnerabilityOptions: [
        {
          id: 'v_co_1',
          text: 'Falta de manutenção, bateria crítica, auto-teste vencido e canal de alerta desconectado.',
          isCorrect: true,
          feedback:
            'Correto! Segurança também envolve disponibilidade: um sensor offline ou sem alertas falha na hora crítica.',
        },
        {
          id: 'v_co_2',
          text: 'O sensor foi fixado no teto acima da ilha da cozinha.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está na falta de checagem periódica e na desconexão dos alertas.',
        },
        {
          id: 'v_co_3',
          text: 'O LED indicador emite luz azul discreta.',
          isCorrect: false,
          feedback:
            'Incorreto. A falha crítica é operacional e de comunicação de alertas.',
        },
      ],
      threat: {
        id: 'threat_co_kitchen',
        title: 'Ausência de alerta em caso de vazamento de gás ou incêndio',
        description:
          'Se houver vazamento de gás ou fumaça, a bateria pode falhar ou o aviso nunca chegar aos moradores.',
        severity: 'MÉDIO',
        consequences:
          'Risco grave à vida e ao patrimônio por falha silenciosa do equipamento de detecção.',
        recommendation:
          'Substituir bateria/calibrar sensor, atualizar firmware, reconectar alertas críticos e ativar checagem de heartbeat.',
        recognitionQuestion:
          'Qual consequência decorre de um detector de gás sem manutenção e sem alertas ativos?',
        recognitionOptions: [
          {
            id: 't_co_1',
            text: 'Falha silenciosa durante um vazamento real, deixando os moradores sem aviso de emergência.',
            isCorrect: true,
            feedback:
              'Exato! Em dispositivos de segurança física, disponibilidade e integridade de alertas são vitais.',
          },
          {
            id: 't_co_2',
            text: 'Desconfiguração do controle remoto da televisão do quarto.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça envolve ausência de alerta durante incidentes domésticos.',
          },
          {
            id: 't_co_3',
            text: 'Lentidão na irrigação do jardim externo.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é não detectar emergências na cozinha.',
          },
        ],
      },
      protectionQuestion:
        'Qual conjunto de medidas garante a confiabilidade do Detector de Monóxido e Gás?',
      protectionOptions: [
        {
          id: 'p_co_a',
          label: 'A',
          text: 'Trocar a bateria, executar auto-teste, atualizar firmware, reconectar alertas críticos e ativar monitoramento de status.',
          quality: 'correct',
          feedback:
            'Perfeito! Manutenção em dia + heartbeat garantem que qualquer falha ou gás seja reportado na hora.',
        },
        {
          id: 'p_co_b',
          label: 'B',
          text: 'Apenas silenciar os avisos de bateria fraca para o apito não incomodar.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Ignorar avisos de bateria deixa o sensor inoperante em poucos dias.',
        },
        {
          id: 'p_co_c',
          label: 'C',
          text: 'Trocar a bateria, mas deixar as notificações no celular e o heartbeat desativados.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. O aparelho volta a ligar, porém os moradores não receberão alertas fora da cozinha.',
          residualRisk: 'Alertas remotos continuam desconectados.',
        },
        {
          id: 'p_co_d',
          label: 'D',
          text: 'Cobrir o sensor com fita isolante para evitar alarmes falsos ao cozinhar.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Obstruir o sensor impede completamente a detecção de gases.',
        },
      ],
    },
    hintProgressive: [
      'Verifique o status da bateria, o auto-teste periódico e se os alertas no aplicativo estão realmente conectados.',
      'Garantir disponibilidade exige bateria saudável, firmware atualizado, auto-teste e heartbeat ativo.',
    ],
  },

  // =========================================================================
  // 5. SALA DE JANTAR (2 dispositivos)
  // =========================================================================
  {
    id: 'lighting_dining',
    name: 'Iluminação Inteligente da Sala de Jantar',
    shortName: 'Luz Jantar',
    roomId: 'dining_room',
    kind: 'lighting',
    position: [9.15, 1.08, -4.52],
    connectionType: 'Zigbee Hub Legado',
    ipAddress: 'Nó Zigbee #08',
    firmwareVersion: 'v1.0.9 (Legado)',
    protocol: 'Zigbee sem chave de rede rotativa',
    summary:
      'Luminária pendente e cenas de iluminação do aparador conectadas ao controlador Zigbee da sala de jantar.',
    isInitiallyVulnerable: true,
    maxPoints: 25,
    securityWeight: 4,
    clues: [
      {
        id: 'ld_clue_1',
        label: 'Chave de Pareamento',
        value: 'Controlador utiliza chave de enlace padrão de fábrica (ZLL Default Key) compartilhada.',
        suspicious: true,
      },
      {
        id: 'ld_clue_2',
        label: 'Modo de Inclusão',
        value: 'Permit-Join (aceitação de novos dispositivos) deixado aberto permanentemente.',
        suspicious: true,
      },
      {
        id: 'ld_clue_3',
        label: 'Versão de Software',
        value: 'Correção Zigbee 3.0 disponível para exigir código de instalação único.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Pareamento aberto e chave padrão na rede de iluminação',
      vulnerabilityCategory: 'Segurança de Rádio e IoT Local',
      vulnerabilityQuestion:
        'O que torna o sistema de iluminação da Sala de Jantar vulnerável?',
      vulnerabilityOptions: [
        {
          id: 'v_ld_1',
          text: 'Chave padrão de fábrica e modo de pareamento aberto (Permit-Join) permitindo inclusão indevida.',
          isCorrect: true,
          feedback:
            'Correto! Com o pareamento aberto e chave conhecida, qualquer dispositivo próximo pode entrar na malha Zigbee.',
        },
        {
          id: 'v_ld_2',
          text: 'O pendente está centralizado exatamente sobre a mesa de 6 lugares.',
          isCorrect: false,
          feedback:
            'Incorreto. Posicionamento decorativo não representa falha de segurança.',
        },
        {
          id: 'v_ld_3',
          text: 'As lâmpadas LED têm consumo de 9W cada.',
          isCorrect: false,
          feedback:
            'Incorreto. Eficiência energética não é vulnerabilidade cibernética.',
        },
      ],
      threat: {
        id: 'threat_lighting_dining',
        title: 'Injeção de dispositivos maliciosos na malha sem fio local',
        description:
          'Um atacante próximo à casa pode parear equipamentos não autorizados ou sequestrar lâmpadas via Touchlink/Permit-Join.',
        severity: 'BAIXO',
        consequences:
          'Controle indevido da iluminação, instabilidade na malha Zigbee e possível salto para sensores conectados ao mesmo hub.',
        recommendation:
          'Atualizar para Zigbee 3.0 com chave exclusiva, desativar Permit-Join após configuração e exigir install code.',
        recognitionQuestion:
          'Qual é a ameaça de manter o modo Permit-Join aberto com chave padrão?',
        recognitionOptions: [
          {
            id: 't_ld_1',
            text: 'Pareamento não autorizado de aparelhos na malha local e controle indevido das luzes.',
            isCorrect: true,
            feedback:
              'Certo! O modo de pareamento só deve ficar aberto por poucos minutos durante a instalação.',
          },
          {
            id: 't_ld_2',
            text: 'Quebra dos pratos de porcelana sobre a mesa.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça é lógica sobre a rede sem fio local.',
          },
          {
            id: 't_ld_3',
            text: 'Bloqueio do portão da garagem por falta de tinta.',
            isCorrect: false,
            feedback:
              'Incorreto. Trata-se de acesso não autorizado à rede de automação.',
          },
        ],
      },
      protectionQuestion:
        'Qual ação corrige a segurança da iluminação da Sala de Jantar?',
      protectionOptions: [
        {
          id: 'p_ld_a',
          label: 'A',
          text: 'Desativar o Permit-Join permanente, atualizar o firmware para Zigbee 3.0 e regenerar chaves exclusivas.',
          quality: 'correct',
          feedback:
            'Muito bem! Fechar o pareamento e usar chaves exclusivas protege a rede local contra intrusões.',
        },
        {
          id: 'p_ld_b',
          label: 'B',
          text: 'Trocar o lustre por outro modelo mantendo o mesmo modo de pareamento aberto.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Se o controlador continua aceitando qualquer dispositivo, a brecha persiste.',
        },
        {
          id: 'p_ld_c',
          label: 'C',
          text: 'Apenas desligar o interruptor após o jantar sem atualizar firmware nem fechar o Permit-Join.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Enquanto desligada não responde, mas ao ligar a brecha de pareamento reaparece.',
          residualRisk: 'Chave padrão e pareamento aberto voltam a valer sempre que a luz é ligada.',
        },
        {
          id: 'p_ld_d',
          label: 'D',
          text: 'Conectar o controlador diretamente sem senha no Wi-Fi da rua.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso ampliaria drasticamente a exposição da automação.',
        },
      ],
    },
    hintProgressive: [
      'Repare se a rede Zigbee aceita novos dispositivos automaticamente o tempo todo e qual chave usa.',
      'Feche o modo de pareamento (Permit-Join) e atualize para chaves exclusivas Zigbee 3.0.',
    ],
  },

  {
    id: 'presence_dining',
    name: 'Sensor de Presença da Sala de Jantar',
    shortName: 'Sensor Presença',
    roomId: 'dining_room',
    kind: 'sensor_presence',
    position: [11.07, 2.1, -0.55],
    rotationY: -Math.PI / 2,
    connectionType: 'Thread / Matter Local',
    ipAddress: 'fd00::12 (Thread)',
    firmwareVersion: 'v3.2.1 (Assinado)',
    protocol: 'Matter over Thread (AES-128)',
    summary:
      'Sensor de presença por radar mmWave que aciona iluminação de conforto apenas localmente, sem envio de dados externos.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'pd_clue_1',
        label: 'Processamento Local',
        value: 'Detecção processada 100% no dispositivo; nenhum dado de presença enviado para nuvens externas.',
        suspicious: false,
      },
      {
        id: 'pd_clue_2',
        label: 'Criptografia',
        value: 'Comunicação Matter/Thread cifrada ponta a ponta com certificado válido.',
        suspicious: false,
      },
      {
        id: 'pd_clue_3',
        label: 'Atualizações',
        value: 'Firmware v3.2.1 assinado e sem vulnerabilidades conhecidas.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Sensor de Presença validado com segurança: processamento local, Thread criptografado e zero telemetria externa.',
    hintProgressive: [
      'Confira se este sensor envia dados de presença para servidores externos ou se opera com criptografia local.',
      'Este equipamento segue privacidade por design e criptografia Matter/Thread segura.',
    ],
  },

  // =========================================================================
  // 6. ESCRITÓRIO (2 dispositivos)
  // =========================================================================
  {
    id: 'pc_office',
    name: 'Estação de Trabalho (PC Dual-Monitor)',
    shortName: 'PC Escritório',
    roomId: 'office',
    kind: 'pc_workstation',
    position: [-9.05, 0.82, 1.95],
    connectionType: 'Ethernet + Wi-Fi 6',
    ipAddress: '192.168.1.102',
    firmwareVersion: 'OS Build 22621 (Desatualizado)',
    protocol: 'RDP Porta 3389 / SMBv1',
    summary:
      'Computador principal de trabalho remoto com acesso a documentos financeiros, e-mails e administração da casa.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 7,
    clues: [
      {
        id: 'pc_clue_1',
        label: 'Atualizações do Sistema',
        value: '14 patches críticos de segurança do sistema operacional e navegador pendentes há 5 meses.',
        suspicious: true,
      },
      {
        id: 'pc_clue_2',
        label: 'Serviços Expostos',
        value: 'Área de Trabalho Remota (RDP 3389) e compartilhamento legado SMBv1 ativos na rede.',
        suspicious: true,
      },
      {
        id: 'pc_clue_3',
        label: 'Firewall Local',
        value: 'Firewall do sistema desabilitado temporariamente durante teste de impressora e nunca reativado.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Computador desatualizado com serviços remotos e firewall desativado',
      vulnerabilityCategory: 'Segurança de Endpoint e Atualizações',
      vulnerabilityQuestion:
        'Quais falhas comprometem o Computador do Escritório?',
      vulnerabilityOptions: [
        {
          id: 'v_pc_1',
          text: 'Falta de atualizações críticas, serviços legados/RDP expostos e firewall local desligado.',
          isCorrect: true,
          feedback:
            'Correto! PCs sem patches e com RDP/SMBv1 abertos são alvos diretos de ransomware e invasão lateral.',
        },
        {
          id: 'v_pc_2',
          text: 'O computador utiliza dois monitores lado a lado na mesma mesa.',
          isCorrect: false,
          feedback:
            'Incorreto. Dois monitores aumentam produtividade e não trazem vulnerabilidade de rede.',
        },
        {
          id: 'v_pc_3',
          text: 'O teclado e o mouse são modelos ergonômicos sem fio.',
          isCorrect: false,
          feedback:
            'Incorreto. O risco crítico está nas atualizações pendentes, RDP/SMBv1 e firewall desligado.',
        },
      ],
      threat: {
        id: 'threat_pc_office',
        title: 'Infecção por ransomware e roubo de dados confidenciais',
        description:
          'Um invasor ou malware que chegue à rede pode explorar falhas antigas ou o RDP aberto para sequestrar arquivos e credenciais.',
        severity: 'MÉDIO',
        consequences:
          'Sequestro de documentos pessoais/profissionais, furto de senhas salvas e uso do PC para atacar outros dispositivos.',
        recommendation:
          'Instalar todas as atualizações de segurança, reativar o firewall, desabilitar SMBv1 e fechar RDP desnecessário.',
        recognitionQuestion:
          'Qual ameaça grave decorre de manter o PC sem patches, sem firewall e com RDP/SMBv1 ativos?',
        recognitionOptions: [
          {
            id: 't_pc_1',
            text: 'Ataque de ransomware, invasão remota da estação de trabalho e vazamento de arquivos confidenciais.',
            isCorrect: true,
            feedback:
              'Exato! Patches em dia, firewall ativo e desativação de protocolos legados bloqueiam a maioria dos ataques.',
          },
          {
            id: 't_pc_2',
            text: 'Desgaste físico imediato das rodinhas da cadeira ergonômica.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é cibernético contra dados e controle do sistema.',
          },
          {
            id: 't_pc_3',
            text: 'Desativação automática da luminária de mesa.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça envolve invasão do computador e sequestro de dados.',
          },
        ],
      },
      protectionQuestion:
        'Qual conjunto de medidas protege adequadamente o Computador do Escritório?',
      protectionOptions: [
        {
          id: 'p_pc_a',
          label: 'A',
          text: 'Aplicar atualizações críticas, reativar o firewall, desabilitar SMBv1/RDP exposto e habilitar updates automáticos.',
          quality: 'correct',
          feedback:
            'Excelente! Você reduziu drasticamente a superfície de ataque e fechou brechas conhecidas.',
        },
        {
          id: 'p_pc_b',
          label: 'B',
          text: 'Apenas trocar o papel de parede e reiniciar o computador sem instalar atualizações.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Reiniciar sem aplicar patches mantém todas as brechas abertas.',
        },
        {
          id: 'p_pc_c',
          label: 'C',
          text: 'Reativar o firewall, mas deixar o sistema operacional sem atualizações e manter SMBv1 ligado.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. O firewall ajuda, mas falhas no navegador e SMBv1 continuam exploráveis.',
          residualRisk: 'Patches críticos pendentes e protocolo legado SMBv1 permanecem vulneráveis.',
        },
        {
          id: 'p_pc_d',
          label: 'D',
          text: 'Desinstalar o antivírus e liberar a porta 3389 no roteador para acessar de qualquer lan-house.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Expor RDP diretamente na internet quase garante ataques automatizados em minutos.',
        },
      ],
    },
    hintProgressive: [
      'Confira o status das atualizações do sistema operacional, o firewall e as portas RDP/SMBv1.',
      'A defesa de endpoint combina patches em dia, firewall ativo e remoção de serviços legados desnecessários.',
    ],
  },

  {
    id: 'printer_office',
    name: 'Impressora Multifuncional Wi-Fi',
    shortName: 'Impressora Wi-Fi',
    roomId: 'office',
    kind: 'printer',
    position: [-10.76, 0.88, 3.55],
    rotationY: Math.PI / 2,
    connectionType: 'Wi-Fi 5 GHz (VLAN Trabalho)',
    ipAddress: '192.168.50.61',
    firmwareVersion: 'v8.2.4 (Atualizado)',
    protocol: 'IPPS (TLS) + Senha Admin',
    summary:
      'Impressora de escritório configurada com impressão criptografada IPPS, senha administrativa e sem impressão pública em nuvem.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'prt_clue_1',
        label: 'Acesso ao Painel',
        value: 'Painel web protegido com senha exclusiva e acesso restrito à sub-rede do escritório.',
        suspicious: false,
      },
      {
        id: 'prt_clue_2',
        label: 'Protocolo de Impressão',
        value: 'IPPS criptografado via TLS ativo; portas legadas Telnet/FTP desabilitadas.',
        suspicious: false,
      },
      {
        id: 'prt_clue_3',
        label: 'Firmware',
        value: 'Versão v8.2.4 atualizada automaticamente pelo fabricante.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Impressora Wi-Fi validada com segurança: IPPS com TLS, senha forte e protocolos legados desativados.',
    hintProgressive: [
      'Observe se portas legadas (como Telnet/FTP) estão desativadas e se o painel web tem senha.',
      'Todos os controles da impressora estão corretamente aplicados e atualizados.',
    ],
  },

  // =========================================================================
  // 7. BANHEIRO (2 dispositivos)
  // =========================================================================
  {
    id: 'leak_bathroom',
    name: 'Sensor de Vazamento de Água',
    shortName: 'Sensor Vazamento',
    roomId: 'bathroom',
    kind: 'water_leak',
    position: [-7.25, 0.065, -4.35],
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.72',
    firmwareVersion: 'v1.3.0',
    protocol: 'HTTP sem token válido',
    summary:
      'Sensor posicionado próximo à pia e encanamento do banheiro para detectar vazamentos de água.',
    isInitiallyVulnerable: true,
    maxPoints: 30,
    securityWeight: 4,
    clues: [
      {
        id: 'lk_clue_1',
        label: 'Configuração de Alerta',
        value: 'Nenhum contato de emergência ou regra de corte automático configurado no aplicativo.',
        suspicious: true,
      },
      {
        id: 'lk_clue_2',
        label: 'Sessão de Nuvem',
        value: 'Token de autenticação expirado há 38 dias; sensor desconectado da automação residencial.',
        suspicious: true,
      },
      {
        id: 'lk_clue_3',
        label: 'Interface Local',
        value: 'Modo de configuração inicial (AP aberto) ainda ativo permitindo alteração por vizinhos.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Sensor de água não configurado adequadamente e AP aberto',
      vulnerabilityCategory: 'Configuração Incompleta e Exposição',
      vulnerabilityQuestion:
        'Qual é o problema identificado no Sensor de Vazamento do Banheiro?',
      vulnerabilityOptions: [
        {
          id: 'v_wb_1',
          text: 'Regras de alerta ausentes, token expirado e modo de setup Wi-Fi (AP) deixado aberto.',
          isCorrect: true,
          feedback:
            'Correto! Além de não alertar em caso de vazamento, o AP de setup aberto expõe o aparelho a terceiros.',
        },
        {
          id: 'v_wb_2',
          text: 'O sensor foi colocado ao lado da bancada da pia onde há encanamento.',
          isCorrect: false,
          feedback:
            'Incorreto. Instalar próximo à pia é exatamente o local correto de detecção.',
        },
        {
          id: 'v_wb_3',
          text: 'O acabamento da carcaça é branco fosco resistente a respingos.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema é a falha de configuração, token vencido e AP aberto.',
        },
      ],
      threat: {
        id: 'threat_leak_bathroom',
        title: 'Vazamentos não detectados e sequestro do dispositivo via AP aberto',
        description:
          'Um vazamento passa despercebido e pessoas próximas podem se conectar ao AP de configuração do sensor.',
        severity: 'MÉDIO',
        consequences:
          'Alagamento e danos ao piso de madeira sem aviso prévio, além de possível uso do chip Wi-Fi comprometido.',
        recommendation:
          'Concluir pareamento seguro, fechar AP de setup, renovar token autenticado e configurar alertas imediatos.',
        recognitionQuestion:
          'Qual ameaça decorre de manter o sensor com token expirado, sem alertas e com AP aberto?',
        recognitionOptions: [
          {
            id: 't_wb_1',
            text: 'Danos por água sem notificação e conexão não autorizada no ponto de acesso aberto do sensor.',
            isCorrect: true,
            feedback:
              'Certo! Dispositivos IoT com setup incompleto unem falha funcional e exposição de rede.',
          },
          {
            id: 't_wb_2',
            text: 'Alteração automática da cor dos azulejos do box.',
            isCorrect: false,
            feedback:
              'Incorreto. Os riscos são danos físicos sem alerta e acesso indevido ao dispositivo.',
          },
          {
            id: 't_wb_3',
            text: 'Desligamento do computador do escritório por falta de água.',
            isCorrect: false,
            feedback:
              'Incorreto. Trata-se de falha na detecção de vazamentos e exposição do AP.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige o Sensor de Vazamento de Água?',
      protectionOptions: [
        {
          id: 'p_wb_a',
          label: 'A',
          text: 'Concluir a configuração autenticada, encerrar o AP de setup, renovar credenciais e ativar alertas no app.',
          quality: 'correct',
          feedback:
            'Excelente! Agora o sensor reporta vazamentos imediatamente e não aceita conexões estranhas.',
        },
        {
          id: 'p_wb_b',
          label: 'B',
          text: 'Remover as pilhas para evitar que alguém conecte no AP aberto.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Fecha o AP desligando tudo, mas deixa o banheiro sem detecção de vazamentos.',
          residualRisk: 'Sem proteção contra alagamentos e configuração continua pendente.',
        },
        {
          id: 'p_wb_c',
          label: 'C',
          text: 'Apenas mover o sensor para dentro do armário longe da pia.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso impede detectar água no piso e não resolve o AP aberto nem o token.',
        },
        {
          id: 'p_wb_d',
          label: 'D',
          text: 'Deixar o AP aberto sem senha para facilitar manutenção futura.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Modo de configuração aberto nunca deve permanecer ativo após a instalação.',
        },
      ],
    },
    hintProgressive: [
      'Confira o status do token na nuvem, se existe regra de alerta e se o modo de configuração inicial ainda está aberto.',
      'Finalize o pareamento seguro fechando o AP de setup e ative as notificações de vazamento.',
    ],
  },

  {
    id: 'humidity_bathroom',
    name: 'Sensor de Umidade e Ventilação',
    shortName: 'Sensor Umidade',
    roomId: 'bathroom',
    kind: 'humidity_sensor',
    position: [-8.05, 2.25, -4.78],
    connectionType: 'Zigbee 3.0 Seguro',
    ipAddress: 'Nó Zigbee #11',
    firmwareVersion: 'v2.4.0 (Assinado)',
    protocol: 'Zigbee AES-128 Local',
    summary:
      'Sensor climático que aciona automaticamente a ventilação inteligente do banheiro quando a umidade sobe.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'hum_clue_1',
        label: 'Rede Sem Fio',
        value: 'Opera exclusivamente em malha Zigbee 3.0 criptografada com chave única.',
        suspicious: false,
      },
      {
        id: 'hum_clue_2',
        label: 'Automação',
        value: 'Regra local aciona exaustor automaticamente sem depender de serviços externos.',
        suspicious: false,
      },
      {
        id: 'hum_clue_3',
        label: 'Manutenção',
        value: 'Bateria em 92% e último auto-teste validado hoje.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Sensor de Umidade validado com segurança: criptografia Zigbee 3.0 ativa e operação local íntegra.',
    hintProgressive: [
      'Analise se há alguma falha de comunicação, bateria ou exposição externa neste sensor.',
      'O sensor de umidade opera localmente com Zigbee criptografado e está em dia.',
    ],
  },

  // =========================================================================
  // 8. QUARTO ADICIONAL (2 dispositivos)
  // =========================================================================
  {
    id: 'ac_guest',
    name: 'Ar-Condicionado Inteligente',
    shortName: 'Ar-Condicionado',
    roomId: 'guest_bedroom',
    kind: 'ac_unit',
    position: [-6.65, 2.38, -9.17],
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.81',
    firmwareVersion: 'v1.2.1 (Desatualizado)',
    protocol: 'HTTP / Hotspot Setup Ativo',
    summary:
      'Split inverter conectado por Wi-Fi para controle de temperatura do quarto de hóspedes.',
    isInitiallyVulnerable: true,
    maxPoints: 30,
    securityWeight: 4,
    clues: [
      {
        id: 'ac_clue_1',
        label: 'Firmware do Módulo Wi-Fi',
        value: 'Módulo Wi-Fi em versão v1.2.1 com vulnerabilidade conhecida de reinicialização remota e vazamento de SSID.',
        suspicious: true,
      },
      {
        id: 'ac_clue_2',
        label: 'Ponto de Acesso Interno',
        value: 'Rede Wi-Fi de manutenção ("AC_SETUP_OPEN") visível e sem senha na vizinhança.',
        suspicious: true,
      },
      {
        id: 'ac_clue_3',
        label: 'Segmentação',
        value: 'Conectado à rede principal da casa junto com dispositivos de trabalho.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Ar-condicionado com firmware desatualizado e hotspot aberto',
      vulnerabilityCategory: 'Firmware e Configuração Sem Fio',
      vulnerabilityQuestion:
        'Qual vulnerabilidade foi encontrada no Ar-Condicionado Inteligente?',
      vulnerabilityOptions: [
        {
          id: 'v_ac_1',
          text: 'Módulo Wi-Fi desatualizado com falha conhecida e rede de manutenção aberta sem senha.',
          isCorrect: true,
          feedback:
            'Correto! Módulos Wi-Fi antigos em eletrodomésticos frequentemente deixam redes de setup abertas.',
        },
        {
          id: 'v_ac_2',
          text: 'O aparelho utiliza tecnologia inverter silenciosa.',
          isCorrect: false,
          feedback:
            'Incorreto. Tecnologia inverter reduz consumo de energia e ruído, sem risco digital.',
        },
        {
          id: 'v_ac_3',
          text: 'A temperatura foi programada para 23 °C no modo econômico.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está no firmware antigo e no hotspot aberto.',
        },
      ],
      threat: {
        id: 'threat_ac_guest',
        title: 'Acesso indevido ao controlador climático e ponte para a rede',
        description:
          'Atacantes próximos podem conectar-se ao hotspot aberto ou explorar o firmware antigo para manipular o aparelho.',
        severity: 'MÉDIO',
        consequences:
          'Sabotagem climática, desgaste do equipamento, aumento na conta de energia e risco à rede doméstica.',
        recommendation:
          'Atualizar o firmware do módulo Wi-Fi, desativar o hotspot de setup e mover o aparelho para a rede IoT isolada.',
        recognitionQuestion:
          'Qual ameaça surge ao deixar o ar-condicionado com firmware antigo e hotspot sem senha?',
        recognitionOptions: [
          {
            id: 't_ac_1',
            text: 'Conexão de estranhos ao hotspot interno, manipulação do aparelho e exposição de dados da rede.',
            isCorrect: true,
            feedback:
              'Certo! Atualizar o módulo, desligar o hotspot e isolar na rede IoT neutraliza a ameaça.',
          },
          {
            id: 't_ac_2',
            text: 'Descongelamento imediato da piscina no quintal.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco envolve invasão do controlador e acesso à rede Wi-Fi.',
          },
          {
            id: 't_ac_3',
            text: 'Perda de pressão na torneira da lavanderia.',
            isCorrect: false,
            feedback:
              'Incorreto. Trata-se de exposição de rede sem fio e firmware vulnerável.',
          },
        ],
      },
      protectionQuestion:
        'Qual é a proteção correta para o Ar-Condicionado Inteligente?',
      protectionOptions: [
        {
          id: 'p_ac_a',
          label: 'A',
          text: 'Atualizar o firmware do módulo Wi-Fi, desabilitar o hotspot de manutenção e isolá-lo na rede IoT.',
          quality: 'correct',
          feedback:
            'Excelente! Atualização + fim do hotspot aberto + segmentação garantem proteção completa.',
        },
        {
          id: 'p_ac_b',
          label: 'B',
          text: 'Apenas fechar a cortina do quarto para esconder o aparelho da janela.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Sinais Wi-Fi atravessam cortinas e paredes facilmente.',
        },
        {
          id: 'p_ac_c',
          label: 'C',
          text: 'Colocar uma senha simples no hotspot, mantendo o firmware desatualizado na rede principal.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Fecha o acesso aberto imediato, mas o firmware antigo continua vulnerável.',
          residualRisk: 'Firmware v1.2.1 segue sem correções e sem isolamento de rede IoT.',
        },
        {
          id: 'p_ac_d',
          label: 'D',
          text: 'Conectar o aparelho em uma rede Wi-Fi sem senha para facilitar o uso por visitantes.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso expõe ainda mais o dispositivo a terceiros.',
        },
      ],
    },
    hintProgressive: [
      'Verifique a versão do módulo Wi-Fi e se existe alguma rede de configuração ("AC_SETUP_OPEN") visível.',
      'Atualize o firmware, feche o hotspot de manutenção e coloque o aparelho na rede segmentada IoT.',
    ],
  },

  {
    id: 'tv_guest',
    name: 'Smart TV do Quarto Adicional',
    shortName: 'TV Hóspedes',
    roomId: 'guest_bedroom',
    kind: 'tv',
    position: [-6.65, 1.14, -8.96],
    connectionType: 'Wi-Fi Convidados (Isolado)',
    ipAddress: '192.168.60.18',
    firmwareVersion: 'v11.4.0 (Atualizado)',
    protocol: 'TLS 1.3 / Modo Hóspede',
    summary:
      'Televisão instalada no quarto adicional em rede isolada para visitantes, sem contas pessoais da família logadas.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'tvg_clue_1',
        label: 'Isolamento de Rede',
        value: 'Conectada à VLAN de convidados sem acesso à rede interna nem aos arquivos do escritório.',
        suspicious: false,
      },
      {
        id: 'tvg_clue_2',
        label: 'Privacidade',
        value: 'Modo visitante ativo: sem cartões salvos, sem contas pessoais e câmera integrada desabilitada.',
        suspicious: false,
      },
      {
        id: 'tvg_clue_3',
        label: 'Sistema',
        value: 'Patches de segurança aplicados automaticamente nesta semana.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Smart TV do Quarto Adicional validada: isolada em VLAN de visitantes, sem contas sensíveis e atualizada.',
    hintProgressive: [
      'Veja em qual rede a TV está conectada e se há dados pessoais sensíveis armazenados nela.',
      'A configuração em VLAN isolada e modo visitante já protege perfeitamente este aparelho.',
    ],
  },

  // =========================================================================
  // 9. LAVANDERIA (2 dispositivos)
  // =========================================================================
  {
    id: 'outlet_laundry',
    name: 'Tomada Inteligente da Lavanderia',
    shortName: 'Tomada Smart',
    roomId: 'laundry',
    kind: 'smart_outlet',
    position: [9.35, 1.25, -5.01],
    rotationY: Math.PI,
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.94',
    firmwareVersion: 'v2.0.1',
    protocol: 'HTTP Local API Aberta',
    summary:
      'Tomada Wi-Fi com medição de energia que controla alimentação de equipamentos e ferro elétrico.',
    isInitiallyVulnerable: true,
    maxPoints: 30,
    securityWeight: 4,
    clues: [
      {
        id: 'out_clue_1',
        label: 'Permissões & API',
        value: 'API HTTP local permite ligar/desligar a tomada sem token ou autenticação e está acessível a qualquer app na rede.',
        suspicious: true,
      },
      {
        id: 'out_clue_2',
        label: 'Integração Externa',
        value: 'Vinculada a 5 automações de terceiros com permissão ampla de controle de energia da conta.',
        suspicious: true,
      },
      {
        id: 'out_clue_3',
        label: 'Segurança Física',
        value: 'Sem limite de carga ou bloqueio contra acionamento remoto acidental.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Tomada inteligente com API aberta e permissões amplas',
      vulnerabilityCategory: 'Controle de Acesso e Permissões',
      vulnerabilityQuestion:
        'Qual vulnerabilidade afeta a Tomada Inteligente da Lavanderia?',
      vulnerabilityOptions: [
        {
          id: 'v_out_1',
          text: 'API de controle sem autenticação e permissões amplas concedidas a integrações de terceiros.',
          isCorrect: true,
          feedback:
            'Correto! Acionamento elétrico sem controle de acesso permite ligar/desligar cargas indevidamente.',
        },
        {
          id: 'v_out_2',
          text: 'A tomada possui pino terra no padrão brasileiro de 3 pinos.',
          isCorrect: false,
          feedback:
            'Incorreto. Aterramento físico é uma característica elétrica de segurança.',
        },
        {
          id: 'v_out_3',
          text: 'O aplicativo exibe o gráfico mensal de consumo em kWh.',
          isCorrect: false,
          feedback:
            'Incorreto. Medição de energia é útil; o problema está na API sem autenticação e permissões excessivas.',
        },
      ],
      threat: {
        id: 'threat_outlet_laundry',
        title: 'Acionamento elétrico não autorizado e abuso por apps terceiros',
        description:
          'Qualquer dispositivo comprometido na rede ou integração abusiva pode ligar/desligar equipamentos ligados à tomada.',
        severity: 'MÉDIO',
        consequences:
          'Desligamento indevido de aparelhos essenciais, risco elétrico se houver aparelhos térmicos ligados e coleta de rotina.',
        recommendation:
          'Ativar autenticação na API local, revogar integrações de terceiros não utilizadas e isolar na VLAN IoT.',
        recognitionQuestion:
          'Qual ameaça decorre da API aberta e das permissões excessivas na Tomada Inteligente?',
        recognitionOptions: [
          {
            id: 't_out_1',
            text: 'Acionamento ou corte de energia não autorizado por terceiros ou scripts na rede local.',
            isCorrect: true,
            feedback:
              'Certo! Controle de energia exige autenticação e princípio do menor privilégio.',
          },
          {
            id: 't_out_2',
            text: 'Mudança automática no sabor do sabão em pó.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça envolve acionamento remoto indevido de energia.',
          },
          {
            id: 't_out_3',
            text: 'Queda de folhas das árvores do quintal.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é o controle elétrico sem autorização.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida protege corretamente a Tomada Inteligente?',
      protectionOptions: [
        {
          id: 'p_out_a',
          label: 'A',
          text: 'Habilitar autenticação obrigatória na API, revogar integrações desnecessárias e segmentar na rede IoT.',
          quality: 'correct',
          feedback:
            'Muito bem! Agora apenas dispositivos e usuários autorizados controlam a alimentação elétrica.',
        },
        {
          id: 'p_out_b',
          label: 'B',
          text: 'Apenas colocar uma etiqueta escrita "Não desligar" ao lado da tomada.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Avisos físicos não impedem comandos digitais pela rede.',
        },
        {
          id: 'p_out_c',
          label: 'C',
          text: 'Remover apenas um dos 5 aplicativos de terceiros, deixando a API HTTP sem senha.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Reduz pouco a exposição, mas a API sem autenticação continua vulnerável.',
          residualRisk: 'API local aberta permite acionamento por qualquer equipamento na rede.',
        },
        {
          id: 'p_out_d',
          label: 'D',
          text: 'Ligar um aquecedor de alta potência na tomada com agendamento público aberto.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso aumenta o risco de segurança elétrica e física.',
        },
      ],
    },
    hintProgressive: [
      'Verifique se a API local da tomada exige token/autenticação e quantos apps externos têm acesso a ela.',
      'Autenticação na API, limpeza de permissões de terceiros e rede IoT isolada resolvem o caso.',
    ],
  },

  {
    id: 'washer_laundry',
    name: 'Lavadora e Secadora Inteligente',
    shortName: 'Lavadora Smart',
    roomId: 'laundry',
    kind: 'washer',
    position: [10.74, 0.5, -7.25],
    rotationY: -Math.PI / 2,
    connectionType: 'Wi-Fi 5 GHz (VLAN IoT)',
    ipAddress: '192.168.50.74',
    firmwareVersion: 'v4.2.0 (Atualizado)',
    protocol: 'HTTPS / TLS 1.3',
    summary:
      'Conjunto lava e seca conectado apenas para avisos de fim de ciclo, isolado em VLAN IoT e protegido por MFA.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'wsh_clue_1',
        label: 'Permissões',
        value: 'Aplicativo acessa apenas status do ciclo de lavagem; sem permissões de contatos ou microfone.',
        suspicious: false,
      },
      {
        id: 'wsh_clue_2',
        label: 'Rede e Criptografia',
        value: 'Conectada na rede IoT isolada usando TLS 1.3 com certificado validado.',
        suspicious: false,
      },
      {
        id: 'wsh_clue_3',
        label: 'Atualizações',
        value: 'Firmware assinado v4.2.0 atualizado automaticamente.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Lavadora e Secadora Smart validada: menor privilégio respeitado, TLS 1.3 ativo e VLAN isolada.',
    hintProgressive: [
      'Confira se a lavadora pede permissões exageradas ou se está em rede segura e atualizada.',
      'Este eletrodoméstico já opera com menor privilégio e criptografia moderna.',
    ],
  },

  // =========================================================================
  // 10. GARAGEM (2 dispositivos)
  // =========================================================================
  {
    id: 'garage_gate',
    name: 'Portão Eletrônico Inteligente',
    shortName: 'Portão Garagem',
    roomId: 'garage',
    kind: 'garage_gate',
    position: [8.5, 1.14, 6.4],
    connectionType: 'RF 433MHz + Bridge Wi-Fi',
    ipAddress: '192.168.1.99',
    firmwareVersion: 'v1.6.0',
    protocol: 'RF Código Fixo + App sem MFA',
    summary:
      'Motor basculante da garagem com abertura por controle remoto RF e aplicativo conectado à internet.',
    isInitiallyVulnerable: true,
    maxPoints: 50,
    securityWeight: 9,
    clues: [
      {
        id: 'gg_clue_1',
        label: 'Sinal de Rádio (RF)',
        value: 'Controles utilizam código fixo estático sem criptografia nem código rolante (rolling code).',
        suspicious: true,
      },
      {
        id: 'gg_clue_2',
        label: 'Acesso no Aplicativo',
        value: 'Abertura remota do portão pelo celular não exige MFA, PIN nem confirmação de proximidade.',
        suspicious: true,
      },
      {
        id: 'gg_clue_3',
        label: 'Registro de Aberturas',
        value: 'Histórico de aberturas desabilitado; impossível saber quem acionou o portão.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Portão eletrônico com código RF fixo e app sem MFA',
      vulnerabilityCategory: 'Segurança Física e RF',
      vulnerabilityQuestion:
        'Quais vulnerabilidades tornam o Portão da Garagem vulnerável?',
      vulnerabilityOptions: [
        {
          id: 'v_gg_1',
          text: 'Código de rádio fixo vulnerável à clonagem (replay) e aplicativo remoto sem MFA nem auditoria.',
          isCorrect: true,
          feedback:
            'Correto! Sinais RF fixos podem ser gravados da rua e reproduzidos com aparelhos baratos.',
        },
        {
          id: 'v_gg_2',
          text: 'O portão possui sensor antiesmagamento para evitar acidentes.',
          isCorrect: false,
          feedback:
            'Incorreto. Sensor antiesmagamento é um requisito positivo de segurança física.',
        },
        {
          id: 'v_gg_3',
          text: 'As folhas do portão têm acabamento amadeirado.',
          isCorrect: false,
          feedback:
            'Incorreto. O risco crítico está no código RF estático e na falta de MFA/logs no app.',
        },
      ],
      threat: {
        id: 'threat_garage_gate',
        title: 'Clonagem do sinal do portão e abertura física da garagem',
        description:
          'Um atacante parado na rua pode capturar o sinal de rádio ao abrir o portão e reproduzi-lo depois para entrar na casa.',
        severity: 'ALTO',
        consequences:
          'Invasão física da garagem e acesso direto ao interior da residência e ao veículo estacionado.',
        recommendation:
          'Migrar para receptor com código rolante criptografado (rolling code), exigir MFA/PIN para abrir via app e ativar logs.',
        recognitionQuestion:
          'Qual ameaça crítica decorre do uso de RF com código fixo e app sem MFA no portão?',
        recognitionOptions: [
          {
            id: 't_gg_1',
            text: 'Captura e clonagem do sinal de abertura na rua ou invasão do app para abrir a garagem.',
            isCorrect: true,
            feedback:
              'Exato! Ataques de replay contra portões de código fixo são muito comuns em áreas urbanas.',
          },
          {
            id: 't_gg_2',
            text: 'Mudança na cor da pintura do carro estacionado.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é abertura física não autorizada da garagem.',
          },
          {
            id: 't_gg_3',
            text: 'Travamento dos botões da máquina de lavar.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça atinge o controle de acesso físico da garagem.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida protege adequadamente o Portão Eletrônico Inteligente?',
      protectionOptions: [
        {
          id: 'p_gg_a',
          label: 'A',
          text: 'Atualizar para criptografia rolling code no RF, exigir MFA/PIN no app e ativar notificações e logs de abertura.',
          quality: 'correct',
          feedback:
            'Perfeito! Código rolante impede clonagem de sinal e MFA + logs protegem o acionamento remoto.',
        },
        {
          id: 'p_gg_b',
          label: 'B',
          text: 'Trocar apenas a pilha do controle remoto mantendo o sistema de código fixo e app sem MFA.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Pilha nova não altera a falta de criptografia do protocolo.',
        },
        {
          id: 'p_gg_c',
          label: 'C',
          text: 'Desativar a abertura pelo celular, mas continuar usando o controle RF de código fixo diariamente.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Fecha o risco do app, mas o sinal RF fixo continua clonável da rua.',
          residualRisk: 'Ataques de replay RF na calçada continuam abrindo o portão.',
        },
        {
          id: 'p_gg_d',
          label: 'D',
          text: 'Configurar abertura automática por GPS sem confirmação para qualquer celular próximo.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso facilita aberturas indesejadas sem controle.',
        },
      ],
    },
    hintProgressive: [
      'Atenção ao tipo de código usado pelo controle remoto (fixo vs. rolante) e à proteção do aplicativo.',
      'Combine rolling code criptografado no RF com MFA e registro de aberturas no aplicativo.',
    ],
  },

  {
    id: 'ev_garage',
    name: 'Carregador de Veículo Elétrico (Wallbox)',
    shortName: 'Carregador EV',
    roomId: 'garage',
    kind: 'ev_charger',
    position: [5.97, 1.32, 3.05],
    rotationY: Math.PI / 2,
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.108',
    firmwareVersion: 'v2.2.0',
    protocol: 'OCPP 1.6 (ws:// sem TLS)',
    summary:
      'Estação de recarga residencial para veículo elétrico com agendamento de tarifa e portal de gerenciamento.',
    isInitiallyVulnerable: true,
    maxPoints: 30,
    securityWeight: 4,
    clues: [
      {
        id: 'ev_clue_1',
        label: 'Protocolo de Recarga',
        value: 'Comunicação OCPP via WebSocket sem criptografia (ws://) e sem autenticação por cartão RFID.',
        suspicious: true,
      },
      {
        id: 'ev_clue_2',
        label: 'Controle de Acesso',
        value: 'Modo "Plug & Charge" público ativado sem restrição de usuário ou agendamento.',
        suspicious: true,
      },
      {
        id: 'ev_clue_3',
        label: 'Isolamento',
        value: 'Wallbox conectado na mesma rede doméstica sem VLAN separada.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Carregador EV com comunicação OCPP sem TLS e acesso aberto',
      vulnerabilityCategory: 'Criptografia e Controle de Acesso',
      vulnerabilityQuestion:
        'Qual vulnerabilidade afeta o Carregador de Veículo Elétrico?',
      vulnerabilityOptions: [
        {
          id: 'v_ev_1',
          text: 'Protocolo OCPP sem criptografia TLS e ausência de autenticação RFID/usuário para recarga.',
          isCorrect: true,
          feedback:
            'Correto! Sem TLS e sem autenticação, comandos podem ser interceptados e terceiros podem usar energia sem autorização.',
        },
        {
          id: 'v_ev_2',
          text: 'O carregador possui cabo espiralado de 5 metros para alcançar a tomada do carro.',
          isCorrect: false,
          feedback:
            'Incorreto. O comprimento do cabo é prático e não causa brecha digital.',
        },
        {
          id: 'v_ev_3',
          text: 'A carcaça é resistente à poeira dentro da garagem.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está no protocolo sem TLS e falta de autenticação.',
        },
      ],
      threat: {
        id: 'threat_ev_garage',
        title: 'Interceptação OCPP, sobrecarga elétrica e uso indevido de energia',
        description:
          'Invasores na rede podem alterar limites de corrente, interromper recargas ou liberar carga sem autorização.',
        severity: 'MÉDIO',
        consequences:
          'Prejuízo financeiro com energia, atraso na recarga do veículo e risco de manipulação de parâmetros elétricos.',
        recommendation:
          'Ativar OCPP seguro sobre TLS (wss://), exigir autenticação RFID/app e isolar na rede IoT.',
        recognitionQuestion:
          'Qual risco surge quando o carregador EV opera com OCPP sem TLS e sem autenticação?',
        recognitionOptions: [
          {
            id: 't_ev_1',
            text: 'Alteração indevida de comandos de recarga, interceptação de dados e consumo não autorizado.',
            isCorrect: true,
            feedback:
              'Certo! Infraestrutura de energia conectada exige transporte cifrado e autorização de uso.',
          },
          {
            id: 't_ev_2',
            text: 'Esvaziamento imediato dos pneus do veículo.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça é digital sobre os comandos e acesso ao carregador.',
          },
          {
            id: 't_ev_3',
            text: 'Desativação automática do chuveiro do banheiro.',
            isCorrect: false,
            feedback:
              'Incorreto. O impacto recai sobre o carregador EV e a rede doméstica.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida protege o Carregador de Veículo Elétrico?',
      protectionOptions: [
        {
          id: 'p_ev_a',
          label: 'A',
          text: 'Habilitar OCPP sobre TLS (wss://), ativar bloqueio por RFID/app autenticado e isolar na VLAN IoT.',
          quality: 'correct',
          feedback:
            'Excelente! Criptografia + autenticação RFID + segmentação garantem recarga segura.',
        },
        {
          id: 'p_ev_b',
          label: 'B',
          text: 'Apenas enrolar o cabo após o uso mantendo OCPP sem TLS e modo público.',
          quality: 'incorrect',
          feedback:
            'Incorreta! O carregador continua acessível digitalmente sem proteção.',
        },
        {
          id: 'p_ev_c',
          label: 'C',
          text: 'Ativar cartão RFID, mas manter o protocolo OCPP em texto claro (ws://) na rede principal.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Controla o uso físico no wallbox, mas o tráfego na rede continua sem criptografia.',
          residualRisk: 'Comandos OCPP via rede permanecem sem TLS.',
        },
        {
          id: 'p_ev_d',
          label: 'D',
          text: 'Desabilitar todas as proteções de corrente para acelerar o carregamento pela rede aberta.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso cria risco elétrico e cibernético.',
        },
      ],
    },
    hintProgressive: [
      'Observe a ausência de TLS no protocolo OCPP (ws://) e a falta de autenticação RFID/usuário.',
      'Use wss:// (OCPP com TLS), autenticação RFID/app e rede IoT separada.',
    ],
  },

  // =========================================================================
  // 11. ÁREA EXTERNA FRONTAL (3 dispositivos)
  // =========================================================================
  {
    id: 'lock_exterior',
    name: 'Fechadura Inteligente da Entrada',
    shortName: 'Fechadura Smart',
    roomId: 'exterior',
    kind: 'smart_lock',
    position: [0.59, 1.2, 2.4],
    rotationY: Math.PI / 2,
    connectionType: 'BLE + Bridge Wi-Fi',
    ipAddress: '192.168.1.77',
    firmwareVersion: 'v4.0.1',
    protocol: 'BLE / App Remoto',
    summary:
      'Fechadura eletrônica da porta principal com teclado numérico, leitura biométrica e destravamento via aplicativo.',
    isInitiallyVulnerable: true,
    maxPoints: 50,
    securityWeight: 9,
    clues: [
      {
        id: 'lock_clue_1',
        label: 'Política de PIN',
        value: 'Código de entrada configurado como "0000" (4 dígitos sequenciais) sem expiração.',
        suspicious: true,
      },
      {
        id: 'lock_clue_2',
        label: 'Proteção contra Tentativas',
        value: 'Bloqueio automático após tentativas incorretas está DESATIVADO.',
        suspicious: true,
      },
      {
        id: 'lock_clue_3',
        label: 'Acesso no Aplicativo',
        value: 'Desbloqueio remoto funciona sem confirmação biométrica ou segundo fator (MFA).',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Autenticação insuficiente no controle de acesso',
      vulnerabilityCategory: 'Autenticação e Controle Físico',
      vulnerabilityQuestion:
        'Qual vulnerabilidade crítica afeta a Fechadura Inteligente da entrada?',
      vulnerabilityOptions: [
        {
          id: 'v_lk_1',
          text: 'Autenticação insuficiente: PIN fraco ("0000"), ausência de bloqueio por tentativas e falta de MFA.',
          isCorrect: true,
          feedback:
            'Correto! Como controla o acesso físico à casa, autenticação fraca é risco crítico.',
        },
        {
          id: 'v_lk_2',
          text: 'A fechadura usa pilhas alcalinas recarregáveis de longa duração.',
          isCorrect: false,
          feedback:
            'Incorreto. Alimentação por bateria é padrão em fechaduras inteligentes.',
        },
        {
          id: 'v_lk_3',
          text: 'A maçaneta está instalada do lado direito da folha da porta.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema é puramente de controle de acesso digital.',
        },
      ],
      threat: {
        id: 'threat_lock_exterior',
        title: 'Destravamento não autorizado da porta principal',
        description:
          'Um invasor pode adivinhar facilmente o PIN trivial no teclado ou explorar a conta do app sem MFA para abrir a casa.',
        severity: 'ALTO',
        consequences:
          'Invasão física direta da residência, desativação de alarmes e risco à segurança patrimonial e pessoal dos moradores.',
        recommendation:
          'Definir PIN longo único por morador, ativar bloqueio temporário após erros e exigir MFA/biometria no app.',
        recognitionQuestion:
          'Qual é a consequência mais grave da autenticação insuficiente nesta fechadura?',
        recognitionOptions: [
          {
            id: 't_lk_1',
            text: 'Abertura não autorizada da porta por força bruta no PIN ou invasão da conta, permitindo entrada física na casa.',
            isCorrect: true,
            feedback:
              'Exato! Em dispositivos de segurança física, uma falha digital vira risco presencial imediato.',
          },
          {
            id: 't_lk_2',
            text: 'Alteração da cor da iluminação da cozinha.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça é o destravamento indevido da porta de entrada.',
          },
          {
            id: 't_lk_3',
            text: 'Aumento da velocidade da internet fibra.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco envolve invasão física por quebra de autenticação.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida de proteção fortalece corretamente a Fechadura Inteligente?',
      protectionOptions: [
        {
          id: 'p_lk_a',
          label: 'A',
          text: 'Criar códigos longos individuais, ativar bloqueio após tentativas erradas e exigir biometria/MFA no app.',
          quality: 'correct',
          feedback:
            'Perfeito! Múltiplas camadas de autenticação garantem rastreabilidade e impedem força bruta.',
        },
        {
          id: 'p_lk_b',
          label: 'B',
          text: 'Trocar o PIN de "0000" para "1234" e manter o aplicativo sem verificação em duas etapas.',
          quality: 'incorrect',
          feedback:
            'Incorreta! "1234" é igualmente óbvio e está no topo de qualquer lista de códigos testados por invasores.',
        },
        {
          id: 'p_lk_c',
          label: 'C',
          text: 'Alterar o PIN para um número forte de 8 dígitos, mas deixar o bloqueio após tentativas desativado.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Um código longo ajuda, porém sem bloqueio de tentativas e sem MFA no app o controle segue incompleto.',
          residualRisk: 'Conta do aplicativo sem MFA e teclado sem limite de tentativas.',
        },
        {
          id: 'p_lk_d',
          label: 'D',
          text: 'Anotar o código da fechadura em um adesivo colado ao lado da campainha.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Expor a senha fisicamente anula qualquer controle eletrônico.',
        },
      ],
    },
    hintProgressive: [
      'Observe o PIN configurado ("0000"), a falta de bloqueio por erros e a ausência de confirmação em duas etapas.',
      'Para proteger o acesso físico, combine códigos individuais fortes, limite de tentativas e MFA/biometria.',
    ],
  },

  {
    id: 'motion_exterior',
    name: 'Sensor de Movimento do Terraço',
    shortName: 'Sensor Movimento',
    roomId: 'exterior',
    kind: 'motion_sensor',
    position: [4.85, 0.92, 3.85],
    rotationY: -Math.PI * 0.75,
    connectionType: 'RF 433MHz / Bridge',
    ipAddress: '192.168.1.89',
    firmwareVersion: 'v1.4.0 (Desatualizado)',
    protocol: 'RF não autenticado + HTTP',
    summary:
      'Sensor infravermelho externo que aciona luzes do terraço e envia alertas de presença perimetral.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 5,
    clues: [
      {
        id: 'mot_clue_1',
        label: 'Protocolo Sem Fio',
        value: 'Sinais transmitidos por radiofrequência sem criptografia nem código rolante.',
        suspicious: true,
      },
      {
        id: 'mot_clue_2',
        label: 'Software & Ajustes',
        value: 'Firmware v1.4.0 desatualizado e sem zona de exclusão para a calçada pública.',
        suspicious: true,
      },
      {
        id: 'mot_clue_3',
        label: 'Histórico de Alertas',
        value: 'Mais de 90 falsos alertas diários causados por passagem na rua e falhas de comunicação.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Dispositivo desatualizado e comunicação insegura',
      vulnerabilityCategory: 'Configuração Insegura e Firmware',
      vulnerabilityQuestion:
        'O que torna o Sensor de Movimento vulnerável e pouco confiável?',
      vulnerabilityOptions: [
        {
          id: 'v_mt_1',
          text: 'Firmware desatualizado, transmissão sem autenticação/criptografia e calibração mal configurada.',
          isCorrect: true,
          feedback:
            'Correto! Sinais sem autenticação podem ser clonados/bloqueados e falsos alarmes mascaram incidentes reais.',
        },
        {
          id: 'v_mt_2',
          text: 'A carcaça externa possui resistência à chuva (IP65).',
          isCorrect: false,
          feedback:
            'Incorreto. Proteção contra água é uma qualidade física positiva do equipamento.',
        },
        {
          id: 'v_mt_3',
          text: 'O sensor utiliza tecnologia infravermelha passiva.',
          isCorrect: false,
          feedback:
            'Incorreto. Infravermelho passivo é o funcionamento normal do sensor; a falha está na comunicação e atualização.',
        },
      ],
      threat: {
        id: 'threat_motion_exterior',
        title: 'Falsificação de sinal (spoofing) e fadiga de alertas',
        description:
          'Atacantes podem repetir ou suprimir sinais não autenticados, enquanto dezenas de falsos alertas fazem o morador ignorar avisos reais.',
        severity: 'MÉDIO',
        consequences:
          'Perda de monitoramento perimetral confiável, mascaramento de invasões reais e injeção de comandos falsos na automação.',
        recommendation:
          'Atualizar o firmware, habilitar comunicação autenticada/criptografada com o hub e ajustar zonas de detecção.',
        recognitionQuestion:
          'Qual ameaça decorre da combinação de sinal não autenticado, firmware antigo e excesso de falsos alarmes?',
        recognitionOptions: [
          {
            id: 't_mt_1',
            text: 'Clonagem ou bloqueio de sinais do sensor e risco de moradores ignorarem uma invasão real por fadiga de alertas.',
            isCorrect: true,
            feedback:
              'Correto! Tanto a falta de autenticação quanto o excesso de alarmes falsos enfraquecem a defesa do perímetro.',
          },
          {
            id: 't_mt_2',
            text: 'Crescimento acelerado das plantas nos vasos externos.',
            isCorrect: false,
            feedback:
              'Incorreto. O impacto é na integridade dos alertas e na confiabilidade da vigilância externa.',
          },
          {
            id: 't_mt_3',
            text: 'Desconfiguração automática dos canais da Smart TV.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça atinge o monitoramento do perímetro externo.',
          },
        ],
      },
      protectionQuestion:
        'Qual ação protege e corrige o Sensor de Movimento?',
      protectionOptions: [
        {
          id: 'p_mt_a',
          label: 'A',
          text: 'Atualizar o firmware, ativar canal criptografado/autenticado com o hub e definir zonas corretas de detecção.',
          quality: 'correct',
          feedback:
            'Muito bem! Comunicação autenticada impede sinais falsos e a calibração garante alertas precisos.',
        },
        {
          id: 'p_mt_b',
          label: 'B',
          text: 'Silenciar todas as notificações do sensor no celular para não se incomodar com os avisos.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Silenciar alertas elimina o propósito do sensor e deixa o perímetro sem monitoramento.',
        },
        {
          id: 'p_mt_c',
          label: 'C',
          text: 'Ajustar apenas o ângulo físico apontando para o muro, mantendo firmware antigo e RF aberto.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Reduz falsos disparos, mas a comunicação sem criptografia e o firmware desatualizado continuam vulneráveis.',
          residualRisk: 'O canal sem autenticação ainda permite replay/spoofing e o firmware segue sem correções.',
        },
        {
          id: 'p_mt_d',
          label: 'D',
          text: 'Desinstalar a senha do hub central para que o sensor conecte mais rápido.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Remover autenticação do hub comprometeria todos os sensores da residência.',
        },
      ],
    },
    hintProgressive: [
      'Preste atenção em dois fatores: o sinal sem criptografia/autenticação e o firmware v1.4.0 desatualizado.',
      'A correção completa envolve atualizar o software, autenticar o canal sem fio e calibrar a área vigiada.',
    ],
  },

  {
    id: 'cam_exterior',
    name: 'Câmera de Vigilância do Terraço',
    shortName: 'Câmera Terraço',
    roomId: 'exterior',
    kind: 'camera',
    position: [3.15, 2.46, 0.44],
    rotationY: 0,
    connectionType: 'Ethernet PoE (VLAN Segura)',
    ipAddress: '192.168.50.40',
    firmwareVersion: 'v4.5.2 (Atualizado)',
    protocol: 'HTTPS / RTSPS (Criptografado)',
    summary:
      'Câmera externa alimentada via cabo Ethernet PoE, isolada em VLAN dedicada com criptografia ponta a ponta.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'camex_clue_1',
        label: 'Autenticação',
        value: 'Senha exclusiva de 16 caracteres e verificação em duas etapas ativadas.',
        suspicious: false,
      },
      {
        id: 'camex_clue_2',
        label: 'Rede e Transporte',
        value: 'Conectada via cabo PoE em VLAN isolada, usando RTSPS criptografado.',
        suspicious: false,
      },
      {
        id: 'camex_clue_3',
        label: 'Integridade',
        value: 'Logs assinados e zero tentativas de login suspeitas registradas.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Câmera de Vigilância do Terraço validada: VLAN isolada, RTSPS criptografado e credenciais fortes.',
    hintProgressive: [
      'Compare os registros desta câmera PoE com a câmera interna da sala.',
      'Esta câmera já está com senha forte, criptografia RTSPS e rede isolada: confirme que está segura.',
    ],
  },

  // =========================================================================
  // 12. ÁREA GOURMET (1 dispositivo)
  // =========================================================================
  {
    id: 'speaker_gourmet',
    name: 'Sistema de Som da Área Gourmet',
    shortName: 'Som Gourmet',
    roomId: 'gourmet',
    kind: 'speaker',
    position: [4.35, 1.11, -8.86],
    connectionType: 'Bluetooth + Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.114',
    firmwareVersion: 'v3.0.1',
    protocol: 'Bluetooth Open Pairing',
    summary:
      'Caixa de som ambiente na bancada gourmet para festas e música integrada ao terraço.',
    isInitiallyVulnerable: true,
    maxPoints: 30,
    securityWeight: 4,
    clues: [
      {
        id: 'sg_clue_1',
        label: 'Pareamento Bluetooth',
        value: 'Modo de descoberta e pareamento automático sem PIN ativo continuamente.',
        suspicious: true,
      },
      {
        id: 'sg_clue_2',
        label: 'Ponte de Voz',
        value: 'Microfone integrado ligado à conta principal da casa sem verificação de voz.',
        suspicious: true,
      },
      {
        id: 'sg_clue_3',
        label: 'Alcance Externo',
        value: 'Sinal Bluetooth alcança além do muro dos fundos e da área vizinha.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Pareamento Bluetooth aberto sem PIN em área externa',
      vulnerabilityCategory: 'Exposição Sem Fio e Privacidade',
      vulnerabilityQuestion:
        'Qual vulnerabilidade foi identificada no Sistema de Som da Área Gourmet?',
      vulnerabilityOptions: [
        {
          id: 'v_sg_1',
          text: 'Pareamento Bluetooth aberto sem PIN e microfone conectado à conta principal sem restrição.',
          isCorrect: true,
          feedback:
            'Correto! Qualquer pessoa próxima consegue parear sem autorização ou explorar a integração de voz.',
        },
        {
          id: 'v_sg_2',
          text: 'A caixa de som é resistente à umidade próxima à pia.',
          isCorrect: false,
          feedback:
            'Incorreto. Proteção contra respingos é positiva.',
        },
        {
          id: 'v_sg_3',
          text: 'O aparelho está apoiado sobre o balcão de mármore.',
          isCorrect: false,
          feedback:
            'Incorreto. O risco é digital pelo Bluetooth descoberto e acesso de conta.',
        },
      ],
      threat: {
        id: 'threat_speaker_gourmet',
        title: 'Sequestro de áudio Bluetooth e comandos não autorizados',
        description:
          'Vizinhos ou transeuntes podem parear seus aparelhos, reproduzir áudio indesejado ou interagir com a automação.',
        severity: 'BAIXO',
        consequences:
          'Perturbação sonora, exposição de comandos de automação vinculados à conta e possível abuso de voz.',
        recommendation:
          'Desativar pareamento aberto contínuo, exigir confirmação/PIN no Bluetooth e limitar acesso do microfone à automação.',
        recognitionQuestion:
          'Qual ameaça decorre de manter o pareamento Bluetooth aberto sem PIN na Área Gourmet?',
        recognitionOptions: [
          {
            id: 't_sg_1',
            text: 'Conexão de estranhos fora da propriedade ao som e disparo indevido de comandos vinculados.',
            isCorrect: true,
            feedback:
              'Certo! Dispositivos em áreas externas precisam de controles rígidos de pareamento.',
          },
          {
            id: 't_sg_2',
            text: 'Apagamento automático da chama da churrasqueira.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco está na conexão Bluetooth não autorizada e na conta vinculada.',
          },
          {
            id: 't_sg_3',
            text: 'Bloqueio do portão da garagem por áudio alto.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça é sequestro de pareamento e abuso da integração.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige o Sistema de Som da Área Gourmet?',
      protectionOptions: [
        {
          id: 'p_sg_a',
          label: 'A',
          text: 'Desativar descoberta automática, exigir PIN/confirmação no pareamento e restringir comandos da conta.',
          quality: 'correct',
          feedback:
            'Excelente! Agora só moradores autorizados podem parear ou executar comandos.',
        },
        {
          id: 'p_sg_b',
          label: 'B',
          text: 'Apenas abaixar o volume após as 22h mantendo o Bluetooth visível para todos.',
          quality: 'incorrect',
          feedback:
            'Incorreta! O aparelho continua aceitando conexões desconhecidas.',
        },
        {
          id: 'p_sg_c',
          label: 'C',
          text: 'Desligar apenas o microfone, mas deixar o Bluetooth aberto para pareamento sem PIN.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Protege comandos de voz, mas estranhos ainda conseguem conectar via Bluetooth.',
          residualRisk: 'Pareamento Bluetooth sem PIN continua acessível.',
        },
        {
          id: 'p_sg_d',
          label: 'D',
          text: 'Habilitar modo festa público sem senha para qualquer celular próximo.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso piora a exposição.',
        },
      ],
    },
    hintProgressive: [
      'Confira como o Bluetooth aceita novos aparelhos e o alcance do sinal fora da casa.',
      'Desative a descoberta contínua, exija confirmação/PIN no pareamento e limite comandos na conta.',
    ],
  },

  // =========================================================================
  // 13. PISCINA & DECK (1 dispositivo)
  // =========================================================================
  {
    id: 'pool_ctrl',
    name: 'Controlador Inteligente da Piscina',
    shortName: 'Controlador Piscina',
    roomId: 'pool',
    kind: 'pool_controller',
    position: [4.35, 0.3, -14.2],
    rotationY: -Math.PI / 2,
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.122',
    firmwareVersion: 'v2.0.0',
    protocol: 'HTTP (porta 80) + Senha Padrão',
    summary:
      'Painel digital conectado que gerencia filtragem, bomba d’água, aquecedor e iluminação subaquática da piscina.',
    isInitiallyVulnerable: true,
    maxPoints: 40,
    securityWeight: 5,
    clues: [
      {
        id: 'pl_clue_1',
        label: 'Acesso Administrativo',
        value: 'Interface web usa senha padrão "pool1234" e transmite credenciais via HTTP sem criptografia.',
        suspicious: true,
      },
      {
        id: 'pl_clue_2',
        label: 'Exposição na Nuvem',
        value: 'Porta de controle remoto exposta sem VPN e sem bloqueio após falhas de login.',
        suspicious: true,
      },
      {
        id: 'pl_clue_3',
        label: 'Controle de Equipamentos',
        value: 'Permite ligar aquecimento máximo e drenar/operar bombas continuamente à distância.',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Controlador de piscina exposto com senha padrão e HTTP',
      vulnerabilityCategory: 'Credenciais e Comunicação Insegura',
      vulnerabilityQuestion:
        'Qual vulnerabilidade afeta o Controlador Inteligente da Piscina?',
      vulnerabilityOptions: [
        {
          id: 'v_pl_1',
          text: 'Senha padrão de fábrica, painel web em HTTP sem TLS e acesso remoto exposto.',
          isCorrect: true,
          feedback:
            'Correto! Controladores externos com senha padrão e HTTP são facilmente encontrados e manipulados.',
        },
        {
          id: 'v_pl_2',
          text: 'A piscina utiliza refletores LED subaquáticos de baixa tensão.',
          isCorrect: false,
          feedback:
            'Incorreto. LEDs de baixa tensão são padrão seguro em piscinas.',
        },
        {
          id: 'v_pl_3',
          text: 'A bomba possui temporizador automático diário.',
          isCorrect: false,
          feedback:
            'Incorreto. A falha está na autenticação fraca e na ausência de criptografia.',
        },
      ],
      threat: {
        id: 'threat_pool_ctrl',
        title: 'Manipulação remota de bombas, aquecimento e iluminação',
        description:
          'Atacantes podem alterar o aquecedor, manter bombas ligadas em seco ou desligar a filtragem da piscina.',
        severity: 'MÉDIO',
        consequences:
          'Danos mecânicos à bomba, desperdício elevado de água/energia e ponto de pivô na rede local.',
        recommendation:
          'Trocar a senha padrão por senha forte, habilitar HTTPS/TLS, fechar exposição direta na internet e isolar na VLAN IoT.',
        recognitionQuestion:
          'Qual ameaça decorre da exposição e senha padrão no Controlador da Piscina?',
        recognitionOptions: [
          {
            id: 't_pl_1',
            text: 'Controle não autorizado das bombas e aquecedor, causando danos físicos e gastos excessivos.',
            isCorrect: true,
            feedback:
              'Exato! Equipamentos hidráulicos e térmicos precisam de autenticação forte e rede protegida.',
          },
          {
            id: 't_pl_2',
            text: 'Mudança automática no sabor do cloro usado na água.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é o comando indevido de bombas, luzes e aquecimento.',
          },
          {
            id: 't_pl_3',
            text: 'Desconfiguração dos canais de TV do quarto.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça atinge o controlador da piscina e a rede local.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida protege corretamente o Controlador da Piscina?',
      protectionOptions: [
        {
          id: 'p_pl_a',
          label: 'A',
          text: 'Definir senha forte exclusiva, ativar HTTPS, fechar acesso direto externo e segmentar na VLAN IoT.',
          quality: 'correct',
          feedback:
            'Excelente! Você eliminou a senha padrão, cifrou o acesso e isolou o equipamento.',
        },
        {
          id: 'p_pl_b',
          label: 'B',
          text: 'Apenas desligar os LEDs da piscina mantendo a senha padrão "pool1234" e porta aberta.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Os invasores continuam controlando bombas e aquecimento.',
        },
        {
          id: 'p_pl_c',
          label: 'C',
          text: 'Trocar a senha padrão, mas manter HTTP sem criptografia e acesso remoto exposto.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Remove a senha óbvia, porém a nova senha viaja sem criptografia em HTTP.',
          residualRisk: 'Comunicação HTTP expõe credenciais e comandos na rede.',
        },
        {
          id: 'p_pl_d',
          label: 'D',
          text: 'Deixar a senha anotada no mural público do aplicativo da área de lazer.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Expor credenciais anula o controle de acesso.',
        },
      ],
    },
    hintProgressive: [
      'Verifique a senha configurada ("pool1234"), o protocolo HTTP sem "S" e o acesso remoto aberto.',
      'Troque a senha por uma combinação forte, ative HTTPS e isole na rede IoT.',
    ],
  },

  // =========================================================================
  // 14. QUINTAL & JARDIM (3 dispositivos)
  // =========================================================================
  {
    id: 'irrigation_backyard',
    name: 'Sistema de Irrigação Automática',
    shortName: 'Irrigação Jardim',
    roomId: 'backyard',
    kind: 'irrigation',
    position: [-13.42, 0.85, -11.5],
    rotationY: Math.PI / 2,
    connectionType: 'Wi-Fi 2.4 GHz',
    ipAddress: '192.168.1.130',
    firmwareVersion: 'v2.5.1',
    protocol: 'Cloud API Permissão Ampla',
    summary:
      'Controlador inteligente de aspersores que ajusta a rega do gramado conforme previsão do tempo.',
    isInitiallyVulnerable: true,
    maxPoints: 20,
    securityWeight: 3,
    clues: [
      {
        id: 'irr_clue_1',
        label: 'Permissões na Nuvem',
        value: 'Token OAuth do aplicativo possui permissão de escrita em toda a automação da casa e agenda compartilhada.',
        suspicious: true,
      },
      {
        id: 'irr_clue_2',
        label: 'Regras de Proteção',
        value: 'Sem limite máximo de tempo por ciclo ou alerta de consumo contínuo de água.',
        suspicious: true,
      },
      {
        id: 'irr_clue_3',
        label: 'Firmware',
        value: 'Aplicativo de controle conectado à conta sem segundo fator (2FA).',
        suspicious: false,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Irrigação com permissões amplas na nuvem e falta de limites',
      vulnerabilityCategory: 'Menor Privilégio e Controle Operacional',
      vulnerabilityQuestion:
        'Qual vulnerabilidade foi detectada no Sistema de Irrigação Automática?',
      vulnerabilityOptions: [
        {
          id: 'v_irr_1',
          text: 'Permissões OAuth excessivas na automação da casa, conta sem 2FA e ausência de limite de fluxo.',
          isCorrect: true,
          feedback:
            'Correto! Um controlador de jardim não deve ter acesso amplo à agenda nem ao resto da casa.',
        },
        {
          id: 'v_irr_2',
          text: 'Os aspersores ficam embutidos no gramado próximo às plantas.',
          isCorrect: false,
          feedback:
            'Incorreto. Aspersores embutidos são padrão de paisagismo.',
        },
        {
          id: 'v_irr_3',
          text: 'O sistema programa a rega para o início da manhã.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está nos privilégios exagerados da conta e falta de salvaguardas.',
        },
      ],
      threat: {
        id: 'threat_irrigation',
        title: 'Desperdício de água e abuso de tokens de nuvem para outros aparelhos',
        description:
          'Se a integração de irrigação vazar, invasores podem acionar válvulas continuamente e pivotar permissões na conta.',
        severity: 'BAIXO',
        consequences:
          'Conta de água elevada, alagamento do jardim e uso do token amplo para consultar rotina da casa.',
        recommendation:
          'Restringir escopo OAuth apenas à irrigação, ativar 2FA na conta e definir limite máximo de tempo por zona.',
        recognitionQuestion:
          'Qual ameaça decorre das permissões amplas e falta de limites na irrigação?',
        recognitionOptions: [
          {
            id: 't_irr_1',
            text: 'Acionamento contínuo das válvulas e uso de permissões excessivas na conta da casa.',
            isCorrect: true,
            feedback:
              'Certo! Aplicar menor privilégio e limites operacionais contém prejuízos.',
          },
          {
            id: 't_irr_2',
            text: 'Desligamento imediato dos monitores do escritório.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco envolve desperdício de água e abuso de tokens da conta.',
          },
          {
            id: 't_irr_3',
            text: 'Alteração das placas dos carros na rua.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça é digital sobre o controle de água e a conta vinculada.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige o Sistema de Irrigação Automática?',
      protectionOptions: [
        {
          id: 'p_irr_a',
          label: 'A',
          text: 'Limitar permissões ao escopo estrito da irrigação, ativar 2FA e configurar limite máximo de tempo/vazão.',
          quality: 'correct',
          feedback:
            'Muito bem! Menor privilégio, 2FA e limite de tempo garantem operação segura e econômica.',
        },
        {
          id: 'p_irr_b',
          label: 'B',
          text: 'Apenas trocar a cor da caixa plástica no muro mantendo todas as permissões amplas.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Mudar aparência física não altera permissões digitais.',
        },
        {
          id: 'p_irr_c',
          label: 'C',
          text: 'Definir tempo máximo de rega, mas deixar o token com acesso total à casa e sem 2FA.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Evita alagamento prolongado, mas mantém privilégios excessivos na conta.',
          residualRisk: 'Token amplo sem 2FA segue exposto.',
        },
        {
          id: 'p_irr_d',
          label: 'D',
          text: 'Compartilhar a senha da conta da casa em rede social para exibir a horta.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Nunca exponha credenciais da residência.',
        },
      ],
    },
    hintProgressive: [
      'Veja quais permissões o token OAuth possui e se há limite máximo de tempo para as válvulas.',
      'Aplique menor privilégio, 2FA e limite operacional por ciclo.',
    ],
  },

  {
    id: 'weather_backyard',
    name: 'Estação Meteorológica Conectada',
    shortName: 'Estação Clima',
    roomId: 'backyard',
    kind: 'weather_station',
    position: [-9.8, 0.86, -15.8],
    connectionType: 'Wi-Fi IoT (Somente Telemetria)',
    ipAddress: '192.168.50.85',
    firmwareVersion: 'v3.6.2 (Assinado)',
    protocol: 'HTTPS / TLS 1.3 (Token Read-Only)',
    summary:
      'Estação climática externa com anemômetro e pluviômetro que envia medições locais via canal criptografado.',
    isInitiallyVulnerable: false,
    maxPoints: 15,
    securityWeight: 3,
    clues: [
      {
        id: 'wth_clue_1',
        label: 'Privilégios de Rede',
        value: 'Isolada na VLAN IoT com permissão apenas de saída HTTPS para telemetria climática.',
        suspicious: false,
      },
      {
        id: 'wth_clue_2',
        label: 'Autenticação',
        value: 'Utiliza certificado mútuo e chave API exclusiva revogável.',
        suspicious: false,
      },
      {
        id: 'wth_clue_3',
        label: 'Firmware',
        value: 'Assinado digitalmente na versão v3.6.2 sem serviços administrativos expostos.',
        suspicious: false,
      },
    ],
    secureConfirmationText:
      'Estação Meteorológica validada com segurança: HTTPS/TLS 1.3, VLAN isolada e privilégios mínimos.',
    hintProgressive: [
      'Analise se a estação climática expõe portas de administração ou se já opera isolada com TLS.',
      'Todos os parâmetros estão corretos e seguros: confirme a conformidade deste dispositivo.',
    ],
  },

  {
    id: 'mower_backyard',
    name: 'Cortador Robô de Grama',
    shortName: 'Robô Cortador',
    roomId: 'backyard',
    kind: 'robot_mower',
    position: [-9.2, -0.08, -12.6],
    connectionType: 'Bluetooth + GPS / Wi-Fi',
    ipAddress: '192.168.1.136',
    firmwareVersion: 'v1.9.0',
    protocol: 'BLE sem PIN + Telemetria Aberta',
    summary:
      'Robô autônomo que patrulha e apara o gramado do quintal obedecendo perímetro virtual.',
    isInitiallyVulnerable: true,
    maxPoints: 20,
    securityWeight: 3,
    clues: [
      {
        id: 'mow_clue_1',
        label: 'Controle Bluetooth',
        value: 'Pareamento BLE aceita comandos de movimento sem exigir código PIN de segurança.',
        suspicious: true,
      },
      {
        id: 'mow_clue_2',
        label: 'Dados de Localização',
        value: 'Mapa completo do quintal e horários de patrulha visíveis no app sem autenticação forte.',
        suspicious: true,
      },
      {
        id: 'mow_clue_3',
        label: 'Proteção Antifurto',
        value: 'Alarme e bloqueio por PIN ao retirar o robô do perímetro estão DESATIVADOS.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Robô autônomo sem PIN de controle e rastreamento desprotegido',
      vulnerabilityCategory: 'Segurança IoT e Privacidade',
      vulnerabilityQuestion:
        'Qual vulnerabilidade afeta o Cortador Robô de Grama?',
      vulnerabilityOptions: [
        {
          id: 'v_mow_1',
          text: 'Controle BLE sem PIN, bloqueio antifurto desativado e mapa/rotina do quintal expostos.',
          isCorrect: true,
          feedback:
            'Correto! Robôs com lâminas e GPS exigem PIN de segurança, antifurto ativo e proteção dos mapas da casa.',
        },
        {
          id: 'v_mow_2',
          text: 'O robô se desloca automaticamente pelo gramado do quintal.',
          isCorrect: false,
          feedback:
            'Incorreto. A movimentação autônoma é o funcionamento esperado do aparelho.',
        },
        {
          id: 'v_mow_3',
          text: 'A carcaça possui para-choque frontal de alumínio.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema está na ausência de PIN no BLE e bloqueio antifurto.',
        },
      ],
      threat: {
        id: 'threat_robot_mower',
        title: 'Comandos não autorizados e exposição da planta do quintal',
        description:
          'Pessoas próximas podem enviar comandos via BLE ou obter o mapa de obstáculos e horários do terreno.',
        severity: 'BAIXO',
        consequences:
          'Desvio ou furto facilitado do equipamento, risco físico por movimentação indevida e exposição do layout do quintal.',
        recommendation:
          'Configurar PIN obrigatório no robô e no BLE, ativar bloqueio antifurto e proteger a conta com senha forte + 2FA.',
        recognitionQuestion:
          'Qual ameaça decorre de operar o robô cortador sem PIN e sem bloqueio antifurto?',
        recognitionOptions: [
          {
            id: 't_mow_1',
            text: 'Acionamento indevido por Bluetooth sem autorização, furto facilitado e vazamento do mapa do terreno.',
            isCorrect: true,
            feedback:
              'Certo! Ativar PIN e proteção da conta garante controle seguro do equipamento.',
          },
          {
            id: 't_mow_2',
            text: 'Queima imediata do forno da cozinha.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça refere-se ao controle e segurança do robô e dados do quintal.',
          },
          {
            id: 't_mow_3',
            text: 'Inversão do sentido dos carros na rua pública.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é sobre o dispositivo do quintal.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida protege adequadamente o Cortador Robô de Grama?',
      protectionOptions: [
        {
          id: 'p_mow_a',
          label: 'A',
          text: 'Definir PIN no Bluetooth e no painel do robô, ativar trava antifurto e proteger a conta do app com 2FA.',
          quality: 'correct',
          feedback:
            'Excelente! O robô continua aparando o jardim com proteção contra comandos estranhos e furto.',
        },
        {
          id: 'p_mow_b',
          label: 'B',
          text: 'Apenas pintar o robô de verde para camuflar na grama mantendo tudo sem PIN.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Sinais Bluetooth são detectados digitalmente independentemente da cor.',
        },
        {
          id: 'p_mow_c',
          label: 'C',
          text: 'Ativar a trava antifurto, mas deixar o BLE sem PIN e a conta sem 2FA.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Ajuda contra furto físico, mas comandos Bluetooth e acesso à conta seguem abertos.',
          residualRisk: 'BLE sem PIN e ausência de 2FA mantêm risco de controle indevido.',
        },
        {
          id: 'p_mow_d',
          label: 'D',
          text: 'Remover a cerca virtual para que o robô saia até a calçada da rua.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Isso cria risco físico na via pública e facilita extravio.',
        },
      ],
    },
    hintProgressive: [
      'Verifique se o Bluetooth pede PIN e se o recurso antifurto está ligado.',
      'Ative PIN no robô/BLE, trava antifurto e 2FA na conta do aplicativo.',
    ],
  },

  // =========================================================================
  // 15. RUA PÚBLICA (1 dispositivo)
  // =========================================================================
  {
    id: 'cam_street',
    name: 'Câmera Externa Voltada para a Rua',
    shortName: 'Câmera Rua',
    roomId: 'street',
    kind: 'camera',
    position: [-2.55, 2.38, 7.46],
    connectionType: 'Wi-Fi 2.4 GHz (Alcance Externo)',
    ipAddress: '192.168.1.145',
    firmwareVersion: 'v1.8.0 (Desatualizado)',
    protocol: 'HTTP / RTSP Aberto na Porta 554',
    summary:
      'Câmera montada junto ao muro frontal monitorando o portão de pedestres, calçada e movimento de veículos na rua.',
    isInitiallyVulnerable: true,
    maxPoints: 50,
    securityWeight: 8,
    clues: [
      {
        id: 'cst_clue_1',
        label: 'Credenciais & Stream',
        value: 'Senha padrão "admin/admin" ativa e fluxo RTSP acessível sem autenticação na porta 554.',
        suspicious: true,
      },
      {
        id: 'cst_clue_2',
        label: 'Exposição na Rua',
        value: 'Redirecionamento UPnP abriu a câmera diretamente na internet pública; 42 acessos externos registrados.',
        suspicious: true,
      },
      {
        id: 'cst_clue_3',
        label: 'Privacidade Pública',
        value: 'Sem máscara de privacidade nas fachadas vizinhas e firmware v1.8.0 desatualizado.',
        suspicious: true,
      },
    ],
    challenge: {
      vulnerabilityTitle: 'Câmera de fachada exposta na internet com senha padrão e RTSP aberto',
      vulnerabilityCategory: 'Exposição Pública e Credenciais',
      vulnerabilityQuestion:
        'Qual é a falha mais grave identificada na Câmera voltada para a Rua?',
      vulnerabilityOptions: [
        {
          id: 'v_cst_1',
          text: 'Transmissão RTSP aberta sem autenticação, senha padrão ("admin/admin") e exposição direta via UPnP.',
          isCorrect: true,
          feedback:
            'Correto! Câmeras expostas por UPnP com senha padrão aparecem rapidamente em buscadores públicos de dispositivos.',
        },
        {
          id: 'v_cst_2',
          text: 'A câmera possui visão noturna infravermelha para gravar carros à noite.',
          isCorrect: false,
          feedback:
            'Incorreto. Visão noturna é um recurso legítimo de vigilância externa.',
        },
        {
          id: 'v_cst_3',
          text: 'A câmera está posicionada acima do portão frontal de entrada.',
          isCorrect: false,
          feedback:
            'Incorreto. O problema crítico é a exposição pública na internet sem senha forte.',
        },
      ],
      threat: {
        id: 'threat_cam_street',
        title: 'Transmissão pública da fachada da casa e vigilância por terceiros',
        description:
          'Qualquer pessoa na internet pode assistir à entrada da casa em tempo real, mapear veículos/horários e usar a câmera em ataques DDoS.',
        severity: 'ALTO',
        consequences:
          'Exposição pública da rotina de saída/chegada dos moradores, violação de privacidade da vizinhança e recrutamento em botnets.',
        recommendation:
          'Trocar senha padrão, fechar UPnP/porta 554 pública, ativar RTSPS/2FA, atualizar firmware e aplicar máscara de privacidade.',
        recognitionQuestion:
          'Qual ameaça crítica resulta dessa câmera externa com RTSP aberto e senha padrão na internet?',
        recognitionOptions: [
          {
            id: 't_cst_1',
            text: 'Acesso público mundial ao vídeo da entrada da casa, monitoramento por criminosos e uso da câmera em botnets.',
            isCorrect: true,
            feedback:
              'Exato! Câmeras de rua expostas na internet permitem que terceiros observem quando a casa fica vazia.',
          },
          {
            id: 't_cst_2',
            text: 'Multa de trânsito automática aplicada aos carros que passam na rua.',
            isCorrect: false,
            feedback:
              'Incorreto. O risco é acesso público indevido ao vídeo e comprometimento do equipamento.',
          },
          {
            id: 't_cst_3',
            text: 'Desligamento dos postes de iluminação pública da prefeitura.',
            isCorrect: false,
            feedback:
              'Incorreto. A ameaça recai sobre a privacidade e segurança da residência.',
          },
        ],
      },
      protectionQuestion:
        'Qual medida corrige definitivamente a Câmera Externa voltada para a Rua?',
      protectionOptions: [
        {
          id: 'p_cst_a',
          label: 'A',
          text: 'Definir senha forte + 2FA, fechar exposição pública/UPnP, atualizar firmware, ativar RTSPS e mascarar áreas vizinhas.',
          quality: 'correct',
          feedback:
            'Perfeito! Você fechou o acesso público, atualizou o firmware, protegeu o vídeo e respeitou a privacidade.',
        },
        {
          id: 'p_cst_b',
          label: 'B',
          text: 'Apenas apontar a câmera ligeiramente mais para baixo mantendo senha "admin" e porta 554 aberta.',
          quality: 'incorrect',
          feedback:
            'Incorreta! O stream continua público na internet com a mesma senha padrão.',
        },
        {
          id: 'p_cst_c',
          label: 'C',
          text: 'Trocar apenas a senha padrão, mas deixar a porta RTSP 554 aberta via UPnP sem criptografia e firmware antigo.',
          quality: 'partial',
          feedback:
            'Parcialmente adequada. Impede login trivial, mas o firmware antigo e a porta aberta em texto claro seguem arriscados.',
          residualRisk: 'Porta RTSP pública sem criptografia e firmware desatualizado continuam expostos.',
        },
        {
          id: 'p_cst_d',
          label: 'D',
          text: 'Compartilhar a URL RTSP sem senha para testar se outros sites conseguem abrir o vídeo.',
          quality: 'incorrect',
          feedback:
            'Incorreta! Divulgar uma câmera aberta multiplica o acesso de estranhos.',
        },
      ],
    },
    hintProgressive: [
      'Verifique a senha padrão ("admin/admin"), a porta RTSP aberta sem autenticação e o redirecionamento UPnP.',
      'Feche o UPnP, aplique senha forte + 2FA, atualize o firmware e use protocolo criptografado.',
    ],
  },
];

export function getClassification(score: number): {
  label: string;
  summary: string;
  tierColor: string;
} {
  if (score <= 299) {
    return {
      label: 'Segurança crítica',
      summary:
        'A residência possui múltiplas exposições graves que facilitam invasões digitais e comprometimento da privacidade.',
      tierColor: 'text-[#B91C1C]',
    };
  }
  if (score <= 499) {
    return {
      label: 'Segurança vulnerável',
      summary:
        'Algumas correções foram iniciadas, porém falhas importantes continuam abertas na rede, no perímetro e nos acessos.',
      tierColor: 'text-[#B45309]',
    };
  }
  if (score <= 699) {
    return {
      label: 'Segurança moderada',
      summary:
        'A postura defensiva melhorou de forma visível, mas ainda restam ajustes essenciais para blindar toda a Smart Home.',
      tierColor: 'text-[#A16207]',
    };
  }
  if (score <= 849) {
    return {
      label: 'Segurança avançada',
      summary:
        'Ótima auditoria! A maioria dos dispositivos internos e externos está devidamente endurecida contra ameaças de IoT.',
      tierColor: 'text-[#315EAA]',
    };
  }
  return {
    label: 'Residência altamente protegida',
    summary:
      'Desempenho exemplar! Toda a Smart Home opera com autenticação forte, redes segmentadas, firmware em dia e menor privilégio.',
    tierColor: 'text-[#197A52]',
  };
}
