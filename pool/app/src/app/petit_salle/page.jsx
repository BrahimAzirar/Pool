'use client';
import { useEffect, useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import axios from '@/lib/axios'
// import DateRangePickerComp from '@/components/DateRangePickerComp.jsx'

export default function petit_salle() {

  const conponentPDF = useRef();
  const [salles, setSalles] = useState([]);
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [price, setPrice] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [sallesId, setSallesId] = useState('')

  useEffect(() => {
    fetchSalle()
  },[])

  const nameChange = (e) => {
    setName(e.target.value)
  }

  const numberChange = (e) => {
    setNumber(e.target.value)
  }

  const priceChange = (e) => {
    setPrice(e.target.value)
  }

  const dateStartChange = (e) => {
    setDateStart(e.target.value)
  }

  const dateEndChange = (e) => {
    setDateEnd(e.target.value)
  }

  const editSalle = (id) => {
    setSallesId(id)
    salles.map((item) => {
      if(item.id == id) {
        setName(item.name_client)
        setNumber(item.telephone)
        setPrice(item.price)
        setDateStart(item.date_start)
        setDateEnd(item.date_end)
      }
    })
  }

  const submitForm = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('number', number)
    formData.append('price', price)
    formData.append('dateStart', dateStart)
    formData.append('dateEnd', dateEnd)
    formData.append('is_salle', 1)
    let url = `/api/salles`;
    if(sallesId != "") {
      url = `/api/salles/${sallesId}`;
      formData.append('_method', 'PUT');
    }
    axios.post(url, formData)
    .then((response) => {
      setName('')
      setNumber('')
      setPrice('')
      setDateStart('')
      setDateEnd('')
      fetchSalle()
      setSallesId('')
    })
  }

  const deleteSalle = (id) => {
    let params = {'_method': 'delete'}
    axios.post(`/api/salles/${id}`,params)
    .then((response) => {
      setName('')
      setNumber('')
      setPrice('')
      setDateStart('')
      setDateEnd('')
      fetchSalle()
      setSallesId('')
    })
  }

  const fetchSalle = () => {
    axios.get("/api/salle")
    .then((response) => {
      setSalles(response.data);
    })
  }

  const generatePDF = useReactToPrint({
    content: ()=>conponentPDF.current,
    documentTitle: "Piscine-Laayoune",

  })
    
  return (
    <div class="part-1">
            <nav>
                <div class="left-nav">
                    <h1>petit salle</h1>
                    <div>Votre grand salle Personnel</div>
                </div>
            </nav>
            <div class="content">
                <form method='Post' onSubmit={submitForm}>
                  <div class="top-content">
                      <div class="left-top-content">
                      <div className="d-l">
                        <p>Ajoute le cout:</p>
                        <input type="number" className="salle" placeholder='ajoute cout....'
                        name="price"
                        value={price}
                        onChange={priceChange}
                        />
                      </div>
                      <div className="d-c">
                        <p>Ajoute client:</p>
                        <input type="text" className="salle" placeholder='ajoute client....'
                        name="name"
                        value={name}
                        onChange={nameChange}
                        />
                      </div>
                      <div className="d-r">
                        <p>Ajoute number:</p>
                        <input type="text" className="salle" placeholder='ajoute number....'
                        name="number"
                        value={number}
                        onChange={numberChange}
                        />
                      </div>
                      </div>
                      <div class="right-top-content">
                        <p>Selectionnez la period:</p>
                      <div className="date-total">
                      <div className="date-left">
                      <label htmlFor="">Date start :</label>
                        <input type="datetime-local" className="salle"
                        name="dateStart"
                        value={dateStart}
                        onChange={dateStartChange}
                        />  
                      </div>
                      <div className="date-right">
                        <label htmlFor="">Date end :</label>
                        <input type="datetime-local" className="salle"
                        name="dateEnd"
                        value={dateEnd}
                        onChange={dateEndChange}
                        />
                      </div>
                      </div>
                      </div>
                  </div>
                  <input type="submit" />
                </form>
<div className="bottom-content">
  {/* <div className="head-table">
  <p>List Des Operations :</p> <div className="filter">Filter<img src="imgs/filter.png" alt="" /></div>
  </div> */}
  <input onClick={generatePDF} type="button" value="PDF" />
    <div className="table-pool" >
    <table class="table" ref={conponentPDF} >
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">nom</th>
      <th scope="col">number</th>
      <th scope="col">cout</th>
      <th scope="col">start</th>
      <th scope="col">end</th>
      <th scope="col">date total</th>
      <th scope="col">action</th>
    </tr>
  </thead>
  <tbody>
  {salles.map((item, i)=>(
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{item.name_client}</td>
        <td>{item.telephone}</td>
        <td>{item.price}</td>
        <td>{item.date_start}</td>
        <td>{item.date_end}</td>
        <td>{item.total_date}</td>
        <td>
          <button onClick={()=> editSalle(item.id)}>update</button>
          <button onClick={()=> deleteSalle(item.id)}>delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
  </div>

</div>
            </div>
        </div>
  )
}
