import React from "react";
import Card from "../product-card/card";

const List = () => {
  return (
    <div className="md:mt-[4em] absolute">
      <div className="grid grid-cols-3 mt-[3px] mx-[3px]">
        <Card />

        <Card />
        <Card />
      </div>
    </div>
  );
};

export default List;
