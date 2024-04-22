"use client";

export default function Home() {
  
  return (
    <div className="part-1">
      <nav>
        <div className="left-nav">
          <h1>Tableau De Bord</h1>
          <div>Votre Tableau De Bord Personnel</div>
        </div>
      </nav>
      <div className="content">
        <p className="name-content">General:</p>
        <div className="cards">
          <div className="card">
            <img className="icon-card" src="imgs/revenus.png" alt="" />
            <p className="money">20000,00 DH</p>
            <p className="name">Revenus</p>
          </div>
          <div className="card">
            <img className="icon-card" src="imgs/depenses_icon.png" alt="" />
            <p className="money">20000,00 DH</p>
            <p className="name">Depeneses</p>
          </div>
          <div className="card">
            <img className="icon-card" src="imgs/benefice.png" alt="" />
            <p className="money">20000,00 DH</p>
            <p className="name">Benefice Net</p>
          </div>
          <div className="card">
            <img className="icon-card" src="imgs/depenses_icon.png" alt="" />
            <p className="money">20000,00 DH</p>
            <p className="name">Depeneses</p>
          </div>
          <div className="card">
            <img className="icon-card" src="imgs/benefice.png" alt="" />
            <p className="money">20000,00 DH</p>
            <p className="name">Benefice Net</p>
          </div>
        </div>
      </div>
    </div>
  );
}
