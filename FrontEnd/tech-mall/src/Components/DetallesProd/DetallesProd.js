import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './DatallesProd.css'; // Asegúrate de tener estilos para este componente
import MostrarProd from '../MostrarProd/MostrarProd';

const DetallesProd = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/prod/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar el producto: ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setProducto(data);
      })
      .catch((error) => {
        console.error("Error al cargar el producto:", error);
        setMensaje("No se pudo cargar el producto. Intenta más tarde.");
      });
  }, [id]);

  if (mensaje) {
    return <div>{mensaje}</div>;
  }

  if (!producto) {
    return <div>Cargando...</div>; // Puedes agregar un spinner aquí si lo deseas
  }

  return (
    <div>
      <div className="detalles-producto">
        <div className="producto-imagen">
          <img src={producto.imagen} alt={producto.nombre} className="imagen-principal" />
        </div>
        <div className="producto-info">
          <h2 className="nombre-producto">{producto.nombre}</h2>
          <p className="descripcion">{producto.descripcion}</p>
          <p className="precio"><strong>Precio:</strong> Q {producto.precio}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>
          
          <div className="botones">
            <button className="boton-comprar">Comprar Ahora</button>
            <button className="boton-carrito">Agregar al Carrito</button>
          </div>
        </div>
      </div>
      <button className="btn-volver" onClick={() => navigate('/')}>Volver</button>
      <MostrarProd />
      <div className="waveDetalleProducto"></div>
      <div className="waveDetalleProducto"></div>
    </div>
  );
};

export default DetallesProd;
