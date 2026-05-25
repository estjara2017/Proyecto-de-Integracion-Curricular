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

const AboutUs = () => {
  const instagramProfileUrl = "https://www.instagram.com/trainingelementalcross?...";

  const carouselSections = [
    {
      id: 'seccion-uno',
      items: [
        { id: 's1-i1', type: 'IMAGE', src: img1, permalink: '...' },
        { id: 's1-i2', type: 'IMAGE', src: img2, permalink: instagramProfileUrl },
        { id: 's2-i1', type: 'IMAGE', src: img3, permalink: '...' },
        { id: 's2-i2', type: 'IMAGE', src: img4, permalink: instagramProfileUrl },
      ]
    },
    {
      id: 'seccion-dos',
      items: [
        { id: 's2-i1', type: 'IMAGE', src: img5, permalink: instagramProfileUrl },
        { id: 's2-i2', type: 'IMAGE', src: img4, permalink: instagramProfileUrl },
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
                    <img src={item.src} alt="Feed Elemental Cross" className={styles.carouselMedia} />
                  ) : (
                    <video src={item.src} className={styles.carouselMedia} autoPlay muted loop playsInline />
                  )}
                  <a href={item.permalink} target="_blank" rel="noopener noreferrer" className={styles.overlay}>
                    <span>Ver en Instagram</span>
                  </a>
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
            <p>Ofrecer un espacio de entrenamiento integral sakjdhasfjkhsdkgjbhsdgfjhsdkjgbsdgbdskgjhdsjkghj</p>
          </section>
          <section className={styles.visionCard}> 
            <h2>Nuestra Visión</h2>
            <p>Ser el centro de acondicionamiento físico referentedskjfhgdskjfghsdkjhfhgdsfgsdkfgdshfgsdhjfghusgdf</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;