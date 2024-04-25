"use client";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";
import React from "react";

export default function depenses() {
  const conponentPDF = useRef();
  const TargetForm = useRef();
  const [Clients, setClients] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [depensesId, setDepensesId] = useState(0);
  const [ExpenseDate, setExpenseDate] = useState("");
  const [UpdateExpense, setUpdateExpense] = useState(false);
  const [SelectedClient, setSelectedClient] = useState("");
  const [SelectedPaymentMethod, setSelectedPaymentMethod] = useState("pay cash");
  const PaymentMethods = {
    "pay cash": "ادفع نقدا",
    "Payment by check": "الدفع عن طريق الشيكات",
    "Credit": "كريدي",
  };

  useEffect(() => {
    const fetchDepense = async () => {
      try {
        const result = await (await axios.get("/api/depenses")).data;
        if (result.err) throw new Error(result.err);
        setDepenses(result.response); 
      } catch (error) {
        alert(error.message);
      }
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
  
    GetAllClients();
    fetchDepense();
  }, []);

  const editDepenses = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TargetForm.current);
      data.append("_method", "PUT");
      const result = await (
        await axios.post(`/api/depenses/${depensesId}`, data)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        const newData = { id: depensesId, ...Object.fromEntries(data) };
        setName("");
        setPrice("");
        setExpenseDate("");
        setDepensesId(0);
        setUpdateExpense(false);
        setDepenses((prev) =>
          prev.map((ele) => {
            if (ele.id == depensesId) return newData;
            return ele;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const AddExpense = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TargetForm.current);
      const result = await (await axios.post(`/api/depenses`, data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setName("");
        setPrice("");
        setExpenseDate("");
        setDepenses((prev) => [
          ...prev,
          { id: result.response, ...Object.fromEntries(data) },
        ]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteDepenses = async (e, id) => {
    e.preventDefault();

    try {
      const result = await (await axios.delete(`/api/depenses/${id}`)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setDepenses((prev) =>
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
    <div className="part-1">
      <nav>
        <div className="left-nav">
          <h1>depenses</h1>
          <div>La Section Depenses</div>
        </div>
      </nav>
      <div className="content">
        <form id="expensesForm" ref={TargetForm}>
          <div className="top-content">
            <div>
              <p>Le type de depenses:</p>
              <input
                type="text"
                className="salle"
                placeholder="le type de depenses...."
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <p>Date des dépenses:</p>
              <input
                type="date"
                className="salle"
                placeholder="date des dépenses...."
                name="expenseDate"
                value={ExpenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
            <div>
              <p>Choose the client</p>
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
                name="persone_id"
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
            </div>
            <div>
              <p>payment method</p>
              <select
                className={SelectedClient ? "" : "desableSelect"}
                value={SelectedPaymentMethod}
                onChange={e => setSelectedPaymentMethod(e.target.value)}
                name="PaymentMethod"
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
          {UpdateExpense ? (
            <input
              type="submit"
              onClick={editDepenses}
              value="modifier un dépense"
            />
          ) : (
            <input
              type="submit"
              onClick={AddExpense}
              value="Ajoutez un dépense"
            />
          )}
        </form>
        <div className="bottom-content">
          <input onClick={generatePDF} type="button" value="PDF" />
          <div className="table-pool">
            <table class="table" ref={conponentPDF}>
              <thead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">le type de cout</th>
                  <th scope="col">cout</th>
                  <th scope="col">date</th>
                  <th scope="col">action</th>
                </tr>
              </thead>
              <tbody>
                {depenses.map((item) => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.expenseDate}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setUpdateExpense(true);
                          setDepensesId(item.id);
                          setName(item.name);
                          setPrice(item.price);
                          setSelectedClient
                          setExpenseDate(item.expenseDate);
                          setSelectedPaymentMethod(item.PaymentMethod);
                          setSelectedClient(item.persone_id);
                        }}
                      >
                        update
                      </button>
                      <button onClick={(e) => deleteDepenses(e, item.id)}>
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
