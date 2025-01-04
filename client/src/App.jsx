import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCenter from './components/modals/ModalCenter'
import AddDataModal from './components/modals/AddDataModal';
import EditDataModal from './components/modals/EditDataModal';
import DetailModal from './components/modals/DetailModal';

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
   const [showModal, setShowModal] = useState(null);
   const [modalType, setModalType] = useState("");
   const [query, setQuery] = useState('');

   const handleShowModal = (idModal, type, idData) => {
      idData && setId(idData);
      setModalType(type);
      setShowModal(idModal);
   }

   const handleCloseModal = () => {
      setShowModal(false);
   }

   const fetchAPI = async (query) => {
      const urls = query ? `${import.meta.env.VITE_API_URL}/api/tanaman/${query}` : `${import.meta.env.VITE_API_URL}/api/tanaman`;

      await axios
         .get(urls)
         .then((res) => {
            console.log(res.data.data);
            setTanaman(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
         })
         .catch((err) => {
            console.log(err.response.data);
            setTanaman([]);
         })
   }

   const handleDelete = (id) => {
      axios
         .delete(`${import.meta.env.VITE_API_URL}/api/tanaman/${id}`)
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
            <Container fluid="lg">
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
                  placeholder="Cari Tanaman"
                  name='search'
                  value={query}
                  type="search"
                  onChange={(e) => setQuery(e.target.value)}
               />
            </Form>
            <Col>
               <Button type="submit" className='bg-primary'>
                  Cari
               </Button>
            </Col>
            <Col xs='auto'>
               <Button variant='primary' onClick={() => handleShowModal('data', 'Tambah Data')}>
                  Tambah Data
               </Button>
            </Col>
         </Row>
         <Container fluid="lg" className='rounded bg-white p-3 mt-4'>
            <Table responsive="sm" className='rounded'>
               <thead>
                  <tr>
                     <th className='text-center'>Id</th>
                     <th className='text-center'>Nama Tanaman</th>
                     <th className='text-center'>Nama Latin</th>
                     <th className='text-center'>Khasiat</th>
                     <th className='text-center'>Bagian digunakan</th>
                     <th colSpan={3} className='text-center'>Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  {tanaman.length > 0 ? (
                     tanaman.map((t, index) => (
                        <tr key={index}>
                           <td className='text-center align-middle'>{t.id}</td>
                           <td className='text-center align-middle'>{t.nama}</td>
                           <td className='text-center align-middle'>{t.namaLatin}</td>
                           <td className='text-center align-middle'>{t.khasiat[0].deskripsi}</td>
                           <td className='text-center align-middle'>{t.bagianYangDigunakan[0].bagian}</td>
                           <td>
                              <Button style={{ width: '100%' }} variant='light' onClick={() => handleShowModal('detail', '', t.id)}>Detail</Button>
                           </td>
                           <td>
                              <Button style={{ width: '100%' }} variant='light' onClick={() => handleShowModal('data', 'edit', t.id)}>Edit</Button>
                           </td>
                           <td>
                              <Button style={{ width: '100%' }} variant='light' onClick={() => handleDelete(t.id)}>Delete</Button>
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

         <ModalCenter show={showModal == 'data'} feature={modalType} onHide={() => handleCloseModal()}>
            {modalType === "Tambah Data" ?
               <AddDataModal /> :
               <EditDataModal id={Id} />
            }
         </ModalCenter>

         <ModalCenter show={showModal == 'detail'} feature='Detail Tanaman' onHide={() => handleCloseModal()}>
            <DetailModal id={Id}></DetailModal>
         </ModalCenter>
      </Container>
   )
}

export default App