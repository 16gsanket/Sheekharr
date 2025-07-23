import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Oil', quantity: 25, price: 140, isFixed: true },
  { name: 'SMP', quantity: 2, price: 340, isFixed: true },
  { name: 'Salt', quantity: 1.6, price: 35, isFixed: true },
  { name: 'Sugar', quantity: 8, price: 45, isFixed: true },
  { name: 'Acids', quantity: 0.6, price: 150, isFixed: true },
  { name: 'Stabilizers', quantity: 4, price: 399, isFixed: true },
  { name: 'Preservatives', quantity: 0.1, price: 400, isFixed: true },
  { name: 'Flavours', quantity: 0.2, price: 400, isFixed: true },
  { name: 'Water', quantity: 58.5, price: 0, isFixed: true },
];

const defaultGelTecIngredients = [
  { name: 'Oil', quantity: 13, price: 140, isFixed: true },
  { name: 'SMP', quantity: 2, price: 340, isFixed: true },
  { name: 'Salt', quantity: 1.6, price: 35, isFixed: true },
  { name: 'Sugar', quantity: 8, price: 45, isFixed: true },
  { name: 'Acids', quantity: 0.6, price: 150, isFixed: true },
  { name: 'Preservatives', quantity: 0.1, price: 400, isFixed: true },
  { name: 'Flavours', quantity: 0.2, price: 400, isFixed: true },
  { name: 'Water', quantity: 70.5, price: 0, isFixed: true },
  { name: 'GelTec XR', quantity: 4, price: 599, isFixed: true },
];

function Mayonnaise() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [gelTecIngredients, setGelTecIngredients] = useState(defaultGelTecIngredients);
  const [customerDailyProduction, setCustomerDailyProduction] = useState(500);

  // Conventional Table Calculations
  const totalWeight = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const pricePerKg = totalWeight > 0 ? (totalCost / totalWeight).toFixed(2) : '';

  // GelTec XR Table Calculations
  const gelTecTotalWeight = gelTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const gelTecTotalCost = gelTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const gelTecPricePerKg = gelTecTotalWeight > 0 ? (gelTecTotalCost / gelTecTotalWeight).toFixed(2) : '';

  // Handlers for Conventional Table
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

  // Handlers for GelTec XR Table
  const handleGelTecIngredientChange = (idx, field, value) => {
    setGelTecIngredients(ings =>
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
  const addGelTecIngredient = () => {
    setGelTecIngredients([...gelTecIngredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeGelTecIngredient = idx => {
    setGelTecIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  const profitPerKg = (pricePerKg && gelTecPricePerKg) ? (Number(pricePerKg) - Number(gelTecPricePerKg)) : 0;
  const dailyExtraProfit = profitPerKg && customerDailyProduction ? profitPerKg * customerDailyProduction : 0;
  const monthlyExtraProfit = dailyExtraProfit ? dailyExtraProfit * 30 : 0;

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4 text-blue-900">Mayonnaise Price Scenario with Conventional method</h2>
      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Mayonnaise Price Scenario with Conventional method</h2>
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
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total Weight (kg):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(totalWeight).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Price per kg:</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{pricePerKg}</span>
        </div>
      </div>
    </div>
    <button
      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mb-4 mt-1 transition"
      onClick={addIngredient}
    >
      + Add Ingredient
    </button>

      {/* GelTec XR Table */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Mayonnaise Price Scenario with GelTec XR</h2>
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
            {gelTecIngredients.map((ing, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td className="p-2">
                    <input
                      className="border rounded p-1 w-full"
                      type="text"
                      value={ing.name}
                      onChange={e => handleGelTecIngredientChange(idx, 'name', e.target.value)}
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
                      onChange={e => handleGelTecIngredientChange(idx, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-right">
                    <input
                      className="border rounded p-1 w-20 text-right"
                      type="number"
                      value={ing.price}
                      min="0"
                      step="any"
                      onChange={e => handleGelTecIngredientChange(idx, 'price', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    {!ing.isFixed && (
                      <button
                        className="text-red-500 font-bold"
                        onClick={() => removeGelTecIngredient(idx)}
                        aria-label="Remove ingredient"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
                {/* Dosage punchline for GelTec XR */}
                {ing.name === 'GelTec XR' && (
                  <tr>
                    <td colSpan={4} className="pl-4 pb-2 text-xs text-gray-500">
                      <span className='font-bold'>Dosage</span> : {gelTecTotalWeight > 0 ? ((Number(ing.quantity) / Number(gelTecTotalWeight)) * 100).toFixed(2) : '0'}% of final finished product<br/>
                      <span className='font-bold'>Recommended Dosage</span> : 3.5% of final finished product
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mb-4 mt-1 transition"
          onClick={addGelTecIngredient}
        >
          + Add Ingredient
        </button>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Weight (kg):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(gelTecTotalWeight).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{gelTecPricePerKg}</span>
          </div>
        </div>
      </div>

      {/* Calculation Group */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Mayonnaise selling price (Rs):</span>
          <input
            className="border rounded p-1 w-24 text-right font-bold bg-green-100"
            type="number"
            value={120}
            disabled
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Profit with Above batch per kg (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{profitPerKg ? profitPerKg.toFixed(1) : ''}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Customer Daily production (kg):</span>
          <input
            className="border rounded p-1 w-24 text-right font-bold bg-green-100"
            type="number"
            value={customerDailyProduction}
            onChange={e => setCustomerDailyProduction(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Customer Daily Extra Profit (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{dailyExtraProfit ? dailyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Customer Monthly Extra Profit (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{monthlyExtraProfit ? monthlyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}</span>
        </div>
      </div>
    </div>
  );
}

export default Mayonnaise;
