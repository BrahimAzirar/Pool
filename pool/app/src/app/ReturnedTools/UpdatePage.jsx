"use client";

import axios from "axios";
import { useRef, useState } from "react";

export default function UpdateTraiteur_Tool({
  data,
  tools,
  traiteurs,
  callback1,
  callback2,
  callback3,
  callback4,
}) {
  const [ReturnedQty, setReturnedQty] = useState(data.returnedQty);
  const [Quantite, setQuantite] = useState(data.qty);
  const [DateStart, setDateStart] = useState(data.dateStart);
  const [DateEnd, setDateEnd] = useState(data.dateEnd);

  const TargetForm = useRef();

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
        convertedData.traiteur_name = traiteurs.find(ele => ele.id == convertedData.traiteur_id).Name;
        convertedData.tool_name = tools.find(ele => ele.id == convertedData.tool_id).name;
        callback2((prev) =>
          prev.map((ele) => {
            if (ele.id == convertedData.id)
                return convertedData;
            return ele;
          })
        );
        callback1(false);
        callback3([]);
        callback4([]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div id="UpdateTraiteur_Tool">
      <div>
        <img src="imgs/cancel.svg" alt="" onClick={() => callback1(false)}/>
      </div>
      <form ref={TargetForm}>
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
            name="qty"
            placeholder="Quantity"
            value={Quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            name="returnedQty"
            placeholder="Returned Quantity"
            value={ReturnedQty}
            onChange={(e) => setReturnedQty(e.target.value)}
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
      </form>
    </div>
  );
}
