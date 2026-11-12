import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  Eye,
  FlaskConical,
  GripVertical,
  HelpCircle,
  Lightbulb,
  MapPin,
  RotateCcw,
  Sliders,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { CustomLabConfig, GameLevel, LevelProgress } from './types/game';
import { createCustomLabLevel, formatPtNumber, GAME_LEVELS } from './data/levels';
import { NumberLineCanvas, toPosKey } from './components/NumberLineCanvas';
import { ObjectIllustration } from './components/ObjectIllustration';
import { PerformanceReport } from './components/PerformanceReport';
import { InteractiveTutorialModal } from './components/InteractiveTutorialModal';
import { sound } from './utils/sound';

type ActiveTab = 'play' | 'levels' | 'lab' | 'guide';

const HERO_ILLUSTRATION_PATH = '/src/assets/images/hero_number_line_explorer_1794499155749.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('play');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [customLevel, setCustomLevel] = useState<GameLevel | null>(null);
  const [labConfig, setLabConfig] = useState<CustomLabConfig>({
    mode: 'integers_pos',
    difficulty: 'medium',
  });
  const [labSeed, setLabSeed] = useState<number>(1);

  // Per-level interactive state
  const [placedTokens, setPlacedTokens] = useState<Record<string, string>>({});
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [activeHintTokenId, setActiveHintTokenId] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<Record<string, 'correct' | 'wrong' | undefined>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [showJumpArcs, setShowJumpArcs] = useState<boolean>(true);
  const [showSubdivisions, setShowSubdivisions] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'partial' | 'info';
    message: string;
  } | null>(null);

  // Interactive tutorial state
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('trilha_reta_numerica_tutorial_accepted');
      return accepted !== 'true';
    }
    return false;
  });

  const handleAcceptTutorial = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trilha_reta_numerica_tutorial_accepted', 'true');
    }
    setIsTutorialOpen(false);
    sound.playSuccess();
    setFeedbackBanner({
      type: 'success',
      message: 'Tutorial concluído com sucesso! Comece arrastando os cartões para a reta numérica.',
    });
  };

  // Track student progress across all 8 campaign levels
  const [progressMap, setProgressMap] = useState<Record<number, LevelProgress>>(() => {
    const initial: Record<number, LevelProgress> = {};
    GAME_LEVELS.forEach((lvl) => {
      initial[lvl.id] = {
        levelId: lvl.id,
        completed: false,
        stars: 0,
        bestScore: 0,
        attempts: 0,
      };
    });
    return initial;
  });

  const activeLevel: GameLevel = customLevel ?? GAME_LEVELS[currentLevelIndex];

  const resetRoundState = () => {
    setPlacedTokens({});
    setSelectedTokenId(null);
    setActiveHintTokenId(null);
    setValidationState({});
    setQuestionAnswers({});
    setFeedbackBanner(null);
  };

  const selectCampaignLevel = (index: number) => {
    setCustomLevel(null);
    setCurrentLevelIndex(index);
    resetRoundState();
    setActiveTab('play');
  };

  const startCustomLabRound = (newConfig?: CustomLabConfig) => {
    const cfg = newConfig ?? labConfig;
    const nextSeed = labSeed + 1;
    setLabSeed(nextSeed);
    const generated = createCustomLabLevel(cfg, nextSeed);
    setCustomLevel(generated);
    resetRoundState();
    setActiveTab('play');
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.muted = next;
  };

  // Place a draggable token into a target position slot on the number line
  const handlePlaceToken = (positionKey: string, tokenId: string) => {
    const existsInLevel = activeLevel.tokens.some((t) => t.id === tokenId);
    if (!existsInLevel) return;

    sound.playPlace();
    setPlacedTokens((prev) => {
      const updated = { ...prev };
      // If this token was already placed in another slot, remove it from the old slot
      Object.keys(updated).forEach((k) => {
        if (updated[k] === tokenId) {
          delete updated[k];
        }
      });
      updated[positionKey] = tokenId;
      return updated;
    });

    // Clear previous validation status for edited slot
    setValidationState((prev) => {
      const next = { ...prev };
      delete next[positionKey];
      return next;
    });
    setSelectedTokenId(null);
    setFeedbackBanner(null);
  };

  const handleRemoveToken = (positionKey: string) => {
    sound.playPickup();
    setPlacedTokens((prev) => {
      const updated = { ...prev };
      delete updated[positionKey];
      return updated;
    });
    setValidationState((prev) => {
      const next = { ...prev };
      delete next[positionKey];
      return next;
    });
    setFeedbackBanner(null);
  };

  // Check all placed tokens on the number line + identification questions
  const handleVerifyRound = () => {
    const newValidation: Record<string, 'correct' | 'wrong'> = {};
    let correctPlacements = 0;

    activeLevel.dropPositions.forEach((pos) => {
      const key = toPosKey(pos);
      const placedId = placedTokens[key];
      if (!placedId) return;
      const token = activeLevel.tokens.find((t) => t.id === placedId);
      if (token && Math.abs(token.targetPosition - pos) < 1e-4) {
        newValidation[key] = 'correct';
        correctPlacements++;
      } else {
        newValidation[key] = 'wrong';
      }
    });

    setValidationState(newValidation);

    const totalSlots = activeLevel.dropPositions.length;
    const placedCount = Object.keys(placedTokens).length;

    const totalQuestions = activeLevel.questions.length;
    let correctQuestions = 0;
    activeLevel.questions.forEach((q) => {
      if (questionAnswers[q.id] === q.correctValue) {
        correctQuestions++;
      }
    });

    const partialScore = correctPlacements * 25 + correctQuestions * 25;

    if (placedCount < totalSlots) {
      sound.playError();
      if (!customLevel && partialScore > 0) {
        setProgressMap((prev) => {
          const current = prev[activeLevel.id];
          return {
            ...prev,
            [activeLevel.id]: {
              levelId: activeLevel.id,
              completed: current?.completed ?? false,
              stars: current?.stars ?? 0,
              bestScore: Math.max(current?.bestScore ?? 0, partialScore),
              attempts: (current?.attempts ?? 0) + 1,
            },
          };
        });
      }
      setFeedbackBanner({
        type: 'info',
        message: `Você posicionou ${placedCount} de ${totalSlots} itens na reta (${correctPlacements} corretos até agora). Arraste todos os cartões para concluir!`,
      });
      return;
    }

    if (correctPlacements === totalSlots && correctQuestions === totalQuestions) {
      sound.playLevelComplete();
      const earnedStars = activeHintTokenId ? 2 : 3;
      const earnedScore = totalSlots * 25 + correctQuestions * 25;

      if (!customLevel) {
        setProgressMap((prev) => {
          const current = prev[activeLevel.id];
          return {
            ...prev,
            [activeLevel.id]: {
              levelId: activeLevel.id,
              completed: true,
              stars: Math.max(current?.stars ?? 0, earnedStars),
              bestScore: Math.max(current?.bestScore ?? 0, earnedScore),
              attempts: (current?.attempts ?? 0) + 1,
            },
          };
        });
      }

      setFeedbackBanner({
        type: 'success',
        message: `Excelente! Todos os ${totalSlots} itens na reta e as ${totalQuestions} perguntas de identificação estão corretos! (+${earnedScore} pts)`,
      });
    } else if (correctPlacements === totalSlots && correctQuestions < totalQuestions) {
      sound.playSuccess();
      if (!customLevel) {
        setProgressMap((prev) => {
          const current = prev[activeLevel.id];
          return {
            ...prev,
            [activeLevel.id]: {
              levelId: activeLevel.id,
              completed: current?.completed ?? false,
              stars: Math.max(current?.stars ?? 0, 1),
              bestScore: Math.max(current?.bestScore ?? 0, partialScore),
              attempts: (current?.attempts ?? 0) + 1,
            },
          };
        });
      }
      setFeedbackBanner({
        type: 'partial',
        message: `Perfeito na reta numérica (${totalSlots}/${totalSlots})! Agora responda às perguntas do "Detetive da Reta" no painel ao lado para fechar o nível com 100%.`,
      });
    } else {
      sound.playError();
      if (!customLevel) {
        setProgressMap((prev) => {
          const current = prev[activeLevel.id];
          return {
            ...prev,
            [activeLevel.id]: {
              levelId: activeLevel.id,
              completed: current?.completed ?? false,
              stars: current?.stars ?? 0,
              bestScore: Math.max(current?.bestScore ?? 0, partialScore),
              attempts: (current?.attempts ?? 0) + 1,
            },
          };
        });
      }
      setFeedbackBanner({
        type: 'partial',
        message: `Você acertou ${correctPlacements} de ${totalSlots} posições na reta. Os itens marcados com "✕ Ajustar" precisam ser movidos — use o botão de Dica se precisar!`,
      });
    }
  };

  const handleAnswerQuestion = (questionId: string, optionValue: string, correctValue: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [questionId]: optionValue }));
    if (optionValue === correctValue) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  // Compute aggregate stats
  const totalStats = useMemo(() => {
    const list = Object.values(progressMap) as LevelProgress[];
    const completedCount = list.filter((p) => p.completed).length;
    const totalStars = list.reduce((acc, p) => acc + p.stars, 0);
    const totalScore = list.reduce((acc, p) => acc + p.bestScore, 0);
    return { completedCount, totalStars, totalScore };
  }, [progressMap]);

  // Determine if all identification questions are solved (to reveal hidden landmark coordinates)
  const allQuestionsSolved = useMemo(() => {
    return activeLevel.questions.every((q) => questionAnswers[q.id] === q.correctValue);
  }, [activeLevel, questionAnswers]);

  const allSlotsCorrect = useMemo(() => {
    return (
      activeLevel.dropPositions.length > 0 &&
      activeLevel.dropPositions.every((pos) => validationState[toPosKey(pos)] === 'correct')
    );
  }, [activeLevel, validationState]);

  const isLevelComplete = allSlotsCorrect && allQuestionsSolved;

  const goToNextLevel = () => {
    if (customLevel) {
      startCustomLabRound();
      return;
    }
    if (currentLevelIndex < GAME_LEVELS.length - 1) {
      selectCampaignLevel(currentLevelIndex + 1);
    } else {
      setActiveTab('levels');
    }
  };

  const activeHintToken = activeLevel.tokens.find((t) => t.id === activeHintTokenId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strictly Compliant 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element brand wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('play');
            }}
            className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Trilha da Reta Numérica
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('play')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                activeTab === 'play' ? 'text-sky-700 font-semibold border-b-2 border-sky-600' : ''
              }`}
            >
              Missão Atual
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('levels')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                activeTab === 'levels' ? 'text-sky-700 font-semibold border-b-2 border-sky-600' : ''
              }`}
            >
              Mapa de Níveis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lab')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                activeTab === 'lab' ? 'text-sky-700 font-semibold border-b-2 border-sky-600' : ''
              }`}
            >
              Laboratório Livre
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                activeTab === 'guide' ? 'text-sky-700 font-semibold border-b-2 border-sky-600' : ''
              }`}
            >
              Guia Pedagógico
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'play') {
                  setActiveTab('play');
                } else if (isLevelComplete) {
                  goToNextLevel();
                } else {
                  handleVerifyRound();
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {activeTab !== 'play'
                ? 'Voltar ao Jogo'
                : isLevelComplete
                ? 'Próximo Nível'
                : 'Verificar Respostas'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Strip (visible only below md) */}
      <div className="md:hidden flex items-center justify-around bg-white border-b border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('play')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'play' ? 'text-sky-700 font-semibold bg-sky-50' : ''
          }`}
        >
          Missão Atual
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('levels')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'levels' ? 'text-sky-700 font-semibold bg-sky-50' : ''
          }`}
        >
          Níveis (1–8)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lab')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'lab' ? 'text-sky-700 font-semibold bg-sky-50' : ''
          }`}
        >
          Laboratório
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'guide' ? 'text-sky-700 font-semibold bg-sky-50' : ''
          }`}
        >
          Guia
        </button>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* =========================================================
            VIEW 1: ACTIVE GAME SANDBOX (MISSÃO ATUAL)
           ========================================================= */}
        {activeTab === 'play' && (
          <div className="space-y-6">
            {/* Level Selector Strip & Unboxed Metadata Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                {/* Clean unboxed metadata with typographic separators (Zero-Pill Rule) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-sky-700">{activeLevel.difficultyLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Habilidade {activeLevel.bnccCode}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    Pontuação Total: {totalStats.totalScore} pts ({totalStats.totalStars}/24 estrelas)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                  {activeLevel.title}
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl">{activeLevel.pedagogicalGoal}</p>
              </div>

              {/* Interactive Level Stepper & Simulation Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Segmented Level Selector Buttons (1 to 8) */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {GAME_LEVELS.map((lvl, idx) => {
                    const isCurrent = !customLevel && currentLevelIndex === idx;
                    const isDone = progressMap[lvl.id]?.completed;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => selectCampaignLevel(idx)}
                        title={`Nível ${lvl.id}: ${lvl.title}`}
                        className={`w-8 h-8 rounded-md text-xs font-mono-num font-semibold transition-colors flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'bg-sky-600 text-white shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        {lvl.id}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={toggleMute}
                  title={isMuted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
                  className="p-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsTutorialOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-800 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Abrir o tutorial interativo passo a passo"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  Tutorial
                </button>

                <button
                  type="button"
                  onClick={resetRoundState}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar Nível
                </button>
              </div>
            </div>

            {/* Feedback Banner when user checks answers or completes level */}
            {feedbackBanner && (
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  feedbackBanner.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : feedbackBanner.type === 'partial'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-sky-50 border-sky-200 text-sky-950'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  {feedbackBanner.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                  ) : feedbackBanner.type === 'partial' ? (
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <p className="text-sm font-medium">{feedbackBanner.message}</p>
                </div>

                {isLevelComplete && (
                  <button
                    type="button"
                    onClick={goToNextLevel}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                  >
                    <span>
                      {customLevel
                        ? 'Gerar Novo Desafio'
                        : currentLevelIndex < GAME_LEVELS.length - 1
                        ? `Avançar para Nível ${currentLevelIndex + 2}`
                        : 'Ver Quadro de Conquistas'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Two-Zone Educational Sandbox Split (Left 68% Stage / Right 32% Control & Concept Deck) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT ZONE (8 cols): Interactive Number Line Canvas + Draggable Item Tray */}
              <div className="lg:col-span-8 space-y-6">
                {/* Visual Scaffolds Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span>Etapa 1: Posicione os Números e Objetos na Reta</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowJumpArcs((v) => !v)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        showJumpArcs
                          ? 'bg-sky-50 border-sky-300 text-sky-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {showJumpArcs ? '✓ Arcos de Salto: Ativos' : 'Arcos de Salto: Ocultos'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSubdivisions((v) => !v)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        showSubdivisions
                          ? 'bg-sky-50 border-sky-300 text-sky-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {showSubdivisions ? '✓ Subdivisões: Visíveis' : 'Subdivisões: Ocultas'}
                    </button>
                  </div>
                </div>

                {/* Interactive Number Line Component */}
                <NumberLineCanvas
                  level={activeLevel}
                  placedTokens={placedTokens}
                  selectedTokenId={selectedTokenId}
                  activeHintTokenId={activeHintTokenId}
                  showJumpArcs={showJumpArcs}
                  showSubdivisions={showSubdivisions}
                  validationState={validationState}
                  revealedLandmarks={allQuestionsSolved}
                  onPlaceToken={handlePlaceToken}
                  onRemoveToken={handleRemoveToken}
                />

                {/* Draggable Items Tray (Bancada de Números e Objetos) */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-display font-bold text-slate-900">
                        Bancada de Cartões (Arraste para a Reta)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Arraste cada cartão até o ponto correspondente na reta ou clique no cartão e depois no espaço <span className="font-mono-num">[ ? ]</span>.
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 font-mono-num">
                      Posicionados: {Object.keys(placedTokens).length} de {activeLevel.tokens.length}
                    </div>
                  </div>

                  {/* Grid of Draggable Token Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLevel.tokens.map((token) => {
                      const placedEntry = Object.entries(placedTokens).find(([, id]) => id === token.id);
                      const isPlaced = Boolean(placedEntry);
                      const placedPosKey = placedEntry?.[0];
                      const isSelected = selectedTokenId === token.id;
                      const isHintActive = activeHintTokenId === token.id;
                      const slotStatus = placedPosKey ? validationState[placedPosKey] : undefined;

                      return (
                        <div
                          key={token.id}
                          draggable={!isPlaced}
                          onDragStart={(e) => {
                            sound.playPickup();
                            setSelectedTokenId(token.id);
                            e.dataTransfer.setData('text/plain', token.id);
                          }}
                          onClick={() => {
                            if (isPlaced && placedPosKey) {
                              handleRemoveToken(placedPosKey);
                              return;
                            }
                            sound.playPickup();
                            setSelectedTokenId((prev) => (prev === token.id ? null : token.id));
                          }}
                          className={`group relative rounded-xl border p-3.5 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isPlaced
                              ? slotStatus === 'correct'
                                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                                : slotStatus === 'wrong'
                                ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                                : 'bg-slate-50 border-slate-200 opacity-75'
                              : isSelected
                              ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/20 shadow-xs'
                              : isHintActive
                              ? 'bg-amber-50/70 border-amber-400'
                              : 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="text-slate-400 group-hover:text-slate-600 shrink-0">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            {token.objectKind ? (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <ObjectIllustration kind={token.objectKind} className="w-7 h-7" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                                <span className="text-sm font-mono-num font-bold text-sky-800">
                                  {token.displayLabel}
                                </span>
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900 font-mono-num truncate">
                                  {token.displayLabel}
                                </span>
                                {isPlaced && placedPosKey && (
                                  <span className="text-[11px] font-mono-num text-slate-500">
                                    · Na marca {formatPtNumber(Number(placedPosKey))}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 truncate">{token.clueLabel}</p>
                            </div>
                          </div>

                          {/* Right Actions: Hint Button or Status */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHintTokenId((prev) => (prev === token.id ? null : token.id));
                                setSelectedTokenId(token.id);
                              }}
                              title="Mostrar dica visual na reta"
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
                                isHintActive
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300'
                              }`}
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Dica</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Hint Callout Box */}
                  {activeHintToken && (
                    <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-xs text-amber-950">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Dica para {activeHintToken.displayLabel}: </span>
                          <span>{activeHintToken.hint}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveHintTokenId(null)}
                        className="text-amber-800 hover:text-amber-950 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Fechar
                      </button>
                    </div>
                  )}

                  {/* Primary Action Footer inside Tray */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPlacedTokens({});
                        setValidationState({});
                        setFeedbackBanner(null);
                      }}
                      disabled={Object.keys(placedTokens).length === 0}
                      className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Limpar Itens da Reta
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleVerifyRound}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verificar Posições na Reta</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT ZONE (4 cols): Detective Identification Challenges & Concept Deck */}
              <div className="lg:col-span-4 space-y-6">
                {/* Detective Identification Questions Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-sky-600" />
                        <span>Etapa 2: Detetive da Reta</span>
                      </h2>
                      <span className="text-xs font-mono-num text-slate-500">
                        {
                          activeLevel.questions.filter((q) => questionAnswers[q.id] === q.correctValue)
                            .length
                        }
                        /{activeLevel.questions.length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Observe os objetos fixos já posicionados acima da reta numérica e responda:
                    </p>
                  </div>

                  <div className="space-y-5">
                    {activeLevel.questions.map((q, qIdx) => {
                      const selectedAnswer = questionAnswers[q.id];
                      const isCorrect = selectedAnswer === q.correctValue;
                      const isAnswered = selectedAnswer !== undefined;

                      return (
                        <div key={q.id} className="space-y-2.5">
                          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                            {qIdx + 1}. {q.prompt}
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt) => {
                              const isThisSelected = selectedAnswer === opt.value;
                              const isThisCorrect = opt.value === q.correctValue;

                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleAnswerQuestion(q.id, opt.value, q.correctValue)}
                                  className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                                    isThisSelected
                                      ? isThisCorrect
                                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                                        : 'bg-rose-50 border-rose-600 text-rose-950 font-semibold'
                                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-sky-400'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5 truncate">
                                    {opt.objectKind && (
                                      <ObjectIllustration kind={opt.objectKind} className="w-4 h-4 shrink-0" />
                                    )}
                                    <span className="font-mono-num truncate">{opt.label}</span>
                                  </span>

                                  {isThisSelected && (
                                    <span className="shrink-0">
                                      {isThisCorrect ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                                      ) : (
                                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                      )}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {isAnswered && (
                            <div
                              className={`p-2.5 rounded-lg text-xs border ${
                                isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
                              }`}
                            >
                              {isCorrect ? (
                                <span>
                                  <strong>✓ Correto:</strong> {q.explanation}
                                </span>
                              ) : (
                                <span>
                                  <strong>✕ Tente outra opção:</strong> Observe a distância entre as marcas principais da escala.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mathematical Concept & Scale Summary Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Resumo Conceitual do Nível</span>
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <p>
                      <strong className="text-slate-900">Intervalo atual:</strong> de{' '}
                      <span className="font-mono-num font-semibold">{formatPtNumber(activeLevel.min)}</span> até{' '}
                      <span className="font-mono-num font-semibold">{formatPtNumber(activeLevel.max)}</span>.
                    </p>
                    <p>
                      <strong className="text-slate-900">Regra de ouro da reta:</strong> números à{' '}
                      <strong>direita</strong> são sempre maiores, e números à <strong>esquerda</strong> são sempre menores.
                    </p>
                    {activeLevel.min < 0 && (
                      <p>
                        <strong className="text-slate-900">Números Simétricos:</strong> dois números opostos (como{' '}
                        <span className="font-mono-num">-6</span> e <span className="font-mono-num">+6</span>) estão exatamente à mesma distância do zero.
                      </p>
                    )}
                    {activeLevel.minorStep < 1 && (
                      <p>
                        <strong className="text-slate-900">Partes da Unidade:</strong> cada inteiro foi dividido em partes iguais de{' '}
                        <span className="font-mono-num font-semibold">{formatPtNumber(activeLevel.minorStep)}</span>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 2: MAPA DE NÍVEIS (8 PROGRESSIVE LEVELS + HERO)
           ========================================================= */}
        {activeTab === 'levels' && (
          <div className="space-y-8">
            {/* Hero Overview Split with Generated Visual Asset & Resilient Fallback */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Currículo de Matemática</span>
                    <span aria-hidden="true">·</span>
                    <span>8 Níveis Progressivos</span>
                    <span aria-hidden="true">·</span>
                    <span>Alinhado à BNCC</span>
                  </div>

                  <h1
                    className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    Jornada Completa pela Reta Numérica
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    Avance desde a contagem natural de 0 a 10 até números inteiros negativos, decimais, frações e deslocamentos com operações. Todos os níveis estão desbloqueados para estudo individual ou uso em sala de aula.
                  </p>
                </div>

                {/* Progress KPI Strip */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500">Níveis Concluídos</div>
                    <div className="text-xl font-display font-bold font-mono-num text-slate-900">
                      {totalStats.completedCount} / 8
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Estrelas Conquistadas</div>
                    <div className="text-xl font-display font-bold font-mono-num text-amber-600">
                      {totalStats.totalStars} / 24
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Pontuação Acumulada</div>
                    <div className="text-xl font-display font-bold font-mono-num text-sky-700">
                      {totalStats.totalScore} pts
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Generated Image with Zero-Broken-Image Fallback */}
              <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[220px] flex items-center justify-center">
                {!heroImgFailed ? (
                  <img
                    src={HERO_ILLUSTRATION_PATH}
                    alt="Ilustração educativa da jornada pela reta numérica com foguete, submarino, estrelas e régua graduada"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center space-y-2 bg-gradient-to-br from-sky-50 to-amber-50 w-full h-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3">
                      <ObjectIllustration kind="submarine" className="w-10 h-10" />
                      <ObjectIllustration kind="compass" className="w-10 h-10" />
                      <ObjectIllustration kind="rocket" className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-display font-bold text-slate-800">
                      Explorador da Reta Numérica
                    </p>
                    <p className="text-xs text-slate-500 font-mono-num">-10 ← 0 → +10</p>
                  </div>
                )}
              </div>
            </div>

            {/* Relatório de Desempenho (Recharts BarChart) */}
            <PerformanceReport
              levels={GAME_LEVELS}
              progressMap={progressMap}
              onSelectLevel={selectCampaignLevel}
            />

            {/* 8 Progressive Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {GAME_LEVELS.map((lvl, idx) => {
                const prog = progressMap[lvl.id];
                const isCurrent = !customLevel && currentLevelIndex === idx;

                return (
                  <div
                    key={lvl.id}
                    className={`bg-white rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all ${
                      isCurrent ? 'border-sky-600 ring-2 ring-sky-600/15' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-sky-700">0{lvl.id}. {lvl.difficultyLabel.split('·')[0]}</span>
                        <span className="font-mono-num">{lvl.bnccCode}</span>
                      </div>

                      <h2 className="text-lg font-display font-bold text-slate-900">{lvl.title}</h2>
                      <p className="text-xs font-mono-num text-slate-600">{lvl.subtitle}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{lvl.pedagogicalGoal}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                (prog?.stars ?? 0) >= s
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono-num text-slate-600">
                          {prog?.completed
                            ? `Concluído (${prog.bestScore} pts)`
                            : (prog?.bestScore ?? 0) > 0
                            ? `Em progresso (${prog?.bestScore} pts)`
                            : 'Não iniciado'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => selectCampaignLevel(idx)}
                        className={`w-full py-2 px-4 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                          isCurrent
                            ? 'bg-sky-600 text-white hover:bg-sky-700'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isCurrent ? 'Continuar Nível' : 'Jogar Nível'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 3: LABORATÓRIO LIVRE (CUSTOM LEVEL GENERATOR)
           ========================================================= */}
        {activeTab === 'lab' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FlaskConical className="w-4 h-4 text-sky-600" />
                <span>Gerador Dinâmico de Rodadas</span>
                <span aria-hidden="true">·</span>
                <span>Prática Infinita</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Laboratório Livre da Reta Numérica
              </h1>
              <p className="text-sm text-slate-600">
                Configure o tipo de conjunto numérico e a escala desejada para gerar novos desafios personalizados de arrastar objetos e identificar coordenadas.
              </p>
            </div>

            <div className="space-y-5">
              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  1. Conjunto Numérico e Escala
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'integers_pos',
                      title: 'Números Naturais (Positivos)',
                      desc: 'Contagem crescente e intervalos a partir do zero.',
                    },
                    {
                      id: 'integers_neg',
                      title: 'Números Inteiros (Negativos e Positivos)',
                      desc: 'Inclui valores abaixo de zero, simetria e deslocamentos.',
                    },
                    {
                      id: 'tens',
                      title: 'Dezenas até 100',
                      desc: 'Escala de 0 a 100 com subdivisões de 5 em 5.',
                    },
                    {
                      id: 'decimals',
                      title: 'Números Decimais (0,5)',
                      desc: 'Subdivisões decimais entre números inteiros.',
                    },
                    {
                      id: 'fractions',
                      title: 'Frações na Reta (1/2, 3/2, 5/2)',
                      desc: 'Localização de frações próprias e impróprias.',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setLabConfig((prev) => ({
                          ...prev,
                          mode: item.id as CustomLabConfig['mode'],
                        }))
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        labConfig.mode === item.id
                          ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/15'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  2. Amplitude da Escala
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'easy', label: 'Curta (Iniciante)' },
                    { id: 'medium', label: 'Média (Padrão)' },
                    { id: 'hard', label: 'Ampla (Desafio)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        setLabConfig((prev) => ({
                          ...prev,
                          difficulty: d.id as CustomLabConfig['difficulty'],
                        }))
                      }
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        labConfig.difficulty === d.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => startCustomLabRound()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Gerar Desafio Agora</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 4: GUIA PEDAGÓGICO (CONCEPTUAL REFERENCE)
           ========================================================= */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Award className="w-4 h-4 text-sky-600" />
                <span>Guia de Estudo e Apoio ao Professor</span>
                <span aria-hidden="true">·</span>
                <span>Ensino Fundamental I e II</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Como Funciona a Reta Numérica?
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                A reta numérica é uma linha graduada onde os números são posicionados de forma ordenada, mantendo a mesma distância para intervalos iguais. Confira os 4 conceitos fundamentais trabalhados nos níveis do jogo:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h2 className="text-sm font-display font-bold text-slate-900">
                    01. Origem (Zero) e Sentido Crescente
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O ponto <strong className="font-mono-num">0</strong> é a referência central (origem). Ao caminhar para a <strong>direita</strong>, os valores aumentam (<strong className="font-mono-num">+1, +2, +3...</strong>). Ao caminhar para a <strong>esquerda</strong>, os valores diminuem.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h2 className="text-sm font-display font-bold text-slate-900">
                    02. Números Inteiros Negativos e Simetria
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Valores menores que zero ficam à esquerda da origem (<strong className="font-mono-num">-1, -2, -3...</strong>). Cuidado: <strong className="font-mono-num">-8</strong> é menor que <strong className="font-mono-num">-2</strong> porque está mais à esquerda!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h2 className="text-sm font-display font-bold text-slate-900">
                    03. Subdivisões: Decimais e Frações
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Entre dois números inteiros existem infinitos números racionais. Se dividirmos o espaço entre <strong className="font-mono-num">0</strong> e <strong className="font-mono-num">1</strong> ao meio, encontramos <strong className="font-mono-num">0,5</strong> (ou <strong className="font-mono-num">1/2</strong>). Se dividirmos em 4 partes iguais, cada marca vale <strong className="font-mono-num">0,25</strong> (<strong className="font-mono-num">1/4</strong>).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h2 className="text-sm font-display font-bold text-slate-900">
                    04. Operações como Saltos na Reta
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Somar um valor positivo significa dar saltos para a <strong>direita</strong> (ex: <strong className="font-mono-num">-5 + 7 = +2</strong>). Subtrair significa dar saltos para a <strong>esquerda</strong> (ex: <strong className="font-mono-num">-2 - 3 = -5</strong>).
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('play')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Praticar na Reta Numérica</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Step-by-Step Tutorial Modal */}
      <InteractiveTutorialModal
        isOpen={isTutorialOpen}
        onAcceptAndAgree={handleAcceptTutorial}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 mt-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Trilha da Reta Numérica — Ambiente Interativo de Educação Matemática</span>
          <span>Alinhado às competências da BNCC (Ensino Fundamental)</span>
        </div>
      </footer>
    </div>
  );
}
