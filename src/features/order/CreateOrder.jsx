import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { clearCart, getTotalCartPrice } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const dispatch = useDispatch();
  const [withPriority, setWithPriority] = useState(false);
  const {
    userName,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const isLoadingPosition = addressStatus === 'loading';
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const navigation = useNavigation();
  const formErrors = useActionData(); // to get access of data return by the attached action
  const isSubmitting = navigation.state === 'submitting';
  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> we can give action or leave it as below react router by default simply match with the closest route by doing this it will not work now we have to give action so similarly as loader below we write action function */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* due flex we use this basis property to give enough space to label */}
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            defaultValue={userName}
            required
            className="grow rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:ring focus:ring-yellow-400 focus:outline-none md:px-6 md:py-3"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              type="tel"
              name="phone"
              required
              className="w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:ring focus:ring-yellow-400 focus:outline-none md:px-6 md:py-3"
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors?.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              disabled={isLoadingPosition}
              defaultValue={address}
              className="w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:ring focus:ring-yellow-400 focus:outline-none md:px-6 md:py-3"
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute top-[3px] right-[3px] z-50 md:top-[5px] md:right-[5px]">
              <Button
                disabled={isLoadingPosition}
                type="small"
                onclick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-offset-2 focus:outline-none"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />
          {/* in tailwind when we apply focus outline none then it may create accessibility issue in order to tackle that we use ring */}
          {/* <button
            disabled={isSubmitting}
            // className="inline-block rounded-full bg-yellow-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing Order...' : 'Order now'}
          </button> 
          in this way we can create component and reuse the same style */}
          <Button disabled={isSubmitting || isLoadingPosition} type="primary">
            {isSubmitting
              ? 'Placing Order...'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
// when you are using this Form from react router then have you remember basic html form is also submitted like this

export async function action({ request }) {
  // as per the convention we have given the name of function is action as shown we submit the form it would create a request which intercepted the this action as shown as it connnected with react router as shown as the form submited this action have a request which can be aceess as props
  const formData = await request.formData(); // here this .formData is provided by the browser
  const data = Object.fromEntries(formData); // for the conversion of form Data to json
  console.log(data); // and final step connect this action to the route in the App.jsx
  // now to add cart data to create order
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  // data validation inside the action can also be done before placing the order or after placing the order
  const errors = {};
  if (!isValidPhone(order?.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.'; // and now we can say if error object contain any error the we want to return the error object in the createOrder component
  if (Object.keys(errors).length > 0) return errors;

  // if everything is okay then create new order and redirect to that order

  const newOrder = await createOrder(order); // now we redirect the user to this new order but here we can't use the navigate as navigate comes from useNavigate Hook and inside this action function we can't use hook so here we use another function which is called redirect this will create new response or new request

  // after creating the order now we want to clear the cart so basically here it is normal function so we can't use dispatch which come from useDispatch hook as it is not component so here we are using a trick but it is not good to use more widely just an emergency case ity have performance issues
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

// now as cretaOrder router is wired up with the above action then data return why this action can be accessible inside the CreateOrder component

export default CreateOrder;
