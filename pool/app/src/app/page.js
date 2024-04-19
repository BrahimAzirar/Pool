"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from "react";
import "./globals.css";
import axios from "@/lib/axios";

export default function page() {
  const router = useRouter();
  const TragetForm = useRef();

  useEffect(() => {
    const AdminIsAuth = async () => {
      try {
        const result = await (await axios.get("/api/adminIsAuth", { withCredentials: true })).data;
        if (result.err) throw new Error(result.err);
        if (result.response) router.push('/tableau_de_bord');
      } catch (error) {
        alert(error.message);
      };
    };

    AdminIsAuth();
  }, []);

  const AdminIsExist = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(TragetForm.current);
      const result = await (await axios.post("/api/adminIsExist", data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) router.push('/tableau_de_bord');
      else throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    } catch (error) {
      alert(error.message);
    };
  };

  return (
    <div id="LoginPage">
      <form ref={TragetForm} method='POST'>
        <div>
            <img src="imgs/icon.png" />
        </div>
        <div>
            <input type="text" name="Username" className="salle" placeholder="اسم المستخدم" />
        </div>
        <div>
            <input type="password" name="Password" className="salle" placeholder="كلمة المرور" />
        </div>
        <div>
            <button onClick={AdminIsExist}>تسجيل الدخول</button>
        </div>
      </form>
    </div>
  );
}
