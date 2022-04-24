import Head from 'next/head';
import type { ReactElement } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import useUser from '@components/hooks/useUser';
import Sidebar from '@components/app/Sidebar';
import Footer from '@components/app/Footer';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Settings() {
  const { user } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isReceiveEmailUpdates, setIsReceiveEmailUpdates] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');

  const onSaveName = async () => {
    await axios.post('/api/settings/name', { name: nameInput });
    setIsEditingName(false);
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="relative min-h-screen bg-gray-100">
        <main>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <main className="flex-1 overflow-y-auto focus:outline-none">
              <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                <div className="my-4 rounded-lg bg-white shadow py-6 px-8 flex-1 flex flex-col">
                  <div className="px-4 sm:px-6 md:px-0">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  </div>
                  <div className="px-4 sm:px-6 md:px-0">
                    <div className="py-6">
                      {/* Description list with inline editing */}
                      <div className="mt-6 divide-y divide-gray-200">
                        <div className="space-y-1">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            Display information is only visible to you
                          </p>
                        </div>
                        <div className="mt-6">
                          <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-500">Name</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {
                                isEditingName
                                  ? (
                                    <input
                                      className="flex-grow bg-gray-100 py-px px-1 rounded-sm"
                                      type="text"
                                      value={nameInput}
                                      onChange={(e) => setNameInput(e.target.value)}
                                    />
                                  )
                                  : <span className="flex-grow py-px">{user?.name}</span>
                              }
                                <span className="ml-4 flex-shrink-0">
                                  {
                                  isEditingName
                                    ? (
                                      <button
                                        type="button"
                                        className="bg-white rounded-md font-medium text-primary hover:text-primary-active"
                                        onClick={onSaveName}
                                      >
                                        Save
                                      </button>
                                    )
                                    : (
                                      <button
                                        type="button"
                                        className="bg-white rounded-md font-medium text-primary hover:text-primary-active"
                                        onClick={() => setIsEditingName(true)}
                                      >
                                        Update
                                      </button>
                                    )
                                }
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 flex items-center sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                              <dt className="text-sm font-medium text-gray-500">Photo</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={user?.profileImg || 'https://i.stack.imgur.com/dz7ja.png'}
                                    alt="Profile"
                                  />
                                </span>
                                <span className="ml-4 flex-shrink-0 flex items-center space-x-4">
                                  <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-primary hover:text-primary-active"
                                  >
                                    Update
                                  </button>
                                  <span className="text-gray-300" aria-hidden="true">
                                    |
                                  </span>
                                  <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-primary hover:text-primary-active"
                                  >
                                    Remove
                                  </button>
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <Switch.Group
                          as="div"
                          className="py-4 flex items-center sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200"
                        >
                          <Switch.Label as="dt" className="text-sm font-medium text-gray-500" passive>
                            Receive email updates
                          </Switch.Label>
                          <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <Switch
                              checked={isReceiveEmailUpdates}
                              onChange={setIsReceiveEmailUpdates}
                              className={classNames(
                                isReceiveEmailUpdates ? 'bg-purple-600' : 'bg-gray-200',
                                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 sm:ml-auto',
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  isReceiveEmailUpdates ? 'translate-x-5' : 'translate-x-0',
                                  'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                                )}
                              />
                            </Switch>
                          </dd>
                        </Switch.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <Sidebar>
      {page}
    </Sidebar>
  );
};
