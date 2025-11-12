import React from "react";

export default function WaitressSelector({ meseras, onSelect, onAdd }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {meseras.map((mesera) => (
        <button
          key={mesera.id}
          className="w-full bg-purple-800 hover:bg-purple-600 text-white justify-center py-3 px-4 rounded-lg transition"
          onClick={() => onSelect(mesera)}
        >
          {mesera.nombre}
        </button>
      ))}
      <button
        onClick={onAdd}
        className="col-span-2 bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-lg w-full transition"
      >
        + Otro nombre
      </button>
    </div>
  );
}
