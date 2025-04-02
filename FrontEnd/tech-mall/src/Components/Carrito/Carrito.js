import React, { useEffect, useState } from 'react';
import './Carrito.css';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
    calcularTotal(carritoGuardado);
  }, []);

  const calcularTotal = (carrito) => {
    const totalCalculado = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    setTotal(totalCalculado);
  };

  const eliminarDelCarrito = (idProducto) => {
    const carritoActualizado = carrito.filter(producto => producto.id !== idProducto);
    setCarrito(carritoActualizado);
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    calcularTotal(carritoActualizado);
  };

  const procederCompra = async () => {
    try {
      const response = await fetch('http://localhost:5000/prod/procesarCompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carrito: carrito }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        // Vaciar el carrito después de la compra exitosa
        setCarrito([]);
        localStorage.removeItem('carrito');
        calcularTotal([]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Hubo un error al procesar la compra.');
    }
  };

  if (carrito.length === 0) {
    return <div className="carrito-vacio">Tu carrito está vacío</div>;
  }

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      <div className="carrito-lista">
        {carrito.map((producto) => (
          <div key={producto.id} className="carrito-item">
            <img src={producto.imagen} alt={producto.nombre} className="imagen-producto" />
            <div className="detalles-producto">
              <h3>{producto.nombre}</h3>
              <p><strong>Precio:</strong> Q {producto.precio}</p>
              <p><strong>Cantidad:</strong> {producto.cantidad}</p>
              <button onClick={() => eliminarDelCarrito(producto.id)} className="eli">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="carrito-total">
        <h3>Total: Q {total}</h3>
        <button onClick={procederCompra} className="boton-comprar">Proceder a la compra</button>
      </div>
    </div>
  );
};

export default Carrito;
