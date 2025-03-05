import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: 'Free',
      limit: 2,
      features: ['Save up to 2 templates'],
      route: '/signup-free',
    },
    {
      name: 'Basic',
      price: '$10/month',
      limit: 10,
      features: ['Save up to 10 templates'],
      route: '/signup-basic',
    },
    {
      name: 'Pro',
      price: '$30/month',
      limit: 50,
      features: ['Save up to 50 templates'],
      route: '/signup-pro',
    },
  ];

  const handleUpgrade = (route) => {
    onClose();
    navigate(route);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white text-gray-950 p-6 rounded-lg shadow-lg relative w-11/12 max-w-2xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Upgrade Your Subscription</h2>
        <p className="mb-6">You have reached the limit of your current plan. Please upgrade your subscription to save more templates.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="border border-gray-300 rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-lg font-bold mb-2">{plan.price}</p>
              <ul className="mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
              <button
                className="bg-blue-500 text-white p-2 rounded w-full"
                onClick={() => handleUpgrade(plan.route)}
              >
                Upgrade to {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;