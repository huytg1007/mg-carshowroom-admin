import { atom } from "jotai";
import { CarMinimal } from "@/interfaces/carInterface";

export const carMinimalAtom = atom<CarMinimal[] | null>(null);
