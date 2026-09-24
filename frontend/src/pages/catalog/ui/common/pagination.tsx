import { ArrowRightAlt } from '@material-symbols-svg/react/arrow-right-alt';
import { ArrowLeftAlt } from '@material-symbols-svg/react/arrow-left-alt';
import { TEST_IDS } from '@/shared/constants/testids';
import {
  DEFAULT_SURROUND,
  getPaginationRange,
  PAGE_ELLIPSIS,
} from '../../lib/getPagesRange';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const navButtonClass =
  'px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer';

const pageButtonBaseClass =
  'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages, DEFAULT_SURROUND);

  const handlePrev = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <nav
      aria-label='Пагинация'
      className='flex items-center justify-center space-x-2 mt-8'
      data-testid={TEST_IDS.catalog.pagination}
    >
      <button
        type='button'
        data-testid={TEST_IDS.catalog.pagePrev}
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label='Предыдущая страница'
        className={navButtonClass}
      >
        <ArrowLeftAlt />
      </button>

      <div className='flex gap-2'>
        {pages.map((page, i) =>
          page === PAGE_ELLIPSIS ? (
            <span
              key={`dots-${i}`}
              aria-hidden='true'
              className='px-3 py-2 text-gray-500 select-none'
            >
              {PAGE_ELLIPSIS}
            </span>
          ) : (
            <button
              key={page}
              type='button'
              onClick={() => onPageChange(page)}
              className={`${pageButtonBaseClass} ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type='button'
        data-testid={TEST_IDS.catalog.pageNext}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label='Следующая страница'
        className={navButtonClass}
      >
        <ArrowRightAlt />
      </button>
    </nav>
  );
};
