interface CatalogHeaderProps {
  total: number;
}
export const CatalogHeader = ({ total }: CatalogHeaderProps) => {
  return (
    <div className='mb-6'>
      <h2 className='text-2xl font-bold text-gray-900'>Комплектующие для ПК</h2>
      <p className='text-md text-gray-500 mt-1'>
        Видеокарты, процессоры и материнские платы - с фильтрами по категории,
        цене и наличию
      </p>
      <p className='text-sm text-gray-500 mt-1'>Найдено товаров: {total}</p>
    </div>
  );
};
