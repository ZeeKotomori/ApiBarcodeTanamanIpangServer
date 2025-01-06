import axios from 'axios';
import { useState, useEffect } from 'react';

// Bootstrap
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function DetailModal({ id }) {
    const url = import.meta.env.VITE_API_URL;
    const [dataDetail, setDataDetail] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tanaman/${id}`);
                setDataDetail(response.data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dataDetail.nama) {
        return <div>Loading...</div>;
    }

    const handleClick = () => {
        const qrLink = dataDetail.qrImageUrl
        const fileName = qrLink.split('/').pop();

        localStorage.setItem('qrData', JSON.stringify(dataDetail));

        const url = `${import.meta.env.VITE_REACT_URL}/print/${fileName}`
        const newTab = window.open(url, '_blank');
        newTab.print();
    }

    return (
        <Row className='justify-content-center justify-content-sm-start'>
            <Image src={`${url}${dataDetail.imageUrl}`} style={{ aspectRatio: '1/1', borderRadius: '2rem' }} />
            <Col className='pt-2' xs='12'>
                <h3>{dataDetail.nama} / {dataDetail.namaLatin}</h3>
            </Col>
            <Col className='pt-2' xs='12'>
                <p className='text-body-secondary mb-0'>Khasiat</p>
                <p>{dataDetail.khasiat[0].deskripsi}</p>
            </Col>
            <Col className='pt-2' xs='12'>
                <p className='text-body-secondary mb-0'>Bagian Yang Digunakan</p>
                <p>{dataDetail.bagianYangDigunakan[0].bagian}</p>
            </Col>
            <Col className='pt-2'>
                <Button as='a' size='sm' onClick={handleClick}>Print QR</Button>
            </Col>
        </Row>
    );
}