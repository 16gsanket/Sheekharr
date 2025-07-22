import { useState } from "react";
import Navbar from "./Components/Navbar";
import ProductSelector from "./Components/ProductSelector";
import Paneer from "./Products/Paneer";
import IceCream from "./Products/IceCream";
import Kulfi from "./Products/Kulfi";
import Dahi from "./Products/Dahi";
import FlavouredMilk from "./Products/FlavouredMilk"
import Mayonnaise from "./Products/Mayonnaise";
import FrozenDessert from "./Products/FrozenDessert";
import Gulabjamun from "./Products/Gulabjamun";
import Cream from "./Products/Cream";


function App() {
  const [product, setProduct] = useState("Paneer");

  let ProductComponent;
  if (product === "Paneer") ProductComponent = <Paneer />;
  else if (product === "Ice Cream") ProductComponent = <IceCream />;
  else if (product === "Kulfi") ProductComponent = <Kulfi />;
  else if (product === "Dahi") ProductComponent = <Dahi />;
  else if (product === "Flavoured Milk") ProductComponent = <FlavouredMilk />;
  else if (product === "Mayonnaise") ProductComponent = <Mayonnaise />;
  else if (product === "FrozenDessert") ProductComponent = <FrozenDessert />;
  else if (product === "Gulabjamun") ProductComponent = <Gulabjamun />;
  else if (product === "Cream") ProductComponent = <Cream />;

  return (
    <div className="font-sans min-h-screen bg-slate-50">
      <Navbar />
      <ProductSelector product={product} setProduct={setProduct} />
      {/* Product Calculator */}
      <div className="p-4 max-w-md mx-auto">
        {ProductComponent}
      </div>
    </div>
  );
}

export default App;
