import React, { useState } from 'react';
import { Check, HelpCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { DraggableToken, GameLevel } from '../types/game';
import { formatPtNumber } from '../data/levels';
import { OBJECT_META, ObjectIllustration } from './ObjectIllustration';

interface NumberLineCanvasProps {
  level: GameLevel;
  placedTokens: Record<string, string>; // key: position string, value: tokenId
  selectedTokenId: string | null;
  activeHintTokenId: string | null;
  showJumpArcs: boolean;
  showSubdivisions: boolean;
  validationState: Record<string, 'correct' | 'wrong' | undefined>;
  revealedLandmarks: boolean;
  onPlaceToken: (positionKey: string, tokenId: string) => void;
  onRemoveToken: (positionKey: string) => void;
  onSelectLandmark?: (position: number) => void;
}

export const toPosKey = (val: number): string => {
  return Number(val.toFixed(4)).toString();
};

export const NumberLineCanvas: React.FC<NumberLineCanvasProps> = ({
  level,
  placedTokens,
  selectedTokenId,
  activeHintTokenId,
  showJumpArcs,
  showSubdivisions,
  validationState,
  revealedLandmarks,
  onPlaceToken,
  onRemoveToken,
  onSelectLandmark,
}) => {
  const [hoveredDropKey, setHoveredDropKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [inspectedTick, setInspectedTick] = useState<number | null>(null);

  const range = level.max - level.min;
  const getPercent = (val: number): number => {
    const pct = ((val - level.min) / range) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  // Generate ticks cleanly without floating-point drift
  const ticks: { value: number; isMajor: boolean }[] = [];
  const stepCount = Math.round(range / level.minorStep);
  for (let i = 0; i <= stepCount; i++) {
    const rawVal = level.min + i * level.minorStep;
    const val = Number(rawVal.toFixed(4));
    const majorRatio = (val - level.min) / level.majorStep;
    const isMajor = Math.abs(majorRatio - Math.round(majorRatio)) < 1e-4;
    ticks.push({ value: val, isMajor });
  }

  const tokenMap = new Map<string, DraggableToken>();
  level.tokens.forEach((t) => tokenMap.set(t.id, t));

  const activeToken =
    (selectedTokenId ? tokenMap.get(selectedTokenId) : undefined) ||
    (activeHintTokenId ? tokenMap.get(activeHintTokenId) : undefined);

  // Determine jump arc coordinates if active
  const getJumpArc = () => {
    if (!showJumpArcs && !activeHintTokenId) return null;
    const tokenForArc = activeToken || level.tokens.find((t) => !Object.values(placedTokens).includes(t.id));
    if (!tokenForArc) return null;

    const startVal = tokenForArc.jumpFrom ?? (level.min <= 0 && level.max >= 0 ? 0 : level.min);
    let endVal: number | null = null;

    if (hoveredDropKey !== null) {
      endVal = Number(hoveredDropKey);
    } else if (dragOverKey !== null) {
      endVal = Number(dragOverKey);
    } else if (activeHintTokenId === tokenForArc.id) {
      endVal = tokenForArc.targetPosition;
    }

    if (endVal === null || Math.abs(endVal - startVal) < 1e-4) return null;

    const x1 = getPercent(startVal);
    const x2 = getPercent(endVal);
    const diff = Number((endVal - startVal).toFixed(4));
    const signDiff = diff > 0 ? `+${formatPtNumber(diff)}` : formatPtNumber(diff);

    return {
      x1,
      x2,
      startVal,
      endVal,
      label: `Salto: ${signDiff}`,
      isHintTarget: activeHintTokenId === tokenForArc.id,
    };
  };

  const jumpArc = getJumpArc();

  const handleDragOver = (e: React.DragEvent, posKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverKey !== posKey) {
      setDragOverKey(posKey);
    }
  };

  const handleDrop = (e: React.DragEvent, posKey: string) => {
    e.preventDefault();
    setDragOverKey(null);
    const droppedTokenId = e.dataTransfer.getData('text/plain');
    if (droppedTokenId) {
      onPlaceToken(posKey, droppedTokenId);
    } else if (selectedTokenId) {
      onPlaceToken(posKey, selectedTokenId);
    }
  };

  const formatValue = (val: number) => {
    if (level.formatTick) return level.formatTick(val);
    return formatPtNumber(val);
  };

  return (
    <div className="relative w-full bg-white border border-slate-200 rounded-xl p-5 sm:p-6 select-none">
      {/* Top Legend & Scale Info Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-slate-900 font-semibold">Escala da Reta:</span>
          <span className="font-mono-num">
            {formatValue(level.min)} até {formatValue(level.max)}
          </span>
          <span aria-hidden="true">·</span>
          <span>Marca principal: {formatValue(level.majorStep)}</span>
          <span aria-hidden="true">·</span>
          <span>Subdivisão: {formatValue(level.minorStep)}</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-400" />
            Objeto Fixo na Reta
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-sky-50 border border-dashed border-sky-500" />
            Posição para Arrastar ({Object.keys(placedTokens).length}/{level.dropPositions.length})
          </span>
        </div>
      </div>

      {/* Main Number Line Stage Container */}
      <div className="relative w-full pt-24 pb-28 px-6 sm:px-10 overflow-x-auto">
        <div className="relative min-w-[640px] w-full h-24">
          {/* SVG Jump Arc Overlay */}
          <svg
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            className="absolute -top-20 left-0 w-full h-24 pointer-events-none overflow-visible z-10"
          >
            <defs>
              <marker
                id="jump-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284C7" />
              </marker>
            </defs>
            {jumpArc && (
              <g>
                <path
                  d={`M ${jumpArc.x1 * 10} 98 Q ${((jumpArc.x1 + jumpArc.x2) / 2) * 10} 15 ${jumpArc.x2 * 10} 92`}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  markerEnd="url(#jump-arrow)"
                />
                <rect
                  x={((jumpArc.x1 + jumpArc.x2) / 2) * 10 - 52}
                  y="22"
                  width="104"
                  height="22"
                  rx="6"
                  fill="#0284C7"
                />
                <text
                  x={((jumpArc.x1 + jumpArc.x2) / 2) * 10}
                  y="37"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {jumpArc.label}
                </text>
              </g>
            )}
          </svg>

          {/* Horizontal Axis Line with Left/Right Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-800 rounded-full">
            {/* Left Arrowhead */}
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 text-slate-800 absolute -left-3 top-1/2 -translate-y-1/2"
              fill="currentColor"
            >
              <path d="M11 2L3 8L11 14V2Z" />
            </svg>
            {/* Right Arrowhead */}
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 text-slate-800 absolute -right-3 top-1/2 -translate-y-1/2"
              fill="currentColor"
            >
              <path d="M5 2L13 8L5 14V2Z" />
            </svg>
          </div>

          {/* Fixed Landmark Objects (Above the Number Line) */}
          {level.landmarks.map((lm) => {
            const pct = getPercent(lm.position);
            const meta = OBJECT_META[lm.objectKind];
            const showNumber = !lm.hideTickLabel || revealedLandmarks;

            return (
              <button
                key={lm.id}
                type="button"
                onClick={() => {
                  setInspectedTick(lm.position);
                  if (onSelectLandmark) onSelectLandmark(lm.position);
                }}
                style={{ left: `${pct}%` }}
                title={`Objeto fixo na reta: ${lm.name}`}
                className="group absolute -top-20 -translate-x-1/2 flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg z-20 cursor-pointer"
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shadow-xs transition-transform duration-150 group-hover:-translate-y-0.5 ${meta.bgClass}`}
                >
                  <ObjectIllustration kind={lm.objectKind} className="w-6 h-6 shrink-0" />
                  <div className="text-left leading-tight">
                    <span className="block text-[11px] font-semibold text-slate-900 whitespace-nowrap">
                      {lm.name}
                    </span>
                    <span className="block text-[10px] font-mono-num text-slate-600">
                      {showNumber ? `Pos: ${formatValue(lm.position)}` : 'Pos: ?'}
                    </span>
                  </div>
                </div>
                {/* Connector stem down to the tick mark */}
                <div className="w-0.5 h-5 bg-amber-500/70" />
              </button>
            );
          })}

          {/* Ticks & Numbers along the Axis */}
          {ticks.map((tick) => {
            const posKey = toPosKey(tick.value);
            const pct = getPercent(tick.value);
            const isZero = Math.abs(tick.value) < 1e-4;
            const isDropTarget = level.dropPositions.some((dp) => Math.abs(dp - tick.value) < 1e-4);
            const isHidden = level.hiddenTicks.some((ht) => Math.abs(ht - tick.value) < 1e-4);
            const landmarkOnTick = level.landmarks.find((lm) => Math.abs(lm.position - tick.value) < 1e-4);
            const hideLabelForLandmark = landmarkOnTick?.hideTickLabel && !revealedLandmarks;

            if (!tick.isMajor && !showSubdivisions && !isDropTarget && !landmarkOnTick) {
              return null;
            }

            return (
              <div
                key={posKey}
                style={{ left: `${pct}%` }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                {/* Tick Vertical Line */}
                <div
                  className={`transition-colors ${
                    isZero
                      ? 'w-1 h-7 bg-sky-700 rounded-full'
                      : tick.isMajor
                      ? 'w-0.5 h-5 bg-slate-800'
                      : 'w-px h-3.5 bg-slate-400'
                  }`}
                />

                {/* Tick Label (when not replaced by a drop slot) */}
                {!isDropTarget && (
                  <div className="mt-2 select-none">
                    {tick.isMajor || showSubdivisions || isZero ? (
                      isHidden || hideLabelForLandmark ? (
                        <span
                          className="inline-flex items-center justify-center w-6 h-5 text-xs font-mono-num font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded"
                          title="Valor oculto — deduza pela escala da reta"
                        >
                          ?
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-mono-num ${
                            isZero
                              ? 'font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200'
                              : tick.isMajor
                              ? 'font-semibold text-slate-800'
                              : 'text-[11px] text-slate-500'
                          }`}
                        >
                          {formatValue(tick.value)}
                        </span>
                      )
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}

          {/* Interactive Drop Slots (Below the Number Line) */}
          {level.dropPositions.map((dropPos) => {
            const posKey = toPosKey(dropPos);
            const pct = getPercent(dropPos);
            const placedTokenId = placedTokens[posKey];
            const placedToken = placedTokenId ? tokenMap.get(placedTokenId) : undefined;
            const status = validationState[posKey];
            const isDragOver = dragOverKey === posKey;
            const isHintedSlot =
              activeHintTokenId !== null &&
              tokenMap.get(activeHintTokenId)?.targetPosition !== undefined &&
              Math.abs((tokenMap.get(activeHintTokenId)?.targetPosition ?? -999) - dropPos) < 1e-4;

            return (
              <div
                key={`drop-${posKey}`}
                style={{ left: `${pct}%` }}
                className="absolute top-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                onMouseEnter={() => setHoveredDropKey(posKey)}
                onMouseLeave={() => setHoveredDropKey(null)}
                onDragOver={(e) => handleDragOver(e, posKey)}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => handleDrop(e, posKey)}
              >
                {/* Target Node Dot on the Axis */}
                <div
                  className={`w-3.5 h-3.5 -mt-1.5 rounded-full border-2 transition-transform ${
                    status === 'correct'
                      ? 'bg-emerald-600 border-white scale-110 ring-2 ring-emerald-600'
                      : status === 'wrong'
                      ? 'bg-rose-600 border-white scale-110 ring-2 ring-rose-600'
                      : isHintedSlot
                      ? 'bg-amber-500 border-white scale-125 ring-2 ring-amber-500'
                      : placedToken
                      ? 'bg-sky-600 border-white ring-2 ring-sky-600'
                      : 'bg-white border-sky-600'
                  }`}
                />

                {/* Stem Line down to Drop Box */}
                <div
                  className={`w-0.5 h-5 ${
                    status === 'correct'
                      ? 'bg-emerald-500'
                      : status === 'wrong'
                      ? 'bg-rose-500'
                      : isHintedSlot
                      ? 'bg-amber-500'
                      : 'bg-sky-400'
                  }`}
                />

                {/* Interactive Drop Zone / Placed Token Button */}
                {placedToken ? (
                  <div className="relative group">
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', placedToken.id);
                      }}
                      onClick={() => {
                        if (selectedTokenId && selectedTokenId !== placedToken.id) {
                          onPlaceToken(posKey, selectedTokenId);
                        } else {
                          onRemoveToken(posKey);
                        }
                      }}
                      title="Clique para remover ou arraste para outra posição"
                      className={`min-w-[68px] px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-0.5 shadow-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                        status === 'correct'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                          : status === 'wrong'
                          ? 'bg-rose-50 border-rose-600 text-rose-950'
                          : 'bg-sky-50 border-sky-600 text-slate-900 hover:bg-sky-100'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {placedToken.objectKind && (
                          <ObjectIllustration kind={placedToken.objectKind} className="w-4 h-4 shrink-0" />
                        )}
                        <span className="font-mono-num whitespace-nowrap">{placedToken.displayLabel}</span>
                      </div>

                      {/* Explicit non-hue-only status label */}
                      {status === 'correct' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 whitespace-nowrap">
                          <Check className="w-3 h-3 stroke-[2.5]" /> Correto
                        </span>
                      )}
                      {status === 'wrong' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-800 whitespace-nowrap">
                          <X className="w-3 h-3 stroke-[2.5]" /> Ajustar
                        </span>
                      )}
                    </button>

                    {/* Quick remove icon on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveToken(posKey);
                      }}
                      aria-label={`Remover ${placedToken.displayLabel}`}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTokenId) {
                        onPlaceToken(posKey, selectedTokenId);
                      }
                    }}
                    aria-label={`Espaço vazio na posição ${formatValue(dropPos)}`}
                    className={`min-w-[60px] min-h-[42px] px-2.5 py-1.5 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                      isDragOver
                        ? 'bg-sky-100 border-sky-600 scale-105'
                        : isHintedSlot
                        ? 'bg-amber-50 border-amber-500 text-amber-900 scale-105'
                        : selectedTokenId
                        ? 'bg-sky-50/80 border-sky-500 text-sky-800 hover:bg-sky-100'
                        : 'bg-slate-50 border-slate-300 text-slate-500 hover:border-sky-500 hover:text-sky-700'
                    }`}
                  >
                    {isHintedSlot ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 whitespace-nowrap">
                        <Sparkles className="w-3.5 h-3.5" /> Aqui!
                      </span>
                    ) : (
                      <span className="text-xs font-mono-num font-semibold">
                        {selectedTokenId ? 'Colocar' : '?'}
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Interactive Coordinate Helper Strip */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
          {selectedTokenId && activeToken ? (
            <span>
              Item selecionado:{' '}
              <strong className="text-slate-900 font-semibold">{activeToken.displayLabel}</strong> ({activeToken.clueLabel}) — clique em um espaço tracejado <strong className="font-mono-num">[ ? ]</strong> na reta ou arraste o cartão.
            </span>
          ) : inspectedTick !== null ? (
            <span>
              Inspecionando marco na reta: veja as referências vizinhas para deduzir a coordenada exata.
            </span>
          ) : (
            <span>
              <strong>Como jogar:</strong> Arraste os cartões abaixo para os espaços tracejados <strong className="font-mono-num">[ ? ]</strong> na reta (ou clique no cartão e depois na posição).
            </span>
          )}
        </div>

        <div className="text-xs text-slate-500 font-mono-num">
          Sentido crescente: Esquerda (menor) → Direita (maior)
        </div>
      </div>
    </div>
  );
};
