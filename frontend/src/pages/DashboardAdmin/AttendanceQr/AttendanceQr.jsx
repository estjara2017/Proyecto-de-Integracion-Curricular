import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FiDownload, FiExternalLink, FiEye, FiEyeOff, FiPrinter, FiRefreshCw } from 'react-icons/fi';
import { fetchQrActivo, generarNuevoQrActivo } from '../../../services/attendanceService';
import styles from './AttendanceQr.module.css';

const QR_SIZE = 320;

export default function AttendanceQr() {
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');
  const [showKeyword, setShowKeyword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
        setShowKeyword(false);
        setError('');
      } catch (err) {
        setError(err.message || 'No se pudo generar el QR de asistencia.');
      }
    };

    cargarQr();
    const interval = setInterval(cargarQr, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showKeyword) return undefined;
    const timeout = setTimeout(() => setShowKeyword(false), 8000);
    return () => clearTimeout(timeout);
  }, [showKeyword, qrData?.palabra]);

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

  const handleGenerateNewQr = async () => {
    setIsGenerating(true);
    try {
      const data = await generarNuevoQrActivo();
      setQrData(data);
      setShowKeyword(false);
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo generar un nuevo QR de asistencia.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.info}>
        <h3>QR de asistencia</h3>
        <p>Muestra este QR en recepcion. El codigo queda vigente durante el dia y puedes generar uno nuevo cuando sea necesario.</p>
        {qrData && (
          <div className={styles.qrMeta}>
            <div className={styles.keywordRow}>
              <span>Palabra:</span>
              <strong className={showKeyword ? styles.keywordVisible : styles.keywordHidden}>
                {showKeyword ? qrData.palabra : '••••••'}
              </strong>
              <button type="button" className={styles.revealButton} onClick={() => setShowKeyword((prev) => !prev)}>
                {showKeyword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                {showKeyword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
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
          <button
            type="button"
            className={`${styles.actionButton} ${styles.generateButton}`}
            onClick={handleGenerateNewQr}
            disabled={isGenerating}
          >
            <FiRefreshCw aria-hidden="true" />
            {isGenerating ? 'Generando...' : 'Generar nuevo QR'}
          </button>
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
