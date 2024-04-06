"use client";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import React from "react";

export default function cafe() {
  const conponentPDF = useRef();
  const [cafeData, setCafe] = useState([]);
  const [price, setPrice] = useState(0);
  const [cafeDataId, setCafeId] = useState("");

  useEffect(() => {
    fetchCafe();
  }, []);

  const priceChange = (e) => {
    setPrice(e.target.value);
  };

  const editPrice = (id) => {
    setCafeId(id);
    cafeData.map((item) => {
      if (item.id == id) {
        setPrice(item.price);
      }
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("price", price);
    let url = `api/cafes`;
    if (cafeDataId != "") {
      url = `api/cafes/${cafeDataId}`;
      formData.append("_method", "PUT");
    }
    axios.post(url, formData).then((response) => {
      setPrice("");
      fetchCafe();
      setCafeId("");
    });
  };

  const deletePrice = (id) => {
    let params = { _method: "delete" };
    axios.post(`/api/cafes/${id}`, params).then((response) => {
      setPrice("");
      fetchCafe();
      setCafeId("");
    });
  };

  const fetchCafe = () => {
    axios.get("/api/cafes").then((response) => {
      setCafe(response.data);
    });
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Piscine-Laayoune",
  });

  return (
    <div class="part-1">
      <nav>
        <div class="left-nav">
          <h1>cafe</h1>
          <div>La Section Cafe</div>
        </div>
      </nav>
      <div class="content">
        <form method="Post" onSubmit={submitForm}>
          <div class="top-content">
            <div class="left-top-content">
              <p>Ajoute le cout:</p>
              <input
                type="number"
                className="salle"
                placeholder="ajoute cout...."
                name="price"
                value={price}
                onChange={priceChange}
              />
            </div>
          </div>
          <input type="submit" />
        </form>
        <div className="bottom-content">
          <input onClick={generatePDF} type="button" value="PDF" />
          <div className="table-pool">
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">cout</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {cafeData.map((item, i) => (
                  <tr key={item.id}>
                    <th>{i + 1}</th>
                    <td>{item.price}</td>
                    <td>
                      <button onClick={() => editPrice(item.id)}>update</button>
                      <button onClick={() => deletePrice(item.id)}>
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
