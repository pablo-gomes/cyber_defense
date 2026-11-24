import { DeviceRuntimeState, SmartDeviceConfig } from '../types/game';
import { SMART_DEVICES } from './smartHomeData';

interface LocalAssistantContext {
  selectedDevice?: SmartDeviceConfig | null;
  deviceState?: DeviceRuntimeState | null;
  score: number;
  securityPercent: number;
  protectedCount: number;
  vulnerableRemaining: number;
}

export function getLocalAssistantReply(
  question: string,
  context: LocalAssistantContext,
): string {
  const q = question.toLowerCase().trim();
  const { selectedDevice, deviceState, score, securityPercent, protectedCount, vulnerableRemaining } =
    context;

  // Report / Score interpretation queries
  if (
    q.includes('relatório') ||
    q.includes('relatorio') ||
    q.includes('pontuação') ||
    q.includes('pontuacao') ||
    q.includes('nota') ||
    q.includes('resultado')
  ) {
    return `Atualmente sua auditoria soma ${score} de 1000 pontos, com ${securityPercent}% de proteção residencial (${protectedCount} dispositivos protegidos e ${vulnerableRemaining} vulnerabilidades pendentes). Cada vulnerabilidade corrigida na primeira tentativa rende pontuação máxima; decisões parciais reduzem apenas parte do risco e respostas incorretas geram penalidade educativa.`;
  }

  // Concept explanations
  if (q.includes('wpa3') || q.includes('wpa') || q.includes('roteador') || q.includes('wi-fi')) {
    return 'O WPA3 (e, em equipamentos mais antigos, o WPA2-AES) criptografa os dados que trafegam pelo ar entre os aparelhos e o roteador. Padrões antigos como WEP ou WPA/TKIP, além de recursos como WPS por PIN, permitem que invasores descubram a chave da rede rapidamente. Separar dispositivos IoT em uma rede própria (VLAN ou Rede de Convidados) também evita que um sensor comprometido alcance seu computador.';
  }

  if (q.includes('mfa') || q.includes('2fa') || q.includes('autentica')) {
    return 'A Autenticação Multifator (MFA ou 2FA) exige uma segunda prova além da senha — como biometria ou código temporário no celular. Mesmo que alguém descubra seu PIN ou senha, não conseguirá destravar uma fechadura ou acessar sua câmera sem esse segundo fator.';
  }

  if (q.includes('firmware') || q.includes('atualiza')) {
    return 'Firmware é o sistema interno gravado nos dispositivos inteligentes. Fabricantes lançam atualizações para corrigir brechas de segurança descobertas após a venda. Manter o firmware atualizado fecha portas conhecidas usadas por ataques automatizados.';
  }

  if (q.includes('menor privil') || q.includes('permiss')) {
    return 'O Princípio do Menor Privilégio significa dar a cada aplicativo ou dispositivo apenas as permissões mínimas necessárias para funcionar. Por exemplo, uma geladeira conectada não precisa acessar seus contatos, e-mail completo ou compras financeiras.';
  }

  if (q.includes('senha padr') || q.includes('fábrica') || q.includes('fabrica')) {
    return 'Senhas padrão de fábrica (como admin/1234 ou 0000) vêm publicadas nos manuais dos fabricantes. Ferramentas automatizadas testam milhares de endereços por minuto usando exatamente essas combinações, por isso alterá-las para senhas longas e exclusivas é prioridade máxima.';
  }

  // Progressive hint for selected device (never spoils directly before attempt!)
  if (selectedDevice) {
    const isResolved = deviceState?.status === 'protected';
    if (isResolved) {
      return `O dispositivo "${selectedDevice.name}" já está devidamente protegido! Principais aprendizados: ${selectedDevice.clues
        .map((c) => c.label)
        .join(', ')}. Você pode selecionar outro equipamento no cenário 3D ou na lista à esquerda.`;
    }

    if (q.includes('dica') || q.includes('ajuda') || q.includes('pista') || q.includes('este dispositivo') || q.includes('o que fazer')) {
      if (!deviceState || deviceState.stage === 'locked') {
        return `Para auditar "${selectedDevice.name}", clique primeiro em "Iniciar Investigação" no painel à direita. Isso vai coletar os registros técnicos para que você avalie se há algum indício suspeito.`;
      }

      const hintIndex =
        deviceState.stage === 'clues_revealed'
          ? 0
          : 1;
      return `Pista sobre ${selectedDevice.name}: ${selectedDevice.hintProgressive[hintIndex]} Lembre-se de analisar os indícios nos registros antes de decidir!`;
    }

    return `Você está inspecionando "${selectedDevice.name}" (${selectedDevice.protocol}). Ele ${
      selectedDevice.isInitiallyVulnerable
        ? 'apresenta sinais que merecem investigação cuidadosa — observe os registros marcados como suspeitos e considere o impacto para a privacidade e controle da casa.'
        : 'pode estar devidamente protegido! Confira se há atualização em dia, criptografia forte e ausência de permissões excessivas.'
    } Se quiser uma pista progressiva, clique em "Pedir pista deste dispositivo".`;
  }

  // General guidance
  const remainingNames = SMART_DEVICES.filter((d) => d.isInitiallyVulnerable)
    .slice(0, 3)
    .map((d) => d.shortName)
    .join(', ');

  return `Olá! Sou o CYBER ASSISTANT. Minha missão é ajudar você a entender os conceitos de cibersegurança em Smart Homes sem entregar as respostas prontas. Clique em qualquer dispositivo na casa 3D (como ${remainingNames}) para inspecionar seus registros técnicos, identificar vulnerabilidades e escolher a proteção ideal.`;
}
