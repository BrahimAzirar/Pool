"use client";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import React from "react";

export default function piscine() {
  const conponentPDF = useRef();
  const [piscine, setPiscine] = useState([]);
  const [person, setPerson] = useState("");
  const [offer, setOffer] = useState("");
  const [piscineId, setPiscineId] = useState(0);

  useEffect(() => {
    fetchPiscine();
  }, []);

  const personChange = (e) => {
    setPerson(e.target.value);
  };

  const offerChange = (e) => {
    setOffer(e.target.value);
  };

  const editPiscine = (id) => {
    setPiscineId(id);
    piscine.map((item) => {
      if (item.id == id) {
        setOffer(item.offer);
        setPerson(item.add_person);
      }
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("offer", offer);
    formData.append("person", person);
    let url = `/api/pools`;
    console.log(piscineId);
    if (piscineId != "") {
      url = `/api/pools/${piscineId}`;
      formData.append("_method", "PUT");
    }
    axios.post(url, formData).then((response) => {
      setOffer("");
      setPerson("");
      fetchPiscine();
      setPiscineId("");
    });
  };

  const deletePiscine = (id) => {
    let params = { _method: "delete" };
    axios.post(`/api/pools/${id}`, params).then((response) => {
      setOffer("");
      setPerson("");
      fetchPiscine();
      setPiscineId("");
    });
  };

  const fetchPiscine = () => {
    axios.get("/api/pools").then((response) => {
      setPiscine(response.data);
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
          <h1>piscine</h1>
          <div>Votre piscine Personnel</div>
        </div>
      </nav>
      <div class="content">
        <form onSubmit={submitForm} method="Post">
          <div class="top-content">
            <div class="left-top-content">
              <p>Choisissez L'offer:</p>
              <input
                type="number"
                className="salle"
                placeholder="ajoute offer...."
                name="offer"
                value={offer}
                onChange={offerChange}
              />
            </div>
            <div class="right-top-content">
              <p>Autres piscine:</p>
              <input
                type="number"
                className="salle"
                placeholder="ajoute autre...."
                name="person"
                value={person}
                onChange={personChange}
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
                  <th scope="col">offer</th>
                  <th scope="col">autres piscine</th>
                  <th scope="col">total</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {piscine.map((item) => (
                  <tr key={item.id}>
                    <th>{item.references_pool}</th>
                    <td>{item.offer}</td>
                    <td>{item.add_person}</td>
                    <td>{item.total}</td>
                    <td>
                      <button onClick={() => editPiscine(item.id)}>
                        update
                      </button>
                      <button onClick={() => deletePiscine(item.id)}>
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
