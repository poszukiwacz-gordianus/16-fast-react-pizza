import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/apiRestaurant";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import { fetchAddress, getUsername, updateName } from "../user/userSlice";
import store from "../../store";
import EmptyCard from "../cart/EmptyCart";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((store) => store.user);
  const isLodingAddress = addressStatus === "loading";
  const [firstName, setFirstName] = useState(username);
  const isSubmitting = navigation.state === "submitting";
  const totalCartPrice = useSelector(getTotalCartPrice);
  const formErrors = useActionData();
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  function handleInput(e) {
    setFirstName(e.target.value);
  }

  useEffect(() => {
    dispatch(updateName(firstName));
  }, [firstName, dispatch]);

  if (!cart.length) return <EmptyCard />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <div className="grow">
            <Input
              value={firstName}
              onChange={handleInput}
              type="text"
              name="customer"
              classN="w-full"
            />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            {formErrors?.phone && (
              <p className="mb-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
            <Input type="tel" name="phone" classN="w-full" />
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              className="w-full rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-400 md:px-6 md:py-3"
              disabled={isLodingAddress}
              defaultValue={address}
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="z-100 absolute right-1.5 top-9 sm:top-1">
              <Button
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
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
                ? JSON.stringify({
                    lat: position.latitude,
                    lng: position.longitude,
                  })
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting || isLodingAddress}>
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  console.log(order);

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  //If everything is okay, create new order and redirect
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
