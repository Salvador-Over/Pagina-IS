const Producto = require('../Model/productos.model');
const secret_key = 'mysecretkey';
const jwt = require('jsonwebtoken');

// Buscar productos por categoría
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoria } = req.params;
        const productos = await Producto.find({ categoria });
        if (productos.length === 0) return res.status(404).json({ message: 'No se encontraron productos para esta categoría.' });
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar productos por categoría.' });
    }
};

// Agregar un nuevo producto
exports.addProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        console.log("Se registró un nuevo producto! " + req.body);
        res.status(201).json({ message: 'Producto creado', nuevoProducto });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: 'Error al crear producto.' });
    }
};

// Actualizar un producto por ID
exports.updateProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoUpdate = await Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!productoUpdate) return res.status(404).send({ message: 'No se encontró el producto' });
        console.log("Se modificó el Producto: " + id);
        res.status(200).json({ message: 'Producto modificado', productoUpdate });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send({ message: 'Error al actualizar producto.' });
    }
};

// Borrar un producto por ID
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoDelete = await Producto.findByIdAndDelete(id);
        if (!productoDelete) return res.status(404).send({ message: 'No se encontró el Producto' });
        console.log("se eliminó el Producto: " + id);
        res.status(200).json({ message: 'Producto eliminado', productoDelete });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).send({ message: 'Error al eliminar producto.' });
    }
};

// Mostrar todos los productos en MongoDB
exports.getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.find();
        console.log("Se listaron todos los productos");
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id); // Agregar este log para verificar el ID
    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).send({ message: 'No se encontró el producto' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send({ message: 'Error al obtener el producto' });
    }
};

// Procesar la compra y disminuir el stock de productos
exports.procesarCompra = async (req, res) => {
    const carrito = req.body; // Espera recibir un array de productos con _id y cantidad

    try {
        // Verificar si todos los productos en el carrito tienen stock suficiente
        for (const item of carrito) {
            const producto = await Producto.findById(item._id);

            if (!producto) {
                return res.status(404).json({ message: `Producto con ID ${item._id} no encontrado.` });
            }

            // Verificar si el stock es 0
            if (producto.stock === 0) {
                return res.status(400).json({ message: `El producto ${producto.nombre} está agotado y no se puede comprar.` });
            }

            // Verificar si hay stock suficiente para la cantidad solicitada
            if (producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${producto.nombre}.` });
            }
        }

        // Reducir el stock de cada producto en el carrito
        for (const item of carrito) {
            const producto = await Producto.findById(item._id);
            producto.stock -= item.cantidad; // Reducir el stock del producto
            await producto.save(); // Guardar el cambio en la base de datos
        }

        // Respuesta en caso de éxito
        res.status(200).json({ message: 'Compra procesada exitosamente y stock actualizado.' });
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ message: 'Error al procesar la compra.' });
    }
};

// Buscar productos por nombre
exports.searchProductsByName = async (req, res) => {
    const { nombre } = req.query; // Obtén el nombre del query string
    try {
        const productos = await Producto.find({ nombre: { $regex: nombre, $options: 'i' } }); // Búsqueda insensible a mayúsculas
        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos con ese nombre.' });
        }
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar productos por nombre.' });
    }
};

exports.crearProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

exports.obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
};

exports.actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await producto.update(req.body);
        res.json({
            message: 'Producto actualizado exitosamente',
            producto
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};
