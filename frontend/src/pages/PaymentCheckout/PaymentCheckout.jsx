import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentCheckout.module.css';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { profileService } from '../../services/profileService';
import { formatFullName } from '../../utils/displayFormatters';

const TERMS_TEXT = `Términos y Condiciones de Uso
Introducción
El presente documento establece los términos y condiciones que regulan el acceso y uso de la plataforma web Elemental Cross Training, desarrollada para la gestión administrativa y el seguimiento deportivo de los usuarios del centro de entrenamiento. Al registrarse o utilizar la plataforma, el usuario manifiesta haber leído, comprendido y aceptado las disposiciones descritas en este documento.

Objeto de la plataforma
La plataforma tiene como finalidad facilitar la administración de los servicios del centro de entrenamiento mediante herramientas que permiten:
• Registro y administración de usuarios.
• Gestión de membresías y planes de entrenamiento.
• Control de asistencia mediante código QR.
• Seguimiento del progreso deportivo.
• Consulta de estadísticas e historial de entrenamiento.
• Administración de rutinas y categorías deportivas.
• Gestión de información por parte del administrador.
La plataforma constituye un sistema de apoyo administrativo y de seguimiento deportivo, por lo que no reemplaza la evaluación profesional realizada por entrenadores o personal especializado.

Registro de usuarios
Para utilizar determinadas funcionalidades de la plataforma será necesario registrarse proporcionando información veraz y actualizada.
El usuario se compromete a:
• Proporcionar datos reales y completos.
• Mantener actualizada su información personal.
• No crear cuentas utilizando información de terceros.
• Utilizar únicamente una cuenta personal.
El administrador podrá suspender o eliminar cuentas que contengan información falsa o incumplan los presentes términos.

Acceso al sistema
El acceso a la plataforma se realizará mediante el mecanismo de autenticación implementado por el sistema. Cada usuario será responsable del uso de su cuenta y de las acciones realizadas desde ella. La plataforma podrá limitar el acceso cuando se detecten actividades sospechosas o intentos de acceso no autorizados.

Uso adecuado de la plataforma
El usuario acepta utilizar la plataforma únicamente para los fines establecidos por el centro de entrenamiento.
Queda prohibido:
• Manipular información del sistema.
• Alterar registros de asistencia.
• Compartir credenciales o códigos de autenticación con terceros.
• Intentar acceder a información restringida.
• Utilizar herramientas automatizadas para alterar el funcionamiento del sistema.
• Realizar actividades que afecten la disponibilidad del servicio.
El incumplimiento de estas disposiciones podrá ocasionar la suspensión temporal o definitiva de la cuenta.

Registro de asistencia
El registro de asistencia se efectuará mediante el procedimiento establecido por el centro deportivo utilizando el código QR habilitado para ese propósito.
Cada asistencia registrada corresponderá únicamente al usuario autenticado.
El sistema podrá rechazar registros duplicados o realizados fuera de las condiciones definidas por la administración.

Planes y membresías
Los planes disponibles serán administrados por el centro de entrenamiento. La plataforma permitirá visualizar el estado de la membresía, fechas de inicio y vencimiento, así como la información relacionada con el plan contratado. La activación o renovación de una membresía estará sujeta a la validación correspondiente por parte del administrador cuando sea necesario.

Seguimiento deportivo
La información mostrada sobre progreso físico, categorías, estadísticas y rendimiento tiene fines informativos y de apoyo al entrenamiento. Las recomendaciones deportivas deberán ser interpretadas junto con la orientación del entrenador responsable. La plataforma no constituye un sistema de diagnóstico médico ni reemplaza la valoración profesional.

Protección de datos personales
La plataforma almacenará únicamente la información necesaria para la gestión del centro deportivo.
Los datos personales serán utilizados exclusivamente para:
• Administración de usuarios.
• Gestión de membresías.
• Control de asistencia.
• Seguimiento deportivo.
• Generación de reportes administrativos.
El acceso a la información estará restringido según los permisos asignados a cada rol del sistema.
El administrador será responsable de aplicar las medidas necesarias para proteger la confidencialidad e integridad de la información almacenada.

Disponibilidad del servicio
Se realizarán los esfuerzos necesarios para mantener la plataforma disponible de manera continua.
No obstante, podrán existir interrupciones ocasionadas por:
• Mantenimiento programado.
• Actualizaciones del sistema.
• Fallos de infraestructura.
• Problemas en la conexión a Internet.
• Situaciones ajenas al control del administrador.

Responsabilidades del usuario
El usuario será responsable de:
• Mantener actualizada su información.
• Hacer un uso adecuado de la plataforma.
• Respetar las normas establecidas por el centro deportivo.
• Reportar cualquier incidente relacionado con su cuenta.
• Utilizar la plataforma conforme a los presentes términos.

Responsabilidades del administrador
El administrador tendrá la responsabilidad de:
• Gestionar los usuarios registrados.
• Administrar los planes y membresías.
• Verificar la información registrada.
• Garantizar el correcto funcionamiento del sistema dentro de sus posibilidades.
• Resguardar la información almacenada.
• Controlar los permisos de acceso.

Propiedad intelectual
El diseño, estructura, código fuente, base de datos, documentación, logotipos e interfaces desarrolladas para Elemental Cross Training constituyen parte del proyecto de software y se encuentran protegidos por la normativa aplicable sobre propiedad intelectual.
Queda prohibida su reproducción, modificación o distribución sin la autorización correspondiente.

Modificaciones
El administrador podrá actualizar los presentes términos y condiciones cuando sea necesario para mejorar el funcionamiento de la plataforma o adaptarse a nuevos requerimientos.
Las modificaciones serán aplicables desde su publicación dentro del sistema.

Aceptación
El registro y utilización de la plataforma implica la aceptación de estos términos y condiciones por parte del usuario.
En caso de no aceptar las disposiciones aquí establecidas, el usuario deberá abstenerse de utilizar los servicios ofrecidos por la plataforma.

Condiciones de Pago, Transferencias y Política de Reembolsos
Pago de la membresía
Al seleccionar un plan de entrenamiento y confirmar el proceso de pago, el usuario declara conocer el valor correspondiente al plan elegido y acepta realizar un único pago por el monto indicado mediante el método de pago habilitado por el centro de entrenamiento, ya sea transferencia bancaria, código QR u otro medio autorizado.
El usuario reconoce que la membresía únicamente será activada una vez que el administrador del centro verifique y confirme la recepción del pago. Hasta que dicha verificación sea realizada, el estado de la membresía permanecerá como pendiente.

Comprobante de pago
El usuario es responsable de proporcionar un comprobante de pago válido cuando el sistema o el administrador lo soliciten para la verificación de la transacción.
En caso de que la información proporcionada sea incorrecta, incompleta o no permita verificar el pago efectuado, el centro podrá rechazar temporalmente la activación de la membresía hasta que la situación sea aclarada.

Vigencia de la membresía
La membresía tendrá vigencia conforme al plan contratado y comenzará a contabilizarse desde la fecha de activación realizada por el administrador del sistema.
La duración del plan corresponde al período contratado y no depende del número de asistencias registradas por el usuario durante dicho período.

Política de asistencia
El usuario reconoce que es su responsabilidad asistir al centro de entrenamiento durante el período de vigencia de su membresía.
La falta de asistencia, ya sea parcial o total, por motivos personales, laborales, académicos, médicos o cualquier otra circunstancia ajena al control del centro, no generará la ampliación automática del tiempo contratado, la suspensión de la membresía ni la devolución del dinero pagado.

Política de reembolsos
Los pagos realizados por concepto de membresías no son reembolsables una vez que hayan sido verificados y la membresía haya sido activada.
Asimismo, el centro de entrenamiento no realizará devoluciones económicas, compensaciones, reposición de días no utilizados, prórrogas ni descuentos por las sesiones a las que el usuario no haya asistido durante la vigencia de su plan.
Únicamente podrán evaluarse excepciones cuando exista un error administrativo atribuible directamente al centro de entrenamiento, las cuales serán analizadas por la administración y resueltas conforme a sus políticas internas.

Responsabilidad del usuario
El usuario acepta que la contratación de un plan representa el derecho de acceso a los servicios ofrecidos durante el período contratado y no garantiza un número específico de asistencias efectivamente realizadas.
Al confirmar el pago, el usuario declara haber leído y aceptado estas condiciones, comprendiendo que la administración del centro no será responsable por la pérdida de días de entrenamiento ocasionada por la inasistencia del propio usuario.`;

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
  const [showTermsModal, setShowTermsModal] = useState(false);

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
                <strong>{usuarioPago ? formatFullName(usuarioPago.nombre, usuarioPago.apellido) : 'Cargando perfil...'}</strong>
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
                  <span>
                    Acepto los{' '}
                    <button
                      type="button"
                      className={styles.termsLink}
                      onClick={() => setShowTermsModal(true)}
                    >
                      términos y condiciones
                    </button>{' '}
                    y confirmo que los datos son correctos.
                  </span>
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

      {showTermsModal && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={() => setShowTermsModal(false)}
        >
          <section
            className={styles.termsModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 id="terms-modal-title">Términos y Condiciones</h3>
              <button
                type="button"
                className={styles.closeModalButton}
                aria-label="Cerrar términos y condiciones"
                onClick={() => setShowTermsModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.termsContent}>
              {TERMS_TEXT.split('\n\n').map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <button
              type="button"
              className={styles.modalAcceptButton}
              onClick={() => setShowTermsModal(false)}
            >
              Entendido
            </button>
          </section>
        </div>
      )}
    </>
  );
}
