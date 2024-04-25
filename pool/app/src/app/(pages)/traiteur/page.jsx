"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import styles from "./page.module.css";

import UpdateTraiteur_Tool from "./UpdatePage";

export default function traiteur() {
  const [filterDateStart, setfilterDateStart] = useState('');
  const [filterDateEnd, setfilterDateEnd] = useState('');
  const [EventsTotal, setEventsTotal] = useState(0);
  const [Totatl, setTotal] = useState(0);
  const [FakeTotal, setFakeTotal] = useState(0);
  const [data_we_want_to_updated, setdata_we_want_to_updated] = useState({});
  const [UpdateTraiteurTool, setUpdateTraiteurTool] = useState(false);
  const [TraiteurTools, setTraiteurTools] = useState([]);
  const [TraiteurId, setTraiteurId] = useState(null);
  const [TraiteurName, setTraiteurName] = useState("");
  const [RegesteredTraiteurs, setRegesteredTraiteurs] = useState([]);
  const [UpdateTraiteurName, setUpdateTraiteurName] = useState(false);
  const [Traiteurs, setTraiteurs] = useState([]);
  const [tools, setTools] = useState([]);
  const [name, setName] = useState("");
  const [UpdateToolName, setUpdateToolName] = useState(false);
  const [ToolId, setToolId] = useState(null);
  const [Clients, setClients] = useState([]);
  const [SelectedPaymentMethod, setSelectedPaymentMethod] =
    useState("pay cash");
  const PaymentMethods = {
    "pay cash": "ادفع نقدا",
    "Payment by check": "الدفع عن طريق الشيكات",
    "Credit": "كريدي",
  };

  const notPayed = useRef();
  const TraiteurForm = useRef();
  const TargetTraiteur = useRef();
  const DateStart = useRef();
  const DateEnd = useRef();
  const TargetClient = useRef();
  const Advance = useRef();

  const DATE = new Date();
  const year = DATE.getFullYear();
  const month = DATE.getMonth() + 1;
  const day = DATE.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const result = await (await axios.get("/api/tools")).data;
        if (result.err) throw new Error(result.err);
        setTools(result.response);
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

    const getAllTraiteurs = async () => {
      try {
        const result = await (await axios.get("/api/getAllTraiteurs")).data;
        if (result.err) throw new Error(err);
        setRegesteredTraiteurs(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchTool();
    getAllTraiteurs();
    GetAllClients();
    getAllTraiteursTools({ now: formattedDate });
  }, []);

  useEffect(() => {
    setEventsTotal(0);
    if (TraiteurTools.length) {
      TraiteurTools.forEach(ele => {
        setEventsTotal(prev => prev + ele.Total);
      })
    } else {
      setEventsTotal(0);
    }
  }, [TraiteurTools]);

  useEffect(() => {
    setFakeTotal(Totatl);
  }, [Totatl]);

  const getAllTraiteursTools = async (data) => {
    try {
      const result = await (
        await axios.post(`/api/getAllTraiteursTools`, data)
      ).data;
      if (result.err) throw new Error(result.err);
      setTraiteurTools(result.response);
    } catch (error) {
      alert(error.message);
    }
  };

  const editTools = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("toolName", name);
      data.append("_method", "PUT");
      const result = await (
        await axios.post(`/api/tools/${ToolId}`, data)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setTools((prev) =>
          prev.map((ele) => {
            if (ele.id === ToolId) ele.name = name;
            return ele;
          })
        );

        setName("");
        setUpdateToolName(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const AddTool = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);

      const result = await (await axios.post("/api/tools", formData)).data;
      if (result.err) throw new Error(err);
      setTools([...tools, { id: result.response, name }]);
      setName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const AddTraiteur = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData(TraiteurForm.current);
      const result = await (await axios.post("/api/AddTraiteurs", data)).data;
      if (result.err) throw new Error(result.err);
      setRegesteredTraiteurs([
        ...RegesteredTraiteurs,
        {
          id: result.response,
          Name: Array.from(data)[0][1],
        },
      ]);

      setTraiteurName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteTools = async (e, id) => {
    e.preventDefault();

    try {
      const result = await (await axios.delete(`/api/tools/${id}`)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setTools((prev) => {
          return prev.filter((ele) => {
            return ele.id !== id;
          });
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const checkSelected = (e) => {
    const tool_id = e.target.value;
    const price =
      e.target.parentElement.nextElementSibling.nextElementSibling.children[0]
        .value;
    const quantity =
      e.target.parentElement.nextElementSibling.nextElementSibling
        .nextElementSibling.children[0].value;
    if (e.target.checked) {
      setTotal((prev) => prev + price * quantity);
      setTraiteurs([...Traiteurs, { tool_id, price, quantity }]);
    } else {
      setTotal((prev) => prev - price * quantity);
      setTraiteurs((prev) => {
        return prev.filter((ele) => ele.tool_id !== tool_id);
      });
    }
  };

  const SendTraiteursTool = async (e) => {
    e.preventDefault();

    try {
      const targetTraitreur = TargetTraiteur.current.value;
      const dateStart = DateStart.current.value;
      const dateEnd = DateEnd.current.value;
      const targetClient = TargetClient.current.value;
      const advance = Advance.current.value;
      const PaymentMethod = SelectedPaymentMethod;
      const data = {
        targetTraitreur,
        dateStart,
        dateEnd,
        Traiteurs,
        targetClient,
        Totatl: FakeTotal,
        advance,
        PaymentMethod
      };

      const result = await (
        await axios.post("/api/AddTraiteurTool", data)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setTraiteurTools((prev) => {
          let updated = false;

          const new_data = prev.map((ele) => {
            if (ele.traiteur_id == targetTraitreur) {
              const newAdvance = advance || 0;

              const updatedElement = {
                ...ele,
                Total: ele.Total + FakeTotal,
                Advance: parseInt(ele.Advance) + parseInt(newAdvance),
              };

              updated = true;
              return updatedElement;
            }

            return ele;
          });

          if (!updated) {
            const newElement = {
              traiteur_id: targetTraitreur,
              dateStart,
              dateEnd,
              ClientId: targetClient,
              Total: FakeTotal,
              Advance: advance || 0,
              PaymentMethod,
            };

            new_data.push(newElement);
          }

          return new_data;
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteTariteur = (id) => {
    axios
      .delete(`/api/deleteTraiteur/${id}`)
      .then((res) => {
        if (res.data.response) {
          setRegesteredTraiteurs((prev) => prev.filter((ele) => ele.id !== id));
        }
      })
      .catch((err) => alert(err.message));
  };

  const updateTraiteur = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TraiteurForm.current);
      data.append("id", TraiteurId);

      const result = await (await axios.post("/api/updateTraiteur", data)).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setRegesteredTraiteurs((prev) => {
          return prev.map((ele) => {
            if (ele.id === TraiteurId) return { ...ele, Name: TraiteurName };
            else return ele;
          });
        });

        setTraiteurName("");
        setUpdateTraiteurName(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const DeleteTraiteurTool = async (e, id) => {
    e.preventDefault();

    try {
      const result = await (
        await axios.delete(`/api/deleteTraiteursTool/${id}`)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setTraiteurTools((prev) =>
          prev.filter((ele) => {
            return ele.traiteur_id !== id;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {UpdateTraiteurTool ? (
        <UpdateTraiteur_Tool
          data={data_we_want_to_updated}
          clients={Clients}
          callback1={setUpdateTraiteurTool}
          callback2={setTraiteurTools}
        />
      ) : null}
      <div className="part-1" id="TraiteurContentX98723">
        <nav>
          <div className="left-nav">
            <h1>الأحدات</h1>
            <div>Ajoute les outil et les commandes</div>
          </div>
        </nav>
        <div className="content">
          <form>
            <div className="top-content">
              <div className="left-top-content">
                <p>إضافة أداة:</p>
                <input
                  type="text"
                  className="salle"
                  placeholder="إضافة أداة...."
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            {UpdateToolName ? (
              <input type="submit" value="Update Tool" onClick={editTools} />
            ) : (
              <input type="submit" value="Ajoute Outil" onClick={AddTool} />
            )}
          </form>
          <form ref={TraiteurForm}>
            <div className="top-content">
              <div className="left-top-content">
                <p>إضافة حدث:</p>
                <input
                  type="text"
                  className="salle"
                  placeholder="إضافة حدث...."
                  name="name"
                  value={TraiteurName}
                  onChange={(e) => setTraiteurName(e.target.value)}
                />
              </div>
            </div>
            {UpdateTraiteurName ? (
              <input
                type="submit"
                value="Update Party"
                onClick={(e) => updateTraiteur(e)}
              />
            ) : (
              <input type="submit" value="Ajoute Party" onClick={AddTraiteur} />
            )}
          </form>
          <div className="bottom-content">
            <div className="head-table">
              <p>List Des Events :</p>
              <div className="filter">
                Filter
                <Image width={10} height={10} src="/imgs/filter.png" />
              </div>
            </div>
            <div className="table-pool">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Id</th>
                    <th style={{ width: "60%" }}>Events name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {RegesteredTraiteurs.map((ele) => {
                    return (
                      <tr key={ele.id}>
                        <td>{ele.id}</td>
                        <td>{ele.Name}</td>
                        <td>
                          <button
                            onClick={(e) => {
                              const Trai_Name =
                                e.target.parentElement.previousElementSibling
                                  .textContent;

                              setTraiteurName(Trai_Name);
                              setUpdateTraiteurName(true);
                              setTraiteurId(ele.id);
                            }}
                          >
                            update
                          </button>
                          <button onClick={() => deleteTariteur(ele.id)}>
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
          <div className="bottom-content">
            <div className="head-table">
              <p>List Des Operations :</p>
              <div className="filter">
                Filter
                <Image width={10} height={10} src="/imgs/filter.png" alt="" />
              </div>
            </div>
            <form id="TraiteurToolsX98234">
              <div id="TraiteurActions">
                <div>
                  <div>
                    <select ref={TargetTraiteur}>
                      <option value={null}>Choose the event name</option>
                      {RegesteredTraiteurs.map((ele) => {
                        return <option value={ele.id}>{ele.Name}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <select ref={TargetClient}>
                      <option value={null}>Choose the client</option>
                      {Clients.map((ele) => {
                        return (
                          <option value={ele.id}>
                            {ele.FirstName} {ele.LastName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <input type="datetime-local" ref={DateStart} />
                  </div>
                  <div>
                    <input type="datetime-local" ref={DateEnd} />
                  </div>
                  <div>
                  <select
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
              </div>
              <div className="table-pool">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>outil</th>
                      <th>prix</th>
                      <th>quantite</th>
                      <th>action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            className={styles.checkpool}
                            type="checkbox"
                            value={item.id}
                            onChange={checkSelected}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>
                          <input
                            className="salle"
                            placeholder="ajoute prix..."
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            className="salle"
                            placeholder="ajoute qty..."
                            type="text"
                          />
                        </td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setName(item.name);
                              setUpdateToolName(true);
                              setToolId(item.id);
                            }}
                          >
                            update
                          </button>
                          <button onClick={(e) => deleteTools(e, item.id)}>
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div>
                  <input
                    type="number"
                    className="salle"
                    ref={Advance}
                    placeholder="Avance"
                    style={{ width: "50%" }}
                    onChange={(e) =>
                      setFakeTotal(() => {
                        if (e.target.value == "") return Totatl;
                        if (parseInt(e.target.value) < 0 || Totatl == 0)
                          return 0;
                        return Totatl - parseInt(e.target.value);
                      })
                    }
                  />
                  <p style={{ margin: "0", fontSize: "1.3rem" }}>
                    <span>{FakeTotal}</span> DH
                  </p>
                </div>
                <div className="submit-traiteur">
                  <input
                    type="submit"
                    style={{ margin: "0", width: "100%" }}
                    onClick={SendTraiteursTool}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="bottom-content">
            <div className="head-table">
              <p>List Des Traiteurs Tools :</p>
              <div className="filter">
                Filter
                <Image width={10} height={10} src="/imgs/filter.png" alt="" />
              </div>
            </div>
            <div id="traiteurFilterX090909">
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
                  getAllTraiteursTools({ start: filterDateStart, end: filterDateEnd })
                }
                style={{ alignSelf: "end", margin: "0px" }}
              >
                بحت
              </button>
            </div>
            <form>
              <div className="table-pool" style={{ overflow: "auto" }}>
                <table className="table" id="TraiteurToolsTable">
                  <thead>
                    <tr>
                      <th>event</th>
                      <th>client name</th>
                      <th>total</th>
                      <th>avance</th>
                      <th>payment method</th>
                      <th>date start</th>
                      <th>date end</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TraiteurTools.map((item) => {
                      const client = Clients.find(
                        (ele) => ele.id == item.ClientId
                      );
                      const { FirstName, LastName } = client || {};
                      return (
                        <tr key={item.traiteur_id}>
                          <td>
                            {
                              RegesteredTraiteurs.find(
                                (ele) => ele.id == item.traiteur_id
                              ).Name
                            }
                          </td>
                          <td>
                            {FirstName} {LastName}
                          </td>
                          <td>{item.Total}</td>
                          <td>{item.Advance ? item.Advance : 0}</td>
                          <td> {PaymentMethods[item.PaymentMethod]} </td>
                          <td style={{ fontSize: ".8rem" }}>
                            {item.dateStart}
                          </td>
                          <td style={{ fontSize: ".8rem" }}>{item.dateEnd}</td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateTraiteurTool(true);
                                setdata_we_want_to_updated(item);
                              }}
                            >
                              update
                            </button>
                            <button
                              onClick={(e) =>
                                DeleteTraiteurTool(e, item.traiteur_id)
                              }
                            >
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
          <div>
            <p id="PicinePool">{EventsTotal} dh</p>
          </div>
        </div>
      </div>
    </>
  );
}
