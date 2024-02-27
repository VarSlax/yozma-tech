import { Suspense } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import Filters from "../components/Filters";
import { getImages } from "../lib/S3";
import Loading from "./loading";

const Canvas = dynamic(() => import("@/app/components/Canvas"), {
  ssr: false,
});

export default async function Page({
  params: { album },
  searchParams: { classes, polygons },
}) {
  const images = await getImages(album, classes, polygons);
  return (
    <div className="flex p-12 ">
      <div className="w-1/3">
        <Filters classes={classes} polygons={polygons} />
      </div>
      <div className="w-full">
        <div className="mx-12 my-5 max-h-screen overflow-auto">
          <Header selectedTab={album} total={images.length} />
          <Suspense fallback={<Loading />}>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.name} className="truncate">
                  <div className="relative aspect-square">
                    <Canvas {...image} />
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
