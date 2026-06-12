import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Attendance.module.css";
import Login from "../Login/Login";
import Header2 from "../../components/Header/Header2";
import Footer from "../../components/Footer/Footer";
import { fetchPalabraDelDia } from "../../services/attendanceService";

function Attendance() {
  const [searchParams] = useSearchParams();
  const [palabra, setPalabra] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPalabra = async () => {
      const qrToken = searchParams.get("qr");

      if (!qrToken) {
        localStorage.removeItem("elemental_attendance_qr_token");
        setError("Escanea el QR vigente del local para ver la palabra clave.");
        return;
      }

      try {
        const palabraClave = await fetchPalabraDelDia(qrToken);
        setPalabra(palabraClave);
        setError(null);
        localStorage.setItem("elemental_attendance_qr_token", qrToken);
        window.history.replaceState({}, "", "/attendance");
      } catch (err) {
        console.error("Error al obtener la palabra del dia:", err);
        localStorage.removeItem("elemental_attendance_qr_token");
        setError(err.message || "No se pudo cargar la palabra del dia. Intentalo mas tarde.");
      }
    };

    cargarPalabra();
  }, [searchParams]);

  return (
    <div className={styles.pageWrapper}>
      <Header2 />

      <main className={styles.container}>
        <section className={styles.codeSection}>
          <h1 className={styles.title}>Palabra del dia</h1>

          {error && <p className={styles.errorMessage}>{error}</p>}

          {!error &&
            (palabra ? (
              <div className={styles.codeBox}>{palabra}</div>
            ) : (
              <p className={styles.loadingText}>Cargando entorno...</p>
            ))}
        </section>

        <section className={styles.loginSection}>
          <Login embedded />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Attendance;
