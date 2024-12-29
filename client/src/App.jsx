import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './components/modals/Modal';
import AddData from './components/modals/AddData';

function App() {
   const [tanaman, setTanaman] = useState([]);
   const [isActive, setIsActive] = useState(false);
   const [query, setQuery] = useState('');

   const openModal = () => setIsActive(true);
   const closeModal = () => setIsActive(false);

   const fetchAPI = (query) => {
      const url = query ? `http://localhost:3001/api/tanaman/${query}` : "http://localhost:3001/api/tanaman";

      axios
         .get(url)
         .then((res) => {
            setTanaman(Array.isArray(res.data) ? res.data : [res.data]);
         })
         .catch((err) => {
            console.log(err.response.data);
            setTanaman([]);
         })
   }

   const handleDelete = (id) => {
      axios
         .delete(`http://localhost:3001/api/tanaman/${id}`)
         .then(() => {
            alert('Data Berhasil Dihapus!');
            fetchAPI();
         })
         .catch((err) => {
            console.error('Terjadi Kesalahan : ', err.response.data);
            alert('Terjadi kesalahan saat menghapus!');
         });

   }

   useEffect(() => {
      fetchAPI(query);
   }, [query]);

   return (
      <div className="container mt-4">
         <nav className="panel is-primary">
            <p className="panel-heading">Tanaman Ipang</p>
            <div className="panel-block">
               <p className="control">
                  <input
                     className="input"
                     name='search'
                     value={query}
                     type="number"
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Cari berdasarkan Id" />
               </p>
            </div>
            <div className='panel-block'>
               <button className='button is-primary' onClick={openModal}>Tambah Data</button>
            </div>
            <table className="table is-fullwidth is-hoverable">
               <thead>
                  <tr>
                     <th>Id</th>
                     <th>Nama Tanaman</th>
                     <th>Nama Latin</th>
                     <th>Khasiat</th>
                     <th colSpan={2} className='has-text-centered'>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {tanaman.length > 0 ? (
                     tanaman.map((t, index) => (
                        <tr key={index}>
                           <td className='is-vcentered'>{t.id}</td>
                           <td className='is-vcentered'>{t.nama}</td>
                           <td className='is-vcentered'>{t.namaLatin}</td>
                           <td className='is-vcentered'>{t.khasiat}</td>
                           <td><button className="button is-info is-pulled-right">Edit</button></td>
                           <td><button className="button is-danger" onClick={() => handleDelete(t.id)}>Delete</button></td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5}>Data tidak ditemukan</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </nav>
         <Modal isActive={isActive} closeModal={closeModal}>
            <AddData />
         </Modal>
      </div>
   )
}

export default App