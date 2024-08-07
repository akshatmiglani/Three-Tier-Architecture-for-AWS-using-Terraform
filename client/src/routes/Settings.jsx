import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Settings = ({ credentials }) => {
  const { user } = useUser();
  const [awsAccessKey, setAwsAccessKey] = useState(credentials.accessKey);
  const [awsSecretKey, setAwsSecretKey] = useState(credentials.secretKey);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setAwsAccessKey(credentials.awsAccessKeyId);
    setAwsSecretKey(credentials.awsSecretAccessKey);
  }, [credentials]);

  const handleSave = async (e) => {
    e.preventDefault();
    console.log('saving');
    try {
      await axios.put(`http://localhost:3000/api/${user.primaryEmailAddress.emailAddress}`, {
        awsAccessKey,
        awsSecretKey,
      });
      setIsEditing(false);
      setAwsSecretKey('storedSecretKey');
    } catch (error) {
      console.error('Error saving credentials', error);
    }
  };

  return (
    <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>

          <p className="mt-4 text-gray-500">
            Edit your account's information and check if the necessary details are filled correctly!
          </p>
        </div>

        <form className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={handleSave}>
          <div>
            <label
              htmlFor="UserEmail"
              className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span className="text-xs font-medium text-gray-700"> Email </span>

              <input
                type="email"
                id="UserEmail"
                placeholder={user.primaryEmailAddress.emailAddress}
                className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                disabled
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="accessKey"
              className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span className="text-xs font-medium text-gray-700"> AWS Access Key </span>

              <input
                type="text"
                id="accessKey"
                value={awsAccessKey}
                onChange={(e) => setAwsAccessKey(e.target.value)}
                className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                disabled={!isEditing}
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="secretKey"
              className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span className="text-xs font-medium text-gray-700"> AWS Secret Key </span>

              <input
                type="password"
                id="secretKey"
                value={awsSecretKey}
                onChange={(e) => setAwsSecretKey(e.target.value)}
                className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                disabled={!isEditing}
              />
            </label>

            <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.6 text-amber-700 mb-4 my-5 ">
      <p className="whitespace-nowrap text-sm flex items-center">
        Make sure that the credentials have the following permissions:
      </p>
    </span>
    <ul className="w-full text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg mt-4">
      <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg">AmazonEC2FullAccess</li>
      <li className="w-full px-4 py-2 border-b border-gray-200">AmazonRDSFullAccess</li>
      <li className="w-full px-4 py-2 border-b border-gray-200">AmazonVPCFullAccess</li>
      <li className="w-full px-4 py-2 rounded-b-lg">ElasticLoadBalancingFullAccess</li>
      <li className="w-full px-4 py-2 rounded-b-lg">S3FullAccess</li>
    </ul>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {!isEditing && (
                <button
                  type="button"
                  className="inline-block rounded-lg bg-gray-500 px-5 py-3 text-sm font-medium text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Change
                </button>
              )}
            </div>
            {isEditing && (
              <button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </article>
  )
}

export default Settings