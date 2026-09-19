import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-200 py-6'>
      <div className='max-w-6xl mx-auto px-4 flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          Магазин комплектующих для ПК — учебный проект Хекслета
        </p>
        <Link
          to='/'
          className='text-sm text-gray-500 hover:text-gray-700 transition-colors'
        >
          Каталог
        </Link>
      </div>
    </footer>
  );
};
