import React, { useState } from 'react';

const defaultIngredients = [
  { name: 'Khoya', quantity: 14, price: 250, isFixed: true },
  { name: 'SMP', quantity: 2, price: 320, isFixed: true },
  { name: 'Maida', quantity: 3, price: 35, isFixed: true },
  { name: 'Sooji', quantity: 1, price: 40, isFixed: true },
  { name: 'Baking soda', quantity: 0.02, price: 80, isFixed: true },
  { name: 'Water', quantity: 1, price: 0, isFixed: true },
  { name: 'Other', quantity: 0, price: 0, isFixed: true },
];

function Gulabjamun() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [sugarSyrupQty, setSugarSyrupQty] = useState(42);
  const [sugarSyrupPrice, setSugarSyrupPrice] = useState(25);

  // Calculations
  const totalDryMix = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const totalWeight = totalDryMix + Number(sugarSyrupQty);
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0) + (Number(sugarSyrupQty) * Number(sugarSyrupPrice));
  const pricePerKg = totalWeight > 0 ? (totalCost / totalWeight).toFixed(1) : '';

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

  // TexTec GJ Table
  const defaultTexTecIngredients = [
    { name: 'Khoya', quantity: 12.6, price: 250, isFixed: true },
    { name: 'SMP', quantity: 1.8, price: 320, isFixed: true },
    { name: 'Maida', quantity: 3, price: 35, isFixed: true },
    { name: 'Sooji', quantity: 1, price: 40, isFixed: true },
    { name: 'Baking soda', quantity: 0.02, price: 80, isFixed: true },
    { name: 'Water', quantity: 1.5, price: 1, isFixed: true },

    { name: 'TexTec GJ', quantity: 1.6, price: 199, isFixed: true },
  ];
  const [texTecIngredients, setTexTecIngredients] = useState(defaultTexTecIngredients);
  const [texTecSugarSyrupQty, setTexTecSugarSyrupQty] = useState(43);
  const [texTecSugarSyrupPrice, setTexTecSugarSyrupPrice] = useState(25);
  // Calculations
  const texTecTotalDryMix = texTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) || 0), 0);
  const texTecTotalWeight = texTecTotalDryMix + Number(texTecSugarSyrupQty);
  const texTecTotalCost = texTecIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0) + (Number(texTecSugarSyrupQty) * Number(texTecSugarSyrupPrice));
  const texTecPricePerKg = texTecTotalWeight > 0 ? (texTecTotalCost / texTecTotalWeight).toFixed(1) : '';
  // Handlers
  const handleTexTecIngredientChange = (idx, field, value) => {
    setTexTecIngredients(ings =>
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
  const addTexTecIngredient = () => {
    setTexTecIngredients([...texTecIngredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeTexTecIngredient = idx => {
    setTexTecIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  // Calculation group state
  const [gulabjamunSellingPrice, setGulabjamunSellingPrice] = useState(125);
  const [customerDailyProduction, setCustomerDailyProduction] = useState(500);
  // Profit calculations
  const profitPerKg = (pricePerKg && texTecPricePerKg) ? (Number(pricePerKg) - Number(texTecPricePerKg)) : 0;
  const dailyExtraProfit = profitPerKg && customerDailyProduction ? profitPerKg * customerDailyProduction : 0;
  const monthlyExtraProfit = dailyExtraProfit ? dailyExtraProfit * 30 : 0;

  return (
    <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">

      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">

        <h2 className="text-lg font-bold mb-4 text-blue-900">Gulabjamun Price Scenario with Conventional method</h2>
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
            <span className="font-semibold">Total Dry mix or Fried:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(totalDryMix).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Sugar syrup:</span>
            <div className="flex gap-2 items-center">
              <input
                className="border rounded p-1 w-20 text-right font-bold bg-green-100"
                type="number"
                value={sugarSyrupQty}
                min="0"
                step="any"
                onChange={e => setSugarSyrupQty(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <span className="text-gray-500">kg ×</span>
              <input
                className="border rounded p-1 w-20 text-right font-bold bg-green-100"
                type="number"
                value={sugarSyrupPrice}
                min="0"
                step="any"
                onChange={e => setSugarSyrupPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <span className="text-gray-500">Rs/kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Weight:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(totalWeight).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{pricePerKg}</span>
          </div>
        </div>
      </div>

      {/* TexTec GJ Table */}
      <div className="bg-white rounded-xl shadow border border-slate-300 p-6 max-w-md mx-auto mt-8 mb-4">
        <h2 className="text-lg font-bold mb-4 text-blue-900">Gulabjamun Price Scenario with TexTec GJ</h2>
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
            {texTecIngredients.map((ing, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td className="p-2">
                    <input
                      className="border rounded p-1 w-full"
                      type="text"
                      value={ing.name}
                      onChange={e => handleTexTecIngredientChange(idx, 'name', e.target.value)}
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
                      onChange={e => handleTexTecIngredientChange(idx, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-right">
                    <input
                      className="border rounded p-1 w-20 text-right"
                      type="number"
                      value={ing.price}
                      min="0"
                      step="any"
                      onChange={e => handleTexTecIngredientChange(idx, 'price', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    {!ing.isFixed && (
                      <button
                        className="text-red-500 font-bold"
                        onClick={() => removeTexTecIngredient(idx)}
                        aria-label="Remove ingredient"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
                {/* Dosage punchline for TexTec GJ */}
                {ing.name === 'TexTec GJ' && (
                  <tr>
                    <td colSpan={4} className="pl-4 pb-2 text-xs text-gray-500">
                      <span className='font-bold'>Dosage</span> : {texTecTotalWeight > 0 ? ((Number(ing.quantity) / Number(texTecTotalWeight)) * 100).toFixed(2) : '0'}% of milk solids replacement<br />
                      <span className='font-bold'>Recommended Dosage</span> : 10% milk solids replacement
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-semibold py-2 mt-1 mb-4 transition"
          onClick={addTexTecIngredient}
        >
          + Add Ingredient
        </button>
        {/* Calculation Summary */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Dry mix or Fried:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(texTecTotalDryMix).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Sugar syrup:</span>
            <div className="flex gap-2 items-center">
              <input
                className="border rounded p-1 w-20 text-right font-bold bg-green-100"
                type="number"
                value={texTecSugarSyrupQty}
                min="0"
                step="any"
                onChange={e => setTexTecSugarSyrupQty(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <span className="text-gray-500">kg ×</span>
              <input
                className="border rounded p-1 w-20 text-right font-bold bg-green-100"
                type="number"
                value={texTecSugarSyrupPrice}
                min="0"
                step="any"
                onChange={e => setTexTecSugarSyrupPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <span className="text-gray-500">Rs/kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Weight:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{Number(texTecTotalWeight).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Price per kg:</span>
            <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{texTecPricePerKg}</span>
          </div>
        </div>
      </div>

      {/* Calculation Group */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Gulabjamun selling price (Rs):</span>
          <input
            className="border rounded p-1 w-24 text-right font-bold bg-green-100"
            type="number"
            value={gulabjamunSellingPrice}
            onChange={e => setGulabjamunSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
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
          <span className="font-bold text-lg">Customer  Daily Extra Profit  (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{dailyExtraProfit ? dailyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">Customer  Monthly  Extra  Profit  (Rs):</span>
          <span className="bg-blue-100 text-blue-900 rounded px-4 py-2 min-w-[80px] text-right font-bold text-lg">{monthlyExtraProfit ? monthlyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}</span>
        </div>
      </div>


    </div>
  );
}

export default Gulabjamun;