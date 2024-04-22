"use client";
import '../globals.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [IsAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const AdminIsAuth = async () => {
      try {
        const result = await (
          await axios.get("/api/adminIsAuth", { withCredentials: true })
        ).data;
        if (result.err) throw new Error(result.err);
        if (!result.response) router.push("/");
        else setIsAuth(true);
      } catch (error) {
        alert(error.message);
      };
    };

    AdminIsAuth();
  }, []);

  const Logout = async () => {
    try {
      const result = await (await axios.get("/api/logout", { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) router.push("/");
    } catch (error) {
      alert(error.message);
    };
  };

  if (IsAuth) {
    return (
      <html lang="en">
        <body>
          <div className="main">
            <div className="part-2">
              <Link href={"/tableau_de_bord"}>
                <img src="imgs/icon.png" alt="" className="icon" />
              </Link>
              <ul>
                <li>
                  <img src="imgs/dashboard.png" alt="" />
                  <Link href={"/tableau_de_bord"}>Tableau de bord</Link>
                </li>
                <li>
                  <img src="imgs/users-solid.svg" alt="" />
                  <Link href="/clients">Personnes</Link>
                </li>
                <li>
                  <img src="imgs/grand_salle.png" alt="" />
                  <Link href={"/grand_salle"}>Grand Salle</Link>
                </li>
                <li>
                  <img src="imgs/petit_salle.png" alt="" />
                  <Link href={"/petit_salle"}>Pitet Salle</Link>
                </li>
                <li>
                  <img src="imgs/depenses.png" alt="" />
                  <Link href={"/depenses"}>Depenses</Link>
                </li>
                <li>
                  <img src="imgs/pisine.png" alt="" />
                  <Link href={"/piscine"}>Piscine</Link>
                </li>
                <li>
                  <img src="imgs/cafe.png" alt="" />
                  <Link href={"/cafe"}>Cafe</Link>
                </li>
                <li>
                  <img src="imgs/users-solid.svg" alt="" />
                  <Link href={"/list_persone"}>Liste presone</Link>
                </li>
                <li>
                  <img src="imgs/traiteur.png" alt="" />
                  <Link href={"/traiteur"}>traiteur</Link>
                </li>
                <li>
                  <img src="imgs/screwdriver-wrench-solid.svg" alt="" />
                  <Link href={"/ReturnedTools"}>outils retournes</Link>
                </li>
                <li style={{ marginBottom: "20px" }}>
                  <button id='logoutbtn' onClick={Logout}>Log out</button>
                </li>
              </ul>
            </div>
            {children}
          </div>
        </body>
      </html>
    );
  } else {
    return (
      <html>
        <body style={{
          height: "100vh",
          background: "#0D0E13",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <p style={{
            fontSize: "2.5rem",
            color: "white"
          }}>Loading ...</p>
        </body>
      </html>
    );
  }
}
