import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type DropdownProps = {
  options: string[],
  selectedOption: string,
  // eslint-disable-next-line no-unused-vars
  setOption: (option: string) => void,
  required?: boolean,
}

export default function Dropdown({
  options, selectedOption, setOption, required,
}: DropdownProps) {
  return (
    <Listbox value={selectedOption} onChange={setOption}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="flex relative items-center w-full bg-white px-1 pb-2 text-left cursor-default sm:text-sm">
              <span className="block truncate text-gray-800 text-lg font-medium">{selectedOption}</span>
              <ChevronDownIcon className="mt-1 h-5 w-5 text-gray-800" aria-hidden="true" />
              { required
                && <div className="text-sm px-2 py-px bg-pink-100 text-pink-800 rounded-full">Required</div>}
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {options.map((option: string) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) => classNames(
                      active ? 'text-white bg-indigo-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-8 pr-4',
                    )}
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-medium' : 'font-normal', 'block truncate')}>
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 left-0 flex items-center pl-1.5',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
