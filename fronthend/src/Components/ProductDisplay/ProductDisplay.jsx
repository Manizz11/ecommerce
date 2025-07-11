import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assests/star_icon.png";
import star_dull_icon from "../Assests/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState(null);

    // Check if product exists before rendering
    if (!product) {
        return <div>Loading Product...</div>;
    }

    return (
        <div className='productdisplay'>
            <div className='productdisplay-left'>
                <div className='productdisplay-img-list'>
                    <img src={product.image} alt="Product thumbnail 1" />
                    <img src={product.image} alt="Product thumbnail 2" />
                    <img src={product.image} alt="Product thumbnail 3" />
                    <img src={product.image} alt="Product thumbnail 4" />
                </div>
                <div className='productdisplay-img'>
                    <img className='productdisplay-main-img' src={product.image} alt="Main product" />
                </div>
            </div>
            <div className='productdisplay-right'>
                <h1>{product.name || "No Name Available"}</h1>
                <div className='productdisplay-right-stars'>
                    <img src={star_icon} alt="Star" />
                    <img src={star_icon} alt="Star" />
                    <img src={star_icon} alt="Star" />
                    <img src={star_icon} alt="Star" />
                    <img src={star_dull_icon} alt="Star" />
                    <p>(122)</p>
                </div>
                <div className='productdisplay-right-prices'>
                    <div className='productdisplay-right-price-old'>${product.old_price || "0.00"}</div>
                    <div className='productdisplay-right-price-new'>${product.new_price || "0.00"}</div>
                </div>
                <div className='productdisplay-right-description'>
                    A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.
                </div>
                <div className='productdisplay-right-size'>
                    <h1>Select Size</h1>
                    <div className='productdisplay-right-sizes'>
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <div 
                                key={size}
                                className={selectedSize === size ? selectedSize : ''}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={() => {
                        if (selectedSize) {
                            addToCart(product.id);
                        }
                    }}
                    disabled={!selectedSize}
                    className='productdisplay-right-button'
                >
                    {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
                </button>
                <p className='productdisplay-right-category'>
                    <span>Category:</span> Women, T-Shirt, Crop Top
                </p>
                <p className='productdisplay-right-category'>
                    <span>Tags:</span> Modern, Latest
                </p>
            </div>
        </div>
    );
};

export default ProductDisplay;
