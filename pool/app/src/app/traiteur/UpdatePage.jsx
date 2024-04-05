"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function UpdateTraiteur_Tool({
  data,
  tools,
  traiteurs,
  clients,
  callback1,
  callback2,
}) {

  const [DateStart, setDateStart] = useState(data.dateStart);
  const [DateEnd, setDateEnd] = useState(data.dateEnd);
  const TargetForm = useRef();

  useEffect(() => {
    const getToolsData = async () => {
      try {
        const result = await (
          await axios.get(
            `${process.env.BACKEND_URL}/api/getToolsData/${data.traiteur_id}`
          )
        ).data;
        if (result.err) throw new Error(result.err);
        
      } catch (error) {
        alert(error.message);
      }
    };

    getToolsData();
  }, []);

  const UpdateData = async (e) => {
    e.preventDefault();

    try {
      const req_data = new FormData(TargetForm.current);
      req_data.append("id", data.id);

      const result = await (
        await axios.post(
          `${process.env.BACKEND_URL}/api/UpdateTraiteurTool`,
          req_data
        )
      ).data;

      if (result.err) throw new Error(result.err);
      if (result.response) {
        const convertedData = Object.fromEntries(req_data);
        callback2((prev) =>
          prev.map((ele) => {
            if (ele.id == convertedData.id) return convertedData;
            return ele;
          })
        );
        callback1(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div id="UpdateTraiteur_Tool">
      <div>
        <img src="imgs/cancel.svg" alt="" onClick={() => callback1(false)} />
      </div>
      <form ref={TargetForm}>
        <div>
          <select name="ClientId">
            {clients.map((ele) => {
              if (ele.id == data.ClientId)
                return (
                  <option value={ele.id} key={ele.id} selected>
                    {ele.FirstName} {ele.LastName}
                  </option>
                );
              return (
                <option value={ele.id} key={ele.id}>
                  {ele.FirstName} {ele.LastName}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <select name="traiteur_id">
            {traiteurs.map((ele) => {
              if (ele.id == data.traiteur_id)
                return (
                  <option value={ele.id} key={ele.id} selected>
                    {ele.Name}
                  </option>
                );
              return (
                <option value={ele.id} key={ele.id}>
                  {ele.Name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <input
            type="datetime-local"
            name="dateStart"
            value={DateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="dateEnd"
            value={DateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
      </form>
      {/* <form ref={TargetForm}>
        <div>
          <select name="ClientId">
            {clients.map((ele) => {
              if (ele.id == data.ClientId)
                return (
                  <option value={ele.id} key={ele.id} selected>
                    {ele.FirstName} {ele.LastName}
                  </option>
                );
              return (
                <option value={ele.id} key={ele.id}>
                  {ele.FirstName} {ele.LastName}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <select name="tool_id">
            {tools.map((ele) => {
              if (ele.id == data.tool_id)
                return (
                  <option value={ele.id} key={ele.id} selected>
                    {ele.name}
                  </option>
                );
              return (
                <option value={ele.id} key={ele.id}>
                  {ele.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <select name="traiteur_id">
            {traiteurs.map((ele) => {
              if (ele.id == data.traiteur_id)
                return (
                  <option value={ele.id} key={ele.id} selected>
                    {ele.Name}
                  </option>
                );
              return (
                <option value={ele.id} key={ele.id}>
                  {ele.Name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <input
            type="number"
            name="price"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            name="qty"
            value={Quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="dateStart"
            value={DateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="dateEnd"
            value={DateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
        <div>
          <button onClick={UpdateData}>Update</button>
        </div>
      </form> */}
    </div>
  );
}
