import React from 'react';
import axios from 'axios';

const Existing = ({ credentials }) => {
  const handleDestroy = async () => {
    try {
      await axios.post(`http://localhost:3000/api/destroy/${user.primaryEmailAddress.emailAddress}`);
      alert('Configuration is getting destroyed!')
    } catch (error) {
      alert('Unable to desstroy')
      console.error('Error destroying architecture:', error);
    }
  };

  return (
    <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
      <div className="flex items-start sm:gap-8">
        <div className="flex-grow">
        <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Exisitng Configuration</h1>

            <p className="mt-4 text-gray-500">
              Below are your details for the 3-Tier Configuration! 
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-700">
            <strong>Front-end Load Balancer:</strong> {credentials.frontendLoadBalancer}<br />
            <strong>Back-end Load Balancer:</strong> {credentials.backendLoadBalancer}<br />
            <strong>Database Endpoint:</strong> {credentials.databaseEndpoint}<br />
            <strong>Signed URL for PEM File:</strong> {credentials.signedUrlForPemFile}<br />
          </p>
          <p className="mt-4 text-sm text-gray-500">
            <strong>Default Database Credentials:</strong><br />
            DB Name: projectdb<br />
            DB User: root<br />
            DB Password: root1234
          </p>
          <button
            className="mt-4 rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white"
            onClick={handleDestroy}
          >
            Destroy Configuration
          </button>
        </div>
      </div>
    </article>
  );
};

export default Existing;
