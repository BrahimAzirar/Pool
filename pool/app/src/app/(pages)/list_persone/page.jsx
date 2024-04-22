"use client";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "@/lib/axios";

export default function page() {
    const conponentPDF = useRef();
    const TargetForm = useRef();
    const SelectedPaymentMethod = useRef();
    const [SelectedClient, setSelectedClient] = useState(null);
    const [UpdateSalle, setUpdateSalle] = useState(false);
    const [Clients, setClients] = useState([]);
    const [Transactions, setTransactions] = useState([]);
    const [salles, setSalles] = useState([]);
    const [price, setPrice] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [sallesId, setSallesId] = useState("");
    const [Total, setTotal] = useState(0);
    const [filterDateStart, setfilterDateStart] = useState("");
    const [filterDateEnd, setfilterDateEnd] = useState("");
    const DATE = new Date();
    const year = DATE.getFullYear();
    const month = DATE.getMonth() + 1;
    const day = DATE.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    const PaymentMethods = {
        "pay cash": "ادفع نقدا",
        "Payment by check": "الدفع عن طريق الشيكات",
        "successive payments": "الدفعات المتتالية",
        "Credit": "كريدي",
    };

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

        const getTransaction = async () => {
            try {
                const result = await (await axios.get("/api/calcul_presons")).data;
                if (result.err) throw new Error(result.err);
                console.log(result.response);
                setTransactions(result.response);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchSalle({ now: formattedDate });
        getTransaction()
        GetAllClients();
    }, []);

    const combinedData = Transactions.reduce((acc, curr) => {
        curr.forEach(item => {
            const { ClientId, ...rest } = item;
            if (!acc[ClientId]) {
                acc[ClientId] = {};
            }
            Object.assign(acc[ClientId], rest);
        });
        return acc;
    }, {});
    
    // Convert the object into an array of objects
    const result = Object.keys(combinedData).map(ClientId => ({
        ClientId: parseInt(ClientId),
        ...combinedData[ClientId]
    }));
    
    console.log(result);

    useEffect(() => {
        setTotal(0);
        if (salles.length) {
            salles.forEach((ele) => {
                setTotal((prev) => prev + ele.price);
            });
        }
    }, [salles]);

    const fetchSalle = async (data) => {
        const result = await (await axios.post("/api/petiteSalles", data)).data;
        if (result.err) throw new Error(result.err);
        setSalles(result.response);
    };

    const priceChange = (e) => {
        setPrice(e.target.value);
    };

    const dateStartChange = (e) => {
        setDateStart(e.target.value);
    };

    const dateEndChange = (e) => {
        setDateEnd(e.target.value);
    };

    const editSalle = async (e) => {
        e.preventDefault();

        try {
            if (!SelectedClient) throw new Error("اختر عميلاً من القائمة");
            const data = new FormData(TargetForm.current);
            data.append("ClientId", SelectedClient);
            data.append("_method", "PUT");

            const result = await (
                await axios.post(`/api/salles/${sallesId}`, data)
            ).data;
            if (result.err) throw new Error(result.err);
            if (result.response) {
                const NewData = {
                    id: sallesId,
                    ...Object.fromEntries(data),
                    is_salle: 0,
                };
                setUpdateSalle(false);
                setSallesId("");
                setPrice("");
                setDateStart("");
                setDateEnd("");
                setSelectedClient(null);
                setSalles((prev) =>
                    prev.map((ele) => {
                        if (ele.id == sallesId) return NewData;
                        return ele;
                    })
                );
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const AddSalle = async (e) => {
        e.preventDefault();

        try {
            if (!SelectedClient) throw new Error("اختر عميلاً من القائمة");
            const data = new FormData(TargetForm.current);
            data.append("ClientId", SelectedClient);
            data.append("is_salle", 1);
            const result = await (await axios.post("/api/salles", data)).data;
            if (result.err) throw new Error(result.err);
            if (result.response) {
                setPrice("");
                setDateStart("");
                setDateEnd("");
                setSelectedClient(null);
                setSalles((prev) => [
                    ...prev,
                    { id: result.response, ...Object.fromEntries(data) },
                ]);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const deleteSalle = async (id) => {
        try {
            const result = await (await axios.delete(`/api/salles/${id}`)).data;
            if (result.err) throw new Error(result.err);
            if (result.response) {
                setSalles((prev) =>
                    prev.filter((ele) => {
                        return ele.id !== id;
                    })
                );
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: "Piscine-Laayoune",
    });


    return (
        <>
            {/* {console.log(Clients)} */}
            <div className="list-personel">
                <h1>list Personel</h1>
                <form className="inputs-list-personel">
                    <div className="form-change">
                        <label htmlFor="">
                            <div>credit me</div>
                            <input type="number" />
                        </label>
                        <label htmlFor="">
                            <div>credit him</div>
                            <input type="number" />
                        </label>
                    </div>
                    <button type='submit'>Change</button>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Cash</th>
                            <th>Credit</th>
                            <th>Successive</th>
                            <th>Check</th>
                            <th>Credit me</th>
                            <th>Credit him</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            result.map((v, i) => {
                                const pre = Clients.find(ele => ele.id == v.ClientId);
                                return (
                                    <tr key={i}>
                                        <td>{pre?.FirstName} {pre?.LastName}</td>
                                        <td>{v.Credit}</td>
                                        <td>{v.Cash}</td>
                                        <td>{v.Successive}</td>
                                        <td>{v.PaymentByCheck}</td>
                                        <td></td>
                                        <td></td>
                                        <td><button>Update</button></td>
                                    </tr>
                                );
                                })
                            }
                    </tbody>
                    <thead>
                        <tr>
                            <th>Total</th>
                            <th>0</th>
                            <th>0</th>
                            <th>0</th>
                            <th>0</th>
                            <th>0</th>
                            <th>0</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </>
    );
}
