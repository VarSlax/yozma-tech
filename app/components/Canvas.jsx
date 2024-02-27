"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Shape, Layer, Image } from "react-konva";
import useImage from "use-image";

export default function Canvas({ name, url, polygons }) {
  const [image] = useImage(url);
  const [size, setSize] = useState(0);

  const ref = useRef(null);
  const shift = -((image?.height ?? size) - size) / 2;

  useEffect(() => {
    setSize(ref.current.clientWidth);
  }, []);

  return (
    <div className="relative aspect-square w-92" ref={ref}>
      <Stage width={size} height={size}>
        <Layer>
          <Image alt={name} image={image} width={size} y={shift} />
          {polygons?.map(({ type, coordinates }, i) => (
            <Shape
              key={i}
              y={shift}
              sceneFunc={(context, shape) => {
                if (!coordinates.length) {
                  return;
                }

                const [[x, y], ...points] = coordinates.map(([x, y]) => [
                  x * size,
                  y * (image?.height ?? size),
                ]);

                context.beginPath();
                context.moveTo(x, y);
                points.forEach(([x, y]) => context.lineTo(x, y));
                context.closePath();
                context.fillStrokeShape(shape);
              }}
              fill="#00D2FF40"
              stroke="#00D2FF"
              strokeWidth={1}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
