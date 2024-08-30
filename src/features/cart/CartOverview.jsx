import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CartOverview() {
  const cart = useSelector((store) => store.cart.items);
  const numOfPizzas = cart.reduce(
    (acc, quantity) => acc + quantity.quantity,
    0,
  );
  const totalPrice = cart.reduce((acc, price) => acc + price.totalPrice, 0);

  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="md: space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{numOfPizzas} pizzas</span>
        <span>${totalPrice}</span>
      </p>
      <Link to={"/cart"}>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
