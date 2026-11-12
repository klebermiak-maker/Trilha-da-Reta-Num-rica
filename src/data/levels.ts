import { CustomLabConfig, GameLevel, ObjectKind } from '../types/game';

export const formatPtNumber = (val: number): string => {
  if (Number.isInteger(val)) return val.toString();
  return val.toString().replace('.', ',');
};

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Primeiros Passos na Reta',
    subtitle: 'Números Naturais de 0 a 10 (Passo 1)',
    difficultyLabel: 'Iniciante · Nível 1',
    bnccCode: 'EF02MA01 / EF03MA04',
    pedagogicalGoal:
      'Reconhecer a ordem crescente dos números naturais de 0 a 10, localizar objetos fixos e arrastar fichas para intervalos unitários.',
    min: 0,
    max: 10,
    majorStep: 1,
    minorStep: 1,
    hiddenTicks: [2, 5, 7, 9],
    dropPositions: [2, 5, 7, 9],
    landmarks: [
      { id: 'lm-1-frog', position: 3, objectKind: 'frog', name: 'Sapo', hideTickLabel: true },
      { id: 'lm-1-star', position: 8, objectKind: 'star', name: 'Estrela', hideTickLabel: false },
    ],
    tokens: [
      {
        id: 't-1-num2',
        targetPosition: 2,
        category: 'number',
        displayLabel: '2',
        clueLabel: 'Número entre 1 e 3',
        hint: 'Conte 2 unidades para a direita a partir do 0.',
        jumpFrom: 0,
      },
      {
        id: 't-1-apple',
        targetPosition: 5,
        category: 'object',
        objectKind: 'apple',
        displayLabel: 'Maçã (5)',
        clueLabel: '2 casas à direita do Sapo',
        hint: 'O Sapo está no 3. Avance +2 casas para a direita: 3 + 2 = 5.',
        jumpFrom: 3,
      },
      {
        id: 't-1-num7',
        targetPosition: 7,
        category: 'number',
        displayLabel: '7',
        clueLabel: 'Antecessor da Estrela (8)',
        hint: 'O antecessor vem 1 unidade imediatamente antes do 8.',
        jumpFrom: 8,
      },
      {
        id: 't-1-rocket',
        targetPosition: 9,
        category: 'object',
        objectKind: 'rocket',
        displayLabel: 'Foguete (9)',
        clueLabel: '1 casa depois da Estrela',
        hint: 'A Estrela está na posição 8. Um salto à direita leva ao 9.',
        jumpFrom: 8,
      },
    ],
    questions: [
      {
        id: 'q-1-1',
        prompt: 'Observe a reta numérica: em qual número exato o Sapo está posicionado?',
        focusPosition: 3,
        options: [
          { id: 'o1', label: 'Posição 2', value: '2' },
          { id: 'o2', label: 'Posição 3', value: '3' },
          { id: 'o3', label: 'Posição 4', value: '4' },
          { id: 'o4', label: 'Posição 6', value: '6' },
        ],
        correctValue: '3',
        explanation: 'O Sapo está exatamente entre os números 2 e 4, portanto ocupa a posição 3.',
      },
      {
        id: 'q-1-2',
        prompt: 'Qual é a distância (em unidades) entre o Sapo (3) e a Estrela (8)?',
        focusPosition: 8,
        options: [
          { id: 'o1', label: '4 unidades', value: '4' },
          { id: 'o2', label: '5 unidades', value: '5' },
          { id: 'o3', label: '6 unidades', value: '6' },
          { id: 'o4', label: '8 unidades', value: '8' },
        ],
        correctValue: '5',
        explanation: 'De 3 até 8 damos 5 saltos unitários: 8 - 3 = 5 unidades.',
      },
    ],
  },
  {
    id: 2,
    title: 'Saltos de 2 em 2',
    subtitle: 'Sequência Par e Ímpar de 0 a 20',
    difficultyLabel: 'Básico · Nível 2',
    bnccCode: 'EF03MA04',
    pedagogicalGoal:
      'Compreender escalas com marcações principais de 2 em 2 e identificar pontos intermediários ímpares.',
    min: 0,
    max: 20,
    majorStep: 2,
    minorStep: 1,
    hiddenTicks: [4, 10, 14, 18],
    dropPositions: [4, 9, 14, 18],
    landmarks: [
      { id: 'lm-2-turtle', position: 6, objectKind: 'turtle', name: 'Tartaruga', hideTickLabel: false },
      { id: 'lm-2-chest', position: 12, objectKind: 'chest', name: 'Baú', hideTickLabel: true },
      { id: 'lm-2-owl', position: 16, objectKind: 'owl', name: 'Coruja', hideTickLabel: false },
    ],
    tokens: [
      {
        id: 't-2-num4',
        targetPosition: 4,
        category: 'number',
        displayLabel: '4',
        clueLabel: '2 unidades antes da Tartaruga',
        hint: 'A Tartaruga está no 6. Volte 2 unidades para a esquerda: 6 - 2 = 4.',
        jumpFrom: 6,
      },
      {
        id: 't-2-compass',
        targetPosition: 9,
        category: 'object',
        objectKind: 'compass',
        displayLabel: 'Bússola (9)',
        clueLabel: 'Exatamente entre 8 e 10',
        hint: 'O número ímpar que fica exatamente no meio entre 8 e 10 é o 9.',
        jumpFrom: 8,
      },
      {
        id: 't-2-num14',
        targetPosition: 14,
        category: 'number',
        displayLabel: '14',
        clueLabel: 'Meio entre o Baú (12) e a Coruja (16)',
        hint: 'Entre 12 e 16 na contagem de 2 em 2 encontramos o 14.',
        jumpFrom: 12,
      },
      {
        id: 't-2-gem',
        targetPosition: 18,
        category: 'object',
        objectKind: 'gem',
        displayLabel: 'Cristal (18)',
        clueLabel: '2 unidades à direita da Coruja',
        hint: 'A Coruja está no 16. Avance +2 unidades: 16 + 2 = 18.',
        jumpFrom: 16,
      },
    ],
    questions: [
      {
        id: 'q-2-1',
        prompt: 'O Baú está em uma marca principal oculta entre 10 e 14. Qual é a posição do Baú?',
        focusPosition: 12,
        options: [
          { id: 'o1', label: 'Posição 11', value: '11' },
          { id: 'o2', label: 'Posição 12', value: '12' },
          { id: 'o3', label: 'Posição 13', value: '13' },
          { id: 'o4', label: 'Posição 15', value: '15' },
        ],
        correctValue: '12',
        explanation: 'Como as marcas principais avançam de 2 em 2 (8, 10, 12, 14), o Baú está no 12.',
      },
      {
        id: 'q-2-2',
        prompt: 'Qual objeto fixo está localizado exatamente na posição 6 da reta?',
        focusPosition: 6,
        options: [
          { id: 'o1', label: 'Tartaruga', value: 'turtle', objectKind: 'turtle' },
          { id: 'o2', label: 'Baú', value: 'chest', objectKind: 'chest' },
          { id: 'o3', label: 'Coruja', value: 'owl', objectKind: 'owl' },
        ],
        correctValue: 'turtle',
        explanation: 'Na marca 6 da reta numérica encontramos a Tartaruga.',
      },
    ],
  },
  {
    id: 3,
    title: 'Dezenas e Pontos Médios',
    subtitle: 'Escala de 0 a 100 (Divisões de 10 e 5)',
    difficultyLabel: 'Elementar · Nível 3',
    bnccCode: 'EF04MA01',
    pedagogicalGoal:
      'Localizar dezenas inteiras e valores terminados em 5 ao longo de uma reta graduada de 0 a 100.',
    min: 0,
    max: 100,
    majorStep: 10,
    minorStep: 5,
    hiddenTicks: [20, 50, 70, 90],
    dropPositions: [20, 35, 50, 85],
    landmarks: [
      { id: 'lm-3-telescope', position: 30, objectKind: 'telescope', name: 'Luneta', hideTickLabel: false },
      { id: 'lm-3-planet', position: 60, objectKind: 'planet', name: 'Planeta', hideTickLabel: true },
      { id: 'lm-3-rocket', position: 80, objectKind: 'rocket', name: 'Foguete', hideTickLabel: false },
    ],
    tokens: [
      {
        id: 't-3-num20',
        targetPosition: 20,
        category: 'number',
        displayLabel: '20',
        clueLabel: '1 dezena antes da Luneta (30)',
        hint: '30 menos 10 unidades é igual a 20.',
        jumpFrom: 30,
      },
      {
        id: 't-3-star',
        targetPosition: 35,
        category: 'object',
        objectKind: 'star',
        displayLabel: 'Estrela (35)',
        clueLabel: 'Metade entre 30 e 40',
        hint: 'Cada subdivisão menor vale 5 unidades. Logo após o 30 temos o 35.',
        jumpFrom: 30,
      },
      {
        id: 't-3-num50',
        targetPosition: 50,
        category: 'number',
        displayLabel: '50',
        clueLabel: 'Ponto central da reta (metade de 100)',
        hint: 'A metade exata entre 0 e 100 é 50.',
        jumpFrom: 0,
      },
      {
        id: 't-3-gem',
        targetPosition: 85,
        category: 'object',
        objectKind: 'gem',
        displayLabel: 'Cristal (85)',
        clueLabel: '5 unidades à direita do Foguete (80)',
        hint: 'O Foguete está no 80. Avance uma marca menor (+5) até 85.',
        jumpFrom: 80,
      },
    ],
    questions: [
      {
        id: 'q-3-1',
        prompt: 'O Planeta está posicionado uma dezena à direita do 50. Qual é o valor da posição do Planeta?',
        focusPosition: 60,
        options: [
          { id: 'o1', label: '55', value: '55' },
          { id: 'o2', label: '60', value: '60' },
          { id: 'o3', label: '65', value: '65' },
          { id: 'o4', label: '70', value: '70' },
        ],
        correctValue: '60',
        explanation: 'Partindo de 50 e avançando uma divisão principal (+10), chegamos a 60.',
      },
      {
        id: 'q-3-2',
        prompt: 'Quanto vale cada subdivisão menor (tracinho intermediário) nesta reta de 0 a 100?',
        focusPosition: 35,
        options: [
          { id: 'o1', label: 'Vale 1 unidade', value: '1' },
          { id: 'o2', label: 'Vale 2 unidades', value: '2' },
          { id: 'o3', label: 'Vale 5 unidades', value: '5' },
          { id: 'o4', label: 'Vale 10 unidades', value: '10' },
        ],
        correctValue: '5',
        explanation: 'Cada intervalo de 10 é dividido ao meio em 2 partes iguais, portanto cada subdivisão vale 5.',
      },
    ],
  },
  {
    id: 4,
    title: 'Abaixo de Zero: Números Inteiros',
    subtitle: 'Negativos e Positivos de -10 a +10',
    difficultyLabel: 'Intermediário · Nível 4',
    bnccCode: 'EF07MA03',
    pedagogicalGoal:
      'Compreender o simétrico (oposto) de um número inteiro e posicionar valores negativos à esquerda da origem (0).',
    min: -10,
    max: 10,
    majorStep: 2,
    minorStep: 1,
    hiddenTicks: [-8, -4, 4, 8],
    dropPositions: [-8, -3, 4, 7],
    landmarks: [
      { id: 'lm-4-sub', position: -6, objectKind: 'submarine', name: 'Submarino', hideTickLabel: true },
      { id: 'lm-4-compass', position: 0, objectKind: 'compass', name: 'Bússola (Origem)', hideTickLabel: false },
      { id: 'lm-4-rocket', position: 6, objectKind: 'rocket', name: 'Foguete', hideTickLabel: false },
    ],
    tokens: [
      {
        id: 't-4-neg8',
        targetPosition: -8,
        category: 'number',
        displayLabel: '-8',
        clueLabel: '2 unidades à esquerda do Submarino (-6)',
        hint: 'Nos negativos, andar para a esquerda diminui o valor: -6 - 2 = -8.',
        jumpFrom: -6,
      },
      {
        id: 't-4-turtle',
        targetPosition: -3,
        category: 'object',
        objectKind: 'turtle',
        displayLabel: 'Tartaruga (-3)',
        clueLabel: '3 unidades à esquerda do Zero (0)',
        hint: 'Partindo da origem 0, conte 3 marcas para a esquerda: -1, -2, -3.',
        jumpFrom: 0,
      },
      {
        id: 't-4-pos4',
        targetPosition: 4,
        category: 'number',
        displayLabel: '+4',
        clueLabel: 'Simétrico (oposto) de -4',
        hint: 'O oposto de -4 está à mesma distância do zero, mas no lado positivo (+4).',
        jumpFrom: 0,
      },
      {
        id: 't-4-star',
        targetPosition: 7,
        category: 'object',
        objectKind: 'star',
        displayLabel: 'Estrela (+7)',
        clueLabel: '1 unidade à direita do Foguete (+6)',
        hint: 'Logo após +6 na direção positiva está o +7.',
        jumpFrom: 6,
      },
    ],
    questions: [
      {
        id: 'q-4-1',
        prompt: 'O Submarino está exatamente na posição simétrica (oposta) ao Foguete (+6). Onde está o Submarino?',
        focusPosition: -6,
        options: [
          { id: 'o1', label: '-8', value: '-8' },
          { id: 'o2', label: '-6', value: '-6' },
          { id: 'o3', label: '-4', value: '-4' },
          { id: 'o4', label: '+6', value: '6' },
        ],
        correctValue: '-6',
        explanation: 'O simétrico de +6 em relação à origem 0 é -6 (6 unidades à esquerda do zero).',
      },
      {
        id: 'q-4-2',
        prompt: 'Qual é a distância total entre o Submarino (-6) e o Foguete (+6)?',
        focusPosition: 0,
        options: [
          { id: 'o1', label: '0 unidades', value: '0' },
          { id: 'o2', label: '6 unidades', value: '6' },
          { id: 'o3', label: '12 unidades', value: '12' },
          { id: 'o4', label: '16 unidades', value: '16' },
        ],
        correctValue: '12',
        explanation: 'De -6 até 0 são 6 unidades, e de 0 até +6 são mais 6 unidades: 6 + 6 = 12 unidades.',
      },
    ],
  },
  {
    id: 5,
    title: 'Explorando os Decimais',
    subtitle: 'Décimos e Meios de 0 a 5 (Passo 0,5)',
    difficultyLabel: 'Intermediário · Nível 5',
    bnccCode: 'EF05MA02',
    pedagogicalGoal:
      'Representar números racionais na forma decimal na reta numérica, identificando metades (0,5) entre inteiros consecutivos.',
    min: 0,
    max: 5,
    majorStep: 1,
    minorStep: 0.5,
    formatTick: formatPtNumber,
    hiddenTicks: [1, 3, 4],
    dropPositions: [0.5, 1.5, 3, 4.5],
    landmarks: [
      { id: 'lm-5-frog', position: 2, objectKind: 'frog', name: 'Sapo', hideTickLabel: false },
      { id: 'lm-5-apple', position: 3.5, objectKind: 'apple', name: 'Maçã', hideTickLabel: true },
    ],
    tokens: [
      {
        id: 't-5-dec05',
        targetPosition: 0.5,
        category: 'decimal',
        displayLabel: '0,5',
        clueLabel: 'Metade entre 0 e 1',
        hint: '0,5 representa meio inteiro: fica exatamente no tracinho entre 0 e 1.',
        jumpFrom: 0,
      },
      {
        id: 't-5-turtle',
        targetPosition: 1.5,
        category: 'object',
        objectKind: 'turtle',
        displayLabel: 'Tartaruga (1,5)',
        clueLabel: '0,5 antes do Sapo (2)',
        hint: 'O Sapo está no 2. Voltando meio passo (0,5) para a esquerda chegamos a 1,5.',
        jumpFrom: 2,
      },
      {
        id: 't-5-int3',
        targetPosition: 3,
        category: 'number',
        displayLabel: '3,0',
        clueLabel: 'Inteiro exatamente entre 2 e 4',
        hint: '3,0 é equivalente ao número inteiro 3.',
        jumpFrom: 2,
      },
      {
        id: 't-5-star',
        targetPosition: 4.5,
        category: 'object',
        objectKind: 'star',
        displayLabel: 'Estrela (4,5)',
        clueLabel: '1 unidade inteira à direita da Maçã (3,5)',
        hint: 'A Maçã está em 3,5. Somando +1 inteiro chegamos a 4,5 (entre 4 e 5).',
        jumpFrom: 3.5,
      },
    ],
    questions: [
      {
        id: 'q-5-1',
        prompt: 'A Maçã está localizada exatamente no meio entre os inteiros 3 e 4. Qual número decimal representa sua posição?',
        focusPosition: 3.5,
        options: [
          { id: 'o1', label: '2,5', value: '2,5' },
          { id: 'o2', label: '3,2', value: '3,2' },
          { id: 'o3', label: '3,5', value: '3,5' },
          { id: 'o4', label: '4,5', value: '4,5' },
        ],
        correctValue: '3,5',
        explanation: 'Três inteiros mais meio (3 + 0,5) é igual a 3,5.',
      },
      {
        id: 'q-5-2',
        prompt: 'Quantos meios (passos de 0,5) são necessários para ir do 0 até o Sapo na posição 2?',
        focusPosition: 2,
        options: [
          { id: 'o1', label: '2 passos de 0,5', value: '2' },
          { id: 'o2', label: '3 passos de 0,5', value: '3' },
          { id: 'o3', label: '4 passos de 0,5', value: '4' },
          { id: 'o4', label: '5 passos de 0,5', value: '5' },
        ],
        correctValue: '4',
        explanation: 'Cada unidade inteira tem 2 meios. Para chegar ao 2, damos 4 saltos de 0,5 (0,5 → 1,0 → 1,5 → 2,0).',
      },
    ],
  },
  {
    id: 6,
    title: 'Frações na Reta Numérica',
    subtitle: 'Quartos e Meios de 0 a 3 (Passo 1/4)',
    difficultyLabel: 'Avançado · Nível 6',
    bnccCode: 'EF05MA05 / EF06MA07',
    pedagogicalGoal:
      'Associar frações próprias, impróprias e números mistos às subdivisões da unidade na reta numérica.',
    min: 0,
    max: 3,
    majorStep: 1,
    minorStep: 0.25,
    formatTick: formatPtNumber,
    hiddenTicks: [],
    dropPositions: [0.25, 0.75, 1.5, 2.25],
    landmarks: [
      { id: 'lm-6-gem', position: 0.5, objectKind: 'gem', name: 'Cristal', hideTickLabel: true },
      { id: 'lm-6-owl', position: 1.75, objectKind: 'owl', name: 'Coruja', hideTickLabel: true },
      { id: 'lm-6-chest', position: 2.5, objectKind: 'chest', name: 'Baú', hideTickLabel: true },
    ],
    tokens: [
      {
        id: 't-6-f14',
        targetPosition: 0.25,
        category: 'fraction',
        displayLabel: '1/4',
        clueLabel: 'Primeira subdivisão após o 0 (0,25)',
        hint: 'Cada unidade foi dividida em 4 partes iguais. A primeira marca após o 0 é 1/4.',
        jumpFrom: 0,
      },
      {
        id: 't-6-compass',
        targetPosition: 0.75,
        category: 'object',
        objectKind: 'compass',
        displayLabel: 'Bússola (3/4)',
        clueLabel: 'Três quartos (3 marcas após o 0)',
        hint: 'Conte 3 subdivisões de 1/4 a partir do zero: 1/4, 2/4, 3/4 (0,75).',
        jumpFrom: 0,
      },
      {
        id: 't-6-f32',
        targetPosition: 1.5,
        category: 'fraction',
        displayLabel: '3/2',
        clueLabel: 'Equivalente a 1 inteiro e meio (1,5)',
        hint: '3 dividido por 2 é 1,5: fica exatamente no meio entre 1 e 2.',
        jumpFrom: 1,
      },
      {
        id: 't-6-planet',
        targetPosition: 2.25,
        category: 'object',
        objectKind: 'planet',
        displayLabel: 'Planeta (2 1/4)',
        clueLabel: '2 inteiros + 1 quarto (9/4)',
        hint: 'Vá até o inteiro 2 e avance mais 1 subdivisão de um quarto (2,25).',
        jumpFrom: 2,
      },
    ],
    questions: [
      {
        id: 'q-6-1',
        prompt: 'O Cristal está na segunda marca após o zero (0,5). Qual fração irredutível representa a posição do Cristal?',
        focusPosition: 0.5,
        options: [
          { id: 'o1', label: '1/4', value: '1/4' },
          { id: 'o2', label: '1/2', value: '1/2' },
          { id: 'o3', label: '3/4', value: '3/4' },
          { id: 'o4', label: '2/3', value: '2/3' },
        ],
        correctValue: '1/2',
        explanation: '2 quartos (2/4) simplificado é exatamente 1/2 (metade entre 0 e 1).',
      },
      {
        id: 'q-6-2',
        prompt: 'O Baú está exatamente no meio entre 2 e 3 (2,5). Qual fração imprópria equivale à posição do Baú?',
        focusPosition: 2.5,
        options: [
          { id: 'o1', label: '3/2', value: '3/2' },
          { id: 'o2', label: '4/2', value: '4/2' },
          { id: 'o3', label: '5/2', value: '5/2' },
          { id: 'o4', label: '7/2', value: '7/2' },
        ],
        correctValue: '5/2',
        explanation: 'Cinco meios (5/2) equivale a 2 inteiros mais 1/2 = 2,5.',
      },
    ],
  },
  {
    id: 7,
    title: 'Operações e Deslocamentos',
    subtitle: 'Adição e Subtração na Reta (-15 a +15)',
    difficultyLabel: 'Avançado · Nível 7',
    bnccCode: 'EF07MA04',
    pedagogicalGoal:
      'Interpretar somas e subtrações de números inteiros como deslocamentos para a direita (+) ou esquerda (-) na reta numérica.',
    min: -15,
    max: 15,
    majorStep: 5,
    minorStep: 1,
    hiddenTicks: [-10, 5, 10],
    dropPositions: [-12, -4, 3, 11],
    landmarks: [
      { id: 'lm-7-sub', position: -8, objectKind: 'submarine', name: 'Submarino (-8)', hideTickLabel: false },
      { id: 'lm-7-telescope', position: -1, objectKind: 'telescope', name: 'Luneta (-1)', hideTickLabel: false },
      { id: 'lm-7-rocket', position: 7, objectKind: 'rocket', name: 'Foguete (+7)', hideTickLabel: false },
    ],
    tokens: [
      {
        id: 't-7-exp1',
        targetPosition: -12,
        category: 'expression',
        displayLabel: '-8 - 4',
        clueLabel: '4 casas à esquerda do Submarino (-8)',
        hint: 'Partindo de -8, desloque 4 unidades para a esquerda: -8 - 4 = -12.',
        jumpFrom: -8,
      },
      {
        id: 't-7-frog',
        targetPosition: -4,
        category: 'object',
        objectKind: 'frog',
        displayLabel: 'Sapo (-8 + 4)',
        clueLabel: 'Ponto médio entre Submarino (-8) e 0',
        hint: 'Partindo do Submarino (-8), avance 4 casas para a direita: -8 + 4 = -4.',
        jumpFrom: -8,
      },
      {
        id: 't-7-exp2',
        targetPosition: 3,
        category: 'expression',
        displayLabel: '-1 + 4',
        clueLabel: '4 casas à direita da Luneta (-1)',
        hint: 'Da Luneta (-1), some +4 unidades para a direita: -1 + 4 = +3.',
        jumpFrom: -1,
      },
      {
        id: 't-7-star',
        targetPosition: 11,
        category: 'object',
        objectKind: 'star',
        displayLabel: 'Estrela (7 + 4)',
        clueLabel: '4 casas à direita do Foguete (+7)',
        hint: 'O Foguete está no +7. Avançando 4 unidades chegamos a +11.',
        jumpFrom: 7,
      },
    ],
    questions: [
      {
        id: 'q-7-1',
        prompt: 'Se o Submarino está em -8 e subir +7 unidades para a direita, em qual posição ele chegará?',
        focusPosition: -1,
        options: [
          { id: 'o1', label: 'Na Luneta (-1)', value: '-1', objectKind: 'telescope' },
          { id: 'o2', label: 'Na origem (0)', value: '0' },
          { id: 'o3', label: 'No Foguete (+7)', value: '7', objectKind: 'rocket' },
          { id: 'o4', label: 'Em -15', value: '-15' },
        ],
        correctValue: '-1',
        explanation: '-8 + 7 = -1, que é exatamente a posição onde está a Luneta.',
      },
      {
        id: 'q-7-2',
        prompt: 'Qual operação representa o deslocamento da Luneta (-1) até o Foguete (+7)?',
        focusPosition: 7,
        options: [
          { id: 'o1', label: 'Avançar +6 unidades', value: '+6' },
          { id: 'o2', label: 'Avançar +7 unidades', value: '+7' },
          { id: 'o3', label: 'Avançar +8 unidades', value: '+8' },
          { id: 'o4', label: 'Voltar -8 unidades', value: '-8' },
        ],
        correctValue: '+8',
        explanation: 'De -1 até 0 é +1 unidade, e de 0 até +7 são +7 unidades. Total: -1 + 8 = +7.',
      },
    ],
  },
  {
    id: 8,
    title: 'Desafio Mestre: Racionais Completos',
    subtitle: 'Negativos, Frações e Decimais (-3 a +3, passo 0,5)',
    difficultyLabel: 'Mestre · Nível 8',
    bnccCode: 'EF07MA10',
    pedagogicalGoal:
      'Dominar simultaneamente números racionais negativos e positivos expressos como decimais, frações e deslocamentos relativos.',
    min: -3,
    max: 3,
    majorStep: 1,
    minorStep: 0.5,
    formatTick: formatPtNumber,
    hiddenTicks: [-2, 1, 2],
    dropPositions: [-2.5, -1.5, 0.5, 2.5],
    landmarks: [
      { id: 'lm-8-sub', position: -2, objectKind: 'submarine', name: 'Submarino', hideTickLabel: true },
      { id: 'lm-8-owl', position: -0.5, objectKind: 'owl', name: 'Coruja', hideTickLabel: true },
      { id: 'lm-8-planet', position: 1.5, objectKind: 'planet', name: 'Planeta', hideTickLabel: true },
    ],
    tokens: [
      {
        id: 't-8-neg25',
        targetPosition: -2.5,
        category: 'decimal',
        displayLabel: '-2,5',
        clueLabel: 'Meia unidade à esquerda do Submarino (-2)',
        hint: '-2,5 fica exatamente no meio entre -2 e -3 (à esquerda de -2).',
        jumpFrom: -2,
      },
      {
        id: 't-8-fneg32',
        targetPosition: -1.5,
        category: 'fraction',
        displayLabel: '-3/2',
        clueLabel: 'Oposto da posição do Planeta (+1,5)',
        hint: '-3/2 equivale a -1,5, que fica exatamente entre -1 e -2.',
        jumpFrom: 0,
      },
      {
        id: 't-8-gem',
        targetPosition: 0.5,
        category: 'object',
        objectKind: 'gem',
        displayLabel: 'Cristal (+1/2)',
        clueLabel: '1 unidade inteira à direita da Coruja (-0,5)',
        hint: 'A Coruja está em -0,5. Somando +1,0 chegamos a +0,5 (ou +1/2).',
        jumpFrom: -0.5,
      },
      {
        id: 't-8-rocket',
        targetPosition: 2.5,
        category: 'object',
        objectKind: 'rocket',
        displayLabel: 'Foguete (5/2)',
        clueLabel: 'Simétrico de -2,5 no lado positivo',
        hint: '5/2 = 2,5, localizado exatamente no meio entre +2 e +3.',
        jumpFrom: 1.5,
      },
    ],
    questions: [
      {
        id: 'q-8-1',
        prompt: 'A Coruja está na primeira subdivisão à esquerda do zero. Qual valor racional representa sua posição?',
        focusPosition: -0.5,
        options: [
          { id: 'o1', label: '-1,5', value: '-1,5' },
          { id: 'o2', label: '-0,5 (ou -1/2)', value: '-0,5' },
          { id: 'o3', label: '+0,5', value: '0,5' },
          { id: 'o4', label: '-1,0', value: '-1' },
        ],
        correctValue: '-0,5',
        explanation: 'Meia unidade à esquerda do 0 corresponde a -0,5 ou -1/2.',
      },
      {
        id: 'q-8-2',
        prompt: 'Qual é a distância entre o Submarino (-2) e o Planeta (+1,5)?',
        focusPosition: 1.5,
        options: [
          { id: 'o1', label: '2,5 unidades', value: '2,5' },
          { id: 'o2', label: '3,0 unidades', value: '3,0' },
          { id: 'o3', label: '3,5 unidades', value: '3,5' },
          { id: 'o4', label: '4,0 unidades', value: '4,0' },
        ],
        correctValue: '3,5',
        explanation: 'De -2 até 0 são 2 unidades, e de 0 até +1,5 são 1,5 unidades: 2 + 1,5 = 3,5 unidades.',
      },
    ],
  },
];

export function createCustomLabLevel(config: CustomLabConfig, seedCounter: number): GameLevel {
  const allObjects: { kind: ObjectKind; name: string }[] = [
    { kind: 'rocket', name: 'Foguete' },
    { kind: 'submarine', name: 'Submarino' },
    { kind: 'frog', name: 'Sapo' },
    { kind: 'star', name: 'Estrela' },
    { kind: 'turtle', name: 'Tartaruga' },
    { kind: 'gem', name: 'Cristal' },
    { kind: 'compass', name: 'Bússola' },
    { kind: 'owl', name: 'Coruja' },
  ];

  // Rotate objects based on seedCounter so every generated round feels fresh
  const rotated = [...allObjects.slice(seedCounter % allObjects.length), ...allObjects.slice(0, seedCounter % allObjects.length)];

  if (config.mode === 'integers_pos') {
    const max = config.difficulty === 'easy' ? 10 : config.difficulty === 'medium' ? 20 : 50;
    const majorStep = config.difficulty === 'easy' ? 1 : config.difficulty === 'medium' ? 2 : 5;
    const minorStep = config.difficulty === 'hard' ? 5 : 1;
    const step = minorStep;
    const totalSteps = Math.round(max / step);
    const p1 = step * Math.max(1, Math.floor(totalSteps * 0.2));
    const p2 = step * Math.floor(totalSteps * 0.45);
    const p3 = step * Math.floor(totalSteps * 0.7);
    const p4 = step * Math.min(totalSteps - 1, Math.floor(totalSteps * 0.9));
    const lmPos1 = step * Math.floor(totalSteps * 0.3);
    const lmPos2 = step * Math.floor(totalSteps * 0.6);

    return {
      id: 100 + seedCounter,
      title: `Laboratório Livre: Naturais (0 a ${max})`,
      subtitle: `Prática Personalizada · Escala de 0 a ${max}`,
      difficultyLabel: 'Modo Laboratório',
      bnccCode: 'Prática Customizada',
      pedagogicalGoal: 'Praticar a localização de números naturais e objetos em escalas configuráveis.',
      min: 0,
      max,
      majorStep,
      minorStep,
      hiddenTicks: [p1, p3],
      dropPositions: [p1, p2, p3, p4],
      landmarks: [
        { id: 'clm-1', position: lmPos1, objectKind: rotated[0].kind, name: rotated[0].name, hideTickLabel: true },
        { id: 'clm-2', position: lmPos2, objectKind: rotated[1].kind, name: rotated[1].name, hideTickLabel: false },
      ],
      tokens: [
        {
          id: 'ct-1',
          targetPosition: p1,
          category: 'number',
          displayLabel: `${p1}`,
          clueLabel: `Posição exata ${p1}`,
          hint: `Localize a marca ${p1} contando a partir do 0.`,
          jumpFrom: 0,
        },
        {
          id: 'ct-2',
          targetPosition: p2,
          category: 'object',
          objectKind: rotated[2].kind,
          displayLabel: `${rotated[2].name} (${p2})`,
          clueLabel: `${p2 - lmPos1} unidades após ${rotated[0].name} (${lmPos1})`,
          hint: `Parta de ${lmPos1} e some +${p2 - lmPos1} para chegar em ${p2}.`,
          jumpFrom: lmPos1,
        },
        {
          id: 'ct-3',
          targetPosition: p3,
          category: 'number',
          displayLabel: `${p3}`,
          clueLabel: `${p3 - lmPos2} unidades após ${rotated[1].name} (${lmPos2})`,
          hint: `Avance de ${lmPos2} até ${p3}.`,
          jumpFrom: lmPos2,
        },
        {
          id: 'ct-4',
          targetPosition: p4,
          category: 'object',
          objectKind: rotated[3].kind,
          displayLabel: `${rotated[3].name} (${p4})`,
          clueLabel: `Posição ${p4} (perto de ${max})`,
          hint: `Fica a ${max - p4} unidades antes do final da reta (${max}).`,
          jumpFrom: lmPos2,
        },
      ],
      questions: [
        {
          id: 'cq-1',
          prompt: `Em qual número da reta está posicionado o item ${rotated[0].name}?`,
          focusPosition: lmPos1,
          options: [
            { id: 'co1', label: `${lmPos1 - step}`, value: `${lmPos1 - step}` },
            { id: 'co2', label: `${lmPos1}`, value: `${lmPos1}` },
            { id: 'co3', label: `${lmPos1 + step}`, value: `${lmPos1 + step}` },
            { id: 'co4', label: `${lmPos2}`, value: `${lmPos2}` },
          ],
          correctValue: `${lmPos1}`,
          explanation: `Contando na escala da reta, ${rotated[0].name} ocupa exatamente a marca ${lmPos1}.`,
        },
      ],
    };
  }

  if (config.mode === 'integers_neg') {
    const bound = config.difficulty === 'easy' ? 6 : config.difficulty === 'medium' ? 10 : 20;
    const majorStep = bound === 20 ? 5 : 2;
    const minorStep = 1;
    const p1 = -Math.floor(bound * 0.8);
    const p2 = -Math.floor(bound * 0.35);
    const p3 = Math.floor(bound * 0.45);
    const p4 = Math.floor(bound * 0.85);
    const lmPos1 = -Math.floor(bound * 0.5);
    const lmPos2 = Math.floor(bound * 0.6);

    return {
      id: 200 + seedCounter,
      title: `Laboratório Livre: Inteiros (-${bound} a +${bound})`,
      subtitle: 'Simetria, Negativos e Deslocamentos',
      difficultyLabel: 'Modo Laboratório',
      bnccCode: 'EF07MA03',
      pedagogicalGoal: 'Dominar números negativos e positivos e calcular deslocamentos na reta.',
      min: -bound,
      max: bound,
      majorStep,
      minorStep,
      hiddenTicks: [p1, p3],
      dropPositions: [p1, p2, p3, p4],
      landmarks: [
        { id: 'clm-n1', position: lmPos1, objectKind: 'submarine', name: 'Submarino', hideTickLabel: true },
        { id: 'clm-n2', position: lmPos2, objectKind: 'rocket', name: 'Foguete', hideTickLabel: false },
      ],
      tokens: [
        {
          id: 'ct-n1',
          targetPosition: p1,
          category: 'number',
          displayLabel: `${p1}`,
          clueLabel: `${Math.abs(p1 - lmPos1)} à esquerda do Submarino (${lmPos1})`,
          hint: `Subtraia ${Math.abs(p1 - lmPos1)} a partir de ${lmPos1} para chegar em ${p1}.`,
          jumpFrom: lmPos1,
        },
        {
          id: 'ct-n2',
          targetPosition: p2,
          category: 'object',
          objectKind: rotated[2].kind,
          displayLabel: `${rotated[2].name} (${p2})`,
          clueLabel: `${Math.abs(p2)} unidades à esquerda do 0`,
          hint: `Conte ${Math.abs(p2)} marcas para a esquerda partindo da origem 0.`,
          jumpFrom: 0,
        },
        {
          id: 'ct-n3',
          targetPosition: p3,
          category: 'expression',
          displayLabel: `+${p3}`,
          clueLabel: `Simétrico de -${p3}`,
          hint: `Localize +${p3} no lado direito da origem.`,
          jumpFrom: 0,
        },
        {
          id: 'ct-n4',
          targetPosition: p4,
          category: 'object',
          objectKind: rotated[3].kind,
          displayLabel: `${rotated[3].name} (+${p4})`,
          clueLabel: `${p4 - lmPos2} à direita do Foguete (+${lmPos2})`,
          hint: `Partindo de +${lmPos2}, avance +${p4 - lmPos2} unidades.`,
          jumpFrom: lmPos2,
        },
      ],
      questions: [
        {
          id: 'cq-n1',
          prompt: 'Em qual coordenada negativa o Submarino está posicionado nesta rodada?',
          focusPosition: lmPos1,
          options: [
            { id: 'o1', label: `${lmPos1 - 2}`, value: `${lmPos1 - 2}` },
            { id: 'o2', label: `${lmPos1}`, value: `${lmPos1}` },
            { id: 'o3', label: `${lmPos1 + 2}`, value: `${lmPos1 + 2}` },
            { id: 'o4', label: `+${Math.abs(lmPos1)}`, value: `${Math.abs(lmPos1)}` },
          ],
          correctValue: `${lmPos1}`,
          explanation: `O Submarino está exatamente em ${lmPos1} (à esquerda do zero).`,
        },
      ],
    };
  }

  // Decimals / Fractions / Tens fallback
  const isFraction = config.mode === 'fractions';
  const maxVal = config.mode === 'tens' ? 100 : 4;
  const majorStep = config.mode === 'tens' ? 10 : 1;
  const minorStep = config.mode === 'tens' ? 5 : 0.5;
  const p1 = config.mode === 'tens' ? 15 : 0.5;
  const p2 = config.mode === 'tens' ? 45 : 1.5;
  const p3 = config.mode === 'tens' ? 70 : 2.5;
  const p4 = config.mode === 'tens' ? 95 : 3.5;
  const lm1 = config.mode === 'tens' ? 30 : 1;
  const lm2 = config.mode === 'tens' ? 80 : 3;

  return {
    id: 300 + seedCounter,
    title: isFraction
      ? 'Laboratório Livre: Frações (0 a 4)'
      : config.mode === 'tens'
      ? 'Laboratório Livre: Dezenas (0 a 100)'
      : 'Laboratório Livre: Decimais (0 a 4)',
    subtitle: 'Subdivisões e Equivalências na Reta',
    difficultyLabel: 'Modo Laboratório',
    bnccCode: 'EF05MA02 / EF06MA07',
    pedagogicalGoal: 'Explorar subdivisões da reta numérica com representação fracionária, decimal ou dezenas.',
    min: 0,
    max: maxVal,
    majorStep,
    minorStep,
    formatTick: formatPtNumber,
    hiddenTicks: [],
    dropPositions: [p1, p2, p3, p4],
    landmarks: [
      { id: 'clm-d1', position: lm1, objectKind: rotated[0].kind, name: rotated[0].name, hideTickLabel: false },
      { id: 'clm-d2', position: lm2, objectKind: rotated[1].kind, name: rotated[1].name, hideTickLabel: true },
    ],
    tokens: [
      {
        id: 'ct-d1',
        targetPosition: p1,
        category: isFraction ? 'fraction' : 'decimal',
        displayLabel: isFraction ? '1/2' : formatPtNumber(p1),
        clueLabel: `Metade entre 0 e ${majorStep}`,
        hint: `Localize a primeira subdivisão do meio após o 0.`,
        jumpFrom: 0,
      },
      {
        id: 'ct-d2',
        targetPosition: p2,
        category: 'object',
        objectKind: rotated[2].kind,
        displayLabel: `${rotated[2].name} (${isFraction ? '3/2' : formatPtNumber(p2)})`,
        clueLabel: `Logo após ${formatPtNumber(lm1)}`,
        hint: `Fica na marca intermediária depois de ${formatPtNumber(lm1)}.`,
        jumpFrom: lm1,
      },
      {
        id: 'ct-d3',
        targetPosition: p3,
        category: isFraction ? 'fraction' : 'decimal',
        displayLabel: isFraction ? '5/2' : formatPtNumber(p3),
        clueLabel: `Posição ${formatPtNumber(p3)}`,
        hint: `Localize o valor correspondente a ${formatPtNumber(p3)} na reta.`,
        jumpFrom: lm1,
      },
      {
        id: 'ct-d4',
        targetPosition: p4,
        category: 'object',
        objectKind: rotated[3].kind,
        displayLabel: `${rotated[3].name} (${isFraction ? '7/2' : formatPtNumber(p4)})`,
        clueLabel: `Meio passo após ${rotated[1].name} (${formatPtNumber(lm2)})`,
        hint: `Avance uma subdivisão menor a partir de ${formatPtNumber(lm2)}.`,
        jumpFrom: lm2,
      },
    ],
    questions: [
      {
        id: 'cq-d1',
        prompt: `Em qual valor da reta numérica está posicionado o objeto ${rotated[1].name}?`,
        focusPosition: lm2,
        options: [
          { id: 'do1', label: formatPtNumber(lm1), value: `${lm1}` },
          { id: 'do2', label: formatPtNumber(p2), value: `${p2}` },
          { id: 'do3', label: formatPtNumber(lm2), value: `${lm2}` },
          { id: 'do4', label: formatPtNumber(maxVal), value: `${maxVal}` },
        ],
        correctValue: `${lm2}`,
        explanation: `${rotated[1].name} está exatamente na marca ${formatPtNumber(lm2)}.`,
      },
    ],
  };
}
