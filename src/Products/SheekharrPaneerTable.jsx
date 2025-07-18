import React, { useState } from 'react';
import { SC900 , SC600 } from '../Constants/configuration';

// Coagulant options: dosage % and price per kg (edit here to change values)
// Coagulant options: dosage % and price per kg can be foind in configuration.js
const COAGULANT_OPTIONS = {
  'SC-600': { dosagePercent: SC600.dosagePercent, pricePerKg: SC600.pricePerKg },
  'SC-900': { dosagePercent: SC900.dosagePercent , pricePerKg: SC900.pricePerKg },
};

const defaultIngredients = [
  { name: 'Milk', quantity: 300, price: 36, isFixed: true },
  // Coagulant row will be handled separately
];

function SheekharrPaneerTable({ milkQty, setMilkQty, milkPrice, setMilkPrice, customerYieldPercent, paneerQty, setPaneerQty, selectedCoagulant, setSelectedCoagulant, coagulantQty, setCoagulantQty, coagulantPrice, setCoagulantPrice }) {
  const [ingredients, setIngredients] = useState(defaultIngredients.map(ing => ({ ...ing, quantity: ing.name === 'Milk' ? milkQty : ing.quantity, price: ing.name === 'Milk' ? milkPrice : ing.price })));

  // New state for editable coagulant fields (fallback to local if not provided)
  const coagulant = COAGULANT_OPTIONS[selectedCoagulant];
  const autoCoagulantQty = milkQty > 0 ? (milkQty * coagulant.dosagePercent / 100) : 0;
  const autoCoagulantPricePerKg = coagulant.pricePerKg;
  const [localCoagulantQty, setLocalCoagulantQty] = useState(autoCoagulantQty);
  const [localCoagulantPrice, setLocalCoagulantPrice] = useState(autoCoagulantPricePerKg);

  // Use prop state if provided, else local
  const effectiveCoagulantQty = typeof coagulantQty !== 'undefined' ? coagulantQty : localCoagulantQty;
  const effectiveSetCoagulantQty = setCoagulantQty || setLocalCoagulantQty;
  const effectiveCoagulantPrice = typeof coagulantPrice !== 'undefined' ? coagulantPrice : localCoagulantPrice;
  const effectiveSetCoagulantPrice = setCoagulantPrice || setLocalCoagulantPrice;

  // Sync coagulant fields with auto values when dependencies change, unless user has overridden
  React.useEffect(() => {
    if (!setCoagulantQty) setLocalCoagulantQty(autoCoagulantQty);
    if (!setCoagulantPrice) setLocalCoagulantPrice(autoCoagulantPricePerKg);
  }, [selectedCoagulant, milkQty]);

  // Calculate coagulant cost
  const coagulantCost = (Number(effectiveCoagulantQty) || 0) * (Number(effectiveCoagulantPrice) || 0);

  // Calculate yield %
  const yieldPercent = milkQty > 0 ? ((paneerQty * 100) / milkQty).toFixed(2) : '';

  // Calculate price per kg (milk + coagulant + extra ingredients)
  const extraIngredients = ingredients.filter(ing => !ing.isFixed);
  const extraCost = extraIngredients.reduce((sum, ing) => sum + (Number(ing.quantity) * Number(ing.price)), 0);
  const totalCost = (Number(milkQty) * Number(milkPrice)) + Number(coagulantCost) + extraCost;
  const pricePerKg = paneerQty > 0 ? (totalCost / paneerQty).toFixed(2) : '';

  // Yield % difference
  const yieldDiff = customerYieldPercent && yieldPercent ? (yieldPercent - customerYieldPercent).toFixed(2) : '';

  // Handle ingredient change
  const handleIngredientChange = (idx, field, value) => {
    // If editing milk row
    if (ingredients[idx].name === 'Milk') {
      if (field === 'quantity') setMilkQty(Number(value));
      if (field === 'price') setMilkPrice(Number(value));
    }
    setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing));
  };

  // Add new ingredient
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', price: '', isFixed: false }]);
  };

  // Remove ingredient
  const removeIngredient = idx => {
    setIngredients(ings => ings.filter((_, i) => i !== idx));
  };

  // Handlers for coagulant fields
  const handleCoagulantQtyChange = (e) => {
    const value = e.target.value;
    if (value === '' || isNaN(Number(value))) {
      setCoagulantQty('');
    } else {
      setCoagulantQty(Number(value));
    }
  };
  const handleCoagulantPriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || isNaN(Number(value))) {
      setCoagulantPricePerKg('');
    } else {
      setCoagulantPricePerKg(Number(value));
    }
  };

  // If user clears the field, revert to auto value on blur
  const handleCoagulantQtyBlur = () => {
    if (coagulantQty === '' || isNaN(Number(coagulantQty))) {
      setCoagulantQty(autoCoagulantQty);
    }
  };
  const handleCoagulantPriceBlur = () => {
    if (coagulantPricePerKg === '' || isNaN(Number(coagulantPricePerKg))) {
      setCoagulantPricePerKg(autoCoagulantPricePerKg);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-2 text-blue-900">Paneer with Sheekharr Coagulant</h2>
      {/* Coagulant selection */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Coagulant:</label>
        <select
          className="border rounded p-1"
          value={selectedCoagulant}
          onChange={e => setSelectedCoagulant(e.target.value)}
        >
          <option value="SC-600">SC-600</option>
          <option value="SC-900">SC-900</option>
        </select>
      </div>
      <div className="space-y-4">
        {/* Milk row */}
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
            <div className="flex gap-2">
              {/* Quantity input with kg suffix */}
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
              {/* Price input with Rs prefix and per kg suffix */}
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
        {/* Coagulant row (auto-calculated, now editable) */}
        <div className="bg-slate-100 rounded p-3 flex flex-col gap-2 relative">
          <div className="flex items-center gap-2">
            <input
              className="border rounded p-1 flex-1 bg-gray-100"
              type="text"
              value={selectedCoagulant + ' (Sheekharr Coagulant)'}
              disabled
            />
          </div>
          <div className="flex gap-2">
            {/* Coagulant Quantity input with kg suffix */}
            <div className="relative w-1/2">
              <input
                className="border rounded p-1 pr-8 w-full"
                type="number"
                value={effectiveCoagulantQty}
                onChange={e => effectiveSetCoagulantQty(e.target.value === '' || isNaN(Number(e.target.value)) ? '' : Number(e.target.value))}
                onBlur={() => {
                  if (effectiveCoagulantQty === '' || isNaN(Number(effectiveCoagulantQty))) effectiveSetCoagulantQty(autoCoagulantQty);
                }}
                placeholder="Quantity"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">kg</span>
            </div>
            {/* Coagulant Price input with Rs prefix and per kg suffix */}
            <div className="relative w-1/2">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">Rs</span>
              <input
                className="border rounded p-1 pl-8 pr-14 w-full"
                type="number"
                value={effectiveCoagulantPrice}
                onChange={e => effectiveSetCoagulantPrice(e.target.value === '' || isNaN(Number(e.target.value)) ? '' : Number(e.target.value))}
                onBlur={() => {
                  if (effectiveCoagulantPrice === '' || isNaN(Number(effectiveCoagulantPrice))) effectiveSetCoagulantPrice(autoCoagulantPricePerKg);
                }}
                placeholder="Price"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">per kg</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Dosage: {(() => {
              return milkQty > 0 ? ((Number(effectiveCoagulantQty) / milkQty) * 100).toFixed(2) : '0';
            })()}% of milk
          </div>
          <div className="text-xs text-gray-500 mt-1">Recommended Dosage : <span className="font-bold">{coagulant.dosagePercent}% of milk </span></div>
        </div>
        <button
          className="w-full bg-blue-100 text-blue-900 rounded py-2 font-semibold mt-2"
          onClick={addIngredient}
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
            value={paneerQty}
            onChange={e => setPaneerQty(Number(e.target.value))}
            min="0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Yield %:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right">{yieldPercent}</span>
          {yieldDiff && (
            <span className="ml-2 px-2 py-1 rounded font-bold text-green-800 bg-green-100 border border-green-300 animate-pulse">
              +{yieldDiff}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold flex-1">Price per kg:</label>
          <span className="bg-blue-100 text-blue-900 rounded px-3 py-1 min-w-[60px] text-right">{pricePerKg}</span>
        </div>
      </div>
    </div>
  );
}

export default SheekharrPaneerTable; 