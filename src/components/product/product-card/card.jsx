import React from "react";
import "./index.css";

const Card = () => {
  return (
    <li className="product soon">
      <img
        src="https://assets.bigcartel.com/product_images/372915931/horizon_relief_blue_side.jpg?auto=format&fit=max&w=900"
        alt=""
        className="w-full rounded-sm"
      />
      <p className="product-name">Horizon Relief - blue</p>
      <p className="product-price">
        <span>$</span>
        643
      </p>
    </li>
  );
};

export default Card;
