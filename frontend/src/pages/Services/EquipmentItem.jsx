import { useCarousel } from '../../hooks/useCarousel';
import styles from './Services.module.css';

const EquipmentItem = ({ item, isOpen, onToggle }) => {
  const isLocal = item.id === 1;
  const isEquipments = item.id === 2;
  const isExtras = item.id === 3;
  const carouselLength = item.carouselSections?.length || 0;

  const localCarousel = useCarousel(carouselLength, 4000, isLocal && isOpen);
  const extrasCarousel = useCarousel(carouselLength, 4500, isExtras && isOpen);

  return (
    <div className={styles.serviceItem} onClick={onToggle}>
      <div className={`${styles.serviceHeaderInverse} ${isOpen ? styles.activeHeader : ''}`}>
        <span className={styles.icon}>{isOpen ? '-' : '+'}</span>
        <span className={styles.serviceTitleText}>{item.title}</span>
      </div>

      <div className={`${styles.dropdownContent} ${isOpen ? (isEquipments ? styles.openGrid : (isLocal || isExtras) ? styles.openCarousel : styles.open) : ''}`}>
        <div className={styles.cardBody}>
          <p className={styles.serviceDescription}>{item.description}</p>

          {isLocal && item.carouselSections && (
            <div className={styles.carouselWrapper} onClick={(e) => e.stopPropagation()}>
              <div className={styles.carouselViewport}>
                <button type="button" className={`${styles.arrowButton} ${styles.leftArrow}`} onClick={localCarousel.prevSlide}>
                  {'<'}
                </button>
                <div className={styles.carouselGrid}>
                  {item.carouselSections[localCarousel.currentIndex].images.map((img, idx) => (
                    <div key={`${img}-${idx}`} className={styles.carouselImageCard}>
                      <img src={img} alt={`Local ${idx + 1}`} />
                    </div>
                  ))}
                </div>
                <button type="button" className={`${styles.arrowButton} ${styles.rightArrow}`} onClick={localCarousel.nextSlide}>
                  {'>'}
                </button>
              </div>
              <div className={styles.carouselDots}>
                {item.carouselSections.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`${styles.dot} ${localCarousel.currentIndex === dotIdx ? styles.activeDot : ''}`}
                    onClick={() => localCarousel.goToSlide(dotIdx)}
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

          {isEquipments && item.equipmentGrid && (
            <div className={styles.equipmentGridContainer} onClick={(e) => e.stopPropagation()}>
              {item.equipmentGrid.map((equipment, index) => (
                <div key={`${equipment.name}-${index}`} className={styles.equipmentCard}>
                  <div className={styles.equipmentImageWrapper}>
                    <img src={equipment.imageUrl} alt={equipment.name} className={styles.equipmentGridImage} />
                  </div>
                  <span className={styles.equipmentNameText}>{equipment.name}</span>
                </div>
              ))}
            </div>
          )}

          {isExtras && item.carouselSections && (
            <div className={styles.carouselWrapper} onClick={(e) => e.stopPropagation()}>
              <div className={styles.sectionIndicatorName}>
                {item.carouselSections[extrasCarousel.currentIndex].sectionName}
              </div>
              <div className={styles.carouselViewport}>
                <button type="button" className={`${styles.arrowButton} ${styles.leftArrow}`} onClick={extrasCarousel.prevSlide}>
                  {'<'}
                </button>
                <div className={styles.carouselGrid}>
                  {item.carouselSections[extrasCarousel.currentIndex].images.map((img, idx) => (
                    <div key={`${img}-${idx}`} className={styles.carouselImageCard}>
                      <img src={img} alt={`Extra ${idx + 1}`} />
                    </div>
                  ))}
                </div>
                <button type="button" className={`${styles.arrowButton} ${styles.rightArrow}`} onClick={extrasCarousel.nextSlide}>
                  {'>'}
                </button>
              </div>
              <div className={styles.carouselDots}>
                {item.carouselSections.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`${styles.dot} ${extrasCarousel.currentIndex === dotIdx ? styles.activeDot : ''}`}
                    onClick={() => extrasCarousel.goToSlide(dotIdx)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentItem;
