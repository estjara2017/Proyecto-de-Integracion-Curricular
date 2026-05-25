import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer'; 
import styles from './Contacts.module.css';

// Eliminado el icono de Telegram
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Contacts = () => {
  const phoneNumber = "593987192799"; 
  const message = "Hola, me interesa agendar mi clase de prueba gratis.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={styles.container}>
      {/* ===== ENCABEZADO GLOBAL ===== */}
      <Header />

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className={styles.mainContent}>
        <div className={styles.contactGrid}>
          
          {/* COLUMNA IZQUIERDA: MAPA */}
          <section className={styles.mapCard}>
            <h3>Nuestra Ubicación</h3>
            <div className={styles.mapWrapper}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.766670624029!2d-78.45319172603132!3d-0.29153823534580253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d597dfb1448089%3A0x7075f44fb2402d58!2sAv.%20de%20los%20Planetas%20625%2C%20Quito!5e0!3m2!1ses-419!2sec!4v1779412528814!5m2!1ses-419!2sec" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Ubicación"
              ></iframe>
            </div>
          </section>

          {/* COLUMNA DERECHA: INFORMACIÓN Y REDES */}
          <section className={styles.infoCard}>
            <h2>¿Cómo encontrarnos?</h2>
            <p>Puedes escribirnos o seguirnos directamente a través de cualquiera de nuestras plataformas oficiales:</p>
            
            {/* Canales de Redes */}
            <div className={styles.directChannels}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                <FaWhatsapp className={styles.icon} /> <span>WhatsApp</span>
              </a>

              <a href="https://www.facebook.com/profile.php?id=61576875033538" target="_blank" rel="noopener noreferrer" className={styles.facebookBtn}>
                <FaFacebookF className={styles.icon} /> <span>Facebook</span>
              </a>

              <a href="https://www.instagram.com/trainingelementalcross?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className={styles.instagramBtn}>
                <FaInstagram className={styles.icon} /> <span>Instagram</span>
              </a>
            </div>

            {/* SECCIÓN DE OFERTA DESTACADA */}
            <div className={styles.offerBadge}>
              <span className={styles.giftIcon}>🎁</span>
              <div className={styles.offerText}>
                <h4>¡Promoción Especial!</h4>
                <p>Gratis clase de prueba</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ===== PIE DE PÁGINA GLOBAL ===== */}
      <Footer />
    </div>
  );
};

export default Contacts;