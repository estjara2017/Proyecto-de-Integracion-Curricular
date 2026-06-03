import { useState } from "react";
import styles from "./PaymentCheckout.module.css";
import Header from "../../components/Header/Header";

export default function PaymentCheckout({
  planSelected,
  userProfile,
  onConfirmPayment,
}) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🏦 GESTIÓN DE TRANSFERENCIAS ALTERNATIVAS
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [customBank, setCustomBank] = useState("");

  const plan = planSelected || {
    id: "trimestral",
    name: "Plan Trimestral",
    price: 75.0,
    durationDays: 90,
    trainingDaysPerWeek: 5,
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    
    const metodoPagoFinal = showBankDetails && customBank.trim() 
      ? `Transf. ${customBank.trim()}` 
      : "Deuna (Pichincha)";

    setIsSubmitting(true);
    try {
      await onConfirmPayment({
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        userId: userProfile?.id || "unknown",
        userName: userProfile?.name || "Usuario sin nombre",
        status: "PENDING", 
        date: new Date().toISOString(),
        metodoPago: metodoPagoFinal, 
      });
      
      alert("¡Notificación enviada! El administrador verificará tu pago para activar el plan.");

    } catch (error) {
      console.error("Error al registrar la intención de pago:", error);
      alert("Hubo un problema al enviar la notificación. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.checkoutContainer}>
        <div className={styles.centralSection}>
          <h2 className={styles.title}>Finalizar tu Suscripción</h2>
          
          <div className={styles.cardsGrid}>
            {/* CARD IZQUIERDA: RESUMEN */}
            <div className={styles.formCard}>
              <h3>Resumen de tu Plan</h3>

              <div className={styles.userConfirmation}>
                <p>Registrando pago para:</p>
                <strong>{userProfile?.name || "Cargando perfil..."}</strong>
              </div>

              <div className={styles.planDetail}>
                <span className={styles.label}>Plan Seleccionado:</span>
                <span className={styles.value}>{plan.name}</span>
              </div>

              <div className={styles.planDetail}>
                <span className={styles.label}>Días de Entrenamiento:</span>
                <span className={styles.value}>
                  {plan.trainingDaysPerWeek} días a la semana
                </span>
              </div>

              <div className={styles.totalDetail}>
                <span className={styles.totalLabel}>Total a transferir:</span>
                <span className={styles.price}>${plan.price.toFixed(2)}</span>
              </div>
            </div>

            {/* CARD DERECHA: PAGO Y QR / DATOS BANCARIOS */}
            <div className={styles.formCard}>
              <h3>{showBankDetails ? "Transferencia Bancaria" : "Escanea y Paga con Deuna"}</h3>

              <p className={styles.instructions}>
                {showBankDetails 
                  ? "Realiza la transferencia interbancaria utilizando los siguientes datos oficiales de la escuela:"
                  : "Usa el QR para transferir. Una vez realizado, presiona el botón de abajo para que el administrador active tu plan."
                }
              </p>

              {/* Contenedor dinámico mejorado */}
              {!showBankDetails ? (
                <div className={styles.qrWrapper}>
                  <img
                    src="/images/pagos/QRDeUna.png"
                    alt="QR Deuna Elemental"
                    className={styles.qrImage}
                  />
                </div>
              ) : (
                <div className={styles.bankDetailsBox}>
                  <h4>Datos de Cuenta Oficial</h4>
                  <div className={styles.bankRow}><strong>Banco:</strong> <span>Banco Pichincha</span></div>
                  <div className={styles.bankRow}><strong>Tipo:</strong> <span>Cuenta de Ahorros</span></div>
                  <div className={styles.bankRow}><strong>Número:</strong> <span>220XXXXXX</span></div>
                  <div className={styles.bankRow}><strong>Titular:</strong> <span>Elemental Cross Training</span></div>
                  <div className={styles.bankRow}><strong>RUC/CI:</strong> <span>17XXXXXXXX</span></div>
                  <div className={styles.bankRow}><strong>Email:</strong> <span>pagos@elemental.com</span></div>
                </div>
              )}

              {/* Botón alternador estilizado */}
              <button 
                type="button"
                className={styles.toggleBankButton}
                onClick={() => {
                  setShowBankDetails(!showBankDetails);
                  setCustomBank(""); // Limpia si cambia de opinión
                }}
              >
                {showBankDetails ? "◀ Volver a QR Deuna" : "🏦 No tienes de Una - Transfiere desde otros bancos"}
              </button>

              <form onSubmit={handlePaymentSubmit} className={styles.form}>
                
                {showBankDetails && (
                  <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>¿Desde qué banco envías el dinero?</label>
                    <input 
                      type="text"
                      placeholder="Ej: Banco Guayaquil, Produbanco, Pacifíco..."
                      className={styles.textField}
                      value={customBank}
                      onChange={(e) => setCustomBank(e.target.value)}
                      required
                    />
                  </div>
                )}

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <span>
                    Acepto los términos y confirmo que los datos son correctos.
                  </span>
                </label>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!acceptedTerms || isSubmitting || (showBankDetails && !customBank.trim())}
                >
                  {isSubmitting ? "Procesando..." : "Ya transferí, notificar administrador"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}