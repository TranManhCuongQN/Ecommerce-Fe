import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const PriceCard = ({ data }) => {
  return (
    <div className="flex flex-col items-end justify-center">
      <span className="text-xl font-semibold">
        {formatPrice(data.data.promotion)}
      </span>
      <span className="text-base line-through">
        {formatPrice(data.data.price)}
      </span>
    </div>
  );
};

export default PriceCard;