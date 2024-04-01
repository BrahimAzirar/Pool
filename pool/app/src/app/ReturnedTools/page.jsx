"use client";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import UpdatePage from "./UpdatePage";

export default function page() {
  const [UpdateData, setUpdateData] = useState(false);
  const [Clients, setClients] = useState([]);
  const [Tools, setTools] = useState([]);
  const [RegesteredTraiteurs, setRegesteredTraiteurs] = useState([]);
  const [Parties_tools_data, setParties_tools_data] = useState([]);
  const [ToolsThatWasReturned, setToolsThatWasReturned] = useState([]);
  const [ToolsThatWasNotReturned, setToolsThatWasNotReturned] = useState([]);
  const [data_we_want_to_updated, setdata_we_want_to_updated] = useState({});

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

    GetAllClients();
    fetchTool();
    getAllTraiteurs();
  }, []);

  useEffect(() => {
    if (Parties_tools_data.length) {
      Parties_tools_data.forEach((ele) => {
        if (ele.qty !== ele.returnedQty)
          setToolsThatWasNotReturned((prev) => [...prev, ele]);
        else setToolsThatWasReturned((prev) => [...prev, ele]);
      });
    }
  }, [Parties_tools_data]);

  const getTargetTraiteurs = async (e) => {
    try {
      const client = e.target.value;
      const result = await (
        await axios.get(`/api/getTargetTraiteurs/${client}`)
      ).data;
      setParties_tools_data([]);
      if (result.err) throw new Error(result.err);
      if (result.response.length) {
        setParties_tools_data(result.response);
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
        setParties_tools_data((prev) =>
          prev.filter((ele) => {
            return ele.id !== id;
          })
        );
        setToolsThatWasReturned([]);
        setToolsThatWasNotReturned([]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {UpdateData ? (
        <UpdatePage
          data={data_we_want_to_updated}
          tools={Tools}
          traiteurs={RegesteredTraiteurs}
          callback1={setUpdateData}
          callback2={setParties_tools_data}
          callback3={setToolsThatWasReturned}
          callback4={setToolsThatWasNotReturned}
        />
      ) : null}
      <div id="ReturnedTools_Page">
        <div style={{ marginBottom: "30px" }}>
          <h1>choisir un client</h1>
          <div>
            <select onChange={getTargetTraiteurs}>
              <option value={null}>Choosir un client</option>
              {Clients.map((ele) => {
                return (
                  <option value={ele.id} key={ele.id}>
                    {ele.FirstName} {ele.LastName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {ToolsThatWasNotReturned.length ? (
          <div className="bottom-content" style={{ marginBottom: "30px" }}>
            <div className="head-table" style={{ margin: "0 auto" }}>
              <p>Liste Des Outils Non Retournés :</p>
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
                <table className="table" style={{ width: "1000px" }}>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Party name</th>
                      <th>Tool name</th>
                      <th>Quantity</th>
                      <th>Returned quantity</th>
                      <th>Date start</th>
                      <th>Date end</th>
                      <th>Acions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ToolsThatWasNotReturned.map((ele) => {
                      return (
                        <tr key={ele.id}>
                          <td>{ele.id}</td>
                          <td>{ele.traiteur_name}</td>
                          <td>{ele.tool_name}</td>
                          <td>{ele.qty}</td>
                          <td>{ele.returnedQty}</td>
                          <td>{ele.dateStart}</td>
                          <td>{ele.dateEnd}</td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateData(true);
                                setdata_we_want_to_updated(ele);
                              }}
                            >
                              update
                            </button>
                            <button
                              onClick={(e) => DeleteTraiteurTool(e, ele.id)}
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
        ) : null}
        {ToolsThatWasReturned.length ? (
          <div className="bottom-content">
            <div className="head-table" style={{ margin: "0 auto" }}>
              <p>Liste Des Outils Retournés :</p>
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
                <table className="table" style={{ width: "1000px" }}>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Party name</th>
                      <th>Tool name</th>
                      <th>Quantity</th>
                      <th>Returned quantity</th>
                      <th>Date start</th>
                      <th>Date end</th>
                      <th>Acions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ToolsThatWasReturned.map((ele) => {
                      return (
                        <tr key={ele.id}>
                          <td>{ele.id}</td>
                          <td>{ele.traiteur_name}</td>
                          <td>{ele.tool_name}</td>
                          <td>{ele.qty}</td>
                          <td>{ele.returnedQty}</td>
                          <td>{ele.dateStart}</td>
                          <td>{ele.dateEnd}</td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUpdateData(true);
                                setdata_we_want_to_updated(ele);
                              }}
                            >
                              update
                            </button>
                            <button
                              onClick={(e) => DeleteTraiteurTool(e, ele.id)}
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
        ) : null}
      </div>
    </>
  );
}
