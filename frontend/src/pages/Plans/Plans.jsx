import { useNavigate } from 'react-router-dom';
import { useAccordion } from '../../hooks/useAccordion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Plans.module.css';

// 📦 Importación de las dos imágenes fijas desde assets
import producto1 from '../../assets/producto1.jpeg'; 
import producto2 from '../../assets/producto2.jpeg';

const Plan = () => {
  const navigate = useNavigate();

  // ================= DATA PLANES (IZQUIERDA) =================
  const plansData = [
    { id: 1, title: "Diarios", description: "Entrena cuando puedas en una clase de 1 hora diaria.", price: "4.50" },
    { id: 2, title: "Semanal", description: "Entrenamiento de 12 clases seguidas, escoge el meses que deseas entrenar.", price: "40" },
    { 
      id: 3, 
      title: "Mensual", 
      description: "Desarrolla tu disciplina entrenando todo un mes.", 
      requirement: "Debes cumplir al menos 5 días a la semana.",
      highlightRequirement: true,
      price: "50" 
    },
    { 
      id: 4, 
      title: "Trimestral", 
      description: "Sigue avanzando en tu físico. Entrena durante 3 meses seguidos, con flexibilidad de horario.", 
      requirement: "Debes cumplir al menos 5 días a la semana.",
      highlightRequirement: true,
      price: "135" 
    },
    { 
      id: 5, 
      title: "Semestral", 
      description: "Entrenamiento completo de 6 meses, con flexibilidad de horario.", 
      requirement: "Debes cumplir al menos 5 días a la semana.",
      highlightRequirement: true,
      price: "240" 
    },
    { 
      id: 6, 
      title: "Anual", 
      description: "Alcanza el nivel máximo. Entrenamiento completo por 1 año.", 
      requirement: "Debes cumplir al menos 5 días a la semana.",
      highlightRequirement: true,
      price: "450" 
    }
  ];

  // ================= DATA BENEFICIOS (DERECHA) =================
  const benefitsData = [
    { id: 1, title: "Sin costo de inscripción", description: "Acceso total sin compromiso en tu prueba gratuita." },
    {
      id: 2,
      title: "Obsequio de bienvenida",
      description: "Recibe uno de estos obsequios al adquirir tu plan.",
      /* 🚀 Extraemos la nota para darle el estilo diferente */
      note: "A partir del plan trimestral.",
      highlightNote: true,
      images: [producto1, producto2]
    },
    { id: 3, title: "Descuentos", description: "10% de descuento si traes a un acompañante." }
  ];

  const [activePlan, togglePlan] = useAccordion(null);
  const [activeBenefit, toggleBenefit] = useAccordion(null);

  const handlePriceClick = (e) => {
    e.stopPropagation(); 
    navigate('/register', { 
      state: { message: "Para adquirir un plan, primero debes crear una cuenta o iniciar sesión." } 
    });
  };

  return (
    <>
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.splitContainer}>

          {/* ================= IZQUIERDA: PLANES ================= */}
          <div className={styles.column}>
            <h1 className={styles.title}>PLANES</h1>

            <div className={styles.accordion}>
              {plansData.map(plan => {
                const isOpen = activePlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={styles.item}
                    onClick={() => togglePlan(plan.id)}
                  >
                    <div className={`${styles.header} ${isOpen ? styles.activeHeader : ''}`}>
                      <span className={styles.serviceTitleText}>{plan.title}</span>
                      <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                    </div>

                    <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
                      <div className={styles.cardPlans}>
                        <div className={styles.planInfoText}>
                          <p>{plan.description}</p>
                          {plan.highlightRequirement && (
                            <span className={styles.requirementBadge}>
                              ⚠️ <strong>Nota:</strong> {plan.requirement}
                            </span>
                          )}
                        </div>
                        <div 
                          className={styles.priceBox} 
                          onClick={handlePriceClick}
                          style={{ cursor: 'pointer' }} 
                          title="Haz clic para registrarte"
                        >
                          ${plan.price}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= DERECHA: BENEFICIOS ================= */}
          <div className={styles.column}>
            <h1 className={styles.titleRight}>BENEFICIOS Y DESCUENTOS</h1>

            <div className={styles.accordion}>
              {benefitsData.map(item => {
                const isOpen = activeBenefit === item.id;

                return (
                  <div
                    key={item.id}
                    className={styles.item}
                    onClick={() => toggleBenefit(item.id)}
                  >
                    <div className={`${styles.headerInverse} ${isOpen ? styles.activeHeader : ''}`}>
                      <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                      <span className={styles.serviceTitleText}>{item.title}</span>
                    </div>

                    <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
                      <div className={styles.cardBenefits}>
                        <p>{item.description}</p>

                        {/* 🚀 Renderizado condicional de la nota de beneficios resaltada */}
                        {item.highlightNote && (
                          <span className={styles.benefitBadge}>
                            ⚠️ <strong>Nota:</strong> {item.note}
                          </span>
                        )}

                        {item.images && (
                          <div className={styles.gridImages}>
                            {item.images.map((img, index) => (
                              <div key={index} className={styles.imageCard}>
                                <img src={img} alt={`Obsequio ${index + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Plan;