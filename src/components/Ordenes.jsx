import axios from "../axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";

export const Ordenes = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getOrders();
  }, [orders]);

  const eliminar = async (order) => {
    Swal.fire({
      title: "Modificar Orden",
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: `Eliminar`,
      confirmButtonText: "Restock",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const product of order.products) {
            const res = await axios.get(`/products/findtt/${product.title}`);
            const prod = await axios.get(`/products/find/${res.data.id}`);
            let sizeIndex = 0;
            switch (product.size) {
              case "XS":
                sizeIndex = 0;
                break;
              case "S":
                sizeIndex = 1;
                break;
              case "M":
                sizeIndex = 2;
                break;
              case "L":
                sizeIndex = 3;
                break;
              case "XL":
                sizeIndex = 4;
                break;
              case "75B":
                sizeIndex = 0;
                break;
              case "75C":
                sizeIndex = 1;
                break;
              case "80B":
                sizeIndex = 2;
                break;
              case "80C":
                sizeIndex = 3;
                break;
              case "80D":
                sizeIndex = 4;
                break;
              case "85B":
                sizeIndex = 5;
                break;
              case "85C":
                sizeIndex = 6;
                break;
              case "85D":
                sizeIndex = 7;
                break;
              default:
                sizeIndex = -1;
                break;
            }
            const sizeQuantity =
              prod.data.images[product.code].colors[0].sizes[sizeIndex].quantity;
            const sizeUpd = {
              sizeIndex: sizeIndex,
              quantity: sizeQuantity + product.quantity,
            };
            await axios.put("/products/" + res.data.id, sizeUpd);
            await axios.put("/orders/" + order._id, { estatus: "Cancelado" });
            Swal.fire("Existencias actualizadas!", "", "success");
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Error al actualizar", "", "error");
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "Eliminar Orden",
          showDenyButton: true,
          confirmButtonText: "Si",
          denyButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.delete("/orders/" + order._id);
              Swal.fire("Orden Eliminada", "", "success");
            } catch (error) {
              console.error(error);
              Swal.fire("Error al eliminar orden", "", "error");
            }
          }
        });
      }
    });
  };

  const fecha = (f) => {
    const formato = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const date = new Date(f);
    return date.toLocaleString("es-UY", formato);
  };

  return (
    <div>
      <Container>
        <Row>
          <div>
            {orders.map((order) => (
              <Card key={order._id} className="mb-2">
                <Card.Body className="prod-card">
                  {order.products.map((product) => (
                    <>
                      <img
                        src={`http://localhost:3000/api/get-image/${product.image}`}
                        className="img-fluid img-thumbnail"
                        alt=""
                        crossOrigin="anonymous"
                      />
                      <div className="texto">
                        <div>
                          <p className="fw-bold">Producto:</p>
                          <p>{product.title}</p>
                        </div>
                        <div>
                          <p className="fw-bold">Precio:</p>
                          <p>${product.price}</p>
                        </div>
                        {!product.color.startsWith("C:") && (
                          <div>
                            <p className="fw-bold">Color:</p>
                            <p>{product.color}</p>
                          </div>
                        )}
                        <div>
                          <p className="fw-bold">Talle:</p>
                          <p>{product.size}</p>
                        </div>
                        <div>
                          <p className="fw-bold">Cantidad:</p>
                          <p>{product.quantity}</p>
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="texto">
                    <div>
                      <p className="fw-bold">Nombre:</p>
                      <p>
                        {order.name} {order.surname}
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold">Telefono:</p>
                      <p>{order.phone}</p>
                    </div>
                    <div>
                      <p className="fw-bold">Mail:</p>
                      <p>{order.mail}</p>
                    </div>
                    <div>
                      <p className="fw-bold">Dirección:</p>
                      <p>
                        {order.address}, {order.city}
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold">Envio por:</p>
                      <p>{order.envio}</p>
                    </div>
                    <div>
                      <p className="fw-bold">Total:</p>
                      <p>${order.total}</p>
                    </div>
                  </div>
                  <div className="texto">
                    <div>
                      <p className="fw-bold">Medio de Pago:</p>
                      <p>{order.medio}</p>
                    </div>
                    <div>
                      <p className="fw-bold">Estado:</p>
                      <p className="fw-bold">({order.estatus})</p>
                    </div>
                    <div>
                      <p className="fw-bold">PayId:</p>
                      <p>{order.payid}</p>
                    </div>
                    <div>
                      <p className="fw-bold">merchant_order_id:</p>
                      <p>{order.merchant_order_id}</p>
                    </div>
                    <div>
                      <p className="fw-bold">Id Compra:</p>
                      <p className="fw-bold">({order._id.slice(-5)})</p>
                    </div>
                    <div>
                      <p className="fw-bold">Fecha:</p>
                      <p>{fecha(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="trash" onClick={() => eliminar(order)}>
                    <p>OPCIONES</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Row>
      </Container>
    </div>
  );
};
