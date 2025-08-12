"use client";
import { carMinimalAtom } from "@/jotai/carAtom";
import carService from "@/services/carService";
import { useQuery } from "@tanstack/react-query";

import { useSetAtom } from "jotai";

export function useCarMinimal() {
  const setCarMinimal = useSetAtom(carMinimalAtom);

  const query = useQuery({
    queryKey: ["cars-minimal"],
    queryFn: () => carService.getAllCarsMinimal(),
    staleTime: 1000 * 60 * 10, // cache 10 phút
  });

  // Handle side effects after data is fetched
  if (query.data?.success && query.data?.data) {
    setCarMinimal(query.data.data);
  }

  return query;
}
