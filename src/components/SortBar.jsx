import { useState } from "react";

export default function SortBar({ onChange }) {
  const [sort, setSort] = useState("name");

  function handleChange(e) {
    const value = e.target.value;
    setSort(value);
    onChange(value);
  }

  return (
    <select
      value={sort}
      onChange={handleChange}
      className="border p-2 rounded w-full sm:w-40"
    >
      <option value="name">Name</option>
      <option value="size">Size</option>
      <option value="date">Date</option>
    </select>
  );
}
