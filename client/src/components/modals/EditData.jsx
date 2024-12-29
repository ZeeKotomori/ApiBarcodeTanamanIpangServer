import axios from 'axios';
import { useState, useEffect } from 'react';

// Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function EditDataModal({ id }) {
    const [formData, setFormData] = useState({
        nama: '',
        namaLatin: '',
        khasiat: '',
        bagianYangDigunakan: '',
    });

    useEffect(() => {
        axios
            .get(`http://localhost:3001/api/tanaman/${id}`)
            .then((res) => {
                setFormData(res.data);
            })
            .catch((err) => {
                console.error('Terjadi Kesalahan : ', err);
                alert('Terjadi kesalahan saat mengambil data!');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        axios
            .put(`http://localhost:3001/api/tanaman/${id}`, formData)
            .then((res) => {
                console.log('Data berhasil dikirim : ', res.data);
            })
            .catch((err) => {
                console.error('Terjadi Kesalahan : ', err);
                alert('Terjadi kesalahan saat mengirim form!');
            });
        console.log("Submit");
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupNama">
                <Form.Label>Nama Tanaman</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text" name='nama'
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Mawar"
                    autoFocus
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupNamaLatin">
                <Form.Label>Nama Latin</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text"
                    name='namaLatin'
                    value={formData.namaLatin}
                    onChange={handleChange}
                    placeholder="Rosa" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupKhasiat">
                <Form.Label>Khasiat</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text"
                    name='khasiat'
                    value={formData.khasiat}
                    onChange={handleChange}
                    placeholder="Meredakan Nyeri Punggung" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupBagianYangDigunakan">
                <Form.Label>Bagian Yang Digunakan</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text"
                    name='bagianYangDigunakan'
                    value={formData.bagianYangDigunakan}
                    onChange={handleChange}
                    placeholder="Batang" />
            </Form.Group>
            <Button type="submit" variant='primary'>
                Tambah
            </Button>
        </Form>
    )
}