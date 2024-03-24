import { Button } from "../../@/components/ui/button";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useShoppingCart } from "../context/ShoppingCartContext";

interface FruitProps {
  id: number;
  FruitName: string;
  FruitPrice: number;
  fruitImg: string;
}

const ProductBox = ({ FruitName, FruitPrice, fruitImg, id }: FruitProps) => {
  const rating = 3;
  const starsArray = Array(5).fill(
    <IoIosStarOutline className="text-yellow-400" />
  );

  for (let i = 0; i < rating; i++) {
    starsArray[i] = <IoIosStar className="text-yellow-400" key={i} />;
  }

  const { increaseCartQuantity } = useShoppingCart();

  return (
    <div className="bg-bg_color2 p-4 w-[250px] rounded-xl shadow-md hover:scale-[1.05] transition-transform duration-500">
      <div className="relative">
        <img
          alt="Apple"
          className="mx-auto bg-bg_color2 p-2"
          height="150"
          src={fruitImg}
          style={{
            aspectRatio: "150/150",
            objectFit: "cover",
          }}
          width="150"
        />
      </div>
      <div className="text-center mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-text_color">{FruitName}</h3>
          <p className="text-[12px] text-gray-500">By Weight 3 / kg</p>
        </div>

        <div className="flex mt-2">{starsArray}</div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-semibold mt-3 text-text_color">
            ${FruitPrice}
          </p>
          <div className="flex justify-center items-center mt-4">
            <Button
              className="text-green-600 border p-1 rounded-[6px] border-primary_color"
              variant="ghost"
              onClick={() => {
                increaseCartQuantity(id);
              }}
            >
              <PiShoppingCartSimpleBold className="w-6 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
