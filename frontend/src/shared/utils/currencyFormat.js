
export const toTenge = (amount) => {
  return new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT' }).format(amount);
};
