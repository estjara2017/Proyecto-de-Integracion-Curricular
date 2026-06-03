// Services.jsx
import { useAccordion } from '../../hooks/useAccordion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'; 
import EquipmentItem from './EquipmentItem';
import { SERVICES_DATA, EQUIPMENT_DATA } from './Services.constants';
import styles from './Services.module.css';

const Services = () => {
  const [activeService, toggleService] = useAccordion(null);
  const [activeEquipment, toggleEquipment] = useAccordion(null);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.splitLayoutContainer}>
          
          {/* ================= CONTENEDOR IZQUIERDO (SERVICIOS) ================= */}
          <div className={styles.columnWrapper}>
            <h1 className={styles.sectionTitle}>NUESTROS SERVICIOS</h1>
            <div className={styles.accordionContainer}>
              {SERVICES_DATA.map((service) => {
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

          {/* ================= CONTENEDOR DERECHO (EQUIPOS Y LOCAL) ================= */}
          <div className={styles.columnWrapper}>
            <h1 className={styles.sectionTitleRight}>EQUIPOS Y LOCAL</h1>
            <div className={styles.accordionContainer}>
              {EQUIPMENT_DATA.map((item) => (
                <EquipmentItem
                  key={item.id}
                  item={item}
                  isOpen={activeEquipment === item.id}
                  onToggle={() => toggleEquipment(item.id)}
                />
              ))}
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