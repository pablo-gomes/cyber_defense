import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { getClassification, ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import { computeSecurityPercent, useGameStore } from '../store/useGameStore';

function formatTime(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}

export function FinalReportView() {
  const score = useGameStore((s) => s.score);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const decisionLog = useGameStore((s) => s.decisionLog);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const resetMission = useGameStore((s) => s.resetMission);

  const securityPercent = computeSecurityPercent(deviceStates);
  const classification = getClassification(score);

  const investigatedDevices = SMART_DEVICES.filter(
    (d) => deviceStates[d.id]?.stage !== 'locked',
  );
  const vulnerableDevices = SMART_DEVICES.filter((d) => d.isInitiallyVulnerable && d.challenge);
  const fixedVulnerabilities = vulnerableDevices.filter(
    (d) => deviceStates[d.id]?.status === 'protected',
  );
  const unfixedVulnerabilities = vulnerableDevices.filter(
    (d) => deviceStates[d.id]?.status !== 'protected',
  );
  const recognizedThreats = vulnerableDevices.filter((d) => {
    const st = deviceStates[d.id]?.stage;
    return st === 'threat_recognized' || st === 'resolved';
  });

  const correctDecisions = decisionLog.filter((d) => d.quality === 'correct');
  const partialDecisions = decisionLog.filter((d) => d.quality === 'partial');
  const incorrectDecisions = decisionLog.filter((d) => d.quality === 'incorrect');

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const lines: string[] = [
      'CYBER DEFENSE — RELATÓRIO FINAL DE AUDITORIA SMART HOME',
      '========================================================',
      `Pontuação Final: ${score} / 1000 pontos`,
      `Segurança Residencial: ${securityPercent}%`,
      `Classificação: ${classification.label}`,
      `Tempo de Auditoria: ${formatTime(elapsedSeconds)}`,
      `Dispositivos Investigados: ${investigatedDevices.length} / ${SMART_DEVICES.length}`,
      '',
      'VULNERABILIDADES CORRIGIDAS:',
      ...fixedVulnerabilities.map(
        (d) => `- [CORRIGIDA] ${d.name}: ${d.challenge!.vulnerabilityTitle}`,
      ),
      '',
      'VULNERABILIDADES PENDENTES / NÃO CORRIGIDAS:',
      ...(unfixedVulnerabilities.length > 0
        ? unfixedVulnerabilities.map(
            (d) =>
              `- [${d.challenge!.threat.severity}] ${d.name}: ${d.challenge!.vulnerabilityTitle}`,
          )
        : ['- Nenhuma vulnerabilidade pendente.']),
      '',
      'REGISTRO DE DECISÕES:',
      ...decisionLog.map(
        (entry) =>
          `- ${entry.deviceName} (${entry.step}): ${entry.chosenText} [${entry.quality.toUpperCase()} | ${entry.pointsDelta >= 0 ? '+' : ''}${entry.pointsDelta} pts]`,
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyber-defense-relatorio-auditoria.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print-report min-h-screen w-full overflow-y-auto bg-[#F5F6F8] text-[#18212F]">
      {/* Top Action Bar (hidden when printing PDF) */}
      <header className="no-print sticky top-0 z-20 border-b border-[#E9EDF2] bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#315EAA]/20 bg-[#EFF6FF] text-[#315EAA]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-[#18212F]">
                Relatório Final de Auditoria
              </h1>
              <p className="text-xs text-[#64748B]">CYBER DEFENSE · Smart Home</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => goToScreen('playing')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-white px-3.5 py-2 text-xs font-medium text-[#18212F] hover:bg-[#F8FAFC] whitespace-nowrap"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#64748B]" />
              <span>Voltar à casa 3D</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-white px-3.5 py-2 text-xs font-medium text-[#18212F] hover:bg-[#F8FAFC] whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-[#64748B]" />
              <span>Baixar (.txt)</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-2 text-xs font-semibold text-[#315EAA] hover:bg-[#DBEAFE] whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Exportar PDF</span>
            </button>
            <button
              type="button"
              onClick={resetMission}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#315EAA] px-4 py-2 text-xs font-semibold text-white hover:bg-[#274D8C] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Jogar novamente</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {/* Executive Summary */}
        <section className="print-card rounded-2xl border border-[#E9EDF2] bg-white p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold text-[#315EAA]">
                Resumo executivo da auditoria residencial
              </p>
              <h2 className={`font-display mt-1 text-2xl font-bold ${classification.tierColor}`}>
                {classification.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">
                {classification.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:min-w-[430px]">
              <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
                <div className="text-[11px] font-medium text-[#64748B]">Pontuação</div>
                <div className="mt-1 font-mono text-2xl font-bold text-[#18212F] tabular-nums">
                  {score}
                  <span className="text-xs font-normal text-[#64748B]">/1000</span>
                </div>
              </div>
              <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
                <div className="text-[11px] font-medium text-[#64748B]">Segurança</div>
                <div className="mt-1 font-mono text-2xl font-bold text-[#197A52] tabular-nums">
                  {securityPercent}%
                </div>
              </div>
              <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
                <div className="text-[11px] font-medium text-[#64748B]">Investigados</div>
                <div className="mt-1 font-mono text-2xl font-bold text-[#315EAA] tabular-nums">
                  {investigatedDevices.length}/{SMART_DEVICES.length}
                </div>
              </div>
              <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
                <div className="text-[11px] font-medium text-[#64748B]">Duração</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#18212F] tabular-nums">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vulnerabilities & Threats Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Vulnerabilities */}
          <section className="print-card rounded-2xl border border-[#E9EDF2] bg-white p-6">
            <h3 className="font-display text-base font-bold text-[#18212F]">
              Vulnerabilidades ({fixedVulnerabilities.length} corrigidas ·{' '}
              {unfixedVulnerabilities.length} pendentes)
            </h3>
            <div className="mt-4 space-y-3">
              {vulnerableDevices.map((dev) => {
                const st = deviceStates[dev.id];
                const isFixed = st?.status === 'protected';
                const isIdentified =
                  st?.stage === 'vulnerability_identified' ||
                  st?.stage === 'threat_recognized' ||
                  st?.stage === 'resolved';
                const roomName = ROOMS.find((r) => r.id === dev.roomId)?.name ?? '';

                return (
                  <div
                    key={dev.id}
                    className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#18212F]">
                        {dev.name} · <span className="font-normal text-[#64748B]">{roomName}</span>
                      </span>
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          isFixed
                            ? 'text-[#197A52]'
                            : isIdentified
                              ? 'text-[#B45309]'
                              : 'text-[#B91C1C]'
                        }`}
                      >
                        {isFixed
                          ? 'Corrigida'
                          : st?.status === 'partial'
                            ? 'Parcialmente corrigida'
                            : isIdentified
                              ? 'Identificada (pendente)'
                              : 'Não auditada'}
                      </span>
                    </div>
                    <p className="mt-1 text-[#475569]">{dev.challenge!.vulnerabilityTitle}</p>
                    <div className="mt-1 text-[11px] text-[#64748B]">
                      Gravidade: {dev.challenge!.threat.severity}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Threats */}
          <section className="print-card rounded-2xl border border-[#E9EDF2] bg-white p-6">
            <h3 className="font-display text-base font-bold text-[#18212F]">
              Ameaças e consequências ({recognizedThreats.length}/{vulnerableDevices.length}{' '}
              reconhecidas)
            </h3>
            <div className="mt-4 space-y-3">
              {vulnerableDevices.map((dev) => {
                const st = deviceStates[dev.id];
                const recognized =
                  st?.stage === 'threat_recognized' || st?.stage === 'resolved';
                const threat = dev.challenge!.threat;
                return (
                  <div
                    key={dev.id}
                    className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#18212F]">{threat.title}</span>
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                          threat.severity === 'ALTO'
                            ? 'text-[#B91C1C]'
                            : threat.severity === 'MÉDIO'
                              ? 'text-[#B45309]'
                              : 'text-[#315EAA]'
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {threat.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-[#475569]">{threat.consequences}</p>
                    <div className="mt-1 text-[11px] text-[#64748B]">
                      Status:{' '}
                      {recognized
                        ? 'Ameaça reconhecida durante a auditoria'
                        : 'Não avaliada pelo auditor'}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Decisions Log */}
        <section className="print-card rounded-2xl border border-[#E9EDF2] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-[#18212F]">
              Histórico de decisões ({decisionLog.length})
            </h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-[#197A52]">Corretas: {correctDecisions.length}</span>
              <span className="text-[#B45309]">Parciais: {partialDecisions.length}</span>
              <span className="text-[#B91C1C]">Incorretas: {incorrectDecisions.length}</span>
            </div>
          </div>

          {decisionLog.length === 0 ? (
            <p className="mt-4 text-xs text-[#64748B]">
              Nenhuma decisão registrada ainda nesta partida. Volte à Smart Home para investigar
              os dispositivos.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-[#E9EDF2]">
              {decisionLog.map((entry) => (
                <div key={entry.id} className="flex items-start justify-between gap-4 py-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    {entry.quality === 'correct' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#197A52]" />
                    ) : entry.quality === 'partial' ? (
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C]" />
                    )}
                    <div>
                      <div className="font-semibold text-[#18212F]">
                        {entry.deviceName} ·{' '}
                        <span className="font-normal text-[#64748B]">
                          {entry.step === 'vulnerability'
                            ? 'Identificação de vulnerabilidade'
                            : entry.step === 'threat'
                              ? 'Reconhecimento de ameaça'
                              : entry.step === 'protection'
                                ? 'Medida de proteção'
                                : 'Validação de dispositivo'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[#18212F]">{entry.chosenText}</p>
                      <p className="mt-1 text-[11px] text-[#64748B]">{entry.explanation}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 font-mono font-semibold tabular-nums ${
                      entry.pointsDelta >= 0 ? 'text-[#197A52]' : 'text-[#B91C1C]'
                    }`}
                  >
                    {entry.pointsDelta >= 0 ? `+${entry.pointsDelta}` : entry.pointsDelta} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Final Pedagogical Conclusion */}
        <section className="print-card flex items-center justify-between gap-4 rounded-2xl border border-[#E9EDF2] bg-white p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#315EAA]" />
            <div>
              <h3 className="font-display text-sm font-bold text-[#18212F]">
                Avaliação geral da residência
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                Uma Smart Home segura combina cinco pilares: senhas fortes e exclusivas,
                autenticação multifator (MFA), atualizações regulares de firmware, criptografia
                moderna no Wi-Fi (WPA3/WPA2-AES) com segmentação IoT e princípio do menor
                privilégio nas permissões.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
