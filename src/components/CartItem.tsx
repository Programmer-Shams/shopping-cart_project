import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { roundToTwoDecimalPlaces } from "../utilities/formatCurrency";
import fruitDetails from "../data/fruitDetails.json";

type CartItemProps = {
  id: number;
  quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
  const { removeFromCart, decreaseCartQuantity, increaseCartQuantity } =
    useShoppingCart();
  const item = fruitDetails.find((i) => i.id === id);
  if (item == null) return null;

  return (
    <Stack
      direction="horizontal"
      className="flex justify-between items-center py-3 relative"
    >
      <div className="flex justify-between items-center w-[95%]">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={item.imgUrl}
            className="bg-[#F6F6F6] p-3 md:p-5 rounded-xl h-[100px] md:h-[120px] w-[120px] md:w-[140px] object-cover"
          />
          <div className="flex flex-col items-center gap-10">
            <div>
              {item.name}{" "}
              {quantity > 1 && <span style={{ fontSize: ".65rem" }}></span>}
            </div>
            <div
              className=" border flex items-center justify-between py-1 px-3 w-[85px] rounded-[5px]"
              style={{ gap: ".5rem" }}
            >
              <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
              <hr className="border border-[#dfdede] w-[1px] h-[20px]" />
              <div>
                <span className="fs-3">{quantity}</span>
              </div>
              <hr className="border border-[#dfdede] w-[1px] h-[20px]" />
              <Button onClick={() => increaseCartQuantity(id)}>+</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-7">
          <p className="font-semibold text-[15px]">${item.price}</p>
          <div>
            <p className="text-[14px]">
              QTY: <span>{quantity}</span>
            </p>
            <p className="text-primary_color font-semibold text-[15px]">
              ${roundToTwoDecimalPlaces(item.price * quantity)}
            </p>
          </div>
        </div>
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => removeFromCart(item.id)}
        className=" absolute top-3 md:top-6 right-0 md:right-1"
      >
        &times;
      </Button>
    </Stack>
  );
}
