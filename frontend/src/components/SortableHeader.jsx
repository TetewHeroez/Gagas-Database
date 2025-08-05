import React from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

const SortableHeader = ({ children, field, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === field;
  const isAsc = isSorted && sortConfig.direction === "asc";
  const isDesc = isSorted && sortConfig.direction === "desc";

  const handleClick = () => {
    let direction = "asc";
    if (isAsc) {
      direction = "desc";
    }
    onSort(field, direction);
  };

  return (
    <th
      scope="col"
      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <span>{children}</span>
        <span className="ml-2">
          {isAsc && <ArrowUp size={14} />}
          {isDesc && <ArrowDown size={14} />}
          {!isSorted && <ChevronsUpDown size={14} className="text-gray-400" />}
        </span>
      </div>
    </th>
  );
};

export default SortableHeader;
