import React, { useEffect, useState } from 'react'
import CreateForm from './CreateForm';
import Existing from './Existing';
import Settings from './Settings';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import axios from 'axios';

const  DashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState('settings');
  const [credentials, setCredentials] = useState({ 
    accessKey: '', 
    secretKey: '',    
    frontendLoadBalancer: '',
    backendLoadBalancer: '',
    databaseEndpoint: '',
    signedUrlForPemFile: '' });
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };
  const {user}=useUser();

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${user.primaryEmailAddress.emailAddress}`);
        setCredentials(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching credentials:', error);
      }
    };

    fetchCredentials();
  }, [user.primaryEmailAddress.emailAddress]);
  return (
    <>
      <div>
        <div>
          <div className="sm:hidden">
            <label htmlFor="Tab" className="sr-only">Tab</label>

            <select id="Tab" className="w-full rounded-md border-gray-200" value={selectedTab} onChange={(e) => handleTabChange(e.target.value)}>
              <option value="create">Create Configuration</option>
              <option value="existing">Existing Configuration</option>
              <option value="settings">Settings</option>
              <option value="log-out"> Log Out</option>
            </select>
          </div>

          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6">
                <a
                  href="#"
                  className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'create' ? 'text-blue-500' : 'text-gray-500'
                    } hover:text-gray-700`}
                  onClick={() => handleTabChange('create')}
                >
                  Create Configuration
                </a>

                <a
                  href="#"
                  className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'existing' ? 'text-blue-500' : 'text-gray-500'
                    } hover:text-gray-700`}
                  onClick={() => handleTabChange('existing')}
                >
                  Existing Configuration
                </a>
                <a
                  href="#"
                  className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'settings' ? 'text-blue-500' : 'text-gray-500'
                    } hover:text-gray-700`}
                  onClick={() => handleTabChange('settings')}
                >
                  Settings
                </a>
                <a
                  className={`shrink-0 border border-transparent p-3 text-sm font-medium ${selectedTab === 'log-out' ? 'text-blue-500' : 'text-red-500'
                    } hover:text-gray-700`}
                >
                  <SignOutButton>Log Out</SignOutButton>
                </a>

              </nav>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {selectedTab === 'create' && <CreateForm credentials={credentials} onInitialized={() => handleTabChange('existing')}/>}
          {selectedTab === 'existing' && <Existing credentials={credentials} />}
          {selectedTab === 'settings' && <Settings credentials={credentials} />}
        </div>
      </div>
    </>
  )
}


export default DashboardPage;