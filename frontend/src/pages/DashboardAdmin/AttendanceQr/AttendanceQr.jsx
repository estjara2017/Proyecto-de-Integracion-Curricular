import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FiDownload, FiExternalLink, FiPrinter } from 'react-icons/fi';
import { fetchQrActivo } from '../../../services/attendanceService';
import styles from './AttendanceQr.module.css';

const QR_SIZE = 320;

export default function AttendanceQr() {
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');

  const attendanceUrl = useMemo(() => {
    const token = qrData?.token || '';
    if (!token) return '';
    if (typeof window === 'undefined') return `/attendance?qr=${token}`;
    return `${window.location.origin}/attendance?qr=${token}`;
  }, [qrData]);

  useEffect(() => {
    const cargarQr = async () => {
      try {
        const data = await fetchQrActivo();
        setQrData(data);
        setError('');
      } catch (err) {
        setError(err.message || 'No se pudo generar el QR de asistencia.');
      }
    };

    cargarQr();
    const interval = setInterval(cargarQr, 15000);
    return () => clearInterval(interval);
  }, []);

  const getQrImage = () => {
    const canvas = canvasRef.current;
    return canvas?.toDataURL('image/png');
  };

  const handleDownload = () => {
    const qrImage = getQrImage();
    if (!qrImage || !attendanceUrl) return;

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'qr-asistencia-elemental.png';
    link.click();
  };

  const handlePrint = () => {
    const qrImage = getQrImage();
    if (!qrImage || !attendanceUrl) return;

    const printWindow = window.open('', '_blank', 'width=720,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>QR Asistencia Elemental</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              font-family: Arial, sans-serif;
              color: #2b2425;
            }
            .sheet {
              width: min(90vw, 560px);
              text-align: center;
              padding: 32px;
              border: 2px solid #7a1e48;
            }
            h1 {
              margin: 0 0 8px;
              font-size: 28px;
              color: #7a1e48;
            }
            p {
              margin: 0 0 24px;
              font-size: 16px;
            }
            img {
              width: 360px;
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <main class="sheet">
            <h1>Asistencia Elemental</h1>
            <p>Escanea el QR para registrar la asistencia del dia.</p>
            <img src="${qrImage}" alt="QR de asistencia" />
          </main>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section className={styles.panel}>
      <div className={styles.info}>
        <h3>QR de asistencia</h3>
        <p>Muestra este QR en recepcion. El codigo cambia automaticamente y solo sirve mientras esta vigente.</p>
        {qrData && (
          <div className={styles.qrMeta}>
            <span>Palabra: <strong>{qrData.palabra}</strong></span>
            <span>Vigente hasta: {new Date(qrData.expiraEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        {attendanceUrl && (
          <a className={styles.url} href={attendanceUrl} target="_blank" rel="noreferrer">
            <FiExternalLink aria-hidden="true" />
            Abrir QR actual
          </a>
        )}
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <div className={styles.qrArea}>
        <div className={styles.qrFrame}>
          {attendanceUrl ? (
            <QRCodeCanvas
              ref={canvasRef}
              value={attendanceUrl}
              size={QR_SIZE}
              level="H"
              includeMargin
            />
          ) : (
            <p className={styles.loadingText}>Generando QR...</p>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={handleDownload}>
            <FiDownload aria-hidden="true" />
            Descargar PNG
          </button>
          <button type="button" className={styles.actionButton} onClick={handlePrint}>
            <FiPrinter aria-hidden="true" />
            Imprimir
          </button>
        </div>
      </div>
    </section>
  );
}
