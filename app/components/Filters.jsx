import Image from "next/image";
import logo from "@/public/logo.svg";
import ClassFilter from "./ClassFilter";
import { getClasses } from "../lib/S3";

import "rc-slider/assets/index.css";

const classNames = [
  "bg-blue border-blue",
  "bg-green border-green",
  "bg-sea border-sea",
  "bg-yellow border-yellow",
  "bg-red border-red",
  "bg-orange border-orange",
  "bg-purple border-purple",
];

export default async function Filters({ polygons }) {
  const allClasses = await getClasses();

  return (
    <div className="h-full p-6 border border-gray rounded-lg">
      <Image priority src={logo} alt="logo image" />
      <ClassFilter
        allClasses={allClasses}
        classNames={classNames}
        polygons={polygons}
      />
    </div>
  );
}
