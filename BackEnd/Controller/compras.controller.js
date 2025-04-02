const Compra = require('../Model/compras.model');
const Producto = require('../Model/productos.model');

exports.procesarCompra = async (req, res) => {
    try {
        const { carrito } = req.body;
        
        // Calcular el total de la compra
        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        // Crear la compra
        const compra = await Compra.create({
            total,
            estado: 'pendiente'
        });

        // Actualizar el stock de los productos
        for (const item of carrito) {
            const producto = await Producto.findByPk(item.id);
            if (producto) {
                await producto.update({
                    stock: producto.stock - item.cantidad
                });
            }
        }

        res.status(201).json({
            message: 'Compra procesada exitosamente',
            compra: {
                id: compra.id,
                total: compra.total,
                fecha: compra.fecha,
                estado: compra.estado
            }
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({
            message: 'Error al procesar la compra',
            error: error.message
        });
    }
}; 