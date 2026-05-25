import { useState, useEffect } from 'react';

/**
 * Hook personalizado para controlar cualquier carrusel con flechas e intervalo automático.
 * @param {number} totalItems - Cantidad total de secciones/slides que tiene el carrusel.
 * @param {number} intervalTime - Tiempo en milisegundos para el cambio automático (por defecto 4000ms).
 * @param {boolean} isActive - Condición para activar el autoplay (útil para acordeones abiertos).
 */
export const useCarousel = (totalItems, intervalTime = 4000, isActive = true) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Control del temporizador automático
  useEffect(() => {
    if (!isActive || totalItems <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isActive, totalItems, intervalTime]);

  // Funciones de navegación manual
  const nextSlide = (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return { currentIndex, nextSlide, prevSlide, goToSlide };
};