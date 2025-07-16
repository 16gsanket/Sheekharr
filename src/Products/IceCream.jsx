import React, { useState, useEffect } from 'react';

const customerDefaultIngredients = [
  { name: 'Milk', quantity: 173.25, price: 38, isFixed: true },
  { name: 'Milk Fat', quantity: 7.1, price: 450, isFixed: true },
  { name: 'SMP', quantity: 4, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 15, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'Stabilizers', quantity: 0.45, price: 399, isFixed: true },
  { name: 'Water', quantity: 0, price: 0, isFixed: true },
];

const creamtecDefaultIngredients = [
  { name: 'Milk', quantity: 173.25, price: 38, isFixed: true },
  { name: 'Milk Fat', quantity: 4.6, price: 450, isFixed: true },
  { name: 'SMP', quantity: 4, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 15, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'Water', quantity: 1.95, price: 0.1, isFixed: true },
  { name: 'CreamTec IC Pro', quantity: 1, price: 499, isFixed: true, dosageRemark: '1% of Icecream Mix' },
];

function IceCream() {
  // Table 1: Customer
  const [customerIngredients, setCustomerIngredients] = useState(customerDefaultIngredients);
  const [customerOverrun, setCustomerOverrun] = useState(100);

  // Table 2: CreamTec
  const [creamtecIngredients, setCreamtecIngredients] = useState(creamtecDefaultIngredients);
  const [creamTecProOverridden, setCreamTecProOverridden] = useState(false);
  const [creamTecProIdx, setCreamTecProIdx] = useState(
    creamtecDefaultIngredients.findIndex(ing => ing.name === 'CreamTec IC Pro')
  );

  // --- Customer Table Calculations ---
  const customerTotalMix = customerIngredients.reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
  const customerTotalCost = customerIngredients.reduce(
    (sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)),
    0
  );
  const customerPricePerKg = customerTotalMix > 0 ? (customerTotalCost / customerTotalMix).toFixed(2) : '';
  const customerPricePerLitre = (customerPricePerKg && customerTotalMix > 0)
    ? ((customerPricePerKg * customerTotalMix) / (Number(customerTotalMix) + Number(customerOverrun))).toFixed(2)
    : '';

  // --- CreamTec Table Calculations ---
  // CreamTec IC Pro auto-calc logic
  const creamtecTotalMixExclCreamTec = creamtecIngredients
    .filter(ing => ing.name !== 'CreamTec IC Pro')
    .reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
  const autoCalcCreamTecProQty = Number((creamtecTotalMixExclCreamTec * 0.01).toFixed(2));

  // useEffect to update CreamTec IC Pro quantity if not overridden
  useEffect(() => {
    setCreamtecIngredients(ings =>
      ings.map(ing =>
        ing.name === 'CreamTec IC Pro' && !creamTecProOverridden
          ? { ...ing, quantity: autoCalcCreamTecProQty }
          : ing
      )
    );
  }, [autoCalcCreamTecProQty, creamTecProOverridden]);

  // Handler for ingredient change (including override logic for CreamTec IC Pro)
  const handleCustomerIngredientChange = (idx, field, value) => {
    setCustomerIngredients(ings =>
      ings.map((ing, i) =>
        i === idx ? { ...ing, [field]: value === '' ? '' : Number(value) } : ing
      )
    );
  };
  const addCustomerIngredient = () => {
    setCustomerIngredients([...customerIngredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeCustomerIngredient = idx => {
    setCustomerIngredients(ings => ings.filter((_, i) => i !== idx));
  };
  const handleCreamtecIngredientChange = (idx, field, value) => {
    setCreamtecIngredients(ings =>
      ings.map((ing, i) =>
        i === idx ? { ...ing, [field]: value === '' ? '' : Number(value) } : ing
      )
    );
    if (creamtecIngredients[idx].name === 'CreamTec IC Pro' && field === 'quantity') {
      setCreamTecProOverridden(true);
    }
  };
  const addCreamtecIngredient = () => {
    setCreamtecIngredients([...creamtecIngredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };
  const removeCreamtecIngredient = idx => {
    setCreamtecIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  // Handler to reset CreamTec IC Pro to auto-calc
  const handleResetCreamTecPro = () => {
    setCreamTecProOverridden(false);
  };

  const [creamtecOverrun, setCreamtecOverrun] = useState(100);
  const creamtecTotalMix = creamtecIngredients.reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
  const creamtecTotalCost = creamtecIngredients.reduce(
    (sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)),
    0
  );
  const creamtecPricePerKg = creamtecTotalMix > 0 ? (creamtecTotalCost / creamtecTotalMix).toFixed(2) : '';
  const creamtecPricePerLitre = (creamtecPricePerKg && creamtecTotalMix > 0)
    ? ((creamtecPricePerKg * creamtecTotalMix) / (Number(creamtecTotalMix) + Number(creamtecOverrun))).toFixed(2)
    : '';

  // --- Summary/Profit Section ---
  const [sellingPricePerKg, setSellingPricePerKg] = useState(350);
  const [dailyProduction, setDailyProduction] = useState(1000);

  // Profit calculations
  const profitPerKg = (customerPricePerKg && creamtecPricePerKg)
    ? (Number(customerPricePerKg) - Number(creamtecPricePerKg)).toFixed(2)
    : '';
  const profitPerLitre = (customerPricePerLitre && creamtecPricePerLitre)
    ? (Number(customerPricePerLitre) - Number(creamtecPricePerLitre)).toFixed(2)
    : '';
  const dailyExtraProfit = (profitPerKg && dailyProduction)
    ? (Number(profitPerKg) * Number(dailyProduction)).toFixed(0)
    : '';
  const monthlyExtraProfit = dailyExtraProfit
    ? (Number(dailyExtraProfit) * 30).toFixed(0)
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Table 1: Customer */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-2 text-blue-900">Customer's existing Icecream price scenario</h2>
        <div className="space-y-4">
          {customerIngredients.map((ing, idx) => (
            <div key={idx} className="bg-slate-100 rounded p-3 flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <input
                  className="border rounded p-1 flex-1"
                  type="text"
                  value={ing.name}
                  onChange={e => setCustomerIngredients(ings => ings.map((item, i) => i === idx ? { ...item, name: e.target.value } : item))}
                  placeholder="Ingredient Name"
                  disabled={ing.isFixed}
                />
                {!ing.isFixed && (
                  <button
                    className="text-red-500 font-bold ml-2"
                    onClick={() => removeCustomerIngredient(idx)}
                    aria-label="Remove ingredient"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative w-1/2">
                  <input
                    className="border rounded p-1 pr-8 w-full"
                    type="number"
                    value={ing.quantity}
                    onChange={e => handleCustomerIngredientChange(idx, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    min="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">kg</span>
                </div>
                <div className="relative w-1/2">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">Rs</span>
                  <input
                    className="border rounded p-1 pl-8 pr-14 w-full"
                    type="number"
                    value={ing.price}
                    onChange={e => handleCustomerIngredientChange(idx, 'price', e.target.value)}
                    placeholder="Price"
                    min="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">per kg</span>
                </div>
              </div>
            </div>
          ))}
          <button
            className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mt-2"
            onClick={addCustomerIngredient}
          >
            + Add Ingredient
          </button>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Total Icecream Mix (kg):</label>
            <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{customerTotalMix.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Total Icecream price per kg:</label>
            <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{customerPricePerKg}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Overrun %:</label>
            <input
              className="border rounded p-1 w-24 text-right"
              type="number"
              value={customerOverrun}
              onChange={e => setCustomerOverrun(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Total Icecream price per litre:</label>
            <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{customerPricePerLitre}</span>
          </div>
        </div>
      </div>
      {/* Table 2: CreamTec IC Pro */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-bold mb-2 text-blue-900">CreamTec IC Pro added Icecream price scenario</h2>
        <div className="space-y-4">
          {creamtecIngredients.map((ing, idx) => (
            <div key={idx} className="bg-slate-100 rounded p-3 flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <input
                  className="border rounded p-1 flex-1"
                  type="text"
                  value={ing.name}
                  onChange={e => handleCreamtecIngredientChange(idx, 'name', e.target.value)}
                  placeholder="Ingredient Name"
                  disabled={ing.isFixed}
                />
                {!ing.isFixed && (
                  <button
                    className="text-red-500 font-bold ml-2"
                    onClick={() => removeCreamtecIngredient(idx)}
                    aria-label="Remove ingredient"
                  >
                    ×
                  </button>
                )}
                {/* Reset button for CreamTec IC Pro */}
                
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative w-1/2">
                  <input
                    className="border rounded p-1 pr-8 w-full"
                    type="number"
                    value={ing.quantity}
                    onChange={e => handleCreamtecIngredientChange(idx, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    min="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">kg</span>
                </div>
                <div className="relative w-1/2">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">Rs</span>
                  <input
                    className="border rounded p-1 pl-8 pr-14 w-full"
                    type="number"
                    value={ing.price}
                    onChange={e => handleCreamtecIngredientChange(idx, 'price', e.target.value)}
                    placeholder="Price"
                    min="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">per kg</span>
                </div>
              </div>
              {/* Dosage and Recommended Dosage for CreamTec IC Pro */}
              {ing.name === 'CreamTec IC Pro' && (
                <>
                  <div className="ml-1 text-xs text-gray-500 mt-1">
                    Dosage: {creamtecTotalMix > 0 ? ((ing.quantity / creamtecTotalMix) * 100).toFixed(2) : '0'}% of Icecream Mixture
                  </div>
                  <div className="ml-1 text-xs text-gray-500 mt-1">
                    Recommended Dosage: 1% of Icecream Mix
                  </div>
                </>
              )}
            </div>
          ))}
          <button
            className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mt-2"
            onClick={addCreamtecIngredient}
          >
            + Add Ingredient
          </button>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Total Icecream Mix (kg):</label>
            <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{creamtecTotalMix.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Total Icecream price per kg:</label>
            <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{creamtecPricePerKg}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Overrun %:</label>
            <input
              className="border rounded p-1 w-24 text-right"
              type="number"
              value={creamtecOverrun}
              onChange={e => setCreamtecOverrun(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold flex-1">Total Icecream price per litre:</label>
            <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{creamtecPricePerLitre}</span>
          </div>
        </div>
      </div>
      {/* Summary/Profit Section */}
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Icecream selling price per kg (Rs):</label>
          <input
            className="border rounded p-1 w-24 text-right"
            type="number"
            value={sellingPricePerKg}
            onChange={e => setSellingPricePerKg(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Profit with Above batch per kg (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{profitPerKg}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Profit with Above batch per litre (Rs):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{profitPerLitre}</span>
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
    </div>
  );
}

export default IceCream;