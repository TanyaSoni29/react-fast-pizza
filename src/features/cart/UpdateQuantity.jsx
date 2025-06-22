import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice';

export default function UpdateQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();
  return (
    <div className="item-center flex gap-2 md:gap-3">
      <Button
        type="round"
        onclick={() => dispatch(decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button
        type="round"
        onclick={() => dispatch(increaseItemQuantity(pizzaId))}
      >
        +
      </Button>
    </div>
  );
}
