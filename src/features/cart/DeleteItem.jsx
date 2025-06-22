import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { removeItem } from './cartSlice';

export default function DeleteItem({pizzaId}) {
  const dispatch = useDispatch()
  const handleDelete = () => {
    if (!pizzaId) return;
    dispatch(removeItem(pizzaId));
  };
  
  return (
    <Button type="small" onclick={handleDelete}>
      Delete
    </Button>
  );
}
