export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  targetHint: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 0,
    title: '1. Movimente a Câmera 3D',
    description:
      'Arraste com o botão esquerdo para girar a propriedade, use a roda do mouse para aproximar e o botão direito para navegar pelos cômodos, quintal e rua.',
    targetHint: 'Experimente girar a casa ou usar o seletor de ambientes na barra inferior.',
  },
  {
    id: 1,
    title: '2. Explore os 15 Ambientes e o Mapa',
    description:
      'Clique diretamente sobre o piso de qualquer cômodo no 3D, navegue pelo painel esquerdo ou abra o Mapa da Propriedade (tecla M) para ir direto a cada zona.',
    targetHint: 'Visite Sala, Escritório, Banheiro, Lavanderia, Garagem, Piscina, Quintal e Rua.',
  },
  {
    id: 2,
    title: '3. Selecione um Dispositivo IoT',
    description:
      'Os 33 equipamentos conectados possuem marcadores luminosos discretos. Clique diretamente em um dispositivo na cena 3D ou na lista lateral.',
    targetHint: 'Recomendamos começar pela Câmera Inteligente da Sala ou pelo Roteador Wi-Fi.',
  },
  {
    id: 3,
    title: '4. Investigue os Registros Técnicos',
    description:
      'No painel direito, clique em "Iniciar Investigação" para coletar pistas técnicas progressivamente sem revelar respostas prontas.',
    targetHint: 'Leia os registros com atenção: nem todo aparelho está vulnerável.',
  },
  {
    id: 4,
    title: '5. Identifique Vulnerabilidades e Ameaças',
    description:
      'Interprete os sinais suspeitos para diagnosticar a falha e reconhecer o nível de gravidade (Baixo, Médio ou Alto) da ameaça.',
    targetHint: 'Acompanhe alertas detalhados também na Central de Segurança.',
  },
  {
    id: 5,
    title: '6. Aplique Medidas de Proteção',
    description:
      'Escolha a solução de defesa mais eficaz. Decisões corretas blindam o dispositivo no cenário 3D e aumentam sua pontuação.',
    targetHint: 'Evite escolhas aleatórias: erros reduzem pontos e ficam registrados no relatório.',
  },
  {
    id: 6,
    title: '7. Acompanhe o Índice e Conclua',
    description:
      'Observe a barra de segurança residencial subir até 100% conforme protege os ambientes internos e externos e gere seu Relatório Final.',
    targetHint: 'Você pode consultar o CYBER ASSISTANT sempre que precisar de uma pista.',
  },
];
