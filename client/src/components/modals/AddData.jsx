import axios from 'axios';
import 'bulma/css/bulma.min.css';
import { useState } from 'react';

export default function AddData({ children }) {
   const [formData, setFormData] = useState({
      nama: '',
      namaLatin: '',
      khasiat: ''
   });

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = () => {
      axios
         .post("http://localhost:3001/api/tanaman", formData)
         .then((res) => {
            console.log('Data berhasil dikirim : ', res.data);
            alert('Form berhasil dikirim!');
         })
         .catch((err) => {
            console.error('Terjadi Kesalahan : ', err);
            alert('Terjadi kesalahan saat mengirim form!');
         });
      console.log("Submit");
   }

   return (
      <form className="box" onSubmit={handleSubmit}>
         <div className="field">
            <label className="label">Nama Tanaman</label>
            <div className="control">
               <input className="input" type="text" name='nama' value={formData.nama} onChange={handleChange} placeholder="Mawar" />
            </div>
         </div>
         <div className="field">
            <label className="label">Nama Latin</label>
            <div className="control">
               <input className="input" type="text" name='namaLatin' value={formData.namaLatin} onChange={handleChange} placeholder="Rosa" />
            </div>
         </div>
         <div className="field">
            <label className="label">Khasiat</label>
            <div className="control">
               <input className="input" type="text" name='khasiat' value={formData.khasiat} onChange={handleChange} placeholder="Antiseptik" />
            </div>
         </div>
         <button className="button is-primary">Tambah</button>
      </form>
   )
}