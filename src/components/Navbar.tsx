import { Container, Nav, Navbar as NavbarBs } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { LuLeafyGreen } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Input } from "../../@/components/ui/input";
import { useShoppingCart } from "../context/ShoppingCartContext";
import fruitDetails from "../data/fruitDetails.json";
import { roundToTwoDecimalPlaces } from "../utilities/formatCurrency";

export function Navbar() {
  const { cartQuantity, cartItems } = useShoppingCart();

  const subtotal = cartItems.reduce((total, cartItem) => {
    const item = fruitDetails.find((i) => i.id === cartItem.id);
    return total + (item?.price || 0) * cartItem.quantity;
  }, 0);

  return (
    <>
      <NavbarBs sticky="top" className="bg-white shadow-sm mb-3 px-2 lg:px-20">
        <Container className="hidden lg:block">
          <Nav className="flex items-center p-2 gap-12">
            <Nav.Link
              to="/"
              as={NavLink}
              className="flex items-center gap-1 text-3xl text-primary_color font-semibold"
            >
              <LuLeafyGreen className="" size={40} />
              <span>
                Green<span className="text-black">Bag</span>
              </span>
            </Nav.Link>
            <div className="flex items-center border rounded-[10px] px-2 py-1 w-[13rem] gap-1">
              <HiOutlineLocationMarker className="text-primary_color text-xl" />
              <Input
                type="text"
                placeholder="Select Location"
                className="outline-none border-none text-sm"
              />
              <RiArrowDropDownLine />
            </div>
            <div className="flex items-center gap-5 text-sm text-text_color font-semibold">
              <Nav.Link
                to="/"
                as={NavLink}
                className="text-primary_color border-b-2 border-text_color"
              >
                Home
              </Nav.Link>
              <Nav.Link
                to="/"
                as={NavLink}
                className="flex items-center w-[7rem]"
              >
                All Categories
                <span>
                  <RiArrowDropDownLine />
                </span>
              </Nav.Link>
              <Nav.Link to="/" as={NavLink} className=" -ml-3">
                Product
              </Nav.Link>
              <Nav.Link to="/" as={NavLink}>
                About
              </Nav.Link>
              <Nav.Link to="/" as={NavLink}>
                Contact
              </Nav.Link>
            </div>
            <div className="flex gap-5 items-center text-xl border p-2 rounded-xl">
              <MdFavoriteBorder />
              <div className="flex items-center gap-3">
                <Link
                  to="/CheckOutCart"
                  className="cursor-pointer flex items-center relative"
                >
                  <PiShoppingCartSimpleBold size={19} />
                  <span className=" text-xs font-semibold bg-red-600 rounded-full text-white px-1 py-0 absolute -top-2 left-3">
                    {cartQuantity}
                  </span>
                </Link>
                <span className="text-sm text-text_color">
                  ${roundToTwoDecimalPlaces(subtotal)}
                </span>
              </div>
            </div>
            <div className="flex items-center border rounded-[10px] px-2 py-1 w-[12rem] gap-1">
              <Input
                type="text"
                placeholder="Select Location"
                className="outline-none border-none text-sm"
              />
              <div>
                <FiSearch />
              </div>
            </div>
          </Nav>
        </Container>


        {/* Displaying the Navbar for Small Screens  */}
        <Container className="p-2 lg:hidden flex justify-between">
          <Nav.Link
            to="/"
            as={NavLink}
            className="flex items-center gap-1 text-xl text-primary_color font-semibold"
          >
            <LuLeafyGreen className="" size={30} />
            <span>
              Green<span className="text-black">Bag</span>
            </span>
          </Nav.Link>
          <div className="flex gap-6 items-center text-xl border p-2 rounded-xl">
            <MdFavoriteBorder />
            <div className="flex items-center gap-5">
              <Link
                to="/CheckOutCart"
                className="cursor-pointer flex items-center relative"
              >
                <PiShoppingCartSimpleBold size={19} />
                <span className=" text-xs font-semibold bg-red-600 rounded-full text-white px-1 py-0 absolute -top-2 left-3">
                  {cartQuantity}
                </span>
              </Link>
              <span className="text-sm text-text_color">
                ${roundToTwoDecimalPlaces(subtotal)}
              </span>
            </div>
          </div>
        </Container>
      </NavbarBs>
    </>
  );
}
