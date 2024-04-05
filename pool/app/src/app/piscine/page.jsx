"use client";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import React from "react";

export default function piscine() {
  const [Offers, setOffers] = useState([]);
  const [clientCounts, setclientCounts] = useState(0);
  const [piscine, setPiscine] = useState([]);
  const [piscineId, setPiscineId] = useState(0);
  const [UpdatePicine, setUpdatePicine] = useState(false);

  const conponentPDF = useRef();
  const OffersContainer = useRef();

  useEffect(() => {
    const fetchPiscine = async () => {
      try {
        const result = await (await axios.get("/api/pools")).data;
        if (result.err) throw new Error(result.err);
        setPiscine(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchPiscine();
  }, []);

  const editPiscine = async (e) => {
    e.preventDefault();

    try {
      if (Offers.length === 1) {
        const reqData = new FormData();
        reqData.append('person', clientCounts);
        reqData.append('offer', Offers[0]);
        reqData.append("_method", "PUT");

        const result = await (await axios.post(`/api/pools/${piscineId}`, reqData)).data;
        if (result.err) throw new Error(result.err);
        if (result.response) {
          setOffers(prev => prev.map(ele => {
            if (ele.id == parseInt(piscineId)) {
              ele.offer = Offers[0];
              ele.add_person = clientCounts;
            }
            else console.log(ele.id, parseInt(piscineId), ele.id == parseInt(piscineId));

            return ele;
          }));
          setclientCounts(0);
        };
      } else throw new Error("Choose only one offer");
    } catch (error) {
      alert(error.message);
    }
  };

  const AddPoolOffer = async (e) => {
    e.preventDefault();

    try {
      const data = Offers.map((ele) => {
        return { offer: ele, add_person: clientCounts };
      });
      const result = await (await axios.post("/api/pools", data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        let id = result.response, dataReturned = [];
        setclientCounts(0);
        Array.from(OffersContainer.current.children).forEach((ele) => {
          ele.classList.remove("ActiveOffer");
        });
        data.reverse().forEach(({ offer, add_person }) => {
          dataReturned.push({ id, offer, add_person });
          id -= 1;
        });
        dataReturned = dataReturned.reverse();
        setPiscine((prev) => [...prev, ...dataReturned]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deletePiscine = async (id) => {
    try {
      const params = { _method: "delete" };
      const result = await (await axios.post(`/api/pools/${id}`, params)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setPiscine((prev) =>
          prev.filter((ele) => {
            return ele.id !== id;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const ActiveOffer = async (e) => {
    e.target.classList.toggle("ActiveOffer");
    if (e.target.className == "ActiveOffer") {
      setOffers((prev) => [...prev, parseInt(e.target.textContent)]);
    } else {
      setOffers((prev) =>
        prev.filter((ele) => ele !== parseInt(e.target.textContent))
      );
    }
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Piscine-Laayoune",
  });

  return (
    <div id="PoolPage" className="part-1">
      <nav>
        <div className="left-nav">
          <h1>piscine</h1>
          <div>Votre piscine Personnel</div>
        </div>
      </nav>
      <div className="content">
        <form>
          <div id="Offers" ref={OffersContainer}>
            {[2, 3, 5, 10, 15, 20, 25, 30].map((ele) => {
              return (
                <div key={ele} onClick={ActiveOffer}>
                  {ele}
                </div>
              );
            })}
          </div>
          <div id="CountsClient">
            <input
              type="number"
              name="count"
              className="salle"
              value={clientCounts}
              onChange={(e) => setclientCounts(e.target.value)}
              placeholder="Enter the clients count"
            />
            {UpdatePicine ? (
              <button onClick={editPiscine}>Update piscine offers</button>
            ) : (
              <button onClick={AddPoolOffer}>Send piscine offers</button>
            )}
          </div>
        </form>
        <div className="bottom-content">
          <input onClick={generatePDF} type="button" value="PDF" />
          <div className="table-pool">
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">offer</th>
                  <th scope="col">the clients count</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {piscine.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.offer}</td>
                    <td>{item.add_person}</td>
                    <td>
                      <button
                        onClick={() => {
                          setOffers([parseInt(item.offer)]);
                          setclientCounts(item.add_person);
                          setUpdatePicine(true);
                          setPiscineId(item.id);
                          Array.from(OffersContainer.current.children).forEach(
                            (ele) => {
                              if (ele.textContent == item.offer)
                                ele.classList.add("ActiveOffer");
                              else ele.classList.remove("ActiveOffer");
                            }
                          );
                        }}
                      >
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
