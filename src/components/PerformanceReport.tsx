import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { GameLevel, LevelProgress } from '../types/game';

interface PerformanceReportProps {
  levels: GameLevel[];
  progressMap: Record<number, LevelProgress>;
  onSelectLevel: (index: number) => void;
}

interface ChartDataItem {
  index: number;
  levelId: number;
  shortName: string;
  fullTitle: string;
  bnccCode: string;
  difficulty: string;
  pontuacao: number;
  metaMaxima: number;
  estrelas: number;
  tentativas: number;
  completed: boolean;
  aproveitamento: number;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  levels,
  progressMap,
  onSelectLevel,
}) => {
  const [chartMetric, setChartMetric] = useState<'score' | 'accuracy'>('score');

  const chartData: ChartDataItem[] = levels.map((lvl, index) => {
    const prog = progressMap[lvl.id];
    const maxScore = lvl.dropPositions.length * 25 + lvl.questions.length * 25;
    const bestScore = prog?.bestScore ?? 0;
    const accuracy = maxScore > 0 ? Math.round((bestScore / maxScore) * 100) : 0;

    return {
      index,
      levelId: lvl.id,
      shortName: `Nível ${lvl.id}`,
      fullTitle: lvl.title,
      bnccCode: lvl.bnccCode,
      difficulty: lvl.difficultyLabel.split('·')[0].trim(),
      pontuacao: bestScore,
      metaMaxima: maxScore,
      estrelas: prog?.stars ?? 0,
      tentativas: prog?.attempts ?? 0,
      completed: prog?.completed ?? false,
      aproveitamento: accuracy,
    };
  });

  const totalEarned = chartData.reduce((acc, item) => acc + item.pontuacao, 0);
  const totalPossible = chartData.reduce((acc, item) => acc + item.metaMaxima, 0);
  const overallPercentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  const activeLevelsCount = chartData.filter((d) => d.pontuacao > 0 || d.tentativas > 0).length;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
      {/* Header & Metric Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <BarChart3 className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-sky-700">Relatório de Desempenho</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">Aproveitamento Geral: {overallPercentage}%</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{activeLevelsCount} de 8 níveis praticados</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Evolução de Pontuação por Nível
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Acompanhe seu crescimento ao longo da trilha. Clique em qualquer barra do gráfico para ir diretamente ao nível correspondente.
          </p>
        </div>

        {/* Interactive Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setChartMetric('score')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              chartMetric === 'score'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pontuação (Pts)
          </button>
          <button
            type="button"
            onClick={() => setChartMetric('accuracy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              chartMetric === 'accuracy'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aproveitamento (%)
          </button>
        </div>
      </div>

      {/* Bar Chart Viewport */}
      <div className="w-full h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 20, left: 0, bottom: 8 }}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="shortName"
              tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
            />
            <YAxis
              domain={chartMetric === 'score' ? [0, 150] : [0, 100]}
              tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              unit={chartMetric === 'score' ? ' pts' : '%'}
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0].payload as ChartDataItem;
                return (
                  <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1.5 min-w-[210px]">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1.5">
                      <span className="font-bold text-sky-300">{item.shortName}</span>
                      <span className="font-mono-num text-slate-300">{item.bnccCode}</span>
                    </div>
                    <div className="font-semibold text-white">{item.fullTitle}</div>
                    <div className="pt-1 space-y-1 font-mono-num text-slate-200">
                      <div className="flex justify-between">
                        <span>Pontuação Obtida:</span>
                        <span className="font-bold text-white">
                          {item.pontuacao} / {item.metaMaxima} pts
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aproveitamento:</span>
                        <span className="font-bold text-emerald-400">{item.aproveitamento}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estrelas:</span>
                        <span className="text-amber-400">{item.estrelas} / 3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tentativas:</span>
                        <span>{item.tentativas}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            {chartMetric === 'score' ? (
              <>
                <ReferenceLine
                  y={150}
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Pontuação Máxima (150 pts)',
                    position: 'insideTopRight',
                    fill: '#64748B',
                    fontSize: 11,
                  }}
                />
                <Bar
                  dataKey="pontuacao"
                  name="Sua Melhor Pontuação"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                  onClick={(_data, idx) => {
                    if (typeof idx === 'number') {
                      onSelectLevel(idx);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-score-${entry.levelId}`}
                      fill={
                        entry.completed
                          ? '#059669'
                          : entry.pontuacao > 0
                          ? '#0284C7'
                          : '#CBD5E1'
                      }
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="metaMaxima"
                  name="Meta do Nível (150 pts)"
                  fill="#E2E8F0"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={20}
                />
              </>
            ) : (
              <Bar
                dataKey="aproveitamento"
                name="Taxa de Aproveitamento (%)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                onClick={(_data, idx) => {
                  if (typeof idx === 'number') {
                    onSelectLevel(idx);
                  }
                }}
                className="cursor-pointer"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-acc-${entry.levelId}`}
                    fill={
                      entry.aproveitamento === 100
                        ? '#059669'
                        : entry.aproveitamento > 0
                        ? '#0284C7'
                        : '#CBD5E1'
                    }
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Action Guidance Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span>✓ Concluído (100%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-sky-600 inline-block" />
            <span>▲ Em Progresso (Parcial)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block" />
            <span>○ Meta Total (150 pts por nível)</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <TrendingUp className="w-4 h-4 text-sky-600" />
          <span className="font-mono-num">
            Total Acumulado: {totalEarned} de {totalPossible} pts possíveis
          </span>
        </div>
      </div>
    </section>
  );
};
