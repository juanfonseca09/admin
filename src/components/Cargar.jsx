import React, { useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "../axiosInstance";

export const Cargar = () => {

  const [imageBlocks, setImageBlocks] = useState(1);
  const [imagesArray, setImagesArray] = useState(Array(imageBlocks).fill(null));
  const [selectedSize, setSelectedSize] = useState("standard");

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const sizeOptions =
    selectedSize === "standard"
      ? ["XS", "S", "M", "L", "XL"]
      : ["75B", "75C", "80B", "80C", "80D", "85B", "85C", "85D"];

  const handleAddImageBlock = () => {
    setImageBlocks(imageBlocks + 1);
    setImagesArray((prevImagesArray) => [...prevImagesArray, null]);
  };

  const handleQuantityChange = (index, size, event) => {
    const updatedImagesArray = [...imagesArray];
    updatedImagesArray[index] = {
      ...updatedImagesArray[index],
      sizes: {
        ...updatedImagesArray[index].sizes,
        [size]: parseInt(event.target.value, 10),
      },
    };
    setImagesArray(updatedImagesArray);
  };

  const handleColorChange = (index, event) => {
    const updatedImagesArray = [...imagesArray];
    const colorValue = event.target.value;

    if (colorValue) {
      const fileInput = event.target.form[`images${index}`];

      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        let sizes = {};
        if (selectedSize === "standard") {
          sizes = {
            XS: event.target.form[`quantity-XS-${index}`]?.value || 0,
            S: event.target.form[`quantity-S-${index}`]?.value || 0,
            M: event.target.form[`quantity-M-${index}`]?.value || 0,
            L: event.target.form[`quantity-L-${index}`]?.value || 0,
            XL: event.target.form[`quantity-XL-${index}`]?.value || 0,
          };
        } else {
          sizes = {
            "75B": event.target.form[`quantity-75B-${index}`]?.value || 0,
            "75C": event.target.form[`quantity-75C-${index}`]?.value || 0,
            "80B": event.target.form[`quantity-80B-${index}`]?.value || 0,
            "80C": event.target.form[`quantity-80C-${index}`]?.value || 0,
            "80D": event.target.form[`quantity-80D-${index}`]?.value || 0,
            "85B": event.target.form[`quantity-85B-${index}`]?.value || 0,
            "85C": event.target.form[`quantity-85C-${index}`]?.value || 0,
            "85D": event.target.form[`quantity-85D-${index}`]?.value || 0,
          };
        }

        updatedImagesArray[index] = {
          image: fileInput.files[0],
          color: colorValue,
          sizes: sizes,
          sizeType: selectedSize,
        };

        setImagesArray(updatedImagesArray);
      }
    }
  };

  const uploadProduct = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const formData = new FormData();

      imagesArray.forEach((imageData, index) => {
        formData.append(`images`, imageData.image);
        formData.append(`color${index}`, imageData.color);
        formData.append(`sizeType-${index}`, selectedSize);

        Object.keys(imageData.sizes).forEach((size) => {
          formData.append(`quantity-${size}-${index}`, imageData.sizes[size]);
        });
      });

      formData.append("title", form.title.value);
      formData.append("desc", form.desc.value);
      formData.append("price", parseFloat(form.price.value));
      formData.append("inStock", true);

      const selectedCategories = [];
      form
        .querySelectorAll('input[type="checkbox"]:checked')
        .forEach((checkbox) => {
          selectedCategories.push(checkbox.value);
        });

      formData.append("categories", selectedCategories.join(","));
      const imageUploadRequest = await axios.post("/products/upload", formData);
      const imageUploadResponse = await imageUploadRequest.json();
      console.log(imageUploadResponse)
      const productData = {
        title: form.title.value,
        desc: form.desc.value,
        categories: selectedCategories,
        price: parseFloat(form.price.value),
        inStock: true,
        images: imageUploadResponse.images,
      };
      console.log(productData);
      const productUploadRequest = await axios.post("/products", JSON.stringify(productData));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto cargado correctamente!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Hubo un error al cargar el producto",
        showConfirmButton: false,
        timer: 2000,
      });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
      console.log(error);
    }
  };

  const imageFormGroups = [];
  for (let i = 0; i < imageBlocks; i++) {
    imageFormGroups.push(
      <div key={i}>
        <Form.Group className="mb-5">
  <Form.Label>Subir imagen {i + 1}:</Form.Label>
  <Form.Control
    type="file"
    name={`images${i}`}
    onChange={(event) => handleColorChange(i, event)}
  />
</Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Select
                name={`color${i}`}
                onChange={(event) => handleColorChange(i, event)}
              >
                <option value="">Color</option>
                <option value="black">Negro</option>
                <option value="white">Blanco</option>
                <option value="red">Rojo</option>
                <option value="yellow">Amarillo</option>
                <option value="blue">Azul</option>
                <option value="green">Verde</option>
                <option value="fuchsia">Fucsia</option>
                <option value="pink">Rosa</option>
                <option value="orange">Naranja</option>
                <option value="burlywood">Animal Print</option>
                <option value="purple">Violeta</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            {sizeOptions.map((size) => (
              <Form.Group key={`${i}-${size}`} className="mb-3">
                <Form.Label className="form-label">{`Cantidad Talle ${size}`}</Form.Label>
                <Form.Control
                  type="text"
                  name={`quantity-${size}-${i}`}
                  value={
                    imagesArray[i] &&
                    imagesArray[i].sizes &&
                    !isNaN(parseFloat(imagesArray[i].sizes[size]))
                      ? parseFloat(imagesArray[i].sizes[size])
                      : ""
                  }
                  onChange={(event) => handleQuantityChange(i, size, event)}
                />
              </Form.Group>
            ))}
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        <section>
          <div className="py-5">
            <div className="d-flex justify-content-center align-items-center">
              <div className=" pb-3">
                <h2 className="fw-bold mb-2 text-uppercase mb-5">
                  Cargar Producto
                </h2>
                <Form
                  onSubmit={uploadProduct}
                  method="POST"
                  encType="multipart/form-data"
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Título</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      autoComplete="off"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      type="text"
                      name="desc"
                      autoComplete="off"
                      required
                    />
                  </Form.Group>
                  <div>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Talles:</Form.Label>
                      <Form.Check
                        type="radio"
                        label="Talles Estándar"
                        value="standard"
                        checked={selectedSize === "standard"}
                        onChange={handleSizeChange}
                      />
                      <Form.Check
                        type="radio"
                        label="Talles Personalizados"
                        value="custom"
                        checked={selectedSize === "custom"}
                        onChange={handleSizeChange}
                      />
                    </Form.Group>
                    {imageFormGroups}
                    <Button
                      variant="outline-dark"
                      className="mb-3"
                      onClick={handleAddImageBlock}
                    >
                      Agregar Nueva Imagen
                    </Button>
                  </div>
                  <Form.Group className="mb-3">
                  <Form.Check
                      type="checkbox"
                      label="Unico Color"
                      value="Unico Color"
                      className="mb-5"
                    />
                    <Form.Label className="form-label">Categorías:</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Victoria's Secret"
                      value="Victoria's Secret"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Lencería"
                      value="Lencería"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Preventa Accesorios Originales"
                      value="Preventa Accesorios Originales"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Indumentaria"
                      value="Indumentaria"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Indumentaria Original"
                      value="Indumentaria Original"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Prendas SHEIN(Por Mayor)"
                      value="Prendas SHEIN(Por Mayor)"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Accesorios Originales(Por Mayor)"
                      value="Accesorios Originales(Por Mayor)"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Indumentaria Original(Por Mayor)"
                      value="Indumentaria Original(Por Mayor)"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Destacado"
                      value="Destacado"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2 col-6">
                    <Form.Label className="form-label">Precio:</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      autoComplete="off"
                      required
                    />
                  </Form.Group>
                  <Button variant="outline-dark" type="submit">
                    Cargar
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </Row>
    </Container>
  );
};
