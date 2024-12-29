import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCenter from './components/modals/Modal'
import AddDataModal from './components/modals/AddData';
import EditDataModal from './components/modals/EditData';

// Bootstrap
import './styles/scss/custom.scss';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

function App() {
   const [tanaman, setTanaman] = useState([]);
   const [Id, setId] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [modalType, setModalType] = useState("");
   const [query, setQuery] = useState('');

   const handleShowModal = (type, id) => {
      id && setId(id);
      setModalType(type);
      setShowModal(true);
   }

   const handleCloseModal = () => {
      setModalType('');
      setShowModal(false);
   }

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
      <Container fluid="lg" className='pt-4'>
         <Navbar className="bg-white rounded">
            <Container>
               <Navbar.Brand href="#">Tanaman Ipang</Navbar.Brand>
               <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text>
                     <a
                        href="#logout"
                        className="link-offset-2 link-offset-3-hover link-underline-dark link-underline-opacity-0 link-underline-opacity-75-hover"
                     >
                        Log Out
                     </a>
                  </Navbar.Text>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <Row className='mt-4'>
            <Form as={Col} xs={4}>
               <Form.Control
                  placeholder="Cari berdasarkan Id"
                  name='search'
                  value={query}
                  type="number"
                  onChange={(e) => setQuery(e.target.value)}
               />
            </Form>
            <Col>
               <Button type="submit" className='bg-primary'>
                  Cari
               </Button>
            </Col>
            <Col xs='auto'>
               <Button variant='primary' onClick={() => handleShowModal('Tambah Data')}>
                  Tambah Data
               </Button>
            </Col>
         </Row>
         <Container fluid="lg" className='rounded bg-white p-3 mt-4'>
            <Table hover responsive="sm" className='rounded'>
               <thead>
                  <tr>
                     <th className='text-center'>Id</th>
                     <th className='text-center'>Nama Tanaman</th>
                     <th className='text-center'>Nama Latin</th>
                     <th className='text-center'>Khasiat</th>
                     <th className='text-center'>Bagian digunakan</th>
                     <th colSpan={2} className='text-center'>Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  {tanaman.length > 0 ? (
                     tanaman.map((t, index) => (
                        <tr key={index}>
                           <td className='text-center align-middle'>{t.id}</td>
                           <td className='text-center align-middle'>{t.nama}</td>
                           <td className='text-center align-middle'>{t.namaLatin}</td>
                           <td className='text-center align-middle'>{t.khasiat}</td>
                           <td className='text-center align-middle'>{t.bagianYangDigunakan}</td>
                           <td className='text-end'>
                              <Button variant='light' onClick={() => handleShowModal('edit', t.id)}>Edit</Button>
                           </td>
                           <td>
                              <Button variant='light' onClick={() => handleDelete(t.id)}>Delete</Button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={6}>Data tidak ditemukan</td>
                     </tr>
                  )}
               </tbody>
            </Table>
         </Container>

         <ModalCenter show={showModal} feature={modalType} onHide={() => handleCloseModal()}>
            {modalType === "Tambah Data" ? (
               <AddDataModal></AddDataModal>
            ) : (
               <EditDataModal id={Id}></EditDataModal>
            )}
         </ModalCenter>
      </Container>
   )
}

export default App