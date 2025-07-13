import React, { useState } from 'react';
import SheekharrPaneerTable from './SheekharrPaneerTable';

const defaultIngredients = [
  { name: 'Milk', quantity: 300, price: 36, isFixed: true },
  { name: 'Customer Coagulant', quantity: 0.6, price: 160, isFixed: true },
];

function Paneer() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [totalPaneer, setTotalPaneer] = useState(51);

  // Sheekharr table milk state - now synced with customer table
  const [sheekharrMilkPrice, setSheekharrMilkPrice] = useState(36);
  const [sheekharrPaneerQty, setSheekharrPaneerQty] = useState(57.3);
  const [selectedCoagulant, setSelectedCoagulant] = useState('SC-900');
  const [sellingPrice, setSellingPrice] = useState(280);

  // Calculate total milk quantity (always from Milk row) - this will be used for both tables
  const milk = ingredients.find(i => i.name === 'Milk');
  const milkQty = milk ? Number(milk.quantity) : 0;
  const milkPrice = milk ? Number(milk.price) : 0;

  // Calculate yield %
  const yieldPercent = milkQty > 0 ? ((totalPaneer * 100) / milkQty).toFixed(2) : '';

  // Calculate price per kg
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const pricePerKg = totalPaneer > 0 ? (totalCost / totalPaneer).toFixed(2) : '';

  // Customer coagulant cost (find by name)
  const customerCoagulant = ingredients.find(i => i.name === 'Customer Coagulant');
  const customerCoagulantQty = customerCoagulant ? Number(customerCoagulant.quantity) : 0;
  const customerCoagulantPrice = customerCoagulant ? Number(customerCoagulant.price) : 0;
  const customerCoagulantCost = customerCoagulantQty * customerCoagulantPrice;

  // Sheekharr coagulant cost (now using synced milk quantity)
  // Use the same constants as in SheekharrPaneerTable
  const COAGULANT_OPTIONS = {
    'SC-600': { dosagePercent: 0.36, pricePerKg: 600 },
    'SC-900': { dosagePercent: 0.37, pricePerKg: 750 },
  };
  const sheekharrCoagulant = COAGULANT_OPTIONS[selectedCoagulant];
  const sheekharrCoagulantQty = milkQty * sheekharrCoagulant.dosagePercent / 100;
  const sheekharrCoagulantCost = sheekharrCoagulantQty * sheekharrCoagulant.pricePerKg;

  // Profit with above batch
  const profitWithBatch = ((sheekharrPaneerQty - totalPaneer) * sellingPrice) - (sheekharrCoagulantCost - customerCoagulantCost);

  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);

  // Calculate yield % for both (now using synced milk quantity)
  const sheekharrYieldPercent = milkQty > 0 ? (sheekharrPaneerQty * 100) / milkQty : 0;
  const customerYieldPercentNum = milkQty > 0 ? (totalPaneer * 100) / milkQty : 0;

  // Customer Daily Extra Paneer with SC 900
  const customerDailyExtraPaneer = customerYieldPercentNum > 0
    ? (customerDailyProduction * (sheekharrYieldPercent / customerYieldPercentNum)) - customerDailyProduction
    : 0;

  // Customer Daily Extra Profit (Rs)
  const customerDailyExtraProfit = Math.max(0,
    (customerDailyExtraPaneer * sellingPrice) -
    (((customerDailyProduction + customerDailyExtraPaneer) * (sheekharrCoagulant.pricePerKg * sheekharrCoagulantQty)) / sheekharrPaneerQty)
  );

  // Debug logging
  console.log('Debug values:', {
    customerDailyExtraPaneer,
    sellingPrice,
    customerDailyProduction,
    sheekharrCoagulantPrice: sheekharrCoagulant.pricePerKg,
    sheekharrCoagulantQty,
    sheekharrPaneerQty,
    customerDailyExtraProfit
  });

  // Customer Monthly Extra Profit (Rs)
  const customerMonthlyExtraProfit = customerDailyExtraProfit * 30;

  return (
    <>
      {/* Tables Section - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop: Side by side tables, perfectly aligned and equal width */}
        <div className="hidden lg:flex justify-center items-start gap-10">
          <div className="w-96">
            <div className="bg-white rounded shadow p-4 w-full">
              <h2 className="text-lg font-bold mb-2 text-blue-900">Paneer with Customer Coagulant</h2>
              <div className="space-y-4">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="bg-slate-100 rounded p-3 flex flex-col gap-2 relative w-full">
                    <div className="flex items-center gap-2 w-full">
                      <input
                        className="border rounded p-1 flex-1"
                        type="text"
                        value={ing.name}
                        onChange={e => setIngredients(ings => ings.map((ing2, i) => i === idx ? { ...ing2, name: e.target.value } : ing2))}
                        placeholder="Ingredient Name"
                        disabled={ing.isFixed}
                      />
                      {!ing.isFixed && (
                        <button
                          className="text-red-500 font-bold ml-2"
                          onClick={() => setIngredients(ings => ings.filter((_, i) => i !== idx))}
                          aria-label="Remove ingredient"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 w-full">
                      <input
                        className="border rounded p-1 w-1/2"
                        type="number"
                        value={ing.quantity}
                        onChange={e => setIngredients(ings => ings.map((ing2, i) => i === idx ? { ...ing2, quantity: e.target.value } : ing2))}
                        placeholder="Quantity (kg)"
                        min="0"
                      />
                      <input
                        className="border rounded p-1 w-1/2"
                        type="number"
                        value={ing.price}
                        onChange={e => setIngredients(ings => ings.map((ing2, i) => i === idx ? { ...ing2, price: e.target.value } : ing2))}
                        placeholder="Price per kg"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mt-2"
                  onClick={() => setIngredients([...ingredients, { name: '', quantity: '', price: '', isFixed: false }])}
                >
                  + Add Ingredient
                </button>
              </div>
              <div className="mt-6 space-y-3 w-full">
                <div className="flex items-center gap-2 w-full">
                  <label className="font-semibold flex-1">Total Paneer Product (kg):</label>
                  <input
                    className="border rounded p-1 w-24 text-right"
                    type="number"
                    value={totalPaneer}
                    onChange={e => setTotalPaneer(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-2 w-full">
                  <label className="font-semibold flex-1">Yield %:</label>
                  <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right">{yieldPercent}</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <label className="font-semibold flex-1">Price per kg:</label>
                  <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right">{pricePerKg}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-96">
            <div className="bg-white rounded shadow p-4 w-full">
              {/* Sheekharr Table is already responsive inside */}
              <SheekharrPaneerTable
                milkQty={milkQty}
                setMilkQty={(newMilkQty) => {
                  setIngredients(ings => ings.map(ing => 
                    ing.name === 'Milk' ? { ...ing, quantity: newMilkQty } : ing
                  ));
                }}
                milkPrice={sheekharrMilkPrice}
                setMilkPrice={setSheekharrMilkPrice}
                customerYieldPercent={yieldPercent}
                setPaneerQty={setSheekharrPaneerQty}
                paneerQty={sheekharrPaneerQty}
                selectedCoagulant={selectedCoagulant}
                setSelectedCoagulant={setSelectedCoagulant}
              />
            </div>
          </div>
        </div>
        {/* Mobile: Stacked tables (keep max-w-md mx-auto for mobile only) */}
        <div className="lg:hidden">
          <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-4">
            <h2 className="text-lg font-bold mb-2 text-blue-900">Paneer with Customer Coagulant</h2>
            <div className="space-y-4">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="bg-slate-100 rounded p-3 flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2">
                    <input
                      className="border rounded p-1 flex-1"
                      type="text"
                      value={ing.name}
                      onChange={e => setIngredients(ings => ings.map((ing2, i) => i === idx ? { ...ing2, name: e.target.value } : ing2))}
                      placeholder="Ingredient Name"
                      disabled={ing.isFixed}
                    />
                    {!ing.isFixed && (
                      <button
                        className="text-red-500 font-bold ml-2"
                        onClick={() => setIngredients(ings => ings.filter((_, i) => i !== idx))}
                        aria-label="Remove ingredient"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="border rounded p-1 w-1/2"
                      type="number"
                      value={ing.quantity}
                      onChange={e => setIngredients(ings => ings.map((ing2, i) => i === idx ? { ...ing2, quantity: e.target.value } : ing2))}
                      placeholder="Quantity (kg)"
                      min="0"
                    />
                    <input
                      className="border rounded p-1 w-1/2"
                      type="number"
                      value={ing.price}
                      onChange={e => setIngredients(ings => ings.map((ing2, i) => i === idx ? { ...ing2, price: e.target.value } : ing2))}
                      placeholder="Price per kg"
                      min="0"
                    />
                  </div>
                </div>
              ))}
              <button
                className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mt-2"
                onClick={() => setIngredients([...ingredients, { name: '', quantity: '', price: '', isFixed: false }])}
              >
                + Add Ingredient
              </button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold flex-1">Total Paneer Product (kg):</label>
                <input
                  className="border rounded p-1 w-24 text-right"
                  type="number"
                  value={totalPaneer}
                  onChange={e => setTotalPaneer(e.target.value)}
                  min="0"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold flex-1">Yield %:</label>
                <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right">{yieldPercent}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold flex-1">Price per kg:</label>
                <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right">{pricePerKg}</span>
              </div>
            </div>
          </div>
          <SheekharrPaneerTable
            milkQty={milkQty}
            setMilkQty={(newMilkQty) => {
              setIngredients(ings => ings.map(ing => 
                ing.name === 'Milk' ? { ...ing, quantity: newMilkQty } : ing
              ));
            }}
            milkPrice={sheekharrMilkPrice}
            setMilkPrice={setSheekharrMilkPrice}
            customerYieldPercent={yieldPercent}
            setPaneerQty={setSheekharrPaneerQty}
            paneerQty={sheekharrPaneerQty}
            selectedCoagulant={selectedCoagulant}
            setSelectedCoagulant={setSelectedCoagulant}
          />
        </div>
      </div>

      {/* Calculation Groups - Centered on Desktop */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded shadow p-4 space-y-6">
          {/* Group 1: Selling price and profit with above batch */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Paneer Selling Price (Rs):</label>
              <input
                className="border rounded p-1 w-24 text-right"
                type="number"
                value={sellingPrice}
                onChange={e => setSellingPrice(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Profit with Above Batch (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{profitWithBatch.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          {/* Group 2: Customer daily production and extra paneer */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Customer Daily Production (kg):</label>
              <input
                className="border rounded p-1 w-24 text-right"
                type="number"
                value={customerDailyProduction}
                onChange={e => setCustomerDailyProduction(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Customer Daily Extra Paneer with SC 900 (kg):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerDailyExtraPaneer.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          {/* Group 3: Customer daily and monthly extra profit */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Customer Daily Extra Profit (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerDailyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Customer Monthly Extra Profit (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerMonthlyExtraProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Paneer;