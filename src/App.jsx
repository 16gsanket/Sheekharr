import { useState } from "react";

// Placeholder components for each product
function Paneer() {
  return <div>Paneer Calculator (to be implemented)</div>;
}
function IceCream() {
  return <div>Ice Cream Calculator (to be implemented)</div>;
}
function Kulfi() {
  return <div>Kulfi Calculator (to be implemented)</div>;
}

function App() {
  const [product, setProduct] = useState("Paneer");

  let ProductComponent;
  if (product === "Paneer") ProductComponent = <Paneer />;
  else if (product === "Ice Cream") ProductComponent = <IceCream />;
  else if (product === "Kulfi") ProductComponent = <Kulfi />;

  return (
    <div className="font-sans min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="flex items-center p-4 bg-blue-900 text-white">
        <img src="/logo.png" alt="Sheekharr Logo" className="h-10 mr-4" />
        <span className="font-bold text-xl">Sheekharr Starch</span>
      </nav>
      {/* Product Selector */}
      <div className="p-4 max-w-md mx-auto">
        <label htmlFor="product-select" className="font-bold mr-2">Select Product:</label>
        <select
          id="product-select"
          value={product}
          onChange={e => setProduct(e.target.value)}
          className="p-2 text-base rounded border"
        >
          <option value="Paneer">Paneer</option>
          <option value="Ice Cream">Ice Cream</option>
          <option value="Kulfi">Kulfi</option>
        </select>
      </div>
      {/* Product Calculator */}
      <div className="p-4 max-w-md mx-auto">
        {ProductComponent}
      </div>
    </div>
  );
}

export default App;
