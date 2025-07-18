


const defaultIngredients = [
    { name: 'Milk', quantity: 97.9, price: 35, isFixed: true },
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


function FlavouredMilk() {


    return (
        <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
            <h1> ... Flovoured Milk coming soon ... </h1>
        </div>
    )

}


export default FlavouredMilk;