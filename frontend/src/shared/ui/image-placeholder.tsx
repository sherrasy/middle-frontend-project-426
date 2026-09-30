import { PhotoCamera } from '@material-symbols-svg/react/photo-camera';

export const ImagePlaceholder = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-8'>
      <PhotoCamera />
      <span className='text-sm text-gray-400'>Нет изображения</span>
    </div>
  );
};
