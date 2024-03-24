import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import Home from "./pages/Home";
import CheckOutCart from "./pages/CheckOutCart";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ShoppingCartProvider>
      <Router>
        <Toaster />
        <Navbar />
        <Container className="mb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/CheckOutCart" element={<CheckOutCart />} />
          </Routes>
        </Container>
      </Router>
    </ShoppingCartProvider>
  );
}

export default App;
