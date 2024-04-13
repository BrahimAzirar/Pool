"use client";

import axios from "axios";
import { useRef, useState } from "react";

export default function UpdateTraiteur_Tool({
  data,
  traiteursId,
  callback1,
  callback2,
  callback3,
  callback4,
  callback5
}) {
  const [Price, setPrice] = useState(data.price);
  const [ReturnedQty, setReturnedQty] = useState(data.returnedQty);
  const [Quantite, setQuantite] = useState(data.qty);

  const TargetForm = useRef();

  const UpdateData = async (e) => {
    e.preventDefault();

    try {
      const req_data = new FormData(TargetForm.current);
      req_data.append("id", data.id);
      req_data.append("traiteur_id", traiteursId);

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
            if (ele.id == convertedData.id) {
              ele.price = convertedData.price;
              ele.qty = convertedData.qty;
              ele.returnedQty = convertedData.returnedQty;
            };
            return ele;
          })
        );
        callback1(false);
        callback3([]);
        callback4([]);
        callback5([]);
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
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
          />
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
          <button onClick={UpdateData}>Update</button>
        </div>
      </form>
    </div>
  );
}
