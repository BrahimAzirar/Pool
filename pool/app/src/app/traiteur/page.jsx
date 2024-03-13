'use client';

import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function traiteur() {

  const formRef = useRef(null);
  const [tools, setTools] = useState([]);
  const [check, setCheck] = useState([]);
  const [name, setName] = useState('')
  const [price, setPrice] = useState([]);
  const [qty, setQty] = useState([]);
  const [toolsId, setToolsId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchTool()
  },[])

  const nameChange = (e) => {
    setName(e.target.value)
  }

  const priceChange = (e) => {
    if (parseFloat(e.target.value)) {
      setPrice([...price,parseFloat(e.target.value)])
    } else {
      setPrice(prev => 
        {
          return prev.filter(value => 
            {
              return value != parseFloat(e.target.value);
            })
        })
    }
  }

  const qtyChange = (e) => {
    if (parseInt(e.target.value)) {
      setQty([...price,parseInt(e.target.value)])
    } else {
      setQty(prev => 
        {
          return prev.filter(value => 
            {
              return value != parseInt(e.target.value);
            })
        })
    }
  }

  const editTools = (id) => {
    setToolsId(id)
    tools.map((item) => {
      if(item.id == id) {
        setName(item.name)
      }
    })
  }

  const submitForm = (e) => {
    e.preventDefault()
    var formData = new FormData()
    formData.append('name', name)
    let url = `/api/tools`;
    console.log(toolsId);
    if(toolsId != "") {
      url = `/api/tools/${toolsId}`;
      formData.append('_method', 'PUT');
    }
    axios.post(url, formData)
    .then((response) => {
      setName('')
      fetchTool()
      setToolsId('')
    })
  }

  const deleteTools = (id) => {
    let params = {'_method': 'delete'}
    axios.post(`/api/tools/${id}`,params)
    .then((response) => {
      setName('')
      fetchTool()
      setToolsId('')
      
    })
  }

  // const checkSelected = (e) => {
  //   let isSelected = e.;
  // }

  const fetchTool = () => {
    axios.get("/api/tools")
    .then((response) => {
      setTools(response.data);
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div class="part-1">
            <nav>
                <div class="left-nav">
                    <h1>traiteur</h1>
                    <div>Ajoute les outil et les commandes</div>
                </div>
            </nav>
            <div class="content">
                <form method='Post' onSubmit={submitForm}>
                  <div class="top-content">
                      <div class="left-top-content">
                        <p>Ajoute l'outil:</p>
                        <input type="text" className="salle" placeholder='ajoute outil....'
                        name="name"
                        value={name}
                        onChange={nameChange}
                        />
                      </div>
                  </div>
                  <input type="submit" />
                </form>
<div className="bottom-content">
{/* <div className="commande">
  <Link href="/traiteur_list" className="commande-link"><Image width={10} height={10} src="/imgs/ajoute_de_commande.png" alt="" /><p>list de commande</p></Link>
  </div> */}
<div className="head-table">
  <p>List Des Operations :</p> <div className="filter">Filter<Image width={10} height={10} src="/imgs/filter.png" alt="" /></div>
  </div>
  <form action="" onSubmit={handleSubmit}>
  <div className="table-pool">
  <table class="table">
  <thead >
    <tr>
      <th>#</th>
      <th>outil</th>
      <th>prix</th>
      <th>quantite</th>
      <th>action</th>
    </tr>
  </thead>
  <tbody>
  {tools.map((item, i)=>(
      <tr key={i}>
        <td><input className={styles.checkpool} type="checkbox" 
        value={item.id}
        // onChange={checkSelected}
        /></td>
        <td>{item.price}</td>
        <td>{item.name}</td>
        <td><input className="salle" placeholder="ajoute prix..." type="text"
        value={price}
        onChange={priceChange}
        /></td>
        <td><input className="salle" placeholder="ajoute qty..." type="text"
        value={qty}
        onChange={qtyChange}
        /></td>
        <td>
          <button onClick={()=> editTools(item.id)}>update</button>
          <button onClick={()=> deleteTools(item.id)}>delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
  </div>
<div className="submit-traiteur">
<input type="submit" />
</div>
  </form>
</div>
            </div>
        </div>
  )
}
