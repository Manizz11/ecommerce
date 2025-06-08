import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>An ecommerce is an online platform that facilitates the buying and selling of products or services over the internet. It serves a virtual marketplaces where businesses and individuals can showcase their products,interact with customers, and conduct trasaction without the need for a physical presence. E-commerce websites have gained immense popularity due to their convience,accesibility, and the gobal reach they offer.</p>
            <p>E-commerce website typically display products or services along with detailed description, imagesm prices,and any available variations(e.g.sizes,colors).Each product usally has its own dedicated page with relevant information.</p>
        </div>
    </div>
  )
}

export default DescriptionBox