import React, { useState } from 'react';
import { useAppContext } from "../context/appContext";

const ProductsTobacco = () => {
    const {
        handleChange,
        productsTobacco
      } = useAppContext();
  const products = [
    {
      id: 1,
      name: 'Nicotine e-cigarettes/vapes (e.g., JUUL, Flum, VUSE)',
      stateKey: 'nic_vape_intent',
    },
    {
      id: 2,
      name: 'Non-nicotine e-cigarettes/vapes (e.g., Monq, Vitaminvape, Cloudy)',
      stateKey: 'nic_nonnic_vape_intent',
    },
    {
      id: 3,
      name: 'Cigarettes',
      stateKey: 'nic_cig_intent',
    },
  ];

  const [responses, setResponses] = useState({
    nic_vape_intent: '',
    nic_nonnic_vape_intent: '',
    nic_cig_intent: '',
  });

  const handleRadioChange = (event, stateKey) => {
    const { value } = event.target;
    setResponses((prevResponses) => ({
        ...prevResponses,
        [stateKey]: value,
      }));
    const updatedProductsTobacco = { ...productsTobacco, [stateKey]: value }; // Create a new object with the updated value
    handleChange({ name: "productsTobacco", value: updatedProductsTobacco }); // Pass the updated object to handleChange
  };
  

  return (
    <>
      <p>10. Do you think you will EVER try these products AGAIN?</p>
      <div style={{ marginLeft: '20px' }}> {/* Apply indentation */}
        {products.map((product) => (

          <div key={product.id} className="product-question">
          <p>{product.name}</p>
            <div className="product-options">
              {['Definitely not', 'Probably not', 'Probably yes', 'Definitely yes'].map((option, index) => (
                <label key={index+1} className="container">
                  <span>{option}</span>
                  <input
                    type="radio"
                    name={product.stateKey}
                    value={index+1}
                    checked={responses[product.stateKey] === String(index+1)}
                    onChange={(e) => handleRadioChange(e, product.stateKey)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsTobacco;