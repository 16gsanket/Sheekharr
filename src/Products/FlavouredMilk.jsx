import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Milk', quantity: 90.75, price: 30, isFixed: true },
  { name: 'SMP', quantity: 0.85, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 8, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'Stabilizers', quantity: 0.2, price: 399, isFixed: true },
];

const defaultCreamTecIngredients = [
  { name: 'Milk', quantity: 90.65, price: 23, isFixed: true },
  { name: 'SMP', quantity: 0.9, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 8, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'Stabilizers', quantity: 0, price: 399, isFixed: true },
  { name: 'CreamTec FM', quantity: 0.25, price: 399, isFixed: true },
];

function FlavouredMilk() {
  // Customer Table State
  const [ingredients, setIngredients] = useState(defaultIngredients);
  // CreamTec Table State
  const [creamTecIngredients, setCreamTecIngredients] = useState(defaultCreamTecIngredients);

  // Customer Table Calculations
  const totalQty = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const pricePerKg = totalQty > 0 ? (totalCost / totalQty).toFixed(2) : '';

  // CreamTec Table Calculations
  const creamTecTotalQty = creamTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const creamTecTotalCost = creamTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const creamTecPricePerKg = creamTecTotalQty > 0 ? (creamTecTotalCost / creamTecTotalQty).toFixed(2) : '';

  // Profit and Extra Profit Calculations
  const profitPerKg = (pricePerKg && creamTecPricePerKg) ? (Number(pricePerKg) - Number(creamTecPricePerKg)).toFixed(1) : '';
  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);
  const customerDailyExtraProfit = (profitPerKg && customerDailyProduction) ? (Number(profitPerKg) * Number(customerDailyProduction)).toFixed(0) : '';
  const customerMonthlyExtraProfit = customerDailyExtraProfit ? (Number(customerDailyExtraProfit) * 30).toFixed(0) : '';

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

  // Handlers for CreamTec Table
  const handleCreamTecIngredientChange = (idx, field, value) => {
    setCreamTecIngredients(ings =>
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
  const addCreamTecIngredient = () => {
    setCreamTecIngredients([...creamTecIngredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeCreamTecIngredient = idx => {
    setCreamTecIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4 text-blue-900">Customer's Existing Flavoured Milk Price Scenario</h2>
      <table className="w-full mb-2">
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
        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mb-4 mt-1 transition"
        onClick={addIngredient}
      >
        + Add Ingredient
      </button>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total (kg):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(totalQty).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Flavoured Milk price per kg:</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{pricePerKg}</span>
        </div>
      </div>

      {/* CreamTec FM Table */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-4 text-blue-900">CreamTec FM added Flavoured Milk/Milkshake price scenario</h2>
        <table className="w-full mb-2">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Ingredient</th>
              <th className="p-2 text-right">Quantity (kg)</th>
              <th className="p-2 text-right">Price per kg</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {creamTecIngredients.map((ing, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td className="p-2">
                    <input
                      className="border rounded p-1 w-full"
                      type="text"
                      value={ing.name}
                      onChange={e => handleCreamTecIngredientChange(idx, 'name', e.target.value)}
                      placeholder="Ingredient Name"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <input
                      className="border rounded p-1 w-20 text-right"
                      type="number"
                      value={ing.quantity}
                      min="0"
                      step="any"
                      onChange={e => handleCreamTecIngredientChange(idx, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-right">
                    <input
                      className="border rounded p-1 w-20 text-right"
                      type="number"
                      value={ing.price}
                      min="0"
                      step="any"
                      onChange={e => handleCreamTecIngredientChange(idx, 'price', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    {!ing.isFixed && (
                      <button
                        className="text-red-500 font-bold"
                        onClick={() => removeCreamTecIngredient(idx)}
                        aria-label="Remove ingredient"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
                {/* Dosage punchline for CreamTec FM/FFM */}
                {(ing.name === 'CreamTec FM' || ing.name === 'CreamTec FFM') && (
                  <tr>
                    <td colSpan={4} className="pl-4 pb-2 text-xs text-gray-500">
                      <span className='font-bold'>Dosage </span> : {creamTecTotalQty > 0 ? ((Number(ing.quantity) / Number(creamTecTotalQty)) * 100).toFixed(2) : '0'}% of final finished product<br/>
                      <span className='font-bold'>Recommended Dosage </span>: <span className="">{ing.name === 'CreamTec FM' ? '0.25%' : '1%'} of final finished product</span>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mb-4 mt-1 transition"
          onClick={addCreamTecIngredient}
        >
          + Add Ingredient
        </button>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total (kg):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(creamTecTotalQty).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Flavoured Milk price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{creamTecPricePerKg}</span>
          </div>
        </div>
      </div>

      {/* Profit and Extra Profit Section */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Profit with Above batch per kg (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{profitPerKg}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Customer daily production (kg):</span>
          <input
            className="border rounded p-1 w-24 text-right font-bold"
            type="number"
            value={customerDailyProduction}
            min="0"
            step="any"
            onChange={e => setCustomerDailyProduction(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Customer Daily Extra Profit (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{customerDailyExtraProfit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Customer Monthly Extra Profit (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{customerMonthlyExtraProfit}</span>
        </div>
      </div>
    </div>
  );
}

export default FlavouredMilk;