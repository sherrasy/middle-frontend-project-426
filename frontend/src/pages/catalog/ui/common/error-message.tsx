export const CatalogErrorMessage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center p-8 bg-white rounded-xl shadow-sm border border-red-100'>
        <h2 className='text-xl font-bold text-red-600 mb-2'>Ошибка загрузки</h2>

        <p className='text-gray-600'>
          Не удалось получить данные каталога. Попробуйте обновить страницу.
        </p>
      </div>
    </div>
  );
};
