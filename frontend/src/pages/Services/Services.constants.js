// Services.constants.js
import videoWeightlifting from '../../assets/weightlifting.mp4';

export const SERVICES_DATA = [
  {
    id: 1,
    title: "weightlifting",
    description: "Entrenamiento de halterofilia o levantamiento de pesas olimpico, haz como Neisi Dajomes.",
    imageUrl: "/images/servicios/imagen1.png",
    videoUrl: videoWeightlifting
  },
  {
    id: 2,
    title: "CROSSFIT",
    description: "Acondicionamiento físico basado en movimientos funcionales, variados y de alta intensidad. Supera tus límites todos los días.",
    imageUrl: "/images/servicios/crossfit.jpg",
    videoUrl: null
  },
  {
    id: 3,
    title: "Fuerza",
    description: "Desarrolla fuerza máxima y explosiva",
    imageUrl: "/images/servicios/bailoterapia.jpg",
    videoUrl: null
  },
  {
    id: 4,
    title: "Acondicionamiento Físico",
    description: "Mejora tu rendimiento, salud y bienestar general mediante el ejercicio regular.",
    imageUrl: "/images/servicios/boxeo.jpg",
    videoUrl: null
  }
];

export const EQUIPMENT_DATA = [
  {
    id: 1,
    title: "Nuestro Local",
    description: "Contamos con caminadoras profesionales, elípticas y bicicletas estáticas con pantallas interactivas para medir tu rendimiento.",
    videoUrl: "/videos/equipos/recorrido-local.mp4",
    carouselSections: [
      { images: ["/images/equipos/zona-cardio.jpg", "/images/equipos/peso-libre.jpg"] },
      { images: ["/images/equipos/nuestro-local.jpg", "/images/equipos/zona-cardio.jpg"] }
    ]
  },
  {
    id: 2,
    title: "Equipos",
    description: "Múltiples juegos de mancuernas y pesas de alta densidad, barras olímpicas, maquinas y accesorios. Para que tu entrenamiento este garantizado ",
    equipmentGrid: [
      { name: "Bicicleta", imageUrl: "/images/equipos/bicicleta.jpeg" },
      { name: "Máquina de remos", imageUrl: "/images/equipos/remos.jpeg" },
      { name: "Accesorios", imageUrl: "/images/equipos/accesorios.jpeg" },
      { name: "Pesas", imageUrl: "/images/equipos/pesas.jpeg" },
      { name: "Pelotas", imageUrl: "/images/equipos/pelotas.jpeg" },
      { name: "Trineo", imageUrl: "/images/equipos/trineo.jpeg" }
    ]
  },
  {
    id: 3,
    title: "Extras",
    description: "Instalaciones amplias y climatizadas con vestidores, duchas y áreas de hidratación diseñadas para ofrecerte comodidad absoluta.",
    carouselSections: [
      { sectionName: "Cafetería", images: ["/images/servicios/extra1.jpeg", "/images/servicios/extra2.jpeg"] },
      { sectionName: "Productos", images: ["/images/productos/producto3.png", "/images/productos/producto4.jpeg"] },
      { sectionName: "Seguridad", images: ["/images/equipos/extra.jpeg", "/images/equipos/extra4.jpeg"] }
    ]
  }
];