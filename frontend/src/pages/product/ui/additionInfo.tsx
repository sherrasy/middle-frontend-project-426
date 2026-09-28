export const AdditionalInfo = () => {
  return (
    <div className='border-t border-gray-200 pt-6'>
      <ul className='space-y-2 text-sm text-gray-600'>
        <li className='flex items-center gap-2'>
          <span className='text-gray-400'>•</span>
          <span>Цена указана в рублях, без копеек</span>
        </li>
        <li className='flex items-start gap-2'>
          <span className='text-gray-400'>•</span>
          <span>Доставка по городу или самовывоз</span>
        </li>
        <li className='flex items-start gap-2'>
          <span className='text-gray-400'>•</span>
          <span>Оплата при оформлении заказа</span>
        </li>
      </ul>
    </div>
  );
};
