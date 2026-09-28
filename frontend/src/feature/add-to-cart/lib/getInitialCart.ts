export const getInitialCart = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      } catch (error) {
        console.error('Error parsing :', error);
      }
    }
  }
  return {};
};
