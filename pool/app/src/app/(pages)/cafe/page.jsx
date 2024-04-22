"use client";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import React from "react";

export default function cafe() {
  const conponentPDF = useRef();
  const TargetForm = useRef();
  const [cafeData, setCafe] = useState([]);
  const [price, setPrice] = useState(0);
  const [EmployeName, setEmployeName] = useState("");
  const [date, setDate] = useState("");
  const [Update, setUpdate] = useState(false);
  const [cafeDataId, setCafeId] = useState(0);
  const [Total, setTotal] = useState(0);
  const [TargetDate, setTargetDate] = useState('');
  const DATE = new Date();
  const year = DATE.getFullYear();
  const month = DATE.getMonth() + 1;
  const day = DATE.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  useEffect(() => {
    fetchCafe(formattedDate);
  }, []);

  useEffect(() => {
    setTotal(0);
    
    if (cafeData.length) {
      cafeData.forEach(ele => {
        setTotal(prev => prev + parseInt(ele.price));
      });
    }
  }, [cafeData]);

  const fetchCafe = async (date) => {
    try {
      const result = await (await axios.get(`/api/cafes/${date}`)).data;
      if (result.err) throw new Error(result.err);
      setCafe(result.response);
    } catch (error) {
      alert(error.message);
    };
  };

  const editPrice = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TargetForm.current);
      data.append("_method", "PUT");
      const result = await ( await axios.post(`/api/cafes/${cafeDataId}`, data) ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        const newData = { id: cafeDataId, ...Object.fromEntries(data) };
        setUpdate(false);
        setCafeId(0);
        setPrice("");
        setDate("");
        setEmployeName("");
        setCafe(prev => prev.map(ele => {
          if (ele.id == cafeDataId)
            return newData;
          return ele;
        }))
      }
    } catch (error) {
      alert(error.message);
    };
  };

  const AddCafee = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TargetForm.current);
      const result = await (await axios.post("/api/cafes", data)).data;
      if (result.err) throw new Error(result.err);
      setCafe((prev) => [
        ...prev,
        { id: result.response, ...Object.fromEntries(data) },
      ]);
      setPrice("");
      setDate("");
      setEmployeName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const deletePrice = async (id) => {
    try {
      const result = await (await axios.delete(`/api/cafes/${id}`)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setCafe((prev) =>
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
          <h1>cafe</h1>
          <div>La Section Cafe</div>
        </div>
      </nav>
      <div class="content">
        <form id="FormCafeePage" ref={TargetForm}>
          <div class="top-content">
            <div>
              <p>Ajouter le nom de l'employé:</p>
              <input
                type="text"
                className="salle"
                placeholder="Ajouter le nom de l'employé...."
                name="EmployeName"
                value={EmployeName}
                onChange={(e) => setEmployeName(e.target.value)}
              />
            </div>
            <div>
              <p>Ajoute le cout:</p>
              <input
                type="number"
                className="salle"
                placeholder="ajoute cout...."
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <p>Ajoute la date:</p>
              <input
                type="date"
                className="salle"
                name="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          {
            Update ?
              <input type="submit" onClick={editPrice} value='Update'/> :
              <input type="submit" onClick={AddCafee} />
          }
        </form>
        <div className="bottom-content" id="Cafe-bottom-content">
          <div>
            <input onClick={generatePDF} type="button" value="PDF" style={{ margin: "0" }}/>
            <input
              className="salle"
              type="date"
              style={{ width: "40%" }}
              value={TargetDate}
              onChange={e => setTargetDate(e.target.value)}
            />
            <button style={{ margin: "0" }} onClick={() => fetchCafe(TargetDate)}>calc total</button>
          </div>
          <div className="table-pool">
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">nom de l'employé</th>
                  <th scope="col">cout</th>
                  <th scope="col">date</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {cafeData.length
                  ? cafeData.map((item) => (
                      <tr key={item.id}>
                        <th>{item.id}</th>
                        <td>{item.EmployeName}</td>
                        <td>{item.price}</td>
                        <td>{item.Date}</td>
                        <td>
                          <button onClick={() => {
                            setUpdate(true);
                            setCafeId(item.id);
                            setEmployeName(item.EmployeName);
                            setPrice(item.price);
                            setDate(item.Date);
                          }}>
                            update
                          </button>
                          <button onClick={() => deletePrice(item.id)}>
                            delete
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <p id="PicinePool">{Total} dh</p>
        </div>
      </div>
    </div>
  );
}
