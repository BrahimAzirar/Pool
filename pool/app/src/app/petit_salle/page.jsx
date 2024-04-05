"use client";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";

export default function grand_salle() {
  const conponentPDF = useRef();
  const TargetForm = useRef();
  const ClientSelect = useRef();
  const [UpdateSalle, setUpdateSalle] = useState(false);
  const [Clients, setClients] = useState([]);
  const [salles, setSalles] = useState([]);
  const [price, setPrice] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [sallesId, setSallesId] = useState("");

  useEffect(() => {
    const fetchSalle = async () => {
      const result = await (await axios.get("/api/salle")).data;
      if (result.err) throw new Error(result.err);
      setSalles(result.response);
    };

    const GetAllClients = async () => {
      try {
        const result = await (await axios.get("/api/client")).data;
        if (result.err) throw new Error(result.err);
        setClients(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchSalle();
    GetAllClients();
  }, []);

  const priceChange = (e) => {
    setPrice(e.target.value);
  };

  const dateStartChange = (e) => {
    setDateStart(e.target.value);
  };

  const dateEndChange = (e) => {
    setDateEnd(e.target.value);
  };

  const editSalle = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TargetForm.current);
      data.append("_method", "PUT");

      const result = await (await axios.post(`/api/salles/${sallesId}`, data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        const NewData = { id: sallesId, ...Object.fromEntries(data), is_salle: 1 };
        setUpdateSalle(false);
        setSallesId('');
        setPrice('');
        setDateStart('');
        setDateEnd('');
        ClientSelect.current.value = null;
        setSalles(prev => prev.map(ele => {
          if (ele.id == sallesId)
            return NewData;
          return ele;
        }))
      };
    } catch (error) {
      alert(error.message);
    }
  };

  const AddSalle = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TargetForm.current);
      data.append('is_salle', 1);
      const result = await (await axios.post("/api/salles", data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setPrice("");
        setDateStart("");
        setDateEnd("");
        setSalles((prev) => [
          ...prev,
          { id: result.response, ...Object.fromEntries(data) },
        ]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteSalle = async (id) => {
    try {
      const result = await (await axios.delete(`/api/salles/${id}`)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setSalles((prev) =>
          prev.filter((ele) => {
            return ele.id !== id;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Piscine-Laayoune",
  });

  return (
    <div class="part-1">
      <nav>
        <div class="left-nav">
          <h1>petite salle</h1>
          <div>Votre grand salle Personnel</div>
        </div>
      </nav>
      <div class="content">
        <form ref={TargetForm}>
          <div class="top-content">
            <div class="left-top-content">
              <div className="d-l">
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
              <div>
                <p>Ajoutez un client: </p>
                <select name="ClientId" ref={ClientSelect} className="Salle_Client_Select">
                  <option value={null}>Choose a client</option>
                  {Clients.map((ele) => {
                    return (
                      <option key={ele.id} value={ele.id}>
                        {ele.FirstName} {ele.LastName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div class="right-top-content">
              <p>Selectionnez la period:</p>
              <div className="date-total">
                <div className="date-left">
                  <label htmlFor="">Date start :</label>
                  <input
                    type="datetime-local"
                    className="salle"
                    name="date_start"
                    value={dateStart}
                    onChange={dateStartChange}
                  />
                </div>
                <div className="date-right">
                  <label htmlFor="">Date end :</label>
                  <input
                    type="datetime-local"
                    className="salle"
                    name="date_end"
                    value={dateEnd}
                    onChange={dateEndChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {
            UpdateSalle ?
            <input type="submit" onClick={editSalle} value='Update salle' /> :
            <input type="submit" onClick={AddSalle} value='Add salle' />
          }
        </form>
        <div className="bottom-content">
          <input onClick={generatePDF} type="button" value="PDF" />
          <div className="table-pool">
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">client name</th>
                  <th scope="col">cout</th>
                  <th scope="col">start</th>
                  <th scope="col">end</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {salles.map((item) => {
                  const client = Clients.find(
                    (ele) => ele.id == item.ClientId
                  );
                  const FirstName = client?.FirstName || "Unknown";
                  const LastName = client?.LastName || "Unknown";
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {FirstName} {LastName}
                      </td>
                      <td>{item.price}</td>
                      <td>{item.date_start}</td>
                      <td>{item.date_end}</td>
                      <td>
                        <button onClick={() => {
                          setUpdateSalle(true);
                          setSallesId(item.id);
                          setPrice(item.price);
                          setDateStart(item.date_start);
                          setDateEnd(item.date_end);
                          ClientSelect.current.value = item.ClientId;
                        }}>
                          update
                        </button>
                        <button onClick={() => deleteSalle(item.id)}>
                          delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
