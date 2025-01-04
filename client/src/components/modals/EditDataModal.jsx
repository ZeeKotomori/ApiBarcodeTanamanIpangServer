import axios from 'axios';
import { useState, useEffect } from 'react';

// Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function EditDataModal({ id }) {
    const [file, setFile] = useState(null)
    const [textData, setTextData] = useState({
        nama: '',
        namaLatin: '',
        khasiat: [{
            deskripsi: ''
        }],
        bagianYangDigunakan: [{
            bagian: ''
        }],
    });

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/tanaman/${id}`)
            .then((res) => {
                setTextData(res.data);
            })
            .catch((err) => {
                console.error('Terjadi Kesalahan : ', err);
                alert('Terjadi kesalahan saat mengambil data!');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target
        console.log(textData);

        if (name == "khasiat" || name == "bagianYangDigunakan") {
            const key = name == "khasiat" ? "deskripsi" : "bagian"
            setTextData({
                ...textData,
                [name]: [{ [key]: value }]
            })
        } else {
            setTextData({
                ...textData,
                [name]: value,
            });
        }

    };

    const handleImage = (e) => {
        setFile(e.target.files[0])
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert('Tolong isi file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('nama', textData.nama);
        formData.append('namaLatin', textData.namaLatin);
        formData.append('khasiat', textData.khasiat[0].deskripsi);
        formData.append('bagianYangDigunakan', textData.bagianYangDigunakan[0].bagian);

        axios
            .put(`${import.meta.env.VITE_API_URL}/api/tanaman/${id}`, formData)
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
                    type="text"
                    name='nama'
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
                    value={textData.khasiat[0].deskripsi}
                    onChange={handleChange}
                    placeholder="Meredakan Nyeri Punggung" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupBagianYangDigunakan">
                <Form.Label>Bagian Yang Digunakan</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type="text"
                    name='bagianYangDigunakan'
                    value={textData.bagianYangDigunakan[0].bagian}
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