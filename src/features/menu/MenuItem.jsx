import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { addItem, getCurrentQuantityById } from '../cart/cartSlice';
import DeleteItem from '../cart/DeleteItem';
import UpdateQuantity from '../cart/UpdateQuantity';

function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;
  const handleAdd = () => {
    if (!id) return;
    const newPizza = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newPizza));
  };

  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-stone-500 capitalize italic">
          {ingredients.join(', ')}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium text-stone-500 uppercase">
              Sold out
            </p>
          )}

          {isInCart && (
            <div className="flex items-center gap-3 sm:gap-8">
              <UpdateQuantity pizzaId={id} currentQuantity={currentQuantity} />
              <DeleteItem pizzaId={id} />
            </div>
          )}

          {!soldOut && !isInCart && (
            <Button type="small" onclick={handleAdd}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

// now above div is flex flex-col then if we apply mt-auto then price move at bottom automatically
// grow property stretch the div as much space available
export default MenuItem;
