"use client";

import axios from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function page() {
  const [Data, setData] = useState([]);
  const [Clients, setClients] = useState([]);
  const [Supplier, setSuppliers] = useState([]);
  const [ClientId, setClientId] = useState(0);
  const [CIN, setCIN] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Thel, setThel] = useState("");
  const [IsClient, setIsClient] = useState(0);
  const [IsSupplier, setIsSupplier] = useState(0);
  const [UpdateClient, setUpdateClient] = useState(false);

  const TargetForm = useRef();
  const is_client = useRef();
  const is_supplier = useRef();

  useEffect(() => {
    const GetAllClients = async () => {
      try {
        const result = await (await axios.get("/api/client")).data;
        if (result.err) throw new Error(result.err);
        setData(result.response);
        setClients([]);
        setSuppliers([]);
      } catch (error) {
        alert(error.message);
      };
    };

    GetAllClients();
  }, []);

  useEffect(() => {
    if (Data.length) {
      Data.forEach(ele => {
        if (parseInt(ele.isClient))
          setClients(prev => [...prev, ele]);
        if (parseInt(ele.isSupplier)) 
          setSuppliers(prev => [...prev, ele]);
      });
    } else {
      setClients([]);
      setSuppliers([]);
    };
  }, [Data]);

  const AddClient = async (e) => {
    e.preventDefault();

    try {
      setClients([]);
      setSuppliers([]);
      const Req_Data = new FormData(TargetForm.current);
      Req_Data.append('isClient', IsClient);
      Req_Data.append('isSupplier', IsSupplier);
      const result = await (await axios.post("/api/client", Req_Data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setCIN("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setThel("");
        setData((prev) => {
          return [
            ...prev,
            { ...Object.fromEntries(Req_Data), id: result.response },
          ];
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const DeleteClient = async (e, id) => {
    e.preventDefault();

    try {
      const result = await (await axios.delete(`/api/client/${id}`)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setData((prev) =>
          prev.filter((ele) => {
            return ele.id !== id;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const updateClient = async (e) => {
    e.preventDefault();

    try {
      const Req_data = new FormData(TargetForm.current);
      Req_data.append('isClient', IsClient);
      Req_data.append('isSupplier', IsSupplier);
      Req_data.append("_method", "PUT");
      const result = await (
        await axios.post(`/api/client/${ClientId}`, Req_data)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setClients([]);
        setSuppliers([]);
        setCIN('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setThel('');
        setClientId(0);
        setUpdateClient(false);
        setIsClient(0);
        setIsSupplier(0);
        is_client.current.checked = false;
        is_supplier.current.checked = false;
        const data = { id: ClientId, ...Object.fromEntries(Req_data) };
        setData((prev) =>
          prev.map((ele) => {
            if (ele.id === ClientId) return data;
            return ele;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div id="Client_Page">
      <div>
        <h1>إضافة عميل أو مورد</h1>
        <form ref={TargetForm}>
          <div>
            <input
              type="text"
              className="salle"
              name="ClientCIN"
              placeholder="CIN"
              value={CIN}
              onChange={(e) => setCIN(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="salle"
              name="FirstName"
              placeholder="الاسم الأول"
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="salle"
              name="LastName"
              placeholder="اسم العائلة"
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="salle"
              name="Thel"
              placeholder="رقم الهاتف"
              value={Thel}
              onChange={(e) => setThel(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="salle"
              name="Email"
              placeholder="بريد إلكتروني"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div>
              <label>عميل: </label>
              <input type="checkbox" ref={is_client} onChange={e => {
                if (e.target.checked)
                  setIsClient(1);
                else setIsClient(0);
              }}/>
            </div>
            <div>
            <div>
              <label>المورد: </label>
              <input type="checkbox" ref={is_supplier} onChange={e => {
                if (e.target.checked)
                  setIsSupplier(1);
                else setIsSupplier(0);
              }}/>
            </div>
            </div>
          </div>
          <div>
            {UpdateClient ? (
              <button onClick={updateClient}>تحديث</button>
            ) : (
              <button onClick={AddClient}>إضافة</button>
            )}
          </div>
        </form>
      </div>
      {Clients.length ? (
        <div className="bottom-content">
          <div className="head-table" style={{ margin: "0 auto" }}>
            <p>قائمة العملاء :</p>
            <div className="filter">
              Filter
              <Image width={10} height={10} src="/imgs/filter.png" alt="" />
            </div>
          </div>
          <form>
            <div
              className="table-pool"
              style={{ overflow: "auto", margin: "0 auto" }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>معرف العميل</th>
                    <th>CIN</th>
                    <th>الاسم الأول</th>
                    <th>اسم العائلة</th>
                    <th>رقم التليفون</th>
                    <th>بريد إلكتروني</th>
                    <th>الاختيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {Clients.map((ele) => {
                    return (
                      <tr key={ele.id}>
                        <td>{ele.id}</td>
                        <td>{ele.ClientCIN}</td>
                        <td>{ele.FirstName}</td>
                        <td>{ele.LastName}</td>
                        <td>{ele.Thel}</td>
                        <td>{ele.Email}</td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              setCIN(ele.ClientCIN);
                              setFirstName(ele.FirstName);
                              setLastName(ele.LastName);
                              setEmail(ele.Email);
                              setThel(ele.Thel);
                              setClientId(ele.id);
                              setUpdateClient(true);
                              setIsClient(1);
                              is_client.current.checked = true;

                              if (parseInt(ele.isSupplier)) {
                                is_supplier.current.checked = true;
                                setIsSupplier(1);
                              };
                            }}
                          >
                            update
                          </button>
                          <button onClick={(e) => DeleteClient(e, ele.id)}>
                            delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      ) : null}
      {Supplier.length ? (
        <div className="bottom-content">
          <div className="head-table" style={{ margin: "0 auto" }}>
            <p>List Des fournisseuse :</p>
            <div className="filter">
              Filter
              <Image width={10} height={10} src="/imgs/filter.png" alt="" />
            </div>
          </div>
          <form>
            <div
              className="table-pool"
              style={{ overflow: "auto", margin: "0 auto" }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>معرف المورد</th>
                    <th>CIN</th>
                    <th>الاسم الأول</th>
                    <th>اسم العائلة</th>
                    <th>رقم التليفون</th>
                    <th>بريد إلكتروني</th>
                    <th>الاختيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {Supplier.map((ele) => {
                    return (
                      <tr key={ele.id}>
                        <td>{ele.id}</td>
                        <td>{ele.ClientCIN}</td>
                        <td>{ele.FirstName}</td>
                        <td>{ele.LastName}</td>
                        <td>{ele.Thel}</td>
                        <td>{ele.Email}</td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              setCIN(ele.ClientCIN);
                              setFirstName(ele.FirstName);
                              setLastName(ele.LastName);
                              setEmail(ele.Email);
                              setThel(ele.Thel);
                              setClientId(ele.id);
                              setUpdateClient(true);
                              setIsSupplier(1);
                              is_supplier.current.checked = true;

                              if (parseInt(ele.isClient)) {
                                is_client.current.checked = true;
                                setIsClient(1);
                              };
                            }}
                          >
                            update
                          </button>
                          <button onClick={(e) => DeleteClient(e, ele.id)}>
                            delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
