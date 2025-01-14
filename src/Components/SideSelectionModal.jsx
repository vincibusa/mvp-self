// Components/SideSelectionModal.jsx
import React, { useState } from "react";


const SideSelectionModal = ({ onSelect, exerciseType }) => {
  const [selectedSide, setSelectedSide] = useState("left");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect(selectedSide);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-sm w-full mx-4">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Select Side for {exerciseType}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-white text-lg">
              Choose the side to test:
            </label>
            <select
              value={selectedSide}
              onChange={(e) => setSelectedSide(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left Side</option>
              <option value="right">Right Side</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Test
          </button>
        </form>
      </div>
    </div>
  );
};



export default SideSelectionModal;