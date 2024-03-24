import { useShoppingCart } from "../context/ShoppingCartContext";
import { Container, Stack } from "react-bootstrap";
import { CartItem } from "../components/CartItem";
import { roundToTwoDecimalPlaces } from "../utilities/formatCurrency";
import fruitDetails from "../data/fruitDetails.json";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../@/components/ui/collapsible";
import { Button } from "../../@/components/ui/button";
import Switch from "@mui/material/Switch";
import { green } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";
import { Input } from "../../@/components/ui/input";
import { RiVisaLine } from "react-icons/ri";
import { IoMdUnlock } from "react-icons/io";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";
const CheckOutCart = () => {
  // Destructure the cartItems, toggleDiscountOffer, isDiscountOfferActive, calculateDiscountedTotal and offers from the useShoppingCart hook
  const {
    cartItems,
    toggleDiscountOffer,
    isDiscountOfferActive,
    calculateDiscountedTotal,
    offers,
  } = useShoppingCart();
  const [, , removeFromLocalStorage] = useLocalStorage("shopping-cart", []);

  // Styling for the switch
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: green[500],
      "&:hover": {
        backgroundColor: alpha(green[500], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: green[600],
    },
  }));

  const subtotal = cartItems.reduce((total, cartItem) => {
    const item = fruitDetails.find((i) => i.id === cartItem.id);
    return total + (item?.price || 0) * cartItem.quantity;
  }, 0);

  const discountedTotal = cartItems.reduce((total, cartItem) => {
    return total + calculateDiscountedTotal(cartItem, offers); // Pass both item and offers
  }, 0);

  // Function to handle checkout to stripe
  const checkout = async () => {
    await fetch("http://localhost:4000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        total: discountedTotal,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.url) {
          window.location.assign(response.url); // Forwarding user to Stripe
        }
      });
  };

  // Function to handle payment
  const handlePay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("Payment Successful");
    removeFromLocalStorage();
    window.location.href = "/";
  };

  // State for card number, expiry date and cvc

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCVC] = useState("");

  // Function to format card number
  const formatCardNumber = (input: string) => {
    let cardNumberValue = input.replace(/\D/g, "");
    cardNumberValue = cardNumberValue.replace(/(\d{4})/g, "$1-");
    cardNumberValue = cardNumberValue.replace(/-$/, "");
    setCardNumber(cardNumberValue);
  };

  // Function to format expiry date
  const formatExpiryDate = (input: string) => {
    let expiryDateValue = input.replace(/\D/g, "");
    if (expiryDateValue.length > 2) {
      expiryDateValue =
        expiryDateValue.slice(0, 2) + " / " + expiryDateValue.slice(2);
    }
    setExpiryDate(expiryDateValue);
  };

  return (
    <>
      <Container className="flex flex-col lg:flex-row gap-8 px-2 lg:px-24 justify-center">
        <div className="border w-full lg:w-[50%] h-fit p-5 rounded-[6px]">
          <h1 className="text-xl border-b pb-5 font-semibold">Shopping Cart</h1>
          <Stack className="mt-5">
            <div className="border-b pb-4">
              {cartItems.length === 0 ? (
                <div className="border-b pb-4 text-center font-semibold text-lg">
                  No item in cart
                </div>
              ) : (
                <div className="border-b pb-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} {...item} />
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5 border-b pb-4">
              <div className="flex items-center justify-between px-4">
                Subtotal
                <span className="font-semibold">
                  $ {roundToTwoDecimalPlaces(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between w-full px-2 pl-3 mt-4">
                {/* Offer */}
                <span className="w-full">
                  <Collapsible className="">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <p>Special Offer</p>
                      <Button
                        className="bg-primary_color text-white p-[5px] rounded-[6px] text-[12px] font-semibold mb-2 hover:bg-green-600"
                        onClick={() => toggleDiscountOffer("all")} // Apply generic "all" discount here (replace with specific offer name if needed)
                      >
                        Apply Offer
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col">
                      <div className="flex items-center justify-between text-sm">
                        <p>
                          <span className=" text-primary_color font-semibold">
                            Orange
                          </span>
                          : 3 For The Price Of 2
                        </p>
                        <GreenSwitch
                          checked={isDiscountOfferActive("threeForTwoOranges")} // Check for specific offer state
                          onChange={() =>
                            toggleDiscountOffer("threeForTwoOranges")
                          } // Toggle the offer
                          inputProps={{ "aria-label": "controlled" }}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p>
                          <span className="text-primary_color font-semibold">
                            Apple
                          </span>
                          : Buy One Get One Free
                        </p>
                        <GreenSwitch
                          checked={isDiscountOfferActive(
                            "buyOneGetOneFreeApples"
                          )} // Check for specific offer state
                          onChange={() =>
                            toggleDiscountOffer("buyOneGetOneFreeApples")
                          } // Toggle the offer
                          inputProps={{ "aria-label": "controlled" }}
                          className="cursor-pointer"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 mt-4 text-primary_color font-semibold">
              Total
              <span>${roundToTwoDecimalPlaces(discountedTotal)}</span>
            </div>
          </Stack>
        </div>
        {/* Payment Section */}
        <div className="md:-mt-5 md:p-6 bg-white">
          <form className="">
            <div className="mb-6 border p-6 rounded-[7px] h-[410px]">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-5">
                Delivery Info
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <Input
                  placeholder="First Name"
                  className="p-2 rounded-[5px]"
                  required
                />
                <Input
                  placeholder="Last Name"
                  className="p-2 rounded-[5px]"
                  required
                />
                <Input
                  placeholder="Address"
                  className="p-2 rounded-[5px]"
                  required
                />
                <Input
                  placeholder="City"
                  className="p-2 rounded-[5px]"
                  required
                />
                <Input
                  placeholder="State"
                  className="p-2 rounded-[5px]"
                  required
                />
                <Input
                  placeholder="Zip"
                  className="p-2 rounded-[5px]"
                  required
                />
                <Input
                  placeholder="Phone"
                  className="p-2 rounded-[5px]"
                  required
                />
              </div>
            </div>
            <div className=" border rounded-[7px] p-5 md:p-">
              <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4">Payment</h2>
                <div className="flex mb-4 border p-[3px] rounded-[5px] bg-[#F6F6F6] gap-4">
                  <Button className="text-primary_color border p-1 rounded-[3px] text-xs bg-white">
                    Credit Card
                  </Button>
                  <Button className="p-1 text-xs text-slate-500">Paypal</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-9">
                <div className="flex relative">
                  <Input
                    placeholder="Card Number"
                    className="p-2 rounded-[5px]"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => formatCardNumber(e.target.value)}
                  />
                  <RiVisaLine className=" absolute right-2 top-2 text-2xl border w-8 rounded-[5px] text-primary_color" />
                </div>
                <div className="flex space-x-4">
                  <Input
                    placeholder="MM / YY"
                    maxLength={7}
                    className="p-2 rounded-[5px]"
                    value={expiryDate}
                    onChange={(e) => formatExpiryDate(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="CVC"
                    maxLength={3}
                    className="p-2 rounded-[5px]"
                    value={cvc}
                    onChange={(e) => setCVC(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                {discountedTotal > 0 ? (
                  <Button
                    className="bg-primary_color hover:bg-green-600 text-white w-full mt-6 p-2 rounded-[5px] cursor-pointer font-semibold flex gap-1 items-center"
                    type="submit"
                    onClick={handlePay}
                  >
                    <IoMdUnlock className="text-white" size={18} />
                    Pay Now ${roundToTwoDecimalPlaces(discountedTotal)}
                  </Button>
                ) : (
                  <Button
                    className="bg-primary_color hover:bg-green-600 text-white w-full mt-6 p-2 rounded-[5px] cursor-pointer font-semibold flex gap-1 items-center"
                    type="submit"
                    onClick={() => {
                      alert("Please Shop Before Making Payment");
                    }}
                  >
                    <IoMdUnlock className="text-white" size={18} />
                    Pay Now ${roundToTwoDecimalPlaces(discountedTotal)}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
};

export default CheckOutCart;
