import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TbArrowNarrowRightDashed } from "react-icons/tb";

const SubscriptionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0.00/month',
      limit: 2,
      features: [
        'Save up to 2 templates',
        'Access to community forum',
        '1 social media platform',
        'Up to 3 automated postings per month',
      ],
      route: '/signup-free',
    },
    {
      name: 'Basic',
      price: '$12/month',
      limit: 10,
      features: [
        'Save up to 10 templates',
        'support',
        'Automated posting to social media',
        'All social media platforms',
        'Up to 30 automated postings per month',
      ],
      route: '/signup-basic',
    },
    {
      name: 'Pro',
      price: '$30/month',
      limit: 50,
      features: [
        'Save up to 50 templates',
        'priority support',
        'Custom branding options',
        'Access to premium templates',
        'Automated posting to social media',
        'All social media platforms',
        'Unlimited automated postings',
      ],
      route: '/signup-pro',
    },
  ];

  const handleUpgrade = (route) => {
    onClose();
    navigate(route);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white h-fit max-h-fit text-gray-950 p-6 rounded-lg shadow-lg relative w-1/2 md:w-3/4 xxl:w-11/12 max-w-4xl xxl:max-w-5xl mr-20">
        <button onClick={onClose} className="absolute top-2 text-3xl right-2 text-gray-800 hover:text-gray-900">
          &times;
        </button>
        <h2 className="text-xl xxl:text-2xl font-bold mb-4 text-center">Save more templates and access additional features!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="border border-gray-300 rounded-lg p-4 shadow-md flex flex-col">
              <h3 className="text-lg xxl:text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-base xxl:text-lg font-bold mb-2">{plan.price}</p>
              <ul className="mb-4 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <TbArrowNarrowRightDashed className="mr-2" color="#46d1db" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="mt-auto bg-blue-500 text-white p-2 rounded w-full"
                onClick={() => handleUpgrade(plan.route)}
              >
                {plan.name === 'Free' ? 'Sign up for Free' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;