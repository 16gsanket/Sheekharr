import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Milk', quantity: 0, price: 0, isFixed: true },
  { name: 'Veg Fat', quantity: 8, price: 160, isFixed: true },
  { name: 'SMP', quantity: 11, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 15, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.1, price: 600, isFixed: true },
  { name: 'Stabilizers', quantity: 0.45, price: 399, isFixed: true },
  { name: 'Water', quantity: 65.45, price: 0, isFixed: true },
];

function FrozenDessert() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [overrun, setOverrun] = useState(100);

  // Calculations
  const totalMix = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const pricePerKg = totalMix > 0 ? (totalCost / totalMix).toFixed(2) : '';
  const pricePerLitre = (pricePerKg && totalMix && overrun !== '') ? ((Number(pricePerKg) * Number(totalMix)) / (Number(totalMix) + Number(overrun))).toFixed(1) : '';

  // Handlers
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

  // CreamTec FD Pro Table
  const defaultCreamTecIngredients = [
    { name: 'Milk', quantity: 0, price: 0, isFixed: true },
    { name: 'Veg Fat', quantity: 5.5, price: 160, isFixed: true },
    { name: 'SMP', quantity: 11, price: 340, isFixed: true },
    { name: 'Sugar', quantity: 15, price: 45, isFixed: true },
    { name: 'Flavour', quantity: 0.1, price: 600, isFixed: true },
    { name: 'CreamTec FD Pro', quantity: 0.9, price: 249, isFixed: true },
    { name: 'Water', quantity: 67.5, price: 0, isFixed: true },
  ];
  const [creamTecIngredients, setCreamTecIngredients] = useState(defaultCreamTecIngredients);
  const [creamTecOverrun, setCreamTecOverrun] = useState(100);
  const creamTecTotalMix = creamTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const creamTecTotalCost = creamTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const creamTecPricePerKg = creamTecTotalMix > 0 ? (creamTecTotalCost / creamTecTotalMix).toFixed(2) : '';
  const creamTecPricePerLitre = (creamTecPricePerKg && creamTecTotalMix && creamTecOverrun !== '') ? ((Number(creamTecPricePerKg) * Number(creamTecTotalMix)) / (Number(creamTecTotalMix) + Number(creamTecOverrun))).toFixed(1) : '';
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

  // Calculation group state
  const [fdSellingPrice, setFdSellingPrice] = useState(350);
  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);
  // Profit calculations
  const profitPerKg = (pricePerKg && creamTecPricePerKg) ? (Number(pricePerKg) - Number(creamTecPricePerKg)) : 0;
  const profitPerLitre = (pricePerLitre && creamTecPricePerLitre) ? (Number(pricePerLitre) - Number(creamTecPricePerLitre)) : 0;
  const dailyExtraProfit = profitPerKg && customerDailyProduction ? profitPerKg * customerDailyProduction : 0;
  const monthlyExtraProfit = dailyExtraProfit ? dailyExtraProfit * 30 : 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
        <div className = "bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Customer's existing FD price scenario</h2>

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
        {/* Customer Calculation Summary */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total FD Mix (kg):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(totalMix).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total FD price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{pricePerKg}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Overrun %:</span>
            <input
              className="border rounded p-1 w-24 text-right font-bold bg-green-100"
              type="number"
              value={overrun}
              min="0"
              step="any"
              onChange={e => setOverrun(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total FD price per litre:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{pricePerLitre}</span>
          </div>
        </div>
        </div>

        {/* CreamTec FD Pro Table */}
        <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
          <h2 className="text-lg font-bold mb-4 text-blue-900">CreamTec FD Pro added FD price scenario</h2>
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
              {creamTecIngredients.map((ing, idx) => (
                <tr key={idx}>
                  <td className="p-2">
                    <input
                      className="border rounded p-1 w-full"
                      type="text"
                      value={ing.name}
                      onChange={e => handleCreamTecIngredientChange(idx, 'name', e.target.value)}
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
              ))}
            </tbody>
          </table>
          <button
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mt-1 mb-4 transition"
            onClick={addCreamTecIngredient}
          >
            + Add Ingredient
          </button>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total FD Mix (kg):</span>
              <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(creamTecTotalMix).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total FD price per kg:</span>
              <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{creamTecPricePerKg}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Overrun %:</span>
              <input
                className="border rounded p-1 w-24 text-right font-bold bg-green-100"
                type="number"
                value={creamTecOverrun}
                min="0"
                step="any"
                onChange={e => setCreamTecOverrun(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total FD price per litre:</span>
              <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{creamTecPricePerLitre}</span>
            </div>
          </div>
        </div>

        {/* Calculation Group */}
        <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">FD selling price per kg (Rs):</span>
            <input
              className="border rounded p-1 w-24 text-right font-bold bg-green-100"
              type="number"
              value={fdSellingPrice}
              onChange={e => setFdSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Profit with Above batch per kg  (Rs):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{profitPerKg ? profitPerKg.toFixed(1) : ''}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Profit with Above batch per litre  (Rs):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{profitPerLitre ? profitPerLitre.toFixed(1) : ''}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Customer daily production (kg):</span>
            <input
              className="border rounded p-1 w-24 text-right font-bold bg-green-100"
              type="number"
              value={customerDailyProduction}
              onChange={e => setCustomerDailyProduction(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">Customer  Daily Extra Profit  (Rs):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{dailyExtraProfit ? dailyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Customer  Monthly  Extra  Profit  (Rs):</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{monthlyExtraProfit ? monthlyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default FrozenDessert;