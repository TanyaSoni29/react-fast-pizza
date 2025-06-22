import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
import { updateOrder } from '../../services/apiRestaurant';

export default function UpdateOrder({ order }) {
  const fetcher = useFetcher(); // here to set priority from false to true we use form inside the fetcher hook means we wrap this button inside the form the form that we are using before is causing navigation but here navigation will not cause and also re-validate the page now to update order we need again action
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make Priority</Button>;
    </fetcher.Form>
  );
}

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}

// now by this action immediately page is updated and this is power of re-validation re-validation means react router knows this action change the data so it automatically re-fetch the data in the background and load the page with that new data 
