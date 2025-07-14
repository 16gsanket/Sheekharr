import React, { useState, useEffect } from 'react';
import { CreamTecIC } from '../Constants/configuration';

console.log(CreamTecIC.dosagePercent)

const defaultCustomerIngredients = [
  { name: 'Milk', quantity: 73.25, price: 38, isFixed: true },
  { name: 'Milk Fat', quantity: 7.1, price: 450, isFixed: true },
  { name: 'SMP', quantity: 4, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 15, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'Stabilizers', quantity: 0.45, price: 399, isFixed: true },
  { name: 'Water', quantity: 0, price: 0, isFixed: true },
];

const defaultSheekharrIngredients = [
  { name: 'Milk', quantity: 73.25, price: 38, isFixed: true },
  { name: 'Milk Fat', quantity: 4.6, price: 450, isFixed: true },
  { name: 'SMP', quantity: 4, price: 340, isFixed: true },
  { name: 'Sugar', quantity: 15, price: 45, isFixed: true },
  { name: 'Flavour', quantity: 0.2, price: 600, isFixed: true },
  { name: 'CreamTec IC Pro', quantity: 1, price: 499, isFixed: true, dosageRemark: '1% of Icecream Mix', dosagePercent: CreamTecIC.dosagePercent },
  { name: 'Water', quantity: 1.95, price: 0.1, isFixed: true },
];

function IngredientTable({ title, ingredients, setIngredients, totalMix, setTotalMix, overrun, setOverrun, pricePerKg, pricePerLitre, isSheekharr }) {
  // Auto-calculate total mix whenever ingredients change (only for Sheekharr table)
  useEffect(() => {
    if (isSheekharr) {
      const newTotalMix = ingredients.reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
      setTotalMix(newTotalMix);
    }
  }, [ingredients, setTotalMix, isSheekharr]);

  // For Sheekharr table, auto-calculate CreamTec IC Pro quantity based on total mix
  useEffect(() => {
    if (!isSheekharr) return;
    
    const newTotalMix = ingredients.reduce((sum, ing) => {
      if (ing.name === 'CreamTec IC Pro') return sum;
      return sum + Number(ing.quantity || 0);
    }, 0);
    
    setIngredients(ings => ings.map(ing =>
      ing.name === 'CreamTec IC Pro'
        ? { ...ing, quantity: (newTotalMix * 1 / 100) }
        : ing
    ));
  }, [ingredients.filter(ing => ing.name !== 'CreamTec IC Pro'), setIngredients, isSheekharr]);

  const handleIngredientChange = (idx, field, value) => {
    // Prevent editing CreamTec IC Pro quantity in Sheekharr table
    if (isSheekharr && ingredients[idx].name === 'CreamTec IC Pro' && field === 'quantity') return;
    
    setIngredients(ings => ings.map((ing, i) =>
      i === idx ? { ...ing, [field]: field === 'quantity' || field === 'price' ? Number(value) : value } : ing
    ));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };

  const removeIngredient = idx => {
    setIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2 text-blue-900">{title}</h2>
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
                  onClick={() => removeIngredient(idx)}
                  aria-label="Remove ingredient"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-1/2">
                <input
                  className={`border rounded p-1 pr-8 w-full ${isSheekharr && ing.name === 'CreamTec IC Pro' ? 'bg-gray-100' : ''}`}
                  type="number"
                  value={ing.quantity}
                  onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                  placeholder="Quantity"
                  min="0"
                  disabled={isSheekharr && ing.name === 'CreamTec IC Pro'}
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
            {/* Show dosage remark for any ingredient with dosageRemark on a new line */}
            {ing.dosageRemark && (
              <div className="ml-1 text-xs text-gray-500 mt-1">{ing.dosageRemark}</div>
            )}
          </div>
        ))}
        <button
          className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mt-2"
          onClick={addIngredient}
        >
          + Add Ingredient
        </button>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Total Icecream Mix (kg):</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right font-bold">{totalMix.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Overrun %:</label>
          <input
            className="border rounded p-1 w-24 text-right"
            type="number"
            value={overrun}
            onChange={e => setOverrun(Number(e.target.value))}
            min="0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Total Icecream price per kg:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{pricePerKg}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Total Icecream price per litre:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{pricePerLitre}</span>
        </div>
      </div>
    </div>
  );
}

function IceCream() {
  // Customer Table State
  const [customerIngredients, setCustomerIngredients] = useState(defaultCustomerIngredients);
  const [customerOverrun, setCustomerOverrun] = useState(100);

  // Sheekharr Table State
  const [sheekharrIngredients, setSheekharrIngredients] = useState(defaultSheekharrIngredients);
  // const [sheekharrTotalMix, setSheekharrTotalMix] = useState(
  //   defaultSheekharrIngredients.reduce((sum, ing) => sum + Number(ing.quantity), 0)
  // );
  const [sheekharrOverrun, setSheekharrOverrun] = useState(100);

  // --- Customer Ice Cream Table FORMULAS (from Excel) ---
  // Total Icecream price per kg = ((E7*F7)+(E8*F8)+...)/E17
  // Total Icecream price per litre = (E18*E17)/((E17+E19))
  // Calculate totalMix as sum of all ingredient quantities for customer table
  const customerTotalMix = customerIngredients.reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
  const customerTotalCost = customerIngredients.reduce(
    (sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)),
    0
  );
  const customerPricePerKg = customerTotalMix > 0 ? (customerTotalCost / customerTotalMix).toFixed(2) : '';
  const customerPricePerLitre = (customerPricePerKg && customerTotalMix > 0)
    ? ((customerPricePerKg * customerTotalMix) / (Number(customerTotalMix) + Number(customerOverrun))).toFixed(2)
    : '';

  // --- Sheekharr Ice Cream Table FORMULAS (from Excel) ---
  // Total Icecream price per kg = ((E25*F25)+(E26*F26)+...)/E35
  // Total Icecream price per litre = (E36*E35)/((E35+E37))
  // Calculate totalMix as sum of all ingredient quantities for Sheekharr table
  const sheekharrTotalMix = sheekharrIngredients.reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
  const sheekharrTotalCost = sheekharrIngredients.reduce(
    (sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)),
    0
  );
  const sheekharrPricePerKg = sheekharrTotalMix > 0 ? (sheekharrTotalCost / sheekharrTotalMix).toFixed(2) : '';
  const sheekharrPricePerLitre = (sheekharrPricePerKg && sheekharrTotalMix > 0)
    ? ((sheekharrPricePerKg * sheekharrTotalMix) / (Number(sheekharrTotalMix) + Number(sheekharrOverrun))).toFixed(2)
    : '';

  // Shared Inputs
  const [sellingPricePerKg, setSellingPricePerKg] = useState(350);
  const [customerDailyProduction, setCustomerDailyProduction] = useState(1000);

  // Profit Calculations (using correct logic)
  // Profit with Above batch per kg (Rs) = customerPricePerKg - sheekharrPricePerKg
  // Profit with Above batch per litre (Rs) = customerPricePerLitre - sheekharrPricePerLitre
  const profitPerKg = (customerPricePerKg && sheekharrPricePerKg)
    ? (Number(customerPricePerKg) - Number(sheekharrPricePerKg)).toFixed(2)
    : '';
  const profitPerLitre = (customerPricePerLitre && sheekharrPricePerLitre)
    ? (Number(customerPricePerLitre) - Number(sheekharrPricePerLitre)).toFixed(2)
    : '';
  const customerDailyExtraProfit = (profitPerKg && customerDailyProduction)
    ? (Number(profitPerKg) * Number(customerDailyProduction)).toFixed(0)
    : '';
  const customerMonthlyExtraProfit = customerDailyExtraProfit
    ? (Number(customerDailyExtraProfit) * 30).toFixed(0)
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Desktop: Side by side tables */}
      <div className="hidden lg:flex justify-center items-start gap-10">
        <div className="w-96">
          {/* --- Customer Ice Cream Table START --- */}
          <IngredientTable
            title={"Customer's existing Icecream price scenario"}
            ingredients={customerIngredients}
            setIngredients={setCustomerIngredients}
            totalMix={customerTotalMix}
            setTotalMix={() => {}} // No-op, not needed for customer table
            overrun={customerOverrun}
            setOverrun={setCustomerOverrun}
            pricePerKg={customerPricePerKg}
            pricePerLitre={customerPricePerLitre}
            isSheekharr={false}
            isCustomer={true}
          />
          {/* --- Customer Ice Cream Table END --- */}
        </div>
        <div className="w-96">
          {/* --- Sheekharr Ice Cream Table START --- */}
          <IngredientTable
            title={"CreamTec IC Pro added Icecream price scenario"}
            ingredients={sheekharrIngredients}
            setIngredients={setSheekharrIngredients}
            totalMix={sheekharrTotalMix}
            setTotalMix={() => {}} // No-op, not needed for Sheekharr table
            overrun={sheekharrOverrun}
            setOverrun={setSheekharrOverrun}
            pricePerKg={sheekharrPricePerKg}
            pricePerLitre={sheekharrPricePerLitre}
            isSheekharr={true}
            isCustomer={false}
          />
          {/* --- Sheekharr Ice Cream Table END --- */}
        </div>
      </div>
      {/* Mobile: Stacked tables */}
      <div className="lg:hidden">
        {/* --- Customer Ice Cream Table START --- */}
        <IngredientTable
          title={"Customer's existing Icecream price scenario"}
          ingredients={customerIngredients}
          setIngredients={setCustomerIngredients}
          totalMix={customerTotalMix}
          setTotalMix={() => {}} // No-op, not needed for customer table
          overrun={customerOverrun}
          setOverrun={setCustomerOverrun}
          pricePerKg={customerPricePerKg}
          pricePerLitre={customerPricePerLitre}
          isSheekharr={false}
          isCustomer={true}
        />
        {/* --- Customer Ice Cream Table END --- */}
        <div className="mt-8">
          {/* --- Sheekharr Ice Cream Table START --- */}
          <IngredientTable
            title={"CreamTec IC Pro added Icecream price scenario"}
            ingredients={sheekharrIngredients}
            setIngredients={setSheekharrIngredients}
            totalMix={sheekharrTotalMix}
            setTotalMix={() => {}} // No-op, not needed for Sheekharr table
            overrun={sheekharrOverrun}
            setOverrun={setSheekharrOverrun}
            pricePerKg={sheekharrPricePerKg}
            pricePerLitre={sheekharrPricePerLitre}
            isSheekharr={true}
            isCustomer={false}
          />
          {/* --- Sheekharr Ice Cream Table END --- */}
        </div>
      </div>
      {/* Summary Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded shadow p-4 space-y-6">
          {/* Selling price and profit with above batch */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Icecream selling price per kg (Rs):</label>
              <input
                className="border rounded p-1 w-24 text-right"
                type="number"
                value={sellingPricePerKg}
                onChange={e => setSellingPricePerKg(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Profit with Above batch per kg (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{profitPerKg}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Profit with Above batch per litre (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{profitPerLitre}</span>
            </div>
          </div>
          {/* Customer daily production and extra profit */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Customer daily production (kg):</label>
              <input
                className="border rounded p-1 w-24 text-right"
                type="number"
                value={customerDailyProduction}
                onChange={e => setCustomerDailyProduction(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold flex-1">Customer Daily Extra Profit (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerDailyExtraProfit}</span>
            </div>
          </div>
          {/* Customer monthly extra profit */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold flex-1">Customer Monthly Extra Profit (Rs):</label>
              <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[80px] text-right font-bold">{customerMonthlyExtraProfit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IceCream;