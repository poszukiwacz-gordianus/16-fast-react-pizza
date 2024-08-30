import Button from "../../ui/Button";
import CartItem from "./CartItem";
import LinkButton from "../../ui/LinkButton";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "./cartSlice";

function Cart() {
  const cart = useSelector((store) => store.cart.items);
  const username = useSelector((store) => store.user.username);
  const dispatch = useDispatch();

  function handleClear() {
    dispatch(clearCart());
  }

  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>
      {cart.length > 0 ? (
        <ul className="divide-y divide-stone-200 border-b">
          {cart.map((item) => (
            <CartItem item={item} key={item.pizzaId} />
          ))}
        </ul>
      ) : (
        <p>Your cart is empty!</p>
      )}
      <div className="mt-6 space-x-2">
        {cart.length > 0 ? (
          <>
            <Button type="primary" to="/order/new">
              Order Pizzas
            </Button>

            <Button type="secondary" onClick={handleClear}>
              Clear cart
            </Button>
          </>
        ) : (
          <Button type="primary" to="/menu">
            Go to menu and choose one of our pizzas!
          </Button>
        )}
      </div>
    </div>
  );
}

export default Cart;
