export type LogicOptionId = 'A' | 'B' | 'C' | 'D';

export type LogicOption = { id: LogicOptionId; label: string };
export type LogicQuestion = { id: string; text: string; options: LogicOption[] };

export const LOGIC_QUESTIONS: LogicQuestion[] = [
  {
    id: 'q1',
    text: 'Durante uma promoção, um produto de R$ 100,00 foi vendido com 20% de desconto. Qual foi o valor pago pelo cliente?',
    options: [
      { id: 'A', label: 'R$ 80,00' },
      { id: 'B', label: 'R$ 90,00' },
      { id: 'C', label: 'R$ 85,00' },
      { id: 'D', label: 'R$ 95,00' },
    ],
  },
  {
    id: 'q2',
    text: 'Se um caixa atendeu 48 clientes em 6 horas, quantos clientes atendeu por hora?',
    options: [
      { id: 'A', label: '6' },
      { id: 'B', label: '7' },
      { id: 'C', label: '8' },
      { id: 'D', label: '9' },
    ],
  },
  {
    id: 'q3',
    text: 'Uma dívida de R$ 1.000,00 deve ser paga em 5 parcelas com juros simples de 2% ao mês. Qual o valor total pago?',
    options: [
      { id: 'A', label: 'R$ 1.050,00' },
      { id: 'B', label: 'R$ 1.100,00' },
      { id: 'C', label: 'R$ 1.200,00' },
      { id: 'D', label: 'R$ 1.100,00' }, // repetido no PDF
    ],
  },
  {
    id: 'q4',
    text: 'Em um centro de distribuição, uma caixa grande contém o dobro de produtos de uma caixa média, que contém 10 itens. Quantos itens há em 3 caixas grandes e 2 médias?',
    options: [
      { id: 'A', label: '50' },
      { id: 'B', label: '60' },
      { id: 'C', label: '70' },
      { id: 'D', label: '80' },
    ],
  },
  {
    id: 'q5',
    text: 'Em um estoque de medicamentos, os frascos são organizados por cores: azul, verde, vermelho, azul, verde... Qual é a cor do 10º frasco?',
    options: [
      { id: 'A', label: 'Azul' },
      { id: 'B', label: 'Verde' },
      { id: 'C', label: 'Vermelho' },
      { id: 'D', label: 'Azul-claro' },
    ],
  },
  {
    id: 'q6',
    text: 'Uma loja funciona 10 horas por dia. Se 5 vendedores se revezam igualmente, quantas horas cada um trabalha por dia?',
    options: [
      { id: 'A', label: '1h' },
      { id: 'B', label: '2h' },
      { id: 'C', label: '3h' },
      { id: 'D', label: '2h30min' },
    ],
  },
  {
    id: 'q7',
    text: 'Um produto vale R$ 100 e recebe 2 descontos sucessivos de 10%. Qual o valor final?',
    options: [
      { id: 'A', label: 'R$ 80,00' },
      { id: 'B', label: 'R$ 81,00' },
      { id: 'C', label: 'R$ 82,00' },
      { id: 'D', label: 'R$ 83,00' },
    ],
  },
  {
    id: 'q8',
    text: 'Na loja, toda quarta há promoção de limpeza, e sexta de perfumaria. Qual a próxima quarta após o dia 8 (segunda)?',
    options: [
      { id: 'A', label: '9' },
      { id: 'B', label: '10' },
      { id: 'C', label: '11' },
      { id: 'D', label: '12' },
    ],
  },
  {
    id: 'q9',
    text: 'Em uma farmácia, para cada 3 vendas com receita, há 2 sem receita. Se foram feitas 25 vendas, quantas foram com receita?',
    options: [
      { id: 'A', label: '10' },
      { id: 'B', label: '15' },
      { id: 'C', label: '18' },
      { id: 'D', label: '20' },
    ],
  },
  {
    id: 'q10',
    text: 'Um gerente organiza uma escala em que cada funcionário trabalha 2 dias e folga 1. Se João começou a trabalhar em uma segunda-feira, em quais dias ele folga na primeira semana?',
    options: [
      { id: 'A', label: 'Quarta e sábado' },
      { id: 'B', label: 'Terça e sexta' },
      { id: 'C', label: 'Quarta e domingo' },
      { id: 'D', label: 'Terça e quinta' },
    ],
  },
];
