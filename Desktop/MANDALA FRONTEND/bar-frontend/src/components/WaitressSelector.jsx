import React from "react";
import { Button } from "@/components/ui/button";

const meseras = [
  "María González",
  "Ana Rodríguez",
  "Carmen López",
  "Sofía Martínez",
  "Valentina Torres",
];

export default function WaitressSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {meseras.map((nombre, i) => (
        <Button
          key={i}
          className="bg-purple-800 hover:bg-purple-600 text-white"
          onClick={() => onSelect(nombre)}
        >
          {nombre}
        </Button>
      ))}
      <Button className="col-span-2 bg-gray-700 hover:bg-gray-500 text-white">
        + Otro nombre
      </Button>
    </div>
  );
}
