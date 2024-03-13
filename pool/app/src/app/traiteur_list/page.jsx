import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function petit_salle() {
  return (
    <div class="part-1">
            <div class="content">
<div className="bottom-content">
  <div className="commande">
  <Link href="/traiteur" className="commande"><Image width={10} height={10} src="/imgs/ajoute_de_commande.png" alt="" />ajoute de commande</Link>
  </div>
<div className="head-table">
  <p>List Des Operations :</p> <div className="filter">filter <Image width={10} height={10} src="/imgs/filter.png" alt="" /></div>
  </div>
  <table class="table">
  <thead >
    <tr>
      <th scope="col">#</th>
      <th scope="col">prix</th>
      <th scope="col">date</th>
      <th scope="col">quentite</th>
      <th scope="col">action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>200</td>
      <td>12-03-2024</td>
      <td>100</td>
      <td>
        <button>update</button>
        <button>delete</button>
      </td>
    </tr>
  </tbody>
</table>
</div>
            </div>
        </div>
  )
}
