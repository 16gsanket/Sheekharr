function ProductSelector({ product, setProduct }) {
  return (
    <div className="p-4 max-w-md mx-auto pt-24">
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
        <option value="Dahi">Flavoured Dahi</option>
        {/* <option value="Flavoured Milk">Flavoured Milk</option>
        <option value="Mayonnaise">Mayonnaise</option>
        <option value="FrozenDessert">Frozen Dessert</option>
        <option value="Gulabjamun">Gulabjamun</option>
        <option value="Cream">Cream</option> */}

      </select>
    </div>
  );
}

export default ProductSelector; 