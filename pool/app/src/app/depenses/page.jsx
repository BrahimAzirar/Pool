"use client";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import React from "react";

export default function depenses() {
  const conponentPDF = useRef();
  const [depenses, setDepenses] = useState([]);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [depensesId, setDepensesId] = useState(0);

  useEffect(() => {
    fetchDepense();
  }, []);

  const priceChange = (e) => {
    setPrice(e.target.value);
  };

  const nameChange = (e) => {
    setName(e.target.value);
  };

  const editDepenses = (id) => {
    setDepensesId(id);
    depenses.map((item) => {
      if (item.id == id) {
        setPrice(item.price);
        setName(item.name);
      }
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("price", price);
    formData.append("name", name);
    let url = `/api/depenses`;
    console.log(depensesId);
    if (depensesId != "") {
      url = `/api/depenses/${depensesId}`;
      formData.append("_method", "PUT");
    }
    axios.post(url, formData).then((response) => {
      setPrice("");
      setName("");
      fetchDepense();
      setDepensesId("");
    });
  };

  const deleteDepenses = (id) => {
    let params = { _method: "delete" };
    axios.post(`/api/depenses/${id}`, params).then((response) => {
      setPrice("");
      setName("");
      fetchDepense();
      setDepensesId("");
    });
  };

  const fetchDepense = () => {
    axios.get("/api/depenses").then((response) => {
      setDepenses(response.data);
    });
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Piscine-Laayoune",
  });

  return (
    <div className="part-1">
      <nav>
        <div className="left-nav">
          <h1>depenses</h1>
          <div>La Section Depenses</div>
        </div>
      </nav>
      <div className="content">
        <form method="Post" onSubmit={submitForm}>
          <div className="top-content">
            <div className="left-top-content">
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
            <div className="right-top-content">
              <p>Le type de depenses:</p>
              <input
                type="text"
                className="salle"
                placeholder="le type de depenses...."
                name="name"
                value={name}
                onChange={nameChange}
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
                  <th scope="col">le type de cout</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {depenses.map((item, i) => (
                  <tr key={item.id}>
                    <th>{i + 1}</th>
                    <td>{item.price}</td>
                    <td>{item.name}</td>
                    <td>
                      <button onClick={() => editDepenses(item.id)}>
                        update
                      </button>
                      <button onClick={() => deleteDepenses(item.id)}>
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
