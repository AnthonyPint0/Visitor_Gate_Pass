// TableRow.jsx

import React from 'react';
import StatusBadge from './StatusBadge.jsx';

const TableRow = ({ visitor }) => {

    return (
        <tr>
            <td>{visitor.name}</td>
            <td>{visitor.phone_number}</td>
            <td>{visitor.purpose_of_visit}</td>
            <td>{visitor.entry_gate}</td>
            <td>{new Date(visitor.check_in_time).toLocaleString()}</td>
            <td>{visitor.exit_gate}</td>
            <td>{visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleString() : 'N/A'}</td>
            <td>{visitor.group_size}</td>
            <td>
                {visitor.visitor_cards.map(card => (
                    <StatusBadge key={card.card_id} card={card} />
                ))}
            </td>
            <td>
                <img src={visitor.photos} alt="Visitor" width="30" height="30" />
            </td>
        </tr>
    );
};

export default TableRow;