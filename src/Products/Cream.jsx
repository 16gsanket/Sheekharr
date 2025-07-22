import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Milk Fat', quantity: 25, price: 425, isFixed: true },
  { name: 'SMP', quantity: 7, price: 300, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'Stabalizer', quantity: 0.5, price: 399, isFixed: true },
  { name: 'Water', quantity: 67.3, price: 0.1, isFixed: true },
  { name: 'Milk', quantity: 0, price: 0, isFixed: true },
];

const defaultSheekharrIngredients = [
  { name: 'Milk Fat', quantity: 20, price: 425, isFixed: true },
  { name: 'SMP', quantity: 7, price: 300, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'CreamTec DC', quantity: 0.8, price: 499, isFixed: true },
  { name: 'Water', quantity: 72, price: 0.1, isFixed: true },
  { name: 'Milk', quantity: 0, price: 0, isFixed: true },
];

function Cream() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [sheekharrIngredients, setSheekharrIngredients] = useState(defaultSheekharrIngredients);
  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);

  // Customer Table Calculations
  const totalQty = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const pricePerKg = totalQty > 0 ? (totalCost / totalQty).toFixed(2) : '';

  // Sheekharr Table Calculations
  const sheekharrTotalQty = sheekharrIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const sheekharrTotalCost = sheekharrIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const sheekharrPricePerKg = sheekharrTotalQty > 0 ? (sheekharrTotalCost / sheekharrTotalQty).toFixed(2) : '';

  // Profit Calculations
  const profitPerKg = (pricePerKg && sheekharrPricePerKg) ? (Number(pricePerKg) - Number(sheekharrPricePerKg)).toFixed(2) : '';
  const dailyExtraProfit = (profitPerKg && customerDailyProduction) ? (Number(profitPerKg) * Number(customerDailyProduction)).toFixed(0) : '';
  const monthlyExtraProfit = dailyExtraProfit ? (Number(dailyExtraProfit) * 30).toFixed(0) : '';

  // Handlers for Customer Table
  const handleIngredientChange = (idx, field, value) => {
    setIngredients(ings =>
      ings.map((ing, i) =>
        i === idx
          ? {
              ...ing,
              [field]: (field === 'quantity' || field === 'price')
                ? (value === '' || isNaN(Number(value)) ? '' : Number(value))
                : value
            }
          : ing
      )
    );
  };
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeIngredient = idx => {
    setIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  // Handlers for Sheekharr Table
  const handleSheekharrIngredientChange = (idx, field, value) => {
    setSheekharrIngredients(ings =>
      ings.map((ing, i) =>
        i === idx
          ? {
              ...ing,
              [field]: (field === 'quantity' || field === 'price')
                ? (value === '' || isNaN(Number(value)) ? '' : Number(value))
                : value
            }
          : ing
      )
    );
  };
  const addSheekharrIngredient = () => {
    setSheekharrIngredients([...sheekharrIngredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeSheekharrIngredient = idx => {
    setSheekharrIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Customer's existing Cream price scenario</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Ingredient</th>
              <th className="p-2 text-right">Quantity (kg)</th>
              <th className="p-2 text-right">Price per kg</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, idx) => (
              <tr key={idx}>
                <td className="p-2">
                  <input
                    className="border rounded p-1 w-full"
                    type="text"
                    value={ing.name}
                    onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                    placeholder="Ingredient Name"
                    disabled={ing.isFixed}
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    className="border rounded p-1 w-20 text-right"
                    type="number"
                    value={ing.quantity}
                    min="0"
                    step="any"
                    onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    className="border rounded p-1 w-20 text-right"
                    type="number"
                    value={ing.price}
                    min="0"
                    step="any"
                    onChange={e => handleIngredientChange(idx, 'price', e.target.value)}
                  />
                </td>
                <td className="p-2 text-center">
                  {!ing.isFixed && (
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => removeIngredient(idx)}
                      aria-label="Remove ingredient"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mt-1 mb-4 transition"
          onClick={addIngredient}
        >
          + Add Ingredient
        </button>
        {/* Calculation Summary */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(totalQty).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Cream price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{pricePerKg}</span>
          </div>
        </div>
      </div>

      {/* Sheekharr Table */}
      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Sheekharr Cream price scenario</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Ingredient</th>
              <th className="p-2 text-right">Quantity (kg)</th>
              <th className="p-2 text-right">Price per kg</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {sheekharrIngredients.map((ing, idx) => (
              <tr key={idx}>
                <td className="p-2">
                  <input
                    className="border rounded p-1 w-full"
                    type="text"
                    value={ing.name}
                    onChange={e => handleSheekharrIngredientChange(idx, 'name', e.target.value)}
                    placeholder="Ingredient Name"
                    disabled={ing.isFixed}
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    className="border rounded p-1 w-20 text-right"
                    type="number"
                    value={ing.quantity}
                    min="0"
                    step="any"
                    onChange={e => handleSheekharrIngredientChange(idx, 'quantity', e.target.value)}
                  />
                </td>
                <td className="p-2 text-right">
                  <input
                    className="border rounded p-1 w-20 text-right"
                    type="number"
                    value={ing.price}
                    min="0"
                    step="any"
                    onChange={e => handleSheekharrIngredientChange(idx, 'price', e.target.value)}
                  />
                </td>
                <td className="p-2 text-center">
                  {!ing.isFixed && (
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => removeSheekharrIngredient(idx)}
                      aria-label="Remove ingredient"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mt-1 mb-4 transition"
          onClick={addSheekharrIngredient}
        >
          + Add Ingredient
        </button>
        {/* Calculation Summary */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(sheekharrTotalQty).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Cream price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{sheekharrPricePerKg}</span>
          </div>
        </div>
      </div>

      {/* Profit Calculation Section */}
      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Profit with Above batch per kg (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{profitPerKg}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Customer daily production (kg):</span>
          <input
            className="border rounded p-1 w-24 text-right font-bold bg-green-100"
            type="number"
            value={customerDailyProduction}
            min="0"
            step="any"
            onChange={e => setCustomerDailyProduction(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Customer Daily Extra Profit (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{dailyExtraProfit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Customer Monthly Extra Profit (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{monthlyExtraProfit}</span>
        </div>
      </div>
    </div>
  );
}

export default Cream;