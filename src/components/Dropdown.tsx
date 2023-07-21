import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
  buttonText: string;
  children: React.ReactNode; // Include children prop in the interface
}

const Dropdown: React.FC<DropdownProps> = ({ buttonText, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative pb-3 pt-3">
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex items-center w-full md:w-auto"
        type="button"
      >
        {buttonText}
        <svg
          className={`w-2.5 h-2.5 ml-2.5 transform transition-transform absolute right-5 md:relative md:right-0 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          id="dropdown"
          className="z-10 absolute top-full left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-full md:w-44 dark:bg-gray-700"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
