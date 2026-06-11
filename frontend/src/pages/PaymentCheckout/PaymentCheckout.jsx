import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentCheckout.module.css';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { profileService } from '../../services/profileService';

export default function PaymentCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [usuarioPago, setUsuarioPago] = useState(usuario);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [customBank, setCustomBank] = useState('');

  const plan = {
    id: location.state?.planId || 4,
    name: location.state?.planNombre || 'Plan Trimestral',
    price: Number(location.state?.planPrecio || 135),
    durationDays: location.state?.durationDays || 90,
    trainingDaysPerWeek: location.state?.trainingDaysPerWeek || 5
  };

  const requiereMinimoSemanal = plan.durationDays >= 30;

  useEffect(() => {
    const cargarUsuarioPago = async () => {
      try {
        const response = await profileService.obtenerPerfil();
        setUsuarioPago(response.usuario);
      } catch {
        setUsuarioPago(usuario);
      }
    };

    cargarUsuarioPago();
  }, [usuario]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms || !plan.id) return;

    const bancoFinal = selectedBank === 'Otra entidad' ? customBank.trim() : selectedBank;
    const metodoPagoFinal = showBankDetails
      ? `Transferencia ${bancoFinal || 'Banco no especificado'}`
      : 'Deuna (Pichincha)';

    setIsSubmitting(true);
    try {
      await paymentService.notificarPago({
        planId: plan.id,
        metodoPago: metodoPagoFinal
      });

      alert('Notificacion enviada. El administrador verificara tu pago para activar el plan.');
      navigate('/dashboardClient');
    } catch (error) {
      alert(error.message || 'Hubo un problema al enviar la notificacion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.checkoutContainer}>
        <div className={styles.centralSection}>
          <h2 className={styles.title}>Finalizar tu Suscripcion</h2>

          <div className={styles.cardsGrid}>
            <div className={styles.formCard}>
              <h3>Resumen de tu Plan</h3>

              <div className={styles.userConfirmation}>
                <p>Registrando pago para:</p>
                <strong>{usuarioPago ? `${usuarioPago.nombre} ${usuarioPago.apellido}` : 'Cargando perfil...'}</strong>
                {usuarioPago?.correo && <p>{usuarioPago.correo}</p>}
              </div>

              <div className={styles.planDetail}>
                <span className={styles.label}>Plan Seleccionado:</span>
                <span className={styles.value}>{plan.name}</span>
              </div>

              <div className={styles.planDetail}>
                <span className={styles.label}>Duracion del Plan:</span>
                <span className={styles.value}>
                  {plan.durationDays} dias
                </span>
              </div>

              {requiereMinimoSemanal && (
                <div className={styles.planDetail}>
                  <span className={styles.label}>Condicion semanal:</span>
                  <span className={styles.value}>
                    Minimo {plan.trainingDaysPerWeek} dias a la semana
                  </span>
                </div>
              )}

              <div className={styles.totalDetail}>
                <span className={styles.totalLabel}>Total a transferir:</span>
                <span className={styles.price}>${plan.price.toFixed(2)}</span>
              </div>
            </div>

            <div className={`${styles.formCard} ${styles.paymentCard} ${showBankDetails ? styles.scrollablePaymentCard : ''}`}>
              <h3>{showBankDetails ? 'Transferencia Bancaria' : 'Escanea y Paga con Deuna'}</h3>

              <p className={styles.instructions}>
                {showBankDetails
                  ? 'Realiza la transferencia interbancaria utilizando los siguientes datos oficiales de la escuela:'
                  : 'Usa el QR para transferir. Una vez realizado, presiona el boton de abajo para que el administrador active tu plan.'
                }
              </p>

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
                  <div className={styles.bankRow}><strong>Numero:</strong> <span>2209030405</span></div>
                  <div className={styles.bankRow}><strong>Titular:</strong> <span>Elemental Cross Training</span></div>
                  <div className={styles.bankRow}><strong>RUC/CI:</strong> <span>1727604884</span></div>
                  <div className={styles.bankRow}><strong>Email:</strong> <span>elementalcrosstraining@gmail.com</span></div>
                </div>
              )}

              <button
                type="button"
                className={styles.toggleBankButton}
                onClick={() => {
                  setShowBankDetails(!showBankDetails);
                  setSelectedBank('');
                  setCustomBank('');
                }}
              >
                {showBankDetails ? 'Volver a QR Deuna' : 'No tienes Deuna - Transfiere desde otros bancos'}
              </button>

              <form onSubmit={handlePaymentSubmit} className={styles.form}>
                {showBankDetails && (
                  <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>Desde que banco o cooperativa envias el dinero?</label>
                    <select
                      className={styles.textField}
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      required
                    >
                      <option value="">Selecciona banco o cooperativa</option>
                      <option value="Produbanco">Produbanco</option>
                      <option value="Banco Guayaquil">Banco Guayaquil</option>
                      <option value="Banco Pacifico">Banco Pacifico</option>
                      <option value="Cooperativa JEP">Cooperativa JEP</option>
                      <option value="Cooperativa Cooprogreso">Cooperativa Cooprogreso</option>
                      <option value="Cooperativa Andalucia">Cooperativa Andalucia</option>
                      <option value="Otra entidad">Otra entidad</option>
                    </select>
                    {selectedBank === 'Otra entidad' && (
                      <input
                        type="text"
                        placeholder="Escribe el banco o cooperativa"
                        className={styles.textField}
                        value={customBank}
                        onChange={(e) => setCustomBank(e.target.value)}
                        required
                      />
                    )}
                  </div>
                )}

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <span>Acepto los terminos y confirmo que los datos son correctos.</span>
                </label>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!acceptedTerms || isSubmitting || (showBankDetails && (!selectedBank || (selectedBank === 'Otra entidad' && !customBank.trim())))}
                >
                  {isSubmitting ? 'Procesando...' : 'Ya transferi, notificar administrador'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
