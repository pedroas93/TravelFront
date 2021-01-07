import React, { useState } from 'react';
import 'antd/dist/antd.css';
import Api from '../../services/api'
import PurchaseSummary from './PurchaseSummary'
import StreetSend from './StreetSend'
export default function Index(props) {
    return (
        <section className='check-section'>
            <StreetSend></StreetSend>
            <PurchaseSummary></PurchaseSummary>
        </section>
    );
}