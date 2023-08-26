/* eslint-disable react-hooks/exhaustive-deps */
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

const AutoCompleteBooking = ({
  label = "",
  textWidth = "w-full",
  ulWidth = "w-full",
  data = [],
  selectedData = {},
  queryData = false,
  isClear = false,
  filterTxt = null,
}) => {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [bgWarning, setBgWarning] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((data) =>
          data.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const checkClear = (obj) => {
    if (!isClear) {
      return obj.description;
    }
    return "";
  };

  useEffect(() => {
    selectedData(selected);
  }, [selected]);

  useEffect(() => {
    if (query.length > 0) queryData(query);
  }, [query]);

  useEffect(() => {
    let a = data.filter((x) => x.id === filterTxt);
    if (a.length > 0) {
      setSelected(data[a[0].rnn]);
    }
  }, [filterTxt]);

  return (
    <>
      {label.length > 0 ? <div className="pt-3">{label}:</div> : null}
      <>
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg shadow text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className={`border-none ${textWidth} py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 ${bgWarning}`}
                displayValue={(obj) => obj.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options
                className={`absolute z-50 mt-1 max-h-60 ${ulWidth} overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
              >
                {filteredData.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredData.map((data) => (
                    <Combobox.Option
                      key={data.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-4 pr-4 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={data}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {data.name}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </>
    </>
  );
};

export default AutoCompleteBooking;
