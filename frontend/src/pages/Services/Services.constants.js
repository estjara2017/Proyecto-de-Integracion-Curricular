import videoWeightlifting from '../../assets/weightlifting.mp4';
import videoLocal from '../../assets/local.mp4';
import weightliftingImage from '../../assets/servicio1.png';
import localExtraImage from '../../assets/extra1.jpeg';
import localMainImage from '../../assets/imagen1.png';

const crossfitImage =
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80';
const strengthImage =
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80';
const conditioningImage =
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80';

export const SERVICES_DATA = [
  {
    id: 1,
    title: 'WEIGHTLIFTING',
    description:
      'Entrenamiento de halterofilia y levantamiento olimpico para mejorar tecnica, potencia y control.',
    imageUrl: weightliftingImage,
    imagePosition: 'center 18%',
    videoUrl: videoWeightlifting
  },
  {
    id: 2,
    title: 'CROSSFIT',
    description:
      'Movimientos funcionales, variados y de alta intensidad para desarrollar fuerza, resistencia y agilidad.',
    imageUrl: crossfitImage,
    imagePosition: 'center 45%',
    videoUrl: null
  },
  {
    id: 3,
    title: 'FUERZA',
    description:
      'Trabajo progresivo con cargas para construir fuerza maxima, estabilidad y tecnica segura.',
    imageUrl: strengthImage,
    imagePosition: 'center 35%',
    videoUrl: null
  },
  {
    id: 4,
    title: 'ACONDICIONAMIENTO FISICO',
    description:
      'Sesiones enfocadas en rendimiento cardiovascular, movilidad y resistencia para tu entrenamiento diario.',
    imageUrl: conditioningImage,
    imagePosition: 'center 45%',
    videoUrl: null
  }
];

export const EQUIPMENT_DATA = [
  {
    id: 1,
    title: 'Nuestro Local',
    description:
      'Espacios equipados para entrenamientos funcionales, fuerza, tecnica y preparacion fisica.',
    videoUrl: videoLocal,
    carouselSections: [
      { images: [localExtraImage, localMainImage] },
      { images: ['/images/equipos/extra4.jpeg'] }
    ]
  },
  {
    id: 2,
    title: 'Equipos',
    description:
      'Multiples juegos de mancuernas y pesas de alta densidad, barras olimpicas, maquinas y accesorios para entrenar con seguridad.',
    equipmentGrid: [
      { name: 'Bicicleta', imageUrl: '/images/equipos/bicicleta.jpeg' },
      { name: 'Maquina de remos', imageUrl: '/images/equipos/remos.jpeg' },
      { name: 'Accesorios', imageUrl: '/images/equipos/accesorios.jpeg' },
      { name: 'Pesas', imageUrl: '/images/equipos/pesas.jpeg' },
      { name: 'Pelotas', imageUrl: '/images/equipos/pelotas.jpeg' },
      { name: 'Trineo', imageUrl: '/images/equipos/trineo.jpeg' }
    ]
  },
  {
    id: 3,
    title: 'Extras',
    description:
      'Contamos con cafeteria, sistema de video-vigilancia, tambien ofrecemos productos como camisetas, toma todos, entre otros ',
    carouselSections: [
      { sectionName: 'Cafeteria', images: ['/images/servicios/extra1.jpeg', '/images/servicios/extra2.jpeg'] },
      { sectionName: 'Productos', images: ['/images/productos/producto3.png', '/images/productos/producto4.jpeg'] },
      { sectionName: 'Seguridad', images: ['/images/equipos/extra.jpeg', '/images/equipos/extra4.jpeg'] }
    ]
  }
];
