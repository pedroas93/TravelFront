import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import 'antd/dist/antd.css';
import '../../../App.scss';
import Api from '../../../services/api'

const { Meta } = Card;

export default function Index(props) {

    const [cardData, setCardData] = useState([]);

    useEffect(() => {
        Api._getTravels().then(data => {
            console.log('what is Data?', data);
            setCardData(data);
        })
    }, []);

    return (
        <section className='Travel-section '>
            <a>
                {cardData && cardData.map((item) => {
                    return (
                        <div>
                            <div className="BannerAbsolute">
                                <p className= "TextBanner">
                                    {item.marker}
                                </p>
                            </div>
                            <div className="hero" >
                                <Card
                                    key={item.id}
                                    hoverable
                                    style={{ width: 375 }}
                                    cover={<img alt="example" width="500" src={item.image} />}
                                >
                                    <div>
                                        <h1 className="CardTitle-title">{item.title}</h1>
                                        <h2 className="CardTitle-subtitle">{item.subTitle}</h2>
                                        <div className="contentType" >
                                            <div className="Type">
                                                <span>{item.type}</span>
                                                <span className="triangle"></span>
                                            </div>
                                            <span className="hours">{item.hours} jours</span>
                                            <p className="ratings">{item.ratings}</p>
                                        </div>
                                        {item.include && item.include.map((element, index) => {
                                            return (
                                                <ul key={index} className='include' >
                                                    <li>{element}</li>
                                                </ul>
                                            )
                                        })}
                                        <div className="Bttom-Card contentPrice">
                                            <span>
                                                des
                                            </span >
                                            <span className="price-line">
                                                {item.disacount}
                                            </span>
                                            <div className="cost">
                                                <span>
                                                    {item.cost}
                                                </span>
                                                <span>
                                                    {item.currency}
                                                </span>
                                            </div>
                                            <div className="Bttom">
                                                <div className="contentBttom">
                                                    <div className="spaceBtoom">
                                                        <span className="textBtoom">programme</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )
                })}
            </a>
        </section>
    );
}