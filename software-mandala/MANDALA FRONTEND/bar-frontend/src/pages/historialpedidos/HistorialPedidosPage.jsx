// src/pages/historialpedidos/HistorialPedidosPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const HistorialPedidosPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [meseras, setMeseras] = useState([]);
    const [meseraSeleccionada, setMeseraSeleccionada] = useState('');
    const [meseraTotals, setMeseraTotals] = useState([]); // Almacena los totales de TODAS las meseras
    const [totalMostrado, setTotalMostrado] = useState(0); // El total que se mostrará en la UI (global o individual)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar la lista de meseras al montar el componente
    useEffect(() => {
        const fetchMeseras = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/meseras/');
                setMeseras(response.data);
            } catch (error) {
                console.error("Error al cargar las meseras:", error);
            }
        };
        fetchMeseras();

        // Cargar el total global de ventas
        const fetchTotalGlobal = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/meseras/total-pedidos/');
                const totalsData = response.data;
                setMeseraTotals(totalsData); // Guardamos la lista completa de totales
                // Calculamos el total global inicial
                const totalGlobal = totalsData.reduce((acc, item) => acc + parseFloat(item.total_vendido), 0);
                setTotalMostrado(totalGlobal);
            } catch (error) {
                console.error("Error al cargar el total global de ventas:", error);
            }
        };
        fetchTotalGlobal();

    }, []);

    // Cargar los pedidos cuando se selecciona una mesera
    useEffect(() => {
        if (!meseraSeleccionada) {
            setPedidos([]);
            setLoading(false);
            return;
        }

        const fetchPedidos = async () => {
            setLoading(true);
            try {
                // Usamos el filtro que ya nos da la API
                const response = await axios.get(`http://127.0.0.1:8000/api/pedidos/?mesera=${meseraSeleccionada}`);
                setPedidos(response.data);
            } catch (error) {
                console.error(`Error al cargar los pedidos para la mesera ${meseraSeleccionada}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [meseraSeleccionada]);

    // Efecto para actualizar el total mostrado cuando cambia la selección de mesera
    useEffect(() => {
        if (!meseraSeleccionada) {
            // Si no hay mesera seleccionada, mostramos el total global
            const totalGlobal = meseraTotals.reduce((acc, item) => acc + parseFloat(item.total_vendido), 0);
            setTotalMostrado(totalGlobal);
        } else {
            // Si se selecciona una mesera, buscamos su total específico
            const meseraIdNum = parseInt(meseraSeleccionada, 10);
            const totalMesera = meseraTotals.find(t => t.mesera_id === meseraIdNum);
            setTotalMostrado(totalMesera ? parseFloat(totalMesera.total_vendido) : 0);
        }
    }, [meseraSeleccionada, meseraTotals]);

    // Determina el título a mostrar basado en si hay una mesera seleccionada
    const tituloTotal = meseraSeleccionada ? `Total de Ventas de ${meseras.find(m => m.id == meseraSeleccionada)?.nombre || ''}` : 'Total Global de Ventas';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0E0D23] to-[#511F86] p-8 text-white">
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
                <ArrowLeft size={18} />
                Volver al Inicio
            </button>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Historial de Pedidos</h1>

                {/* Filtro por Mesera */}
                <div className="mb-6">
                    <label htmlFor="mesera-select" className="block mb-2 text-sm font-medium text-gray-300">Filtrar por Mesera:</label>
                    <select
                        id="mesera-select"
                        value={meseraSeleccionada}
                        onChange={(e) => setMeseraSeleccionada(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    >
                        <option value="">-- Seleccione una mesera --</option>
                        {meseras.map((mesera) => (
                            <option key={mesera.id} value={mesera.id}>{mesera.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Lista de Pedidos */}
                {loading ? (
                    <p className="text-center">Cargando pedidos...</p>
                ) : (
                    <div className="space-y-4">
                        {pedidos.length > 0 ? pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-[#2B0D49]/80 border border-[#6C3FA8] rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="font-bold text-lg">Pedido #{pedido.id}</h2>
                                    <span className="text-sm text-gray-400">{new Date(pedido.fecha_hora).toLocaleString()}</span>
                                </div>
                                <p className="text-sm mb-2">Mesa: <span className="font-semibold">{pedido.mesa_numero}</span></p>
                                <ul className="list-disc list-inside pl-2 text-gray-300">
                                    {pedido.productos_detalle.map((item, index) => (
                                        <li key={index}>
                                            {item.cantidad} x {item.producto_nombre} - ${(parseFloat(item.producto_precio) * item.cantidad).toLocaleString('es-CO')}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-right font-bold text-xl mt-2">Total: ${parseFloat(pedido.total).toLocaleString('es-CO')}</p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400">{meseraSeleccionada ? 'No hay pedidos para esta mesera.' : 'Seleccione una mesera para ver sus pedidos.'}</p>
                        )}
                    </div>
                )}

                {/* Total Global */}
                <div className="mt-8 pt-4 border-t-2 border-purple-500 text-center">
                    <h2 className="text-2xl font-bold text-white">{tituloTotal}</h2>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#A944FF] to-[#FF4BC1] mt-2">${totalMostrado.toLocaleString('es-CO')}</p>
                </div>
            </div>
        </div>
    );
};

export default HistorialPedidosPage;