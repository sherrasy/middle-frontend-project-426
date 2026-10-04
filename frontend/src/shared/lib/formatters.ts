export const formatPrice = (value: number) =>
  `${value.toLocaleString('ru-RU')} ₽`;

export const formatDate = (isoString: string) => {
  return new Date(isoString)
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ' в');
};
