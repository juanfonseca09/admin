import axios from "../axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";

export const Productos = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getProducts();
  }, [products]);

  const eliminar = async (id) => {
    Swal.fire({
      title: "Eliminar Producto",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete("/products/" + id);
          Swal.fire("Producto Eliminado", "", "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error al eliminar el producto", "", "error");
        }
      }
    });
  };

  return (
    <div>
      <Container>
        <Row>
          <div>
            {products.map((product) => (
              <Card key={product._id} className="mb-2">
                <Card.Body className="prod-card">
                  <img
                    src={`http://localhost:3000/api/get-image/${product.images[0].url}`}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                  <div className="texto">
                    <div>
                      <p className="fw-bold">Producto:</p>
                      <p>{product.title}</p>
                    </div>
                    <div>
                      <p className="fw-bold">Talles:</p>
                      {product.images.map((t, index) => (
                        <div key={index}>
                          <p>{t.colors[0].color}:</p>
                          {t.colors[0].sizes.map((s, sizeIndex) => (
                            <p key={sizeIndex}>
                              {s.size}: {s.quantity}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="trash" onClick={() => eliminar(product._id)}>
                    <p>ELIMINAR</p>
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
