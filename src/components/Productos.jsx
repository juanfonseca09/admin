import axios from "../axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export const Productos = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`/products?page=${currentPage}&limit=8`);
        setProducts((prevProducts) => [...prevProducts, ...res.data]);
      } catch (err) {
        console.error(err);
      }
    };
    getProducts();
  }, [currentPage, products]);
  
  const eliminar = async (id) => {
    Swal.fire({
      title: "Eliminar Producto",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/products/" + id);
          Swal.fire("Producto Eliminado", "", "success");
          setCurrentPage(1);
        } catch (error) {
          console.error(error);
          Swal.fire("Error al eliminar el producto", "", "error");
        }
      }
    });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
                    crossOrigin="anonymous"
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
        <Row className='justify-content-center'>
          <Button className="col-3" onClick={handleNextPage}>Cargar Más</Button>
        </Row>
      </Container>
    </div>
  );
};
