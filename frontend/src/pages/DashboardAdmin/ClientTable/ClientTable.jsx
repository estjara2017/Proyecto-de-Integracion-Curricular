import { useState, useEffect } from 'react';
import styles from './ClientTable.module.css';


// Simulación de datos que vendrían del Backend
const MOCK_CLIENTS = [
  { id: '1', name: 'Esteban Jara', phone: '0243221', address: 'La Floresta', email: 'estjara19958@yahoo.com', active: true },
  { id: '2', name: 'María Flores', phone: '0998765', address: 'Cumbayá', email: 'mflores@gmail.com', active: false },
  { id: '3', name: 'Carlos Pérez', phone: '0223456', address: 'Centro Histórico', email: 'cperez@hotmail.com', active: true },
];

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ phone: '', address: '', email: '' });

  // Simulación de la carga de datos (aquí irá tu fetch/axios al backend)
useEffect(() => {
  const loadMockData = () => {
    setClients(MOCK_CLIENTS);
  };
  
  // Simula un retraso de red de 100ms para que sea asíncrono
  const timer = setTimeout(loadMockData, 100);
  
  return () => clearTimeout(timer); // Limpieza de timer
}, []);
  // Activar el modo edición para una fila específica
  const handleEditClick = (client) => {
    setEditingId(client.id);
    setEditFormData({
      phone: client.phone,
      address: client.address,
      email: client.email
    });
  };

  // Capturar los cambios de los inputs en edición
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar los cambios (Preparado para PUT/PATCH al backend)
  const handleSaveClick = (id) => {
    // BACKEND INTEGRATION: Aquí harías la petición HTTP correspondientes
    // const updatedClient = { ...clients.find(c => c.id === id), ...editFormData };
    // await api.put(`/clients/${id}`, updatedClient);

    const updatedClients = clients.map((client) => {
      if (client.id === id) {
        return { ...client, ...editFormData };
      }
      return client;
    });

    setClients(updatedClients);
    setEditingId(null); // Cierra el modo edición
  };

  // Cancelar la edición actual
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Eliminar un cliente (Preparado para DELETE al backend)
  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmDelete) {
      // BACKEND INTEGRATION: await api.delete(`/clients/${id}`);
      const filteredClients = clients.filter(client => client.id !== id);
      setClients(filteredClients);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.clientTable}>
        <thead>
          <tr>
            <th>Información del Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const isEditing = editingId === client.id;

            return (
              <tr key={client.id} className={styles.tableRow}>
                {/* Columna de Datos Básicos */}
                <td className={styles.infoCell}>
                  <div className={styles.infoGrid}>
                    <div className={styles.mainInfo}>
                      <span className={styles.clientName}>{client.name}</span>
                      <span className={styles.clientPhone}>
                        <strong>Teléfono:</strong>{' '}
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
                        <strong>Dirección:</strong>{' '}
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
                    </div>
                  </div>
                </td>

                {/* Columna de Estado */}
                <td className={styles.statusCell}>
                  <span className={`${styles.statusBadge} ${client.active ? styles.active : styles.inactive}`}>
                    {client.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* Columna de Acciones */}
                <td className={styles.actionsCell}>
                  {isEditing ? (
                    <div className={styles.actionButtons}>
                      <button 
                        onClick={() => handleSaveClick(client.id)} 
                        className={styles.saveBtn}
                      >
                        Guardar
                      </button>
                      <button 
                        onClick={handleCancelClick} 
                        className={styles.cancelBtn}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className={styles.actionButtons}>
                      <button 
                        onClick={() => handleEditClick(client)} 
                        className={styles.editBtn}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(client.id)} 
                        className={styles.deleteBtn}
                      >
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