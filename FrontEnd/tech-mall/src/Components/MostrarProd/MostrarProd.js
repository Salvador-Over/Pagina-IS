import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MostrarProd.css';

const MostrarProd = () => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/prod')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);

  const handleVerDetalles = (id) => {
    navigate(`/detalles/${id}`);
  };

  const handleComprarAhora = (producto) => {
    setMensaje(`¡Has comprado el producto ${producto.nombre}!`);
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleAgregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verifica si el producto ya está en el carrito
    const productoExistente = carritoActual.find(item => item.id === producto.id);
    
    if (productoExistente) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      productoExistente.cantidad += 1;
    } else {
      // Si no está, agrégalo con cantidad 1
      carritoActual.push({ ...producto, cantidad: 1 });
    }

    // Actualiza localStorage con el carrito modificado
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    setMensaje(`¡${producto.nombre} se ha agregado al carrito!`);
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="productos-container2">
      <h2>Productos Disponibles</h2>
      {mensaje && <div className="tooltip2">{mensaje}</div>}

      <div className="productos-grid2">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div
              key={producto.id}
              className="producto-card2"
              onClick={() => handleVerDetalles(producto.id)}
            >
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="producto-imagen2" 
              />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p><strong>Precio:</strong> Q {producto.precio}</p>
              
              <div className="botones-accion2">
                <button 
                  className="boton-comprar" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComprarAhora(producto);
                  }}
                >
                  Comprar Ahora
                </button>
                <button 
                  className="boton-carrito" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgregarAlCarrito(producto);
                  }}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default MostrarProd;
