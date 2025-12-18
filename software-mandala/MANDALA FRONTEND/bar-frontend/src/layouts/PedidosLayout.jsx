import React from 'react';
import { Outlet } from 'react-router-dom';
import { PedidosProvider } from '../context/PedidosContext';

const PedidosLayout = () => {
    return (
        <PedidosProvider>
            <Outlet />
        </PedidosProvider>
    );
};

export default PedidosLayout;
