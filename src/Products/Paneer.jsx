import React, { useState } from 'react';
import SheekharrPaneerTable from './SheekharrPaneerTable';
import { SC900 , SC600 } from '../Constants/configuration';

const defaultIngredients = [
  { name: 'Milk', quantity: 300, price: 36, isFixed: true },
  { name: 'Customer Coagulant', quantity: 0.6, price: 160, isFixed: true },
];

// This configurations for WEB APP's local storage data , not required in PWAs
const LOCAL_STORAGE_KEY = 'paneerCalcData';
const EXPIRY_HOURS = 4;

function Paneer() {
  const [ingredients, setIngredients] = useState(defaultIngredients);
  const [totalPaneer, setTotalPaneer] = useState(51);

  // Sheekharr table milk state - now synced with customer table
  const [sheekharrMilkPrice, setSheekharrMilkPrice] = useState(36);
  const [sheekharrPaneerQty, setSheekharrPaneerQty] = useState(57.3);
  const [selectedCoagulant, setSelectedCoagulant] = useState('SC-900');
  const [sellingPrice, setSellingPrice] = useState(280);

  // --- LIFTED STATE FOR COAGULANT FIELDS ---
  const [sheekharrCoagulantQty, setSheekharrCoagulantQty] = useState(3); // default: 1% of 300kg
  const [sheekharrCoagulantPrice, setSheekharrCoagulantPrice] = useState(160); // default price

  // Calculate total milk quantity (always from Milk row) - this will be used for both tables
  const milk = ingredients.find(i => i.name === 'Milk');
  const milkQty = milk ? Number(milk.quantity) : 0;

  // Calculate yield %
  const yieldPercent = milkQty > 0 ? ((totalPaneer * 100) / milkQty).toFixed(2) : '';

  // Calculate price per kg
  const totalCost = ingredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const pricePerKg = totalPaneer > 0 ? (totalCost / totalPaneer).toFixed(2) : '';

  // Sheekharr coagulant cost (now using lifted state)
  const sheekharrCoagulantCost = (Number(sheekharrCoagulantQty) || 0) * (Number(sheekharrCoagulantPrice) || 0);

  // Profit with above batch (now using lifted state)
  const profitWithBatch = ((Number(sheekharrPaneerQty) - Number(totalPaneer)) * sellingPrice) - sheekharrCoagulantCost;

  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);

  // Calculate yield % for both (now using synced milk quantity)
  const sheekharrYieldPercent = milkQty > 0 ? (Number(sheekharrPaneerQty) * 100) / milkQty : 0;
  const customerYieldPercentNum = milkQty > 0 ? (Number(totalPaneer) * 100) / milkQty : 0;

  // Customer Daily Extra Paneer with SC 900 (kg)
  const customerDailyExtraPaneer =
    (customerDailyProduction * (sheekharrYieldPercent / customerYieldPercentNum)) - customerDailyProduction;

  // Customer Daily Extra Profit (Rs)
  const customerDailyExtraProfit =
    (customerDailyExtraPaneer * sellingPrice) -
    (((customerDailyProduction + customerDailyExtraPaneer) * sheekharrCoagulantCost) / Number(sheekharrPaneerQty));

  // Customer Monthly Extra Profit (Rs)
  const customerMonthlyExtraProfit = customerDailyExtraProfit * 30;

  // Debug logging
  console.log({
    sheekharrPaneerQty,
    totalPaneer,
    sellingPrice,
    sheekharrCoagulantQty,
    sheekharrCoagulantPrice: sheekharrCoagulantPrice,
    customerDailyProduction,
    sheekharrYieldPercent,
    customerYieldPercentNum,
    customerDailyExtraPaneer,
    customerDailyExtraProfit
  });

  // Customer Table: update ingredients and totalPaneer as numbers
  const handleIngredientChange = (idx, field, value) => {
    setIngredients(ings =>
      ings.map((ing, i) =>
        i === idx ? { ...ing, [field]: field === 'quantity' || field === 'price' ? (value === '' ? '' : Number(value)) : value } : ing
      )
    );
  };

  // Customer Table: update totalPaneer as number
  const handleTotalPaneerChange = (value) => {
    setTotalPaneer(value === '' ? '' : Number(value));
  };

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
                        onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
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
                      <div className="relative w-1/2">
                        <input
                          className="border rounded p-1 pr-8 w-full"
                          type="number"
                          value={ing.quantity}
                          onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
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
                          onChange={e => handleIngredientChange(idx, 'price', e.target.value)}
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
                    onChange={e => handleTotalPaneerChange(e.target.value)}
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
                paneerQty={sheekharrPaneerQty}
                setPaneerQty={setSheekharrPaneerQty}
                selectedCoagulant={selectedCoagulant}
                setSelectedCoagulant={setSelectedCoagulant}
                coagulantQty={sheekharrCoagulantQty}
                setCoagulantQty={setSheekharrCoagulantQty}
                coagulantPrice={sheekharrCoagulantPrice}
                setCoagulantPrice={setSheekharrCoagulantPrice}
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
                      onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
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
                    <div className="relative w-1/2">
                      <input
                        className="border rounded p-1 pr-8 w-full"
                        type="number"
                        value={ing.quantity}
                        onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
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
                        onChange={e => handleIngredientChange(idx, 'price', e.target.value)}
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
                onClick={() => setIngredients([...ingredients, { name: '', quantity: '', price: '', isFixed: false }])}
              >
                + Add Ingredient
              </button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold flex-1">Total Paneer Formed (kg):</label>
                <input
                  className="border rounded p-1 w-24 text-right"
                  type="number"
                  value={totalPaneer}
                  onChange={e => handleTotalPaneerChange(e.target.value)}
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
            paneerQty={sheekharrPaneerQty}
            setPaneerQty={setSheekharrPaneerQty}
            selectedCoagulant={selectedCoagulant}
            setSelectedCoagulant={setSelectedCoagulant}
            coagulantQty={sheekharrCoagulantQty}
            setCoagulantQty={setSheekharrCoagulantQty}
            coagulantPrice={sheekharrCoagulantPrice}
            setCoagulantPrice={setSheekharrCoagulantPrice}
          />
        </div>
      </div>

      {/* Calculation Groups - Centered on Desktop */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded shadow p-4 space-y-6">
          {/* Group 1: Selling price and profit with above batch */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Paneer selling price (Rs):</label>
              <input
                className="border rounded p-1 w-24 text-right"
                type="number"
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Profit with above batch (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{profitWithBatch.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          {/* Group 2: Customer daily production and extra paneer */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Customer daily production (kg):</label>
              <input
                className="border rounded p-1 w-24 text-right"
                type="number"
                value={customerDailyProduction}
                onChange={e => setCustomerDailyProduction(e.target.value === '' ? '' : Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Customer daily extra Paneer with Sheekhar Coagulant (kg):</label>
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