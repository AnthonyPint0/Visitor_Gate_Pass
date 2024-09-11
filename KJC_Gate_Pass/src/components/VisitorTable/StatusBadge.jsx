import React from "react";

const StatusBadge = ({ card }) => {
  const getStatusClass = (status) => {
    if (status === "checked_in")
      return "inline-block bg-red-500 text-center text-white rounded px-2 py-1 mx-1";
    if (status === "checked_out")
      return "inline-block bg-green-600 text-center text-white rounded px-2 py-1 mx-1";
    return "inline-block bg-yellow-600 text-center text-white rounded px-2 py-1 mx-1";
  };

  return <span className={getStatusClass(card.status)}>{card.card_id}</span>;
};

export default StatusBadge;
