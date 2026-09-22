interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState = ({
  title = 'Ничего не найдено',
  description = 'Под выбранные фильтры не подошёл ни один товар. Измените условия или сбросьте фильтры.',
  onReset,
}: EmptyStateProps) => {
  return (
    <div className='bg-white w-full rounded-xl shadow-sm border border-gray-100 p-12 text-center'>
      <h3 className='text-xl font-semibold text-gray-900 mb-2'>{title}</h3>

      <p className='text-gray-600 mb-6 max-w-md mx-auto'>{description}</p>

      {onReset && (
        <button
          onClick={onReset}
          className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors hover:cursor-pointer'
        >
          Показать все товары
        </button>
      )}
    </div>
  );
};
