import React, { useState, useEffect } from 'react';
import Api from '../../services/api'

export default function PurchaseSummary(props) {
    const [product, setProduct] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        Api._getProducts().then(data => {
            let newSubtotal = Number(subtotal)
            data.forEach(element => {
                newSubtotal += Number(element.price);
            });
            setSubtotal(newSubtotal);
            setProduct(data)
        })
    }, []);

    return (
        <section>
            <div>
                <div className='ContainerlTittleResume'>
                    <h1 className='tittleInitial'>
                        RESUMEN DE LA ORDEN
                    </h1>
                </div>
                {product && product.map(productItem => {
                    return (
                        <div className="productList" key={productItem.name}>
                            <img width="100" height="100" src={productItem.image} />
                            <p>
                                {productItem.name}
                            </p>
                            <p className="pricePRoduct">
                                ${productItem.price}
                            </p>
                        </div>
                    )
                })}
                <div className="wrapper-btn">
                    <button className='btn-secundary'> Editar </button>
                </div>
                <div className='ContainerlTittleSubtotal'>
                    <h1 className='tittleInitial'>
                        SUBTOTAL
                    </h1>
                    <p className="subTotalPrice">
                        ${subtotal}
                    </p>
                </div>
                <div className='ContainerlTittleSubtotal'>
                    <h1 className='sendTotal'>
                        ENVÍO
                    </h1>
                    <h1 className='sendTotalPrice'>
                        A calcular
                    </h1>
                </div>
                <button type="submit" className="btn-total">TOTAL $13,974.00</button>

            </div>
        </section>
    );
}