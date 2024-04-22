"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function UpdateTraiteur_Tool({
  data,
  clients,
  callback1,
  callback2,
}) {
  const [Advance, setAdvance] = useState(data.Advance);
  const [DateStart, setDateStart] = useState(data.dateStart);
  const [DateEnd, setDateEnd] = useState(data.dateEnd);
  const [Payed, setPayed] = useState(data.Payed);
  const TargetForm = useRef();
  const paid = useRef();
  const NotPaid = useRef();

  const PaymentMethods = {
    "pay cash": "ادفع نقدا",
    "Payment by check": "الدفع عن طريق الشيكات",
    "successive payments": "الدفعات المتتالية",
    Credit: "كريدي",
  };

  const UpdateData = async (e) => {
    e.preventDefault();

    try {
      const req_data = new FormData(TargetForm.current);
      req_data.append("id", data.traiteur_id);
      req_data.append("Payed", Payed);

      const result = await (
        await axios.post(
          `${process.env.BACKEND_URL}/api/UpdateTraiteurData`,
          req_data
        )
      ).data;

      if (result.err) throw new Error(result.err);
      if (result.response) {
        const convertedData = Object.fromEntries(req_data);
        callback2((prev) => {
          if (data.Payed !== Payed) {
            return prev.filter((ele) => {
              return ele.traiteur_id !== data.traiteur_id;
            });
          } else {
            return prev.map((ele) => {
              if (ele.traiteur_id == data.traiteur_id) {
                ele.ClientId = convertedData.ClientId;
                ele.Advance = convertedData.Advance;
                ele.dateStart = convertedData.dateStart;
                ele.dateEnd = convertedData.dateEnd;
              }

              return ele;
            });
          }
        });
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
          <input
            type="number"
            name="Advance"
            value={Advance}
            onChange={(e) => setAdvance(e.target.value)}
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
          <select>
            {Object.keys(PaymentMethods).map((ele) => {
              return (
                <option value={ele} key={ele}>
                  {PaymentMethods[ele]}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <button onClick={UpdateData}>Update</button>
        </div>
      </form>
    </div>
  );
}
