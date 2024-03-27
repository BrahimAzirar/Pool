"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import styles from "./page.module.css";

import UpdateTraiteur_Tool from "./UpdatePage";

export default function traiteur() {
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

  const TraiteurForm = useRef();
  const TargetTraiteur = useRef();
  const DateStart = useRef();
  const DateEnd = useRef();

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

    const getAllTraiteurs = async () => {
      try {
        const result = await (await axios.get("/api/getAllTraiteurs")).data;
        if (result.err) throw new Error(err);
        setRegesteredTraiteurs(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    const getAllTraiteursTools = async () => {
      try {
        const result = await (
          await axios.get("/api/getAllTraiteursTools")
        ).data;
        if (result.err) throw new Error(result.err);
        setTraiteurTools(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchTool();
    getAllTraiteurs();
    getAllTraiteursTools();
  }, []);

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
    if (e.target.checked) {
      const price =
        e.target.parentElement.nextElementSibling.nextElementSibling.children[0]
          .value;
      const quantity =
        e.target.parentElement.nextElementSibling.nextElementSibling
          .nextElementSibling.children[0].value;

      console.log({ tool_id, price, quantity });

      setTraiteurs([...Traiteurs, { tool_id, price, quantity }]);
    } else {
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
      const data = { targetTraitreur, dateStart, dateEnd, Traiteurs };

      const result = await (
        await axios.post("/api/AddTraiteurTool", data)
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        const LastId = Math.max(...TraiteurTools.map((item) => item.id), 0);

        Traiteurs.forEach(({ tool_id, price, quantity }, idx) => {
          const data = {
            id: LastId + idx + 1,
            tool_id,
            traiteur_id: targetTraitreur,
            price,
            qty: quantity,
            dateStart,
            dateEnd,
          };

          setTraiteurTools((prevTraiteurTools) => [...prevTraiteurTools, data]);
        });

        TargetTraiteur.current.value = "";
        TargetTraiteur.current.value = "";
        DateEnd.current.value = "";
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
            return ele.id !== id;
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
          tools={tools}
          traiteurs={RegesteredTraiteurs}
          callback1={setUpdateTraiteurTool}
          callback2={setTraiteurTools}
        />
      ) : null}
      <div class="part-1">
        <nav>
          <div class="left-nav">
            <h1>traiteur</h1>
            <div>Ajoute les outil et les commandes</div>
          </div>
        </nav>
        <div class="content">
          <form>
            <div class="top-content">
              <div class="left-top-content">
                <p>Ajoute l'outil:</p>
                <input
                  type="text"
                  className="salle"
                  placeholder="ajoute outil...."
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
            <div class="top-content">
              <div class="left-top-content">
                <p>Ajoute traiteur:</p>
                <input
                  type="text"
                  className="salle"
                  placeholder="ajoute fête...."
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
              <p>List Des Traiteurs :</p>
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
                    <th style={{ width: "60%" }}>Traiteur name</th>
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
            <form>
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
              <div id="TraiteurActions">
                <div>
                  <div>
                    <select ref={TargetTraiteur}>
                      <option value={null}>Choose the party name</option>
                      {RegesteredTraiteurs.map((ele) => {
                        return <option value={ele.id}>{ele.Name}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <input type="datetime-local" ref={DateStart} />
                  </div>
                  <div>
                    <input type="datetime-local" ref={DateEnd} />
                  </div>
                </div>
                <div className="submit-traiteur">
                  <input type="submit" onClick={SendTraiteursTool} />
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
            <form>
              <div className="table-pool" style={{ overflow: "auto" }}>
                <table className="table" id="TraiteurToolsTable">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>outil</th>
                      <th>traiteur</th>
                      <th>price</th>
                      <th>quantity</th>
                      <th>date start</th>
                      <th>date end</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TraiteurTools.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>
                            {tools.find((ele) => ele.id == item.tool_id).name}
                          </td>
                          <td>
                            {
                              RegesteredTraiteurs.find(
                                (ele) => ele.id == item.traiteur_id
                              ).Name
                            }
                          </td>
                          <td>{item.price}</td>
                          <td>{item.qty}</td>
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
                              onClick={(e) => DeleteTraiteurTool(e, item.id)}
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
        </div>
      </div>
    </>
  );
};