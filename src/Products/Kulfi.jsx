import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Milk', quantity: 140, price: 50 },
  { name: 'Milk Fat', quantity: 3, price: 450 },
  { name: 'SMP', quantity: 0, price: 360 },
  { name: 'Sugar', quantity: 15, price: 40 },
  { name: 'Flavour', quantity: 0.1, price: 600 },
  { name: 'Stabilizers', quantity: 0.25, price: 400 },
  { name: 'Other', quantity: 0, price: 0 },
];

function Kulfi() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [finalProductKg, setFinalProductKg] = useState(100);

  // Calculate total cost
  const totalCost = ingredients.reduce(
    (sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)),
    0
  );
  const totalPricePerKg = finalProductKg > 0 ? (totalCost / finalProductKg).toFixed(2) : '';

  const handleIngredientChange = (idx, field, value) => {
    setIngredients(ings =>
      ings.map((ing, i) =>
        i === idx ? { ...ing, [field]: value } : ing
      )
    );
  };

  // Add ingredient for customer table
  const addCustomerIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', price: '' }]);
  };
  const removeCustomerIngredient = idx => {
    setIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  // Sheekharr (CreamTec KF Pro) table state
  const defaultSheekharrIngredients = [
    { name: 'Milk (6% fat, 9% SNF)', quantity: 140, price: 50 },
    { name: 'Milk Fat', quantity: 0, price: 450 },
    { name: 'SMP', quantity: 0, price: 360 },
    { name: 'Sugar', quantity: 15, price: 40 },
    { name: 'Flavour', quantity: 0.1, price: 600 },
    { name: 'Stabilizers', quantity: 0, price: 400 },
    { name: 'CreamTec KF Pro', quantity: 1, price: 499 },
  ];
  const [sheekharrIngredients, setSheekharrIngredients] = useState(defaultSheekharrIngredients);
  const [sheekharrFinalProductKg, setSheekharrFinalProductKg] = useState(100);

  const sheekharrTotalCost = sheekharrIngredients.reduce(
    (sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)),
    0
  );
  const sheekharrTotalPricePerKg = sheekharrFinalProductKg > 0 ? (sheekharrTotalCost / sheekharrFinalProductKg).toFixed(2) : '';

  const handleSheekharrIngredientChange = (idx, field, value) => {
    setSheekharrIngredients(ings =>
      ings.map((ing, i) =>
        i === idx ? { ...ing, [field]: value } : ing
      )
    );
  };

  // Add ingredient for sheekharr table
  const addSheekharrIngredient = () => {
    setSheekharrIngredients([...sheekharrIngredients, { name: '', quantity: '', price: '' }]);
  };
  const removeSheekharrIngredient = idx => {
    setSheekharrIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  // Calculation Group state
  const [kulfiSellingPrice, setKulfiSellingPrice] = useState(300);
  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);

  // Profit per kg: customer table price per kg - sheekharr table price per kg
  const profitPerKg = (totalPricePerKg && sheekharrTotalPricePerKg)
    ? (Number(totalPricePerKg) - Number(sheekharrTotalPricePerKg)).toFixed(2)
    : '';

  const customerDailyExtraProfit = (profitPerKg && customerDailyProduction)
    ? Math.round(Number(profitPerKg) * Number(customerDailyProduction))
    : '';
  const customerMonthlyExtraProfit = customerDailyExtraProfit ? customerDailyExtraProfit * 30 : '';

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4 text-blue-900">Customer's Existing Kulfi Price Scenario</h2>
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
                {idx >= 7 && (
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => removeCustomerIngredient(idx)}
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
        onClick={addCustomerIngredient}
      >
        + Add Ingredient
      </button>
      <div className="flex items-center gap-2 mb-2">
        <label className="font-semibold flex-1">Final Kulfi Product (kg):</label>
        <input
          className="border rounded p-1 w-24 text-right"
          type="number"
          value={finalProductKg}
          min="0"
          step="any"
          onChange={e => setFinalProductKg(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="font-semibold flex-1">Total Icecream price per kg:</label>
        <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{totalPricePerKg}</span>
      </div>
      {/* Sheekharr (CreamTec KF Pro) Table */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-4 text-blue-900">CreamTec KF Pro Added - Pro Price Scenario</h2>
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
              <tr key={idx}>
                <td className="p-2">
                  <input
                    className="border rounded p-1 w-full"
                    type="text"
                    value={ing.name}
                    onChange={e => handleSheekharrIngredientChange(idx, 'name', e.target.value)}
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
                  {idx >= 7 && (
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
          className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mb-4"
          onClick={addSheekharrIngredient}
        >
          + Add Ingredient
        </button>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold flex-1">Final Kulfi Product (kg):</label>
          <input
            className="border rounded p-1 w-24 text-right"
            type="number"
            value={sheekharrFinalProductKg}
            min="0"
            step="any"
            onChange={e => setSheekharrFinalProductKg(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Total Icecream price per kg:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{sheekharrTotalPricePerKg}</span>
        </div>
      </div>

      {/* Calculation Group */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Kulfi selling price per kg (Rs):</label>
          <input
            className="border rounded p-1 w-24 text-right"
            type="number"
            value={kulfiSellingPrice}
            min="0"
            step="any"
            onChange={e => setKulfiSellingPrice(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Profit with Above batch per kg (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{profitPerKg}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Customer daily production (kg):</label>
          <input
            className="border rounded p-1 w-24 text-right"
            type="number"
            value={customerDailyProduction}
            min="0"
            step="any"
            onChange={e => setCustomerDailyProduction(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Customer Daily Extra Profit (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerDailyExtraProfit}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Customer Monthly Extra Profit (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerMonthlyExtraProfit}</span>
        </div>
      </div>
    </div>
  );
}

export default Kulfi;