"use client";

import { useState, useEffect } from "react";
import RCSlider from "rc-slider";
import { applyFilters } from "../actions";

export default function Slider({ filters }) {
  const [polygons, setPolygons] = useState(filters || [0, 4]);

  useEffect(() => {
    applyFilters([], polygons);
  }, [polygons]);

  return (
    <>
      <div className="my-4 font-medium">
        Poligon range
        <div className="flex justify-between">
          <div className="mr-2 font-light">
            min: <span className="font-semibold">{polygons[0]}</span>
          </div>
          <div className="mr-2 font-light">
            max: <span className="font-semibold">{polygons[1]}</span>
          </div>
        </div>
      </div>
      <RCSlider range min={0} max={4} value={polygons} onChange={setPolygons} />
      <input type="hidden" name="polygon" value={polygons[0]} />
      <input type="hidden" name="polygon" value={polygons[1]} />
    </>
  );
}
