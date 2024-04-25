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
  const [Total, setTotal] = useState(0);
  const [DatePool, setDatePool] = useState("");
  const [Clients, setClients] = useState([]);
  const [ClientsCount, setClientsCount] = useState(0);
  const [SelectedClient, setSelectedClient] = useState(null);
  const [SelectedPaymentMethod, setSelectedPaymentMethod] =
    useState("pay cash");
  const PaymentMethods = {
    "pay cash": "ادفع نقدا",
    "Payment by check": "الدفع عن طريق الشيكات",
    "Credit": "كريدي",
  };

  const conponentPDF = useRef();
  const OffersContainer = useRef();
  const DATE = new Date();
  const year = DATE.getFullYear();
  const month = DATE.getMonth() + 1;
  const day = DATE.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  useEffect(() => {
    const GetAllClients = async () => {
      try {
        const result = await (await axios.get("/api/client")).data;
        if (result.err) throw new Error(result.err);
        setClients(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    GetAllClients();
    fetchPiscine();
  }, []);

  useEffect(() => {
    setClientsCount(0)
    if (piscine.length) {
      getTotal();
    }

  }, [piscine]);

  const fetchPiscine = async (date = formattedDate) => {
    try {
      const result = await (await axios.get(`/api/pools/${date}`)).data;
      if (result.err) throw new Error(result.err);
      setPiscine(result.response);
      if (!result.response.length) setTotal(0);
    } catch (error) {
      alert(error.message);
    }
  };

  const editPiscine = async (e) => {
    e.preventDefault();

    try {
      if (Offers.length === 1) {
        const reqData = new FormData();
        reqData.append("person", clientCounts);
        reqData.append("offer", Offers[0]);
        if (SelectedClient) reqData.append("SelectedClient", SelectedClient);
        reqData.append("PaymentMethod", SelectedPaymentMethod);
        reqData.append("_method", "PUT");

        const result = await (
          await axios.post(`/api/pools/${piscineId}`, reqData)
        ).data;
        if (result.err) throw new Error(result.err);
        if (result.response) {
          setPiscine((prev) =>
            prev.map((ele) => {
              if (ele.id == parseInt(piscineId)) {
                ele.offer = Offers[0];
                ele.add_person = clientCounts;
                ele.SelectedClient = SelectedClient;
                ele.PaymentMethod = SelectedPaymentMethod;
              };

              return ele;
            })
          );
          setclientCounts(0);
          setUpdatePicine(false);
        }
      } else throw new Error("Choose only one offer");
    } catch (error) {
      alert(error.message);
    }
  };

  const AddPoolOffer = async (e) => {
    e.preventDefault();

    try {
      const data = Offers.map((ele) => {
        return {
          offer: ele,
          add_person: clientCounts,
          poolDate: formattedDate,
          SelectedClient,
          PaymentMethod: SelectedPaymentMethod,
        };
      });
      const result = await (await axios.post("/api/pools", data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        let id = result.response,
          dataReturned = [];
        setclientCounts(0);
        Array.from(OffersContainer.current.children).forEach((ele) => {
          ele.classList.remove("ActiveOffer");
        });
        data
          .reverse()
          .forEach(
            ({
              offer,
              add_person,
              poolDate,
              SelectedClient,
              PaymentMethod,
            }) => {
              dataReturned.push({
                id,
                offer,
                add_person,
                poolDate,
                SelectedClient,
                PaymentMethod,
              });
              id -= 1;
            }
          );
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

  const getTotal = () => {
    const listOfTotal = piscine.map((ele) => {
      setClientsCount(prev => prev + parseInt(ele.add_person));
      if (ele.poolDate === DatePool ? DatePool : formattedDate) {
        return ele.offer * ele.add_person;
      }
    });

    let someOfTotal = 0;

    listOfTotal.forEach((ele) => {
      if (ele) someOfTotal += ele;
    });

    setTotal(someOfTotal);
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Piscine-Laayoune",
  });

  return (
    <div id="PoolPage" className="part-1">
      <nav>
        <div className="left-nav">
          <h1>حمام سباحة</h1>
          <div>Votre piscine Personnel</div>
        </div>
      </nav>
      <div className="content">
        <form id="AddPicine">
          <div>
            <div id="Offers" ref={OffersContainer}>
              {[2, 3, 5, 10, 15, 20, 25, 30].map((ele) => {
                return (
                  <div key={ele} onClick={ActiveOffer}>
                    {ele}
                  </div>
                );
              })}
            </div>
            <div style={{ width: "30%" }}>
              <select
                style={{ marginBottom: "15px" }}
                value={SelectedClient}
                onChange={(e) =>
                  setSelectedClient(() => {
                    if (e.target.value == "اختر العميل") {
                      setSelectedPaymentMethod("pay cash");
                      return null;
                    };
                    return e.target.value;
                  })
                }
              >
                <option value={null}>اختر العميل</option>
                {Clients.map((ele) => {
                  return (
                    <option value={ele.id} key={ele.id}>
                      {ele.FirstName} {ele.LastName}
                    </option>
                  );
                })}
              </select>
              <select
                className={SelectedClient ? "" : "desableSelect"}
                value={SelectedPaymentMethod}
                onChange={(e) => {
                  setSelectedPaymentMethod(e.target.value);
                }}
              >
                {Object.keys(PaymentMethods).map((ele) => {
                  return (
                    <option value={ele} key={ele}>
                      {PaymentMethods[ele]}
                    </option>
                  );
                })}
              </select>
            </div>
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
              <button onClick={editPiscine}>تحديث</button>
            ) : (
              <button onClick={AddPoolOffer}>إضافة</button>
            )}
          </div>
        </form>
        <div className="bottom-content" id="Picine-bottom-content">
          <div>
            <input onClick={generatePDF} type="button" value="PDF" />
            <input
              className="salle"
              type="date"
              style={{ width: "40%" }}
              value={DatePool}
              onChange={(e) => setDatePool(e.target.value)}
            />
            <button onClick={() => fetchPiscine(DatePool)}>calc total</button>
          </div>
          <div className="table-pool">
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">المعرف</th>
                  <th scope="col">اسم العميل</th>
                  <th scope="col">العرض</th>
                  <th scope="col">عدد العملاء</th>
                  <th scope="col">مجموع</th>
                  <th scope="col">طرق الدفع</th>
                  <th scope="col">تاريخ</th>
                  <th scope="col">الاختيارات</th>
                </tr>
              </thead>
              <tbody>
                {piscine.map((item) => {
                  const client = Clients.find(
                    (ele) => ele.id == item.SelectedClient
                  );
                  const { FirstName, LastName } = client || {};

                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {FirstName} {LastName}
                      </td>
                      <td>{item.offer}</td>
                      <td>{item.add_person}</td>
                      <td>{item.offer * item.add_person}</td>
                      <th>{PaymentMethods[item.PaymentMethod]}</th>
                      <td>{item.poolDate}</td>
                      <td>
                        <button
                          onClick={() => {
                            setOffers([parseInt(item.offer)]);
                            setclientCounts(item.add_person);
                            setUpdatePicine(true);
                            setPiscineId(item.id);
                            setSelectedClient(item.SelectedClient);
                            setSelectedPaymentMethod(item.PaymentMethod);
                            Array.from(
                              OffersContainer.current.children
                            ).forEach((ele) => {
                              if (ele.textContent == item.offer)
                                ele.classList.add("ActiveOffer");
                              else ele.classList.remove("ActiveOffer");
                            });
                          }}
                        >
                          update
                        </button>
                        <button onClick={() => deletePiscine(item.id)}>
                          delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <p id="PicinePool" style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ margin: "0 20px 0 0" }}>عدد العملاء {ClientsCount} </p>
              <p style={{ margin: "0 0 0 20px" }}>{Total} dh</p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
