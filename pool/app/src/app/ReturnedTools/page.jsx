"use client";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import UpdatePage from "./UpdatePage";

export default function page() {
  const [UpdateData, setUpdateData] = useState(false);
  const [RegesteredTraiteurs, setRegesteredTraiteurs] = useState([]);
  const [Parties_tools_data, setParties_tools_data] = useState([]);
  const [ToolsThatWasReturned, setToolsThatWasReturned] = useState([]);
  const [ToolsThatWasNotReturned, setToolsThatWasNotReturned] = useState([]);
  const [ToolsThatAreStillInUse, setToolsThatAreStillInUse] = useState([]);
  const [data_we_want_to_updated, setdata_we_want_to_updated] = useState({});
  const [eventId, seteventId] = useState(0);

  useEffect(() => {
    const getAllTraiteurs = async () => {
      try {
        const result = await (await axios.get("/api/getAllTraiteurs")).data;
        if (result.err) throw new Error(err);
        setRegesteredTraiteurs(result.response);
      } catch (error) {
        alert(error.message);
      }
    };

    getAllTraiteurs();
  }, []);

  useEffect(() => {
    if (Parties_tools_data.length) {
      Parties_tools_data.forEach((ele) => {
        if (ele.qty == ele.returnedQty)
          setToolsThatWasReturned((prev) => [...prev, ele]);
        else if (ele.dateEnd >= getCurrentDateTime())
          setToolsThatAreStillInUse((prev) => [...prev, ele]);
        else if (
          ele.qty !== ele.returnedQty &&
          ele.dateEnd < getCurrentDateTime()
        )
          setToolsThatWasNotReturned((prev) => [...prev, ele]);
      });
    } else {
      setToolsThatWasNotReturned([]);
      setToolsThatWasReturned([]);
      setToolsThatAreStillInUse([]);
    }
  }, [Parties_tools_data]);

  function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const getTargetTraiteurs = async (e) => {
    try {
      if (parseInt(e.target.value)) {
        setParties_tools_data([]);
        const party = e.target.value;
        seteventId(party);
        const result = await (
          await axios.get(`/api/getTargetTraiteurs/${party}`)
        ).data;
        if (result.err) throw new Error(result.err);
        if (result.response.length) {
          setParties_tools_data(result.response);
        }
      } else setParties_tools_data([]);
    } catch (error) {
      alert(error.message);
    }
  };

  const DeleteTraiteurTool = async (e, id, totalPrice) => {
    e.preventDefault();

    try {
      const result = await (
        await axios.delete(
          `/api/deleteTargetTraiteurTool/${id}/${totalPrice}/${eventId}`
        )
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        setToolsThatWasReturned([]);
        setToolsThatWasNotReturned([]);
        setToolsThatAreStillInUse([]);
        setParties_tools_data((prev) =>
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
      {UpdateData ? (
        <UpdatePage
          data={data_we_want_to_updated}
          traiteursId={eventId}
          callback1={setUpdateData}
          callback2={setParties_tools_data}
          callback3={setToolsThatWasReturned}
          callback4={setToolsThatWasNotReturned}
          callback5={setToolsThatAreStillInUse}
        />
      ) : null}
      <div id="ReturnedTools_Page">
        <div style={{ marginBottom: "30px" }}>
          <h1>choisir un event</h1>
          <div>
            <select onChange={getTargetTraiteurs}>
              <option value={null}>Choosir une fête</option>
              {RegesteredTraiteurs.map((ele) => {
                return (
                  <option value={ele.id} key={ele.id}>
                    {ele.Name}
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
                      <th>Tool name</th>
                      <th>prix</th>
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
                          <td>{ele.tool_name}</td>
                          <td>{ele.price}</td>
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
                              onClick={(e) =>
                                DeleteTraiteurTool(
                                  e,
                                  ele.id,
                                  ele.price * ele.qty
                                )
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
                      <th>Tool name</th>
                      <th>prix</th>
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
                          <td>{ele.tool_name}</td>
                          <td>{ele.price}</td>
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
                              onClick={(e) =>
                                DeleteTraiteurTool(
                                  e,
                                  ele.id,
                                  ele.price * ele.qty
                                )
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
        ) : null}
        {ToolsThatAreStillInUse.length ? (
          <div className="bottom-content">
            <div className="head-table" style={{ margin: "0 auto" }}>
              <p>Des outils toujours utilisés :</p>
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
                      <th>Nom de client</th>
                      <th>Nom de outil</th>
                      <th>prix</th>
                      <th>Quantity</th>
                      <th>Returned quantity</th>
                      <th>Date start</th>
                      <th>Date end</th>
                      <th>Acions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ToolsThatAreStillInUse.map((ele) => {
                      return (
                        <tr key={ele.id}>
                          <td>{ele.id}</td>
                          <td>{ele.FirstName} {ele.LastName}</td>
                          <td>{ele.tool_name}</td>
                          <td>{ele.price}</td>
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
                              onClick={(e) =>
                                DeleteTraiteurTool(
                                  e,
                                  ele.id,
                                  ele.price * ele.qty
                                )
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
        ) : null}
      </div>
    </>
  );
}
