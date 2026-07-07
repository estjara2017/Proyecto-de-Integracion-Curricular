
import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer'; 
import styles from './AboutUs.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCarousel } from '../../hooks/useCarousel';

import img1 from '../../assets/imagen1.png';
import img2 from '../../assets/imagen2.png';
import img3 from '../../assets/imagen3.png';
import img4 from '../../assets/imagen4.png';
import img5 from '../../assets/imagen5.png';
import producto3 from '../../assets/producto3.jpeg';
import extra4 from '../../assets/extra4.jpeg';
import extra1 from '../../assets/extra1.jpeg';

const AboutUs = () => {

  const carouselSections = [
    {
      id: 'seccion-uno',
      items: [
        { id: 's1-i1', type: 'IMAGE', src: img1 },
        { id: 's1-i2', type: 'IMAGE', src: img2 },
        { id: 's2-i1', type: 'IMAGE', src: img3 },
        { id: 's2-i2', type: 'IMAGE', src: img4 },
      ]
    },
    {
      id: 'seccion-dos',
      items: [
        { id: 's2-i1', type: 'IMAGE', src: img5 },
        { id: 's2-i2', type: 'IMAGE', src: producto3 },
        { id: 's2-i3', type: 'IMAGE', src: extra4 },
        { id: 's2-i4', type: 'IMAGE', src: extra1 },
      ]
    }
  ];

  const { 
    currentIndex: currentSection, 
    nextSlide: nextSection, 
    prevSlide: prevSection, 
    goToSlide 
  } = useCarousel(carouselSections.length, 4000);

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h1>Conócenos</h1>
          <h2>Nunca es tarde para cumplir tus metas</h2>
        </div>

        <section className={styles.carouselSection}>
          <h3>momentos inolvidables</h3>
          
          <div className={styles.carouselWrapper}>
            <button className={styles.navButton} onClick={prevSection} aria-label="Anterior">
              <FaChevronLeft />
            </button>

            <div className={styles.instagramGrid}>
              {carouselSections[currentSection].items.map((item) => (
                <div key={item.id} className={styles.mediaContainer}>
                  {item.type === 'IMAGE' ? (
                    <img src={item.src} alt="Momento Elemental Cross" className={styles.carouselMedia} />
                  ) : (
                    <video src={item.src} className={styles.carouselMedia} autoPlay muted loop playsInline />
                  )}
                </div>
              ))}
            </div>

            <button className={styles.navButton} onClick={nextSection} aria-label="Siguiente">
              <FaChevronRight />
            </button>
          </div>

          <div className={styles.indicators}>
            {carouselSections.map((_, index) => (
              <span 
                key={index} 
                className={`${styles.dot} ${currentSection === index ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)} 
              />
            ))}
          </div>
        </section>

        <div className={styles.aboutGrid}>
          <section className={styles.misionCard}>
            <h2>Nuestra Misión</h2>
            <p>Promover una metodología de enseñanza diferente e innovadora donde nuestro enfoque es el bienestar de la comunidad en el entrenamiento de Crossfit.</p>
          </section>
          <section className={styles.visionCard}> 
            <h2>Nuestra Visión</h2>
            <p>Llegar a ser un lugar de entrenamiento único, donde la enseñanza sea base fundamental para la comunidad, brindando más confianza en salud y seguridad especializado en el entrenamiento de Crossfit, llegar a crecer en mas zonas donde nuestra forma de entrenamiento sea diferente. </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
