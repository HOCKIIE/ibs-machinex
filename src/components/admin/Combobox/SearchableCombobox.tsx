'use client';

import { Combobox } from '@headlessui/react';
import { useState } from 'react';
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { IoCheckmark, IoChevronDownOutline } from "react-icons/io5";

type Option = {
    id: number;
    name: string;
};

type Props = {
    options: Option[];
    value: Option | null;
    onChange: (value: Option) => void;
    errors: object;
};

export default function SearchableCombobox({ options, value, onChange }: Props) {
    const [query, setQuery] = useState('');

    const filteredOptions =
        query === ''
        ? options
        : options.filter((person) => person.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox value={value} onChange={onChange}>
        <div className="relative mt-1">
            <div className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 text-left focus:outline-none focus:ring-3 focus:ring-indigo-300 sm:text-sm">
            <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-white bg-transparent focus:ring-0 rounded-lg"
                displayValue={(person: Option) => person?.name ?? ''}
                onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <IoChevronDownOutline
                className="h-5 w-5 text-gray-400 dark:text-gray-300"
                aria-hidden="true"
                />
            </Combobox.Button>
            </div>
            {filteredOptions.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions.map((person) => (
                <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100'
                    }`
                    }
                    value={person}
                >
                    {({ selected, active }) => (
                    <>
                        <span
                        className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                        }`}
                        >
                        {person.name}
                        </span>
                        {selected ? (
                        <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-indigo-600'
                            }`}
                        >
                            <IoCheckmark className="h-5 w-5" aria-hidden="true" />
                        </span>
                        ) : null}
                    </>
                    )}
                </Combobox.Option>
                ))}
            </Combobox.Options>
            )}
        </div>
    </Combobox>
    );
}
