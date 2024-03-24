import { Container } from "react-bootstrap";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../@/components/ui/tabs";
import ProductBox from "./ProductBox";
import fruitDetails from "../data/fruitDetails.json";

const ProductSection = () => {
  return (
    <>
      <Container className="px-24 mt-28">
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="flex text-3xl text-text_color font-semibold">
            Top Product
          </h1>
          <Tabs
            defaultValue="account"
            className="flex flex-col items-center justify-center gap-10"
          >
            <TabsList className="flex gap-8">
              <TabsTrigger
                value="account"
                className=" text-[17px] font-semibold text-primary_color border-b-2 border-b-primary_color"
              >
                Feautred
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="text-[17px] font-semibold text-text_color hidden md:block"
              >
                new Arrival
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="text-[17px] font-semibold text-text_color hidden md:block"
              >
                Sale Off
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="account"
              className="flex flex-col md:flex-row gap-10"
            >
              {fruitDetails.map((fruit) => (
                <ProductBox
                  key={fruit.id}
                  FruitName={fruit.name}
                  FruitPrice={fruit.price}
                  fruitImg={fruit.imgUrl}
                  id={fruit.id}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default ProductSection;
