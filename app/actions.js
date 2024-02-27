"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const applyFilters = (classes, polygons = [0, 4]) => {
  const { pathname, searchParams } = new URL(headers().get("referer"));

  const params = new URLSearchParams({
    classes: classes ?? searchParams.get("classes"),
    polygons: polygons ?? searchParams.get("polygons"),
  });

  redirect(`${pathname}?${params}`);
};

export const selectAllClasses = () =>
  applyFilters(["0", "1", "2", "3", "4", "5", "6"]);

export const deselectAllClasses = () => applyFilters([]);

export const clearFilters = () => {
  const { pathname } = new URL(headers().get("referer"));
  redirect(pathname);
};
