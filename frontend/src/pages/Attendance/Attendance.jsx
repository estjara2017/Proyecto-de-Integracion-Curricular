import { useEffect, useState } from "react";
import styles from "./Attendance.module.css";
import Login from "../Login/Login";
import Header2 from "../../components/Header/Header2"; // Ajusta la ruta exacta según tu árbol
import Footer from "../../components/Footer/Footer";
import { fetchPalabraDelDia } from "../../services/attendanceService";

function Attendance() {
  const [palabra, setPalabra] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPalabra = async () => {
      try {
        const palabraClave = await fetchPalabraDelDia();
        setPalabra(palabraClave);
        localStorage.setItem('elemental_qr_scan_date', new Date().toISOString().slice(0, 10));
      } catch (err) {
        console.error("Error al obtener la palabra del día:", err); // 🚀 Al usar 'err' aquí, el error desaparece
        setError("No se pudo cargar la palabra del día. Inténtalo más tarde.");
      }
    };

    cargarPalabra();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Header2 />

      <main className={styles.container}>
        {/* SECCIÓN SUPERIOR: PALABRA CLAVE */}
        <section className={styles.codeSection}>
          <h1 className={styles.title}>Palabra del día</h1>

          {error && <p className={styles.errorMessage}>{error}</p>}

          {!error &&
            (palabra ? (
              <div className={styles.codeBox}>{palabra}</div>
            ) : (
              <p className={styles.loadingText}>Cargando entorno...</p>
            ))}
        </section>

        {/* SECCIÓN INFERIOR: LOGIN REUTILIZADO */}
        <section className={styles.loginSection}>
          <Login embedded />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Attendance;
