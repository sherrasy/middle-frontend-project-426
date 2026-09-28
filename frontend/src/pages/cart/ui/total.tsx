interface CartTotalProps {
  amount: number;
  price: number;
}
export const CartTotal = ({ amount, price }: CartTotalProps) => {
  return (
    <div className='w-full lg:w-80 shrink-0 '>
      <div className='bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2'>
        <h2 className='text-xl font-bold text-gray-900 mb-2'>Итог</h2>

        <div className='border-t border-gray-200 pt-4 space-y-3'>
          <div className='flex justify-between text-gray-600'>
            <span>Товаров</span>
            <span className='font-medium text-gray-900'>{amount}</span>
          </div>

          <div className='flex justify-between items-baseline'>
            <span className='text-gray-600'>К оплате</span>
            <span className='text-xl font-bold text-gray-900'>
              {price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        <button
          disabled={!amount}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:cursor-pointer ${
            amount
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Оформить заказ
        </button>

        <p className='text-xs text-gray-400 mt-3 leading-relaxed'>
          Окончательную сумму посчитает сервер по актуальным ценам.
        </p>
      </div>
    </div>
  );
};
