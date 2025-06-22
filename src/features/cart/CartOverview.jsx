import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTotalCartItem, getTotalCartPrice } from './cartSlice';
import { formatCurrency } from '../../utils/helpers';

function CartOverview() {
  // const { cart } = useSelector((state) => state.cart);
  // const totalCart = cart
  //   .reduce((acc, curr) => acc + curr.quantity, 0)
  //   ?.toFixed(2);
  // this is not better practice redux always say when you select state then immediately perform your operation as shown below and

  // const totalPizzas = useSelector((state) =>
  //   state.cart.cart.reduce((sum, item) => sum + item.quantity, 0),
  // );

  // and best practice you should do that inside the slice and key point is the name will always start from get

  const totalPizzas = useSelector(getTotalCartItem);
  const totalCartPrize = useSelector(getTotalCartPrice);

  if (!totalPizzas) return null;
  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm text-stone-200 uppercase sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalPizzas} pizzas</span>
        <span>${formatCurrency(totalCartPrize)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
