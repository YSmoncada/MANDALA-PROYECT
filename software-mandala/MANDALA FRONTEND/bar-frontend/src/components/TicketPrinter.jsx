import React from 'react';

const TicketPrinter = ({ pedido, empresaConfig }) => {
    if (!pedido || !empresaConfig) return null;

    // Calcular totales si no vienen calculados o para asegurar precisión
    const subtotal = pedido.productos_detalle.reduce((acc, item) => {
        const precio = parseFloat(item.producto_precio || 0);
        return acc + (item.cantidad * precio);
    }, 0);

    const impuesto = (subtotal * (parseFloat(empresaConfig.impuesto_porcentaje || 0) / 100));
    const finalTotal = subtotal + impuesto;

    return (
        <div id="print-ticket" className="print-only text-black p-4 font-mono text-sm max-w-[80mm] mx-auto bg-white">
            <div className="text-center mb-4">
                <h2 className="text-lg font-bold uppercase">{empresaConfig.nombre}</h2>
                {empresaConfig.nit && <p className="text-xs">NIT/RUT: {empresaConfig.nit}</p>}
                {empresaConfig.direccion && <p className="text-xs">{empresaConfig.direccion}</p>}
                {empresaConfig.telefono && <p className="text-xs">Tel: {empresaConfig.telefono}</p>}
                <div className="mt-4 border-t border-dashed border-black pt-2">
                    <div className="flex justify-between text-xs font-bold">
                        <span>MESA: {pedido.mesa_numero}</span>
                        <span>PEDIDO: #{pedido.id}</span>
                    </div>
                    <p className="text-[10px] mt-1">Fecha: {new Date(pedido.fecha_hora).toLocaleString()}</p>
                    <p className="text-[10px]">Mesero/a: {pedido.mesera_nombre}</p>
                </div>
                <p className="mt-2 text-xs">---------------------------</p>
            </div>

            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-black">
                        <th className="text-left py-1">Cant.</th>
                        <th className="text-left py-1">Producto</th>
                        <th className="text-right py-1">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {pedido.productos_detalle.map((item, idx) => (
                        <tr key={idx} className="border-b border-black/10">
                            <td className="py-1">{item.cantidad}</td>
                            <td className="py-1">{item.producto_nombre}</td>
                            <td className="text-right py-1">{empresaConfig.moneda}{(item.cantidad * (item.producto_precio || 0)).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 border-t border-black pt-2 text-xs">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{empresaConfig.moneda}{subtotal.toLocaleString()}</span>
                </div>
                {impuesto > 0 && (
                    <div className="flex justify-between">
                        <span>Propina/Imp ({(empresaConfig.impuesto_porcentaje || 0)}%):</span>
                        <span>{empresaConfig.moneda}{impuesto.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-black">
                    <span>TOTAL:</span>
                    <span>{empresaConfig.moneda}{finalTotal.toLocaleString()}</span>
                </div>
            </div>

            <div className="text-center mt-8">
                <p className="text-xs font-bold">{empresaConfig.mensaje_footer}</p>
                <p className="text-[8px] mt-4 opacity-50">Software NoxOS - Facturación Electrónica Digital</p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media screen {
                    .print-only { display: none; }
                }
                @media print {
                    body * { visibility: hidden !important; }
                    #print-ticket, #print-ticket * { visibility: visible !important; }
                    #print-ticket {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 10mm;
                    }
                    @page {
                        margin: 0;
                        size: auto;
                    }
                }
            `}} />
        </div>
    );
};

export default TicketPrinter;
