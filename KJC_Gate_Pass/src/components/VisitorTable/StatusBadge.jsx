import React from "react";

const StatusBadge = ({ card }) => {
  const getStatusClass = (status) => {
    if (status === "checked_in")
      return "flex items-center justify-center bg-red-500 text-white rounded px-1 py-1 mx-1 h-8";
    if (status === "checked_out")
      return "flex items-center justify-center bg-green-600 text-white rounded px-1 py-1 mx-1 h-8";
    return "flex items-center justify-center bg-yellow-600 text-white rounded px-1 py-1 mx-1 h-8";
  };

  return (
    <span className={getStatusClass(card.status)}>
      <p>{card.card_id}</p>
    </span>
  );
};

export default StatusBadge;
