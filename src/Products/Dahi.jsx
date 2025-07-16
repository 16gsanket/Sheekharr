import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Milk (3.1% fat, 8.5% SNF)', quantity: 97.9, price: 35, isFixed: true },
  { name: 'SMP', quantity: 1.6, price: 340, isFixed: true },
  { name: 'Culture', quantity: 0.005, price: 8000, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
];

const defaultSheekharrIngredients = [
  { name: 'Milk', quantity: 97.9, price: 30, isFixed: true },
  { name: 'SMP', quantity: 1.1, price: 340, isFixed: true },
  { name: 'Culture', quantity: 0.005, price: 8000, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'CreamTec FFM', quantity: 0.8, price: 249, isFixed: true },
];

function Dahi() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  // Sheekharr table state
  const [sheekharrIngredients, setSheekharrIngredients] = useState(defaultSheekharrIngredients);

  // Customer table calculations
  const totalQuantity = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const totalCost = ingredients.reduce((sum, ing) => sum + ((Number(ing.quantity) || 0) * (Number(ing.price) || 0)), 0);
  const pricePerKg = totalQuantity > 0 ? (totalCost / totalQuantity).toFixed(2) : '';

  // Sheekharr table calculations
  const sheekharrTotalQuantity = sheekharrIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const sheekharrTotalCost = sheekharrIngredients.reduce((sum, ing) => sum + ((Number(ing.quantity) || 0) * (Number(ing.price) || 0)), 0);
  const sheekharrPricePerKg = sheekharrTotalQuantity > 0 ? (sheekharrTotalCost / sheekharrTotalQuantity).toFixed(2) : '';

  // --- Summary/Profit Section State and Calculations ---
  const [dailyProduction, setDailyProduction] = useState(2000);
  const profitPerKg = (pricePerKg && sheekharrPricePerKg)
    ? (Number(pricePerKg) - Number(sheekharrPricePerKg)).toFixed(2)
    : '';
  const dailyExtraProfit = (profitPerKg && dailyProduction)
    ? (Number(profitPerKg) * Number(dailyProduction)).toFixed(0)
    : '';
  const monthlyExtraProfit = dailyExtraProfit
    ? (Number(dailyExtraProfit) * 30).toFixed(0)
    : '';

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

  // Sheekharr handlers
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
    <>
      {/* Customer Table Card */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Customer's Existing Flavoured Dahi Price Scenario</h2>
        <table className="w-full mb-4">
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
          className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mb-4"
          onClick={addIngredient}
        >
          + Add Ingredient
        </button>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold flex-1">Total (kg):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{totalQuantity.toFixed(3)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold flex-1">Flavoured Dahi price per kg:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{pricePerKg}</span>
        </div>
      </div>
      {/* Sheekharr Table Card */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-4 text-blue-900">CreamTec FFM added Flavoured Dahi Price Scenario</h2>
        <table className="w-full mb-4">
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
              <React.Fragment key={idx}>
                <tr>
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
                {/* Dosage and Recommended Dosage for CreamTec FFM */}
                {ing.name === 'CreamTec FFM' && (
                  <tr>
                    <td colSpan={4} className="pl-4 pb-1 pt-0 align-top">
                      <div className="ml-1 text-xs text-gray-500 mt-1">
                        Dosage: {sheekharrTotalQuantity > 0 ? ((ing.quantity / sheekharrTotalQuantity) * 100).toFixed(2) : '0'}% of Final Finished Product
                      </div>
                      <div className="ml-1 text-xs text-gray-500 mt-1">
                        Recommended Dosage: 1% of Final Finished Product
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mb-4"
          onClick={addSheekharrIngredient}
        >
          + Add Ingredient
        </button>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold flex-1">Total (kg):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{sheekharrTotalQuantity.toFixed(3)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold flex-1">Flavoured Dahi price per kg:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{sheekharrPricePerKg}</span>
        </div>
      </div>
      {/* --- Summary/Profit Section --- */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Profit with Above batch per kg (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{profitPerKg}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Customer daily production (kg):</label>
          <input
            className="border rounded p-1 w-24 text-right"
            type="number"
            value={dailyProduction}
            onChange={e => setDailyProduction(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Customer Daily Extra Profit (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{dailyExtraProfit}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Customer Monthly Extra Profit (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{monthlyExtraProfit}</span>
        </div>
      </div>
    </>
  );
}

export default Dahi;

