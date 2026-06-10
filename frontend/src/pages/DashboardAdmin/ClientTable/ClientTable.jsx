import { useEffect, useState } from 'react';
import styles from './ClientTable.module.css';
import { adminService } from '../../../services/adminService';

const mapClient = (client) => ({
  id: client.id,
  name: `${client.nombre || ''} ${client.apellido || ''}`.trim(),
  phone: client.telefono || '',
  address: client.direccion || '',
  email: client.correo || '',
  weight: client.peso || '',
  height: client.estatura || '',
  liftWeight: client.pesoLevantamientoKg || 0,
  maxAverage: client.pesoMaxPromedioKg || 0,
  progress: client.porcentajeProgreso || 0,
  active: client.estado === 'activo'
});

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ phone: '', address: '', email: '', weight: '', height: '', liftWeight: '', maxAverage: '' });
  const [error, setError] = useState('');
  const [cedulaAdmin, setCedulaAdmin] = useState('');

  const cargarClientes = async () => {
    try {
      const data = await adminService.listarClientes();
      setClients(data.map(mapClient));
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los clientes');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarClientes();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (client) => {
    setEditingId(client.id);
    setEditFormData({
      phone: client.phone,
      address: client.address,
      email: client.email,
      weight: client.weight,
      height: client.height,
      liftWeight: client.liftWeight,
      maxAverage: client.maxAverage
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (id) => {
    try {
      const updated = await adminService.actualizarCliente(id, {
        telefono: editFormData.phone,
        direccion: editFormData.address,
        correo: editFormData.email,
        peso: editFormData.weight || null,
        estatura: editFormData.height || null,
        pesoLevantamientoKg: editFormData.liftWeight || 0,
        pesoMaxPromedioKg: editFormData.maxAverage || 0
      });

      setClients((prev) => prev.map((client) => (
        client.id === id ? mapClient(updated) : client
      )));
      setEditingId(null);
    } catch (err) {
      alert(err.message || 'No se pudo actualizar el cliente');
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm('Estas seguro de que deseas desactivar este cliente?');
    if (!confirmDelete) return;

    try {
      await adminService.desactivarCliente(id);
      setClients((prev) => prev.map((client) => (
        client.id === id ? { ...client, active: false } : client
      )));
    } catch (err) {
      alert(err.message || 'No se pudo desactivar el cliente');
    }
  };

  const handleAsignarAdmin = async (event) => {
    event.preventDefault();
    try {
      const usuario = await adminService.asignarAdminPorCedula(cedulaAdmin.trim());
      alert(`${usuario.nombre} ${usuario.apellido} ahora tiene rol de administrador.`);
      setCedulaAdmin('');
      await cargarClientes();
    } catch (err) {
      alert(err.message || 'No se pudo asignar el rol de administrador');
    }
  };

  return (
    <div className={styles.tableContainer}>
      <form className={styles.adminRoleForm} onSubmit={handleAsignarAdmin}>
        <span>Asignar administrador por cedula</span>
        <input
          type="text"
          value={cedulaAdmin}
          onChange={(e) => setCedulaAdmin(e.target.value)}
          placeholder="Cedula / Identificacion"
          required
        />
        <button type="submit">Asignar</button>
      </form>
      {error && <p className={styles.emptyMessage}>{error}</p>}
      <table className={styles.clientTable}>
        <thead>
          <tr>
            <th>Informacion del Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const isEditing = editingId === client.id;

            return (
              <tr key={client.id} className={styles.tableRow}>
                <td className={styles.infoCell}>
                  <div className={styles.infoGrid}>
                    <div className={styles.mainInfo}>
                      <span className={styles.clientName}>{client.name}</span>
                      <span className={styles.clientPhone}>
                        <strong>Telefono:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="text"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          client.phone
                        )}
                      </span>
                    </div>
                    <div className={styles.subInfo}>
                      <span className={styles.clientAddress}>
                        <strong>Direccion:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          client.address
                        )}
                      </span>
                      <span className={styles.clientEmail}>
                        <strong>Correo:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          client.email
                        )}
                      </span>
                      <span className={styles.clientEmail}>
                        <strong>Peso:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            name="weight"
                            value={editFormData.weight}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          `${client.weight || '--'} kg`
                        )}
                      </span>
                      <span className={styles.clientEmail}>
                        <strong>Estatura:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            name="height"
                            value={editFormData.height}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          `${client.height || '--'} m`
                        )}
                      </span>
                      <span className={styles.clientEmail}>
                        <strong>Prueba:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.5"
                            name="liftWeight"
                            value={editFormData.liftWeight}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          `${client.liftWeight || 0} kg`
                        )}
                      </span>
                      <span className={styles.clientEmail}>
                        <strong>Max prom.:</strong>{' '}
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.5"
                            name="maxAverage"
                            value={editFormData.maxAverage}
                            onChange={handleEditFormChange}
                            className={styles.editInput}
                          />
                        ) : (
                          `${client.maxAverage || 0} kg (${client.progress}%)`
                        )}
                      </span>
                    </div>
                  </div>
                </td>

                <td className={styles.statusCell}>
                  <span className={`${styles.statusBadge} ${client.active ? styles.active : styles.inactive}`}>
                    {client.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                <td className={styles.actionsCell}>
                  {isEditing ? (
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleSaveClick(client.id)} className={styles.saveBtn}>
                        Guardar
                      </button>
                      <button onClick={handleCancelClick} className={styles.cancelBtn}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleEditClick(client)} className={styles.editBtn}>
                        Editar
                      </button>
                      <button onClick={() => handleDeleteClick(client.id)} className={styles.deleteBtn}>
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
