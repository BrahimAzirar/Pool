"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import styles from "./page.module.css";

export default function traiteur() {
  const [TraiteurId, setTraiteurId] = useState(null);
  const [UpdateTraiteurName, setUpdateTraiteurName] = useState(false);
  const [TraiteurName, setTraiteurName] = useState("");
  const [RegesteredTraiteurs, setRegesteredTraiteurs] = useState([]);
  const [Traiteurs, setTraiteurs] = useState([]);
  const [tools, setTools] = useState([]);
  const [name, setName] = useState("");

  const TraiteurForm = useRef();

  useEffect(() => {
    const getAllTraiteurs = async () => {
      try {
        const result = await (await axios.get("/api/getAllTraiteurs")).data;
        if (result.err) throw new Error(err);
        setRegesteredTraiteurs(result.response);
      } catch (error) {
        alert(error.message);
      };
    };

    fetchTool();
    getAllTraiteurs();
  }, []);

  const editTools = (id) => {
    
    tools.map((item) => {
      if (item.id == id) {
        setName(item.name);
      }
    });
  };

  const AddTool = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      
      const result = await (await axios.post('/api/tools', formData)).data;
      if (result.err) throw new Error(err);
      setTools([ ...tools, { id: result.response, name } ])
      setName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const AddTraiteur = (e) => {
    e.preventDefault();
    const data = new FormData(TraiteurForm.current);
    axios.post("/api/AddTraiteurs", data).then((res) => {
      setRegesteredTraiteurs([
        ...RegesteredTraiteurs,
        {
          id: res.data.response,
          Name: Array.from(data)[0][1],
        },
      ]);

      setTraiteurName("");
    });
  };

  const deleteTools = (id) => {
    axios.delete(`/api/tools/${id}`).then((response) => {
      setName("");
      fetchTool();
    });
  };

  const fetchTool = () => {
    axios.get("/api/tools").then((response) => {
      setTools(response.data);
    });
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
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

      setTraiteurs([...Traiteurs, { tool_id, price, quantity }]);
    } else {
      setTraiteurs((prev) => {
        return prev.filter((ele) => ele.tool_id !== tool_id);
      });
    }
  };

  const SendTraiteurs = (e) => {
    e.preventDefault();

    axios
      .post("/api/AddTraiteur", Traiteurs)
      .then((response) => {
        console.log("POST request successful:", response);
      })
      .catch((error) => {
        console.error("Error making POST request:", error);
      });
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
      if (result.err) throw new Error(err);
      if (result.response) {
        setRegesteredTraiteurs((prev) => {
          return prev.map((ele) => {
            if (ele.id === TraiteurId) return { ...ele, Name: TraiteurName };
            else return ele;
          });
        });

        setTraiteurName(""); setUpdateTraiteurName(false);
      };
    } catch (error) {
      alert(error.message);
    };
  };
  

  return (
    <div class="part-1">
      <nav>
        <div class="left-nav">
          <h1>traiteur</h1>
          <div>Ajoute les outil et les commandes</div>
        </div>
      </nav>
      <div class="content">
        <form method="Post" onSubmit={AddTool}>
          <div class="top-content">
            <div class="left-top-content">
              <p>Ajoute l'outil:</p>
              <input
                type="text"
                className="salle"
                placeholder="ajoute outil...."
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
          <input type="submit" value="Ajoute Outil" />
        </form>
        <form ref={TraiteurForm}>
          <div class="top-content">
            <div class="left-top-content">
              <p>Ajoute traiteur:</p>
              <input
                type="text"
                className="salle"
                placeholder="ajoute traiteur...."
                name="name"
                value={TraiteurName}
                onChange={(e) => setTraiteurName(e.target.value)}
              />
            </div>
          </div>
          {UpdateTraiteurName ? (
            <input
              type="submit"
              value="Update Traiteur"
              onClick={(e) => updateTraiteur(e)}
            />
          ) : (
            <input
              type="submit"
              value="Ajoute Traiteur"
              onClick={AddTraiteur}
            />
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
          <form action="" onSubmit={handleSubmit}>
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
                        <button onClick={() => editTools(item.id)}>
                          update
                        </button>
                        <button onClick={() => deleteTools(item.id)}>
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="submit-traiteur">
              <input type="submit" onClick={SendTraiteurs} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
