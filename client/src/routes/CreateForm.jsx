import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const CreateForm = ({ credentials, onInitialized }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasActiveConfig, setHasActiveConfig] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const checkActiveConfig = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/checkActiveConfig/${user.primaryEmailAddress.emailAddress}`);
        setHasActiveConfig(response.data.isActive);
      } catch (error) {
        console.error('Error checking active configuration:', error);
      }
    };

    checkActiveConfig();
  }, [user]);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await axios.post(`http://localhost:3000/api/initialize/${user.primaryEmailAddress.emailAddress}`);
      setTimeout(() => {
        alert('After your configurations are created, it will appear in the "existing configuration" section. This usually takes 5 minutes.')
        setIsInitializing(false);
        onInitialized();
      }, 60000); 
    } catch (error) {
      console.error('Error initializing architecture:', error);
      setIsInitializing(false);
    }
  };

  return (
    <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
      <div className="flex items-start sm:gap-8">
        <div className="flex-grow">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Initialize Architecture</h1>
            <p className="mt-4 text-gray-500">
              Click the below button to create 3-Tier Architecture on your AWS Account!
            </p>
          </div>
          <div className="flex justify-center">
            {hasActiveConfig ? (
              <p className="text-red-500 mt-4">An active configuration already exists.</p>
            ) : (
              <button
                className="mt-4 rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                onClick={handleInitialize}
                disabled={isInitializing}
              >
                Initialize Architecture
              </button>
            )}
          </div>
          {isInitializing && (
            <div className="mt-4">
              <span id="ProgressLabel" className="sr-only">Loading</span>
              <span
                role="progressbar"
                aria-labelledby="ProgressLabel"
                aria-valuenow="75"
                className="block rounded-full bg-gray-200"
              >
                <span
                  className="block h-3 rounded-full bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-from)_0,_var(--tw-gradient-from)_20px,_var(--tw-gradient-to)_20px,_var(--tw-gradient-to)_40px)] from-indigo-400 to-indigo-500"
                  style={{ width: '75%' }}
                ></span>
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default CreateForm;
