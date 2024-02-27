import Link from "next/link";
import { getAlbums } from "../lib/S3";

export default async function Header({ selectedTab, total }) {
  const albums = await getAlbums();

  return (
    <div className="mb-2">
      <div className="m-2 flex text-2xl font-semibold justify-between">
        <div>Bone-fracture-detection</div>
        <div>
          <b>{total}</b> of <b>{total}</b> images
        </div>
      </div>
      {["all", ...albums].map((tab) => (
        <Link
          key={tab}
          href={tab}
          className={`px-5 py-1 border-b ${
            selectedTab === tab
              ? "text-yellow  bg-yellow bg-opacity-20 border-yellow"
              : "border-gray"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Link>
      ))}
    </div>
  );
}
