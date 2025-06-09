import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const formErrors = useActionData(); // to get access of data return by the attached action
  const isSubmitting = navigation.state === "submitting";
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> we can give action or leave it as below react router by default simply match with the closest route by doing this it will not work now we have to give action so similarly as loader below we write action function */}
      <Form method='POST'>
        <div>
          <label>First Name</label>
          <input type='text' name='customer' required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type='tel' name='phone' required />
          </div>
          {formErrors.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type='text' name='address' required />
          </div>
        </div>

        <div>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority'>Want to yo give your order priority?</label>
        </div>

        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <button disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Order now"}
          </button>
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
    priority: data.priority === "on",
  };

  // data validation inside the action can also be done before placing the order or after placing the order
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you."; // and now we can say if error object contain any error the we want to return the error object in the createOrder component
  if (Object.keys(errors).length > 0) return errors;

  // if everything is okay then create new order and redirect to that order

  const newOrder = await createOrder(order); // now we redirect the user to this new order but here we can't use the navigate as navigate comes from useNavigate Hook and inside this action function we can't use hook so here we use another function which is called redirect this will create new response or new request

  return redirect(`/order/${newOrder.id}`);
}

// now as cretaOrder router is wired up with the above action then data return why this action can be accessible inside the CreateOrder component

export default CreateOrder;
