"use client";

import { useState } from "react";
import Slider from "./Slider";
import Image from "next/image";
import trash from "@/public/trash.svg";
import {
  deselectAllClasses,
  selectAllClasses,
  clearFilters,
  applyFilters,
} from "../actions";

export default function ClassFilter({ allClasses, classNames, polygons }) {
  const [selected, setSelected] = useState([]);

  const allClassesIndexes = allClasses.map((_, i) => `${i}`);

  const dontSelected = allClassesIndexes.filter((el) => !selected.includes(el));

  const handleClearFilters = () => {
    clearFilters();
    setSelected([]);
  };

  const handleClick = (pickedClassIndex) => {
    if (!selected.includes(`${pickedClassIndex}`)) {
      setSelected((prev) => [...prev, `${pickedClassIndex}`]);
      applyFilters([...selected, `${pickedClassIndex}`]);
    } else {
      setSelected((prev) => prev.filter((el) => el !== `${pickedClassIndex}`));
      applyFilters(selected.filter((el) => el !== `${pickedClassIndex}`));
    }
  };

  const handleSelectAllFilters = () => {
    setSelected(dontSelected);
    selectAllClasses();
  };

  const handleDeselectAllFilters = () => {
    setSelected([]);
    deselectAllClasses();
  };

  return (
    <>
      <span className="mt-4 mb-1 font-medium">Classes filter</span>
      <div className="flex justify-between mb-2 text-xs">
        <form action={handleSelectAllFilters}>
          <button
            type="submit"
            disabled={selected.length}
            className={`${
              selected?.length !== 7 ? "text-blue" : "disabled text-gray"
            } cursor-pointer`}
          >
            Select all
          </button>
        </form>
        <form action={handleDeselectAllFilters}>
          <button
            type="submit"
            disabled={!selected.length}
            className={`${
              selected?.length ? "text-blue" : "disabled text-gray"
            } cursor-pointer`}
          >
            Deselect all
          </button>
        </form>
      </div>
      <form>
        <div className="flex flex-wrap">
          {allClasses.map((filter, i) => (
            <div
              name={filter}
              key={filter}
              onClick={() => handleClick(i)}
              className={`relative my-0.5 mr-1.5 py-1 px-3 border rounded-3xl text-xs capitalize ${classNames.at(
                i
              )} ${
                selected?.includes(`${i}`) ? "bg-opacity-50" : "bg-opacity-0"
              }`}
            >
              <input
                value={i}
                type="checkbox"
                name="class"
                className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
              />
              {filter}
            </div>
          ))}
        </div>
      </form>
      <Slider filter={polygons} />
      <form action={handleClearFilters}>
        <div className="flex justify-between my-6">
          <div className="flex items-center cursor-pointer">
            <Image className="mr-1.5" priority src={trash} alt="trash image" />
            <button className="text-sm font-medium" type="submit">
              Clear Filters
            </button>
          </div>
          <span className="text-gray text-sm cursor-pointer">Need help?</span>
        </div>
      </form>
    </>
  );
}
