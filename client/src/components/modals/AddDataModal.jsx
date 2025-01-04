import axios from 'axios';
import { useState } from 'react';

// Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function AddDataModal() {
    const [file, setFile] = useState(null)
    const [textData, setTextData] = useState({
        nama: '',
        namaLatin: '',
        khasiat: '',
        bagianYangDigunakan: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setTextData({
            ...textData,
            [name]: value,
        });
    };

    const handleImage = (e) => {
        setFile(e.target.files[0])
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Tolong isi file!');
            return;
        }

        const formData = new FormData();
        appendFormData(formData, textData);
        formData.append('file', file);

        await axios
            .post(`${import.meta.env.VITE_API_URL}/api/tanaman`, formData)
            .then((res) => {
                console.log('Data berhasil dikirim : ', res.data);
            })
            .catch((err) => {
                console.error('Terjadi Kesalahan : ', err.response.data);
                alert(err.response.data.message);
            });
        window.location.reload();
    }

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3" controlId="formGroupNama">
                <Form.Label>Nama Tanaman</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text" name='nama'
                    value={textData.nama}
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
                    value={textData.namaLatin}
                    onChange={handleChange}
                    placeholder="Rosa" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupKhasiat">
                <Form.Label>Khasiat</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text"
                    name='khasiat'
                    value={textData.khasiat}
                    onChange={handleChange}
                    placeholder="Meredakan Nyeri Punggung" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupBagianYangDigunakan">
                <Form.Label>Bagian Yang Digunakan</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text"
                    name='bagianYangDigunakan'
                    value={textData.bagianYangDigunakan}
                    onChange={handleChange}
                    placeholder="Batang" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupGambar">
                <Form.Label>Gambar</Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleImage} />
            </Form.Group>
            <Button type="submit" variant='primary'>
                Tambah
            </Button>
        </Form>
    )
}

// Fungsi untuk mengisi textData ke formData
const appendFormData = (formData, fields) => {
    for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
    }
};