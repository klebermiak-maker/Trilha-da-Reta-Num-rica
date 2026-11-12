import React, { useState } from 'react';
import {
  Compass,
  GripVertical,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Cloud,
  Check,
} from 'lucide-react';
import { ObjectIllustration } from './ObjectIllustration';

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onAcceptAndAgree: () => void;
}

interface StepItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onAcceptAndAgree,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: StepItem[] = [
    {
      id: 1,
      title: 'Bem-vindo à Trilha da Reta Numérica!',
      subtitle: 'Compreenda a escala e a orientação crescente dos números',
      icon: <Compass className="w-6 h-6 text-sky-600" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            A <strong className="text-slate-900 font-semibold">Reta Numérica</strong> é uma linha graduada com marcas espaçadas em intervalos iguais:
          </p>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 border-b border-slate-200 pb-2">
              <span className="text-rose-600">← Menores (Esquerda)</span>
              <span className="text-sky-700 font-extrabold px-2 py-0.5 bg-sky-100 rounded">0 (Origem)</span>
              <span className="text-emerald-700">Maiores (Direita) →</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
              <span>Negativos: -3, -2, -1</span>
              <span>Naturais: 1, 2, 3...</span>
            </div>
          </div>
          <p>
            Você vai explorar desde números naturais simples (0 a 10) até dezenas, negativos, decimais e frações com objetos ilustrados!
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Etapa 1: Arrastar e Posicionar na Reta',
      subtitle: 'Como posicionar números e itens nos pontos corretos',
      icon: <GripVertical className="w-6 h-6 text-sky-600" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Na parte inferior da tela, você encontrará a <strong className="text-slate-900 font-semibold">Bancada de Cartões</strong> com números e itens:
          </p>
          <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2.5">
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <ObjectIllustration kind="rocket" className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Foguete (Posição +6)</div>
                <div className="text-slate-500">6 unidades à direita do zero</div>
              </div>
            </div>
            <div className="text-xs text-slate-700">
              👉 <strong>Modos de posicionamento:</strong> você pode <em>arrastar o cartão</em> até a caixa tracejada <strong>[ ? ]</strong> na reta, ou simplesmente <em>clicar no cartão</em> e depois <em>clicar na posição</em> desejada.
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Dica: use o botão <strong>Dica</strong> nos cartões caso queira visualizar arcos de salto explicativos.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Etapa 2: Detetive da Reta & Dedução',
      subtitle: 'Identifique marcos fixos e distâncias',
      icon: <Eye className="w-6 h-6 text-sky-600" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Acima da reta há objetos de referência já fixados (Sapo, Tartaruga, Submarino, etc.). No painel lateral <strong className="text-slate-900 font-semibold">Detetive da Reta</strong>:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Localização Exata</span>
              <span>Identifique em qual número exato cada objeto se encontra observando a escala.</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Cálculo de Distâncias</span>
              <span>Calcule quantos passos ou unidades separam dois pontos na reta.</span>
            </div>
          </div>
          <p>
            Ao responder corretamente, as coordenadas ocultas dos marcos são reveladas na reta!
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Verificação, Pontuação e Google Drive',
      subtitle: 'Feedback imediato, relatório pedagógico e backup na nuvem',
      icon: <Sparkles className="w-6 h-6 text-sky-600" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verificação com Correção Clara:</span>
            </div>
            <p className="text-xs text-emerald-900">
              Clique em <strong>&quot;Verificar Respostas&quot;</strong> a qualquer momento. Os acertos recebem o selo <strong>✓ Correto</strong> e os itens fora de lugar recebem <strong>✕ Ajustar</strong> para você tentar de novo.
            </p>
          </div>

          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
              <Cloud className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Google Drive &amp; Relatórios:</span>
            </div>
            <p className="text-xs text-sky-900">
              Acompanhe seu desempenho no <strong>Gráfico de Barras</strong> e salve seu progresso ou exporte relatórios escolares diretamente para sua conta do Google Drive com permissão.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Step Tracker */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div>
              <div className="text-[11px] font-bold text-sky-700 tracking-wide uppercase">
                Passo {step.id} de {steps.length}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-tight">
                {step.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Step Body Content */}
        <div className="min-h-[170px] flex flex-col justify-center">
          <div className="text-xs font-medium text-slate-500 mb-2">{step.subtitle}</div>
          {step.content}
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentStep === idx
                  ? 'w-6 bg-sky-600'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Ir para passo ${s.id}`}
              aria-label={`Passo ${s.id}`}
            />
          ))}
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            {!isLastStep ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onAcceptAndAgree}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Aceito e concordo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
