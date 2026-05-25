import { useState } from 'react';

/**
 * Custom Hook para controlar la lógica de apertura y cierre de acordeones.
 * @param {any} initialState - ID del elemento abierto por defecto (null si todos inician cerrados).
 */
export function useAccordion(initialState = null) {
  const [activeId, setActiveId] = useState(initialState);

  const toggle = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  // Retorna el ID activo y la función para alternar su estado
  return [activeId, toggle];
}