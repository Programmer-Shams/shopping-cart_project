import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import toast from "react-hot-toast";
import fruitDetails from "../data/fruitDetails.json";

// Define types and interfaces
type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

interface Offers {
  buyOneGetOneFreeApples: boolean;
  threeForTwoOranges: boolean;
}

type ShoppingCartContext = {
  getItemQuantity: (id: number) => number; // Function to get the quantity of a specific item in the cart
  increaseCartQuantity: (id: number) => void; // Function to increase the quantity of a specific item in the cart
  decreaseCartQuantity: (id: number) => void; // Function to decrease the quantity of a specific item in the cart
  removeFromCart: (id: number) => void; // Function to remove an item from the cart
  cartQuantity: number; // Total quantity of items in the cart
  cartItems: CartItem[]; // Array of items in the cart
  toggleDiscountOffer: (offerName: string) => void; // Function to toggle a discount offer
  isDiscountOfferActive: (offerName: string) => boolean; // Function to check if a discount offer is active
  calculateDiscountedTotal: (item: CartItem, offers: Offers) => number; // Function to calculate the discounted total amount
  offers: Offers; // Object containing the state of discount offers
};

// Create context for shopping cart
const ShoppingCartContext = createContext({} as ShoppingCartContext);

// Custom hook to use shopping cart context
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

// Provider component for shopping cart context
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [offers, setOffers] = useState<Record<string, boolean>>({});

  // Calculate total quantity of items in the cart
  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  // Function to get the quantity of a specific item in the cart
  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  // Function to increase and add the quantity of a specific item in the cart
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
    toast.success("Product added to cart"); // Show success toast when item is added to cart
  }

  // Function to decrease the quantity of a specific item in the cart
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  // Function to remove an item from the cart
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  // Function to toggle a discount offer
  const toggleDiscountOffer = (offerName: string) => {
    setOffers((prevOffers) => ({
      ...prevOffers,
      [offerName]: !prevOffers[offerName],
    }));
  };

  // Function to check if a discount offer is active
  const isDiscountOfferActive = (offerName: string) => offers[offerName];

  // Function to calculate the discounted total amount
  const calculateDiscountedTotal = (item: CartItem, offers: Offers): number => {
    const fruit = fruitDetails.find((fruit) => fruit.id === item.id);

    if (!fruit) return 0;

    if (
      (fruit.name === "Apple" || fruit.name === "Red Apple") &&
      offers.buyOneGetOneFreeApples
    ) {
      const totalApples = item.quantity;
      const discountedApples = Math.floor(totalApples / 2); // Calculate half of the total apples
      const regularApples = totalApples % 2; // Calculate the remaining apples that are not discounted
      const discountedPrice = discountedApples * fruit.price;
      const regularPrice = regularApples * fruit.price;
      return roundToTwoDecimalPlaces(discountedPrice + regularPrice); // Return the total price after discount
    }

    if (fruit.name === "Orange" && offers.threeForTwoOranges) {
      const totalOranges = item.quantity;
      const discountedGroups = Math.floor(totalOranges / 3);
      const remainingOranges = totalOranges % 3;
      const discountedPrice = discountedGroups * 2 * fruit.price;
      const regularPrice = remainingOranges * fruit.price;
      return roundToTwoDecimalPlaces(discountedPrice + regularPrice);
    }

    return roundToTwoDecimalPlaces(item.quantity * fruit.price);
  };

  // Function to round a number to two decimal places
  const roundToTwoDecimalPlaces = (value: number): number => {
    return Math.round(value * 100) / 100;
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        toggleDiscountOffer,
        isDiscountOfferActive,
        calculateDiscountedTotal,
        cartItems,
        cartQuantity,
        offers: {
          buyOneGetOneFreeApples: false,
          threeForTwoOranges: false,
          ...offers,
        },
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
