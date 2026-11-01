export const STATUS = [
  { valor: 'QUERO_LER', rotulo: 'Quero ler' },
  { valor: 'LENDO', rotulo: 'Lendo' },
  { valor: 'LIDO', rotulo: 'Lido' },
];

export const rotuloStatus = (valor) => STATUS.find((s) => s.valor === valor)?.rotulo ?? valor;
