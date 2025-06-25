import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../Assests/breadcrum_arrow.png'; 

const Breadcrum = (props) => {
    const { product } = props;

    return (
        <nav className='breadcrum'>
            <span>HOME</span> 
            <img src={arrow_icon} alt="arrow" />
            <span>SHOP</span> 
            <img src={arrow_icon} alt="arrow" />
            <span>{product?.category || "Category"}</span> 
            <img src={arrow_icon} alt="arrow" />
            <span>{product?.name || "Product"}</span>
        </nav>
    );
};

export default Breadcrum;
