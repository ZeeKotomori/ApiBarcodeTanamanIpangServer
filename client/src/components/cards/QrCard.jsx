import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router'

//Bootstrap
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function QrCard() {
    let { file } = useParams();
    const [qrData, setQrData] = useState(null)

    useEffect(() => {
        // Mengambil data dari localStorage
        const storedData = localStorage.getItem('qrData');
        if (storedData) {
            setQrData(JSON.parse(storedData));
        }
    }, []);

    if (!qrData) {
        return <p>Loading...</p>;
    }

    const url = import.meta.env.VITE_API_URL;

    return (
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={`${url}${qrData.qrImageUrl}`} />
                <Card.Body>
                    <Card.Title className='pb-2'>{qrData.nama} / {qrData.namaLatin}</Card.Title>
                    <Card.Text className='text-body-secondary mb-0'>
                        Khasiat
                    </Card.Text>
                    <Card.Text>
                        {qrData.khasiat[0].deskripsi}
                    </Card.Text>
                    <Card.Text className='text-body-secondary mb-0'>
                        Bagian Yang Digunakan
                    </Card.Text>
                    <Card.Text className='mb-5'>
                        {qrData.bagianYangDigunakan[0].bagian}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Row>
    )
}