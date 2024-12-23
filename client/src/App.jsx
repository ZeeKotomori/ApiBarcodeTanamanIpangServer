import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './components/modals/Modal';
import AddData from './components/modals/AddData';

function App() {
   const [tanaman, setTanaman] = useState([]);
   const [isActive, setIsActive] = useState(false);
   const [isDeleted, setIsDeleted] = useState(false)

   const openModal = () => setIsActive(true);
   const closeModal = () => setIsActive(false);

   const fetchAPI = async () => {
      try {
         await axios
            .get("http://localhost:3001/api/tanaman")
            .then((res) => {
               setTanaman(res.data);
            })
      } catch (err) {
         console.log(err);
      }
   };

   const handleDelete = (id) => {
      axios
         .delete(`http://localhost:3001/api/tanaman/${id}`)
         .then((res) => {
            alert('Data Berhasil Dihapus!');
            setIsDeleted(true);
            fetchAPI();
         })
         .catch((err) => {
            console.error('Terjadi Kesalahan : ', err);
            alert('Terjadi kesalahan saat menghapus!');
         });

   }

   useEffect(() => {
      fetchAPI();
   }, []);

   return (
      <div className="container mt-4">
         <nav className="panel is-primary">
            <p className="panel-heading">Tanaman Ipang</p>
            <div className="panel-block">
               <p className="control">
                  <input className="input" type="text" placeholder="Search" />
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
                  {tanaman.map((t, index) => (
                     <tr key={index}>
                        <td className='is-vcentered'>{t.id}</td>
                        <td className='is-vcentered'>{t.nama}</td>
                        <td className='is-vcentered'>{t.namaLatin}</td>
                        <td className='is-vcentered'>{t.khasiat}</td>
                        <td><button className="button is-info is-pulled-right">Edit</button></td>
                        <td><button className="button is-danger" onClick={() => handleDelete(t.id)}>Delete</button></td>
                     </tr>
                  ))}
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