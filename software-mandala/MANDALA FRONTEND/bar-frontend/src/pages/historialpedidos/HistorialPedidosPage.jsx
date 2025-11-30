// src/pages/historialpedidos/HistorialPedidosPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '../../apiConfig';

const capitalize = (str = '') => {
  const s = String(str).trim();
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
const HistorialPedidosPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [estados, setEstados] = useState(["pendiente", "despachado", "finalizada", "cancelado"]);
    const [meseraSeleccionada, setMeseraSeleccionada] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }); // Estado para la fecha
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
    const [totalMostrado, setTotalMostrado] = useState(0); // El total que se mostrará en la UI (global o individual)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const manejoEstado = (estado) => {switch (estado) {
        case 'pendiente' || "Pendiente":
            return 'text-yellow-500';
        case 'despachado' || "Despachado":
            return 'text-green-500';
        case 'finalizada' || "Finalizada":
            return 'text-blue-500';
        case "cancelado" || "Cancelado":
            return 'text-red-500';
        default:
            return '';
        }
    };
    // Cargar la lista de meseras al montar el componente
    useEffect(() => {
        const fetchMeseras = async () => {
            try {
                const response = await axios.get(`${API_URL}/meseras/`); // Ya estaba bien, pero se confirma
                setMeseras(response.data);
            } catch (error) {
                console.error("Error al cargar las meseras:", error);
            }
        };
        fetchMeseras();

    }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

    // Efecto para buscar los pedidos cuando cambian los filtros
    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();

                if (meseraSeleccionada) {
                    params.append('mesera', meseraSeleccionada);
                }

                if (fechaSeleccionada) {
                    // Ensure date is in YYYY-MM-DD format
                    const date = new Date(fechaSeleccionada);
                    const formattedDate = date.toISOString().split('T')[0];
                    params.append('fecha', formattedDate);
                    console.log('Fecha enviada:', formattedDate);
                }
                if (estadoSeleccionado) {
                    params.append('estado', estadoSeleccionado);
                }

                const url = `${API_URL}/pedidos/?${params.toString()}`;
                console.log('URL completa:', url);

                const response = await axios.get(url);
                console.log('Pedidos recibidos:', response.data);
                setPedidos(response.data);

            } catch (error) {
                console.error("Error al cargar los pedidos:", error);
                setPedidos([]);
            } finally {
                setLoading(false);
            }
        };

        // Buscar si se ha seleccionado una mesera O una fecha.
        if (meseraSeleccionada || fechaSeleccionada || estadoSeleccionado) {
            fetchPedidos();
        } else {
            setPedidos([]); // Limpia los pedidos si no hay filtros activos
        }
    }, [meseraSeleccionada, fechaSeleccionada, estadoSeleccionado]);

    // Efecto para actualizar el total mostrado cuando cambia la selección de mesera
    useEffect(() => {
        // El total mostrado ahora se calcula directamente de los pedidos filtrados en pantalla.
        const totalCalculado = pedidos.reduce((acc, pedido) => acc + parseFloat(pedido.total), 0);
        setTotalMostrado(totalCalculado);
    }, [pedidos]); // Se recalcula cada vez que la lista de pedidos cambia.

    // Determina el título a mostrar basado en los filtros activos
    const getTituloTotal = () => {
        const nombreMesera = meseras.find(m => m.id == meseraSeleccionada)?.nombre;
        const fechaFormateada = fechaSeleccionada ? new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

        if (nombreMesera && fechaFormateada) {
            return `Ventas de ${nombreMesera} el ${fechaFormateada}`;
        }
        if (nombreMesera) {
            return `Total de Ventas de ${nombreMesera}`;
        }
        if (fechaFormateada) {
            return `Total de Ventas para el ${fechaFormateada}`;
        }
        return 'Seleccione un filtro para ver el total';
    };
    const tituloTotal = getTituloTotal();

    // Añade esta función después de las declaraciones de estado
    const limpiarFiltros = () => {
        setMeseraSeleccionada('');
        setFechaSeleccionada('');
        setEstadoSeleccionado('');
        setPedidos([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0E0D23] to-[#511F86] p-8 text-white">
            <button
                onClick={() => navigate(-1)} // Usamos navigate(-1) para volver a la página anterior
                className="absolute top-6 left-6 flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
                <ArrowLeft size={18} />
                Volver al Inicio
            </button>

            <div className="max-w-4xl mx-auto pt-12 sm:pt-0">
                <h1 className="text-4xl font-bold text-center mb-8">Historial de Pedidos</h1>

                {/* Contenedor de Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Filtro por Mesera */}
                    <div>
                        <label htmlFor="mesera-select" className="block mb-2 text-sm font-medium text-gray-300">Filtrar por Mesera:</label>
                        <select
                            id="mesera-select"
                            value={meseraSeleccionada}
                            onChange={(e) => setMeseraSeleccionada(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                        >
                            <option value="">-- Todas las meseras --</option>
                            {meseras.map((mesera) => (
                                <option key={mesera.id} value={mesera.id}>{mesera.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Fecha */}
                    <div>
                        <label htmlFor="fecha-select" className="block mb-2 text-sm font-medium text-gray-300">Filtrar por Fecha:</label>
                        <input
                            type="date"
                            id="fecha-select"
                            value={fechaSeleccionada}
                            onChange={(e) => {
                                const selectedDate = e.target.value;
                                console.log('Nueva fecha seleccionada:', selectedDate);
                                setFechaSeleccionada(selectedDate);
                            }}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                        />
                    </div>
                    
                    {/* Filtro por Estado */}
                    <div>
                        <label htmlFor="estado-select" className="block mb-2 text-sm font-medium text-gray-300">Filtrar por Estado:</label>
                        <select
                            id="estado-select"
                            value={estadoSeleccionado}
                            onChange={(e) => setEstadoSeleccionado(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                        >
                            <option value="">-- Todas los estados --</option>
                            {estados.map((estado) => (
                                <option key={estado} value={estado}>{capitalize(estado)}</option>
                            ))}
                        </select>
                    </div>
                    {/* Botón para limpiar fecha */}
                    <div className="flex items-end">
                        <button onClick={() => setFechaSeleccionada('')} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2.5 px-4 rounded-lg w-full">
                            Limpiar Fecha
                        </button>
                    </div>

                    {/* Añade este botón junto a los otros filtros */}
                    <div className="flex items-end">
                        <button
                            onClick={limpiarFiltros}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg w-full"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>

                {/* Lista de Pedidos */}
                {loading ? (
                    <p className="text-center">Cargando pedidos...</p>
                ) : (
                    <div className="space-y-4">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-[#2B0D49]/80 border border-[#6C3FA8] rounded-xl p-4">
                                <span className={manejoEstado(pedido.estado)}>
                                        {capitalize(pedido.estado) || 'Sin estado'}
                                    </span>
                                <div className="flex justify-between items-center mb-2">
                                    
                                    <h2 className="font-bold text-lg">Pedido #{pedido.id}</h2>
                                    <span className="text-sm text-gray-400">{new Date(pedido.fecha_hora).toLocaleString()}</span>
                                </div>
                                <p className="text-sm mb-2">Mesa: <span className="font-semibold">{pedido.mesa_numero}</span></p>
                                <ul className="list-disc list-inside pl-2 text-gray-300">
                                    {pedido.productos_detalle.map((item, index) => (
                                        <li key={index} className="text-sm">
                                            {item.cantidad} x {item.producto_nombre} - ${(parseFloat(item.producto_precio) * item.cantidad).toLocaleString('es-CO')}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-right font-bold text-xl mt-2">Total: ${parseFloat(pedido.total).toLocaleString('es-CO')}</p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400">
                                {(() => {
                                    if (meseraSeleccionada && fechaSeleccionada) return 'No hay pedidos para esta mesera en la fecha seleccionada.';
                                    if (meseraSeleccionada) return 'No hay pedidos para esta mesera.';
                                    if (fechaSeleccionada) return 'No se encontraron pedidos para la fecha seleccionada.';
                                    return 'Seleccione una mesera o una fecha para ver los pedidos.';
                                })()}
                            </p>
                        )}
                    </div>
                )}

                {/* Total Global */}
                {/* Solo mostrar el total si hay filtros aplicados */}
                {(meseraSeleccionada || fechaSeleccionada) && (
                    <div className="mt-8 pt-4 border-t-2 border-purple-500 text-center">
                        <h2 className="text-xl font-bold text-white">{tituloTotal}</h2>
                        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] mt-2">${totalMostrado.toLocaleString('es-CO')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialPedidosPage;