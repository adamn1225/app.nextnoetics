import React from 'react';
import AddAccessToken from '../AddAccessToken';

const AccessTokenModal = ({ setIsAccessTokenModalVisible }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                <span className="text-gray-500 dark:text-gray-300 cursor-pointer float-right" onClick={() => setIsAccessTokenModalVisible(false)}>&times;</span>
                <AddAccessToken onClose={() => setIsAccessTokenModalVisible(false)} />
            </div>
        </div>
    );
};

export default AccessTokenModal;