"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function page() {
  const [Total, setTotal] = useState({
    TotalCredit: 0,
    TotalCash: 0,
    TotalCheck: 0,
    Total_S_Credit: 0,
    TotalBrrow: 0,
    TotalCreditHim: 0,
    TotalKhlasto: 0,
  });
  const [TransactionId, setTransactionId] = useState(null);
  const [Borrow_me, setBorrow_me] = useState(0);
  const [CreditHim, setCreditHim] = useState(0);
  const [PaidHim, setPaidHim] = useState(0);
  const [Result, setResult] = useState([]);
  const [Clients, setClients] = useState([]);
  const [Transactions, setTransactions] = useState([]);

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

    const getTransaction = async () => {
      try {
        const result = await (await axios.get("/api/calcul_presons")).data;
        if (result.err) throw new Error(result.err);
        console.log(result.response);
        setTransactions(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    getTransaction();
    GetAllClients();
  }, []);

  useEffect(() => {
    if (Transactions.length) {
      const combinedData = Transactions.reduce((acc, curr) => {
        curr.forEach((item) => {
          const { ClientId, ...rest } = item;
          if (!acc[ClientId]) {
            acc[ClientId] = {};
          }
          Object.assign(acc[ClientId], rest);
        });
        return acc;
      }, {});

      setResult(
        Object.keys(combinedData).map((ClientId) => ({
          ClientId: parseInt(ClientId),
          ...combinedData[ClientId],
        }))
      );
    }
  }, [Transactions]);

  useEffect(() => {
    setTotal((prev) => {
      Result.forEach(ele => {
        prev.TotalCash += ele.Cash;
        prev.TotalCheck += ele.PaymentByCheck;
        prev.TotalCredit += ele.Credit;
        prev.Total_S_Credit += ele.spent;
        prev.TotalBrrow += ele.borrow_me;
        prev.TotalCreditHim += ele.credit_for_him;
        prev.TotalKhlasto += ele.khlstou;
      });

      return prev;
    });
  }, [Result]);

  const AddTransaction = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("borrow_me", Borrow_me);
      data.append("credit_for_him", CreditHim);
      data.append("paidHim", PaidHim);
      data.append("_method", "PUT");

      const result = (await (axios.post(`/api/calcul_presons/${TransactionId}`, data))).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setResult(prev => prev.map(ele => {
          if (ele.ClientId == TransactionId) {
            ele.borrow_me = Borrow_me;
            ele.credit_for_him = CreditHim;
            ele.khlstou = PaidHim;
          };

          return ele;
        }))
      };
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="list-personel">
        <h1>list Personel</h1>
        <form className="inputs-list-personel">
          <div className="form-change">
            <label htmlFor="">
              <div>borrow me</div>
              <input
                type="number"
                value={Borrow_me}
                onChange={(e) => setBorrow_me(e.target.value)}
              />
            </label>
            <label htmlFor="">
              <div>credit him</div>
              <input
                type="number"
                value={CreditHim}
                onChange={(e) => setCreditHim(e.target.value)}
              />
            </label>
            <label htmlFor="">
              <div>paid him</div>
              <input
                type="number"
                value={PaidHim}
                onChange={(e) => setPaidHim(e.target.value)}
              />
            </label>
          </div>
          <button type="submit" onClick={AddTransaction}>
            Change
          </button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cash</th>
              <th>Check</th>
              <th>Client credit</th>
              <th>Supplier credit</th>
              <th>Borrow me</th>
              <th>Credit him</th>
              <th>خلصتو</th>
              <th>Payed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Result.map((v, i) => {
              const pre = Clients.find((ele) => ele.id == v.ClientId);
              return (
                <tr key={i}>
                  <td>
                    {pre?.FirstName} {pre?.LastName}
                  </td>
                  <td>{v.Cash}</td>
                  <td>{v.PaymentByCheck}</td>
                  <td>{v.Credit}</td>
                  <td>{v.spent ? v.spent : 0}</td>
                  <td>{v.borrow_me ? v.borrow_me : 0}</td>
                  <td>{v.credit_for_him ? v.credit_for_him : 0}</td>
                  <td>{v.khlstou ? v.khlstou : 0}</td>
                  <td>
                    {v.Credit -
                      (v.spent ? v.spent : 0) -
                      (v.borrow_me ? v.borrow_me : 0) +
                      (v.credit_for_him ? v.credit_for_him : 0) -
                      (v.khlstou ? v.khlstou : 0)}
                  </td>
                  <td>
                    <button onClick={() => {
                      setTransactionId(v.ClientId);
                      setPaidHim(v.khlstou ? v.khlstou : 0);
                      setBorrow_me(v.borrow_me ? v.borrow_me : 0);
                      setCreditHim(v.credit_for_him ? v.credit_for_him : 0);
                    }}>Update</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <thead>
            <tr>
              <th>Total</th>
              <th>{ Total.TotalCash }</th>
              <th>{ Total.TotalCheck }</th>
              <th>{ Total.TotalCredit }</th>
              <th>{ Total.Total_S_Credit }</th>
              <th>{ Total.TotalBrrow }</th>
              <th>{ Total.TotalCreditHim }</th>
              <th>{ Total.TotalKhlasto }</th>
              <th>0</th>
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
}
