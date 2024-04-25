"use client";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import "./style.css";

export default function grand_salle() {
  const conponentPDF = useRef();
  const TargetForm = useRef();
  const SelectedPaymentMethod = useRef();
  const [SelectedClient, setSelectedClient] = useState(null);
  const [UpdateSalle, setUpdateSalle] = useState(false);
  const [Clients, setClients] = useState([]);
  const [salles, setSalles] = useState([]);
  const [price, setPrice] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [sallesId, setSallesId] = useState("");
  const [Total, setTotal] = useState(0);
  const [filterDateStart, setfilterDateStart] = useState("");
  const [filterDateEnd, setfilterDateEnd] = useState("");
  const DATE = new Date();
  const year = DATE.getFullYear();
  const month = DATE.getMonth() + 1;
  const day = DATE.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const PaymentMethods = {
    "pay cash": "ادفع نقدا",
    "Payment by check": "الدفع عن طريق الشيكات",
    "Credit": "كريدي",
  };

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

    fetchSalle({ now: formattedDate });
    GetAllClients();
  }, []);

  useEffect(() => {
    setTotal(0);
    if (salles.length) {
      salles.forEach((ele) => {
        setTotal((prev) => prev + parseInt(ele.price));
      });
    }
  }, [salles]);

  const fetchSalle = async (data) => {
    const result = await (await axios.post("/api/grandSalles", data)).data;
    if (result.err) throw new Error(result.err);
    setSalles(result.response);
  };

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
      data.append("ClientId", SelectedClient);
      data.append("_method", "PUT");

      if (Object.values(Object.fromEntries(data)).values().some(ele => ele == ''))
        throw new Error("Some feilds is empty");

      const result = await (
        await axios.post(`/api/salles/${sallesId}`, data)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        const NewData = {
          id: sallesId,
          ...Object.fromEntries(data),
          is_salle: 0,
        };
        setUpdateSalle(false);
        setSallesId("");
        setPrice("");
        setDateStart("");
        setDateEnd("");
        setSelectedClient(null);
        setSalles((prev) =>
          prev.map((ele) => {
            if (ele.id == sallesId) return NewData;
            return ele;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const AddSalle = async (e) => {
    e.preventDefault();

    try {
      // if (!SelectedClient) throw new Error("اختر عميلاً من القائمة");
      const data = new FormData(TargetForm.current);
      data.append("ClientId", SelectedClient);
      data.append("is_salle", 0);
      if (Object.values(Object.fromEntries(data)).values().some(ele => ele == ''))
        throw new Error("Some feilds is empty");
      const result = await (await axios.post("/api/salles", data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setPrice("");
        setDateStart("");
        setDateEnd("");
        setSelectedClient(null);
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
          <h1>القاعة الكبيرة</h1>
          <div>Votre grand salle Personnel</div>
        </div>
      </nav>
      <div class="content">
        <form ref={TargetForm}>
          <div class="top-content">
            <div class="left-top-content">
              <div className="d-l">
                <p>أضف التكلفة:</p>
                <input
                  type="number"
                  className="salle"
                  placeholder="أضف التكلفة...."
                  name="price"
                  value={price}
                  onChange={priceChange}
                />
              </div>
              <div>
                <p>اختر عميلا : </p>
                <select
                  className="Salle_Client_Select"
                  value={SelectedClient}
                  onChange={(e) => {
                    setSelectedClient(() => {
                      if (e.target.value == "اختر عميلاً") {
                        SelectedPaymentMethod.current.value = "pay cash";
                        return null;
                      }

                      return e.target.value;
                    });
                  }}
                >
                  <option value={null}>اختر عميلاً</option>
                  {Clients.map((ele) => {
                    return (
                      <option key={ele.id} value={ele.id}>
                        {ele.FirstName} {ele.LastName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div style={{ margin: "10px auto 0 auto" }}>
                <select
                  name="PaymentMethod"
                  ref={SelectedPaymentMethod}
                  className={
                    SelectedClient
                      ? "Salle_Client_Select"
                      : "desableSelect Salle_Client_Select"
                  }
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
            <div class="right-top-content">
              <p>حدد الفترة:</p>
              <div className="date-total">
                <div className="date-left">
                  <label htmlFor="">تاريخ البدء :</label>
                  <input
                    type="datetime-local"
                    className="salle"
                    name="date_start"
                    value={dateStart}
                    onChange={dateStartChange}
                  />
                </div>
                <div className="date-right">
                  <label htmlFor="">تاريخ الانتهاء :</label>
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
          {UpdateSalle ? (
            <input type="submit" onClick={editSalle} value="تحديث" />
          ) : (
            <input type="submit" onClick={AddSalle} value="إضافة" />
          )}
        </form>
        <div className="bottom-content" id="SallesX987438">
          <div>
            <input onClick={generatePDF} type="button" value="PDF" />
            <div>
              <div>
                <label>البحث حسب تاريخ البدء</label>
                <input
                  type="date"
                  className="salle"
                  value={filterDateStart}
                  onChange={(e) => setfilterDateStart(e.target.value)}
                  style={{ width: "90%" }}
                />
              </div>
              <div>
                <label>البحث حسب تاريخ الانتهاء</label>
                <input
                  type="date"
                  className="salle"
                  value={filterDateEnd}
                  onChange={(e) => setfilterDateEnd(e.target.value)}
                  style={{ width: "90%" }}
                />
              </div>
              <button
                onClick={() =>
                  fetchSalle({ start: filterDateStart, end: filterDateEnd })
                }
                style={{ alignSelf: "end", margin: "0px" }}
              >
                بحت
              </button>
            </div>
          </div>
          <div className="table-pool" style={{ width: "100%" }}>
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">المعرف</th>
                  <th scope="col">اسم العميل</th>
                  <th scope="col">تكلفة</th>
                  <th scope="col">طريقة الدفع</th>
                  <th scope="col">تاريخ البداية</th>
                  <th scope="col">تاريخ النهاية</th>
                  <th scope="col">الاختيارات</th>
                </tr>
              </thead>
              <tbody>
                {salles.map((item) => {
                  const client = Clients.find((ele) => ele.id == item.ClientId);
                  const FirstName = client?.FirstName || "Unknown";
                  const LastName = client?.LastName || "Unknown";
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {FirstName} {LastName}
                      </td>
                      <td>{item.price}</td>
                      <td>{PaymentMethods[item.PaymentMethod]}</td>
                      <td>{item.date_start}</td>
                      <td>{item.date_end}</td>
                      <td>
                        <button
                          onClick={() => {
                            setUpdateSalle(true);
                            setSallesId(item.id);
                            setPrice(item.price);
                            setDateStart(item.date_start);
                            setDateEnd(item.date_end);
                            setSelectedClient(item.ClientId);
                            SelectedPaymentMethod.current.value =
                              item.PaymentMethod;
                          }}
                        >
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
        <div id="Salle_total">
          <p>{Total} dh</p>
        </div>
      </div>
    </div>
  );
}
