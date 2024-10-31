import React, { useState } from 'react';

const ProfilePopup = ({ isOpen, onToggle }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const togglePopup = () => {
    onToggle(false);
    localStorage.setItem('isProfileComplete', 'true');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-end md:items-center z-50">
          <div className="bg-white p-4 md:p-8 rounded-t-lg md:rounded-lg shadow-lg w-full md:w-1/2 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            {step === 1 && (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-4">Complete your profile!</h2>
                <p className="mb-6">Please complete your account information to access the website!</p>
                <button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded w-full"
                >
                  Okay
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-4">Tell us about your address</h2>
                <p className="mb-6">Please complete your address information to access the website.</p>
                <form>
                  <label className="block mb-2">Address Name</label>
                  <input type="text" placeholder="Address Name" className="w-full mb-4 p-2 border rounded" />

                  <label className="block mb-2">Province</label>
                  <input type="text" placeholder="Province" className="w-full mb-4 p-2 border rounded" />

                  <label className="block mb-2">City</label>
                  <input type="text" placeholder="City" className="w-full mb-4 p-2 border rounded" />

                  <label className="block mb-2">District</label>
                  <input type="text" placeholder="District" className="w-full mb-4 p-2 border rounded" />

                  <label className="block mb-2">Sub-district</label>
                  <input type="text" placeholder="Sub-district" className="w-full mb-4 p-2 border rounded" />

                  <label className="block mb-2">Postal Code</label>
                  <input type="text" placeholder="Postal Code" className="w-full mb-4 p-2 border rounded" />

                  <button
                    onClick={handleNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded w-full"
                  >
                    Next
                  </button>
                </form>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-4">Wanna add profile picture?</h2>
                <p className="mb-6">You can upload your profile picture here or add it later.</p>
                <div className="border-dashed border-2 border-gray-300 p-6 mb-4 text-center">
                  <p>Drag and drop or select image to upload</p>
                  <p className="text-sm text-gray-500">( Maximum 3mb. )</p>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={togglePopup}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 md:px-6 md:py-2 rounded"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-4">Profile setup completed</h2>
                <p className="mb-6">Browse the website and shop now</p>
                <div className="flex justify-center mb-6">
                  <span className="text-4xl">✔️</span>
                </div>
                <button
                  onClick={togglePopup}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded w-full"
                >
                  Let's go
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePopup;
