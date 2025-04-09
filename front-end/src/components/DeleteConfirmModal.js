// src/components/DeleteConfirmModal.js
import React from 'react';

const DeleteConfirmModal = ({ user, onDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <h3 className="text-xl font-bold mt-4">Хэрэглэгч устгах</h3>
          <p className="text-gray-600 mt-2">
            Та энэ хэрэглэгчийн устгахдаа итгэлтэй байна уу? <span className="font-bold">{user.username}</span>?
          </p>
         
        </div>
        
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Цуцлах
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Устгах
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;