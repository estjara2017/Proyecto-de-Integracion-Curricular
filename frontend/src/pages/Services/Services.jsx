import { useAccordion } from '../../hooks/useAccordion';
import { useCarousel } from '../../hooks/useCarousel'; // 👈 Importación del nuevo hook de carrusel
import Footer from '../../components/Footer/Footer'; 
import styles from './Services.module.css';
import Header from '../../components/Header/Header';

const Services = () => {
  // ================= DATA DEL CONTENEDOR IZQUIERDO: SERVICIOS =================
  const servicesData = [
    {
      id: 1,
      title: "weightlifting",
      description: "Acceso total a nuestra zona de pesas, máquinas de última generación and asesoramiento de entrenadores calificados para cumplir tus objetivos.",
      imageUrl: "/images/servicios/imagen1.png",
      videoUrl: "/videos/servicios/gimnasio.mp4"
    },
    {
      id: 2,
      title: "CROSSFIT",
      description: "Clases de alta intensidad que combinan fuerza, resistencia y comunidad. Supera tus límites todos los días.",
      imageUrl: "/images/servicios/crossfit.jpg",
      videoUrl: null
    },
    {
      id: 3,
      title: "Fuerza",
      description: "Quema calorías, diviértete y mejora tu coordinación al ritmo de la mejor música con instructores llenos de energía.",
      imageUrl: "/images/servicios/bailoterapia.jpg",
      videoUrl: null
    },
    {
      id: 4,
      title: "Acondicionamiento Físico",
      description: "Aprende técnicas de golpeo, defensa personal y mejora tu condición cardiovascular de una manera dinámica y exigente.",
      imageUrl: "/images/servicios/boxeo.jpg",
      videoUrl: null
    }
  ];

  // ================= DATA DEL CONTENEDOR DERECHO: EQUIPOS Y LOCAL =================
  const equipmentData = [
    {
      id: 1,
      title: "Nuestro Local",
      description: "Contamos con caminadoras profesionales, elípticas y bicicletas estáticas con pantallas interactivas para medir tu rendimiento.",
      videoUrl: "/videos/equipos/recorrido-local.mp4",
      carouselSections: [
        {
          images: ["/images/equipos/zona-cardio.jpg", "/images/equipos/peso-libre.jpg"]
        },
        {
          images: ["/images/equipos/nuestro-local.jpg", "/images/equipos/zona-cardio.jpg"]
        }
      ]
    },
    {
      id: 2,
      title: "Equipos",
      description: "Múltiples juegos de mancuernas de alta densidad, barras olímpicas y racks de seguridad adaptados para atletas de todo nivel.",
      equipmentGrid: [
        { name: "Bicicleta", imageUrl: "/images/equipos/bicicleta.jpg" },
        { name: "Máquina de remos", imageUrl: "/images/equipos/remos.jpg" },
        { name: "Accesorios", imageUrl: "/images/equipos/accesorios.jpg" },
        { name: "Pesas", imageUrl: "/images/equipos/pesas.jpg" },
        { name: "Pelotas", imageUrl: "/images/equipos/pelotas.jpg" },
        { name: "Cajas", imageUrl: "/images/equipos/cajas.jpg" }
      ]
    },
    {
      id: 3,
      title: "Extras",
      description: "Instalaciones amplias y climatizadas con vestidores, duchas y áreas de hidratación diseñadas para ofrecerte comodidad absoluta.",
      carouselSections: [
        {
          sectionName: "Cafetería",
          images: ["/images/regalos/regalo1.png", "/images/regalos/regalo2.png"]
        },
        {
          sectionName: "Productos",
          images: ["/images/regalos/regalo3.png", "/images/regalos/regalo4.png"]
        },
        {
          sectionName: "Seguridad",
          images: ["/images/regalos/regalo2.png", "/images/regalos/regalo4.png"]
        }
      ]
    }
  ];

  const [activeService, toggleService] = useAccordion(null);
  const [activeEquipment, toggleEquipment] = useAccordion(null);

  // ================= IMPLEMENTACIÓN DEL CUSTOM HOOK =================
  // Instancia 1: Controla el carrusel de "Nuestro Local" (2 secciones, corre si el acordeón id 1 está abierto)
  const { 
    currentIndex: currentLocalIdx, 
    nextSlide: handleLocalNext, 
    prevSlide: handleLocalPrev, 
    goToSlide: goToLocalSlide 
  } = useCarousel(2, 4000, activeEquipment === 1);

  // Instancia 2: Controla el carrusel de "Extras" (3 secciones, corre si el acordeón id 3 está abierto)
  const { 
    currentIndex: currentExtrasIdx, 
    nextSlide: handleExtrasNext, 
    prevSlide: handleExtrasPrev, 
    goToSlide: goToExtrasSlide 
  } = useCarousel(3, 4500, activeEquipment === 3);


  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.splitLayoutContainer}>
          
          {/* ================= CONTENEDOR IZQUIERDO (SERVICIOS) ================= */}
          <div className={styles.columnWrapper}>
            <h1 className={styles.sectionTitle}>NUESTROS SERVICIOS</h1>
            <div className={styles.accordionContainer}>
              {servicesData.map((service) => {
                const isOpen = activeService === service.id;
                return (
                  <div 
                    key={service.id} 
                    className={styles.serviceItem}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className={`${styles.serviceHeader} ${isOpen ? styles.activeHeader : ''}`}>
                      <span className={styles.serviceTitleText}>{service.title}</span>
                      <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                    </div>

                    <div className={`${styles.dropdownContent} ${isOpen ? styles.open : ''}`}>
                      <div className={styles.cardBody}>
                        <p className={styles.serviceDescription}>{service.description}</p>
                        <div className={styles.mediaContainer}>
                          {service.imageUrl && (
                            <img src={service.imageUrl} alt={service.title} className={styles.serviceImage} />
                          )}
                          {service.videoUrl && (
                            <video src={service.videoUrl} controls className={styles.serviceVideo} muted />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={styles.finalLine}></div>
            </div>
          </div>

          {/* ================= CONTENEDOR DERECHO SIMÉTRICO (EQUIPOS Y LOCAL) ================= */}
          <div className={styles.columnWrapper}>
            <h1 className={styles.sectionTitleRight}>EQUIPOS Y LOCAL</h1>
            <div className={styles.accordionContainer}>
              {equipmentData.map((item) => {
                const isOpen = activeEquipment === item.id;
                const isLocal = item.id === 1;
                const isEquipments = item.id === 2;
                const isExtras = item.id === 3;

                return (
                  <div 
                    key={item.id} 
                    className={styles.serviceItem}
                    onClick={() => toggleEquipment(item.id)}
                  >
                    <div className={`${styles.serviceHeaderInverse} ${isOpen ? styles.activeHeader : ''}`}>
                      <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                      <span className={styles.serviceTitleText}>{item.title}</span>
                    </div>

                    <div className={`${styles.dropdownContent} ${isOpen ? (isEquipments ? styles.openGrid : (isLocal || isExtras) ? styles.openCarousel : styles.open) : ''}`}>
                      <div className={styles.cardBody}>
                        <p className={styles.serviceDescription}>{item.description}</p>
                        
                        {/* ================= CASO 1: CARRUSEL DINÁMICO EN NUESTRO LOCAL ================= */}
                        {isLocal && item.carouselSections && (
                          <div className={styles.carouselWrapper} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.carouselViewport}>
                              <button type="button" className={`${styles.arrowButton} ${styles.leftArrow}`} onClick={handleLocalPrev}>‹</button>
                              
                              <div className={styles.carouselGrid}>
                                {item.carouselSections[currentLocalIdx].images.map((img, idx) => (
                                  <div key={idx} className={styles.carouselImageCard}>
                                    <img src={img} alt={`Local Section ${currentLocalIdx} - ${idx}`} />
                                  </div>
                                ))}
                              </div>

                              <button type="button" className={`${styles.arrowButton} ${styles.rightArrow}`} onClick={handleLocalNext}>›</button>
                            </div>

                            <div className={styles.carouselDots}>
                              {[0, 1].map((dotIdx) => (
                                <span 
                                  key={dotIdx} 
                                  className={`${styles.dot} ${currentLocalIdx === dotIdx ? styles.activeDot : ''}`}
                                  onClick={() => goToLocalSlide(dotIdx)} // Usa la función directa del hook
                                />
                              ))}
                            </div>

                            {item.videoUrl && (
                              <div className={styles.standaloneVideoContainer}>
                                <video src={item.videoUrl} controls className={styles.serviceVideo} muted />
                              </div>
                            )}
                          </div>
                        )}

                        {/* ================= CASO 2: REJILLA DE 6 EQUIPOS (ESTÁTICA) ================= */}
                        {isEquipments && item.equipmentGrid && (
                          <div className={styles.equipmentGridContainer} onClick={(e) => e.stopPropagation()}>
                            {item.equipmentGrid.map((equipment, index) => (
                              <div key={index} className={styles.equipmentCard}>
                                <div className={styles.equipmentImageWrapper}>
                                  <img src={equipment.imageUrl} alt={equipment.name} className={styles.equipmentGridImage} />
                                </div>
                                <span className={styles.equipmentNameText}>{equipment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ================= CASO 3: CARRUSEL CON SECCIONES EN EXTRAS ================= */}
                        {isExtras && item.carouselSections && (
                          <div className={styles.carouselWrapper} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.sectionIndicatorName}>
                              {item.carouselSections[currentExtrasIdx].sectionName}
                            </div>

                            <div className={styles.carouselViewport}>
                              <button type="button" className={`${styles.arrowButton} ${styles.leftArrow}`} onClick={handleExtrasPrev}>‹</button>
                              
                              <div className={styles.carouselGrid}>
                                {item.carouselSections[currentExtrasIdx].images.map((img, idx) => (
                                  <div key={idx} className={styles.carouselImageCard}>
                                    <img src={img} alt={`Extra ${item.carouselSections[currentExtrasIdx].sectionName} - ${idx}`} />
                                  </div>
                                ))}
                              </div>

                              <button type="button" className={`${styles.arrowButton} ${styles.rightArrow}`} onClick={handleExtrasNext}>›</button>
                            </div>

                            <div className={styles.carouselDots}>
                              {[0, 1, 2].map((dotIdx) => (
                                <span 
                                  key={dotIdx} 
                                  className={`${styles.dot} ${currentExtrasIdx === dotIdx ? styles.activeDot : ''}`}
                                  onClick={() => goToExtrasSlide(dotIdx)} // Usa la función directa del hook
                                />
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={styles.finalLine}></div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;