import React, { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { formatDateWithPadding } from "../../library/helper.js";
import StatusBadge from "./StatusBadge.jsx";
import "./VisitorTable.css"; // Retain the existing CSS for any needed custom styling

const MUIVisitorTable = ({ visitors, totalVisitorCount }) => {
  const [filterText, setFilterText] = useState("");

  // Process visitors to replace null values in check_in_time and check_out_time
  const processedVisitors = useMemo(() => {
    return visitors.map((visitor) => ({
      ...visitor,
      check_in_time: visitor.check_in_time
        ? formatDateWithPadding(visitor.check_in_time)
        : "N/A",
      check_out_time: visitor.check_out_time
        ? formatDateWithPadding(visitor.check_out_time)
        : "N/A",
    }));
  }, [visitors]);

  // Define columns for DataGrid
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        renderCell: (params) => (
          <div className="flex min-w-14 flex-nowrap">{params.value}</div>
        ),
      },
      { field: "phone_number", headerName: "Phone Number", flex: 1 },
      {
        field: "purpose_of_visit",
        headerName: "Purpose of Visit",
        flex: 2,
        renderCell: (params) => (
          <div className="flex min-w-20 flex-nowrap">{params.value}</div>
        ),
      },
      {
        field: "entry_gate",
        headerName: "Entry Gate",
        flex: 1,
        renderCell: (params) => (
          <div className="flex min-w-10 flex-nowrap">{params.value}</div>
        ),
      },
      {
        field: "check_in_time",
        headerName: "Check-In Time",
        flex: 1,
        valueGetter: (params) => params.value, // already formatted or "N/A"
      },
      {
        field: "exit_gate",
        headerName: "Exit Gate",
        flex: 1,
        renderCell: (params) => (
          <div className="flex min-w-10 flex-nowrap">{params.value}</div>
        ),
      },
      {
        field: "check_out_time",
        headerName: "Check-Out Time",
        flex: 1,
        valueGetter: (params) => params.value, // already formatted or "N/A"
      },
      {
        field: "group_size",
        headerName: "Group Size",
        flex: 1,
        renderCell: (params) => (
          <div className="text-center">{params.value}</div>
        ),
      },
      {
        field: "visitor_cards",
        headerName: "Visitor ID Cards",
        flex: 2,
        sortable: false,
        renderCell: (params) => (
          <div className="flex flex-nowrap">
            {params.value.map((card) => (
              <StatusBadge key={card.card_id} card={card} />
            ))}
          </div>
        ),
      },
      {
        field: "photos",
        headerName: "Photos",
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <div className="flex flex-1 justify-center">
            <img className="w-7 h-7" src={params.value} alt="Visitor" />
          </div>
        ),
      },
    ],
    [] // No dependencies needed for columns, they are static
  );

  // Filtered rows based on filterText
  const filteredRows = useMemo(() => {
    return processedVisitors.filter(
      (visitor) =>
        visitor.name.toLowerCase().includes(filterText.toLowerCase()) ||
        visitor.phone_number.includes(filterText)
    );
  }, [filterText, processedVisitors]);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <div className="text-count">
        <h2>Visitor Data Grid</h2>
        <input
          type="text"
          placeholder="Filter by name or phone number"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border w-56 border-gray-400 rounded px-1 h-8 mb-1"
        />
        <h1 className="text-2xl">{totalVisitorCount}</h1>
      </div>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row._id} // Specify _id as the unique identifier
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        pagination
        autoHeight
      />
    </div>
  );
};

export default MUIVisitorTable;
