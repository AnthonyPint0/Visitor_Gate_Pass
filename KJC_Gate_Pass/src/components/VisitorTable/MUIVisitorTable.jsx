import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const PhotoCell = ({ value }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={value}
      alt="Visitor"
      width="30"
      height="30"
      style={{ borderRadius: "50%" }}
    />
  </div>
);

const HorizontalStatusBadgeContainer = styled(Box)({
  display: "flex",
  flexWrap: "nowrap",
  gap: "8px",
  overflowX: "auto",
});

const columns = useMemo(
  () => [
    { field: "name", headerName: "Name", width: 90, sortable: true },
    {
      field: "Phone Number",
      headerName: "phone_number",
      width: 150,
      sortable: true,
    },
    {
      field: "purpose_of_visit",
      headerName: "Purpose of Visit",
      width: 150,
      sortable: true,
    },
    {
      field: "entry_gate",
      headerName: "Entry Gate",
      type: "number",
      width: 90,
      sortable: true,
    },
    {
      field: "check_in_time",
      headerName: "Check-In Time",
      width: 150,
      sortable: true,
    },
    {
      field: "exit_gate",
      headerName: "Exit Gate",
      type: "number",
      width: 90,
      sortable: true,
    },
    {
      field: "check_out_time",
      headerName: "Check-Out Time",
      width: 150,
      sortable: true,
    },
    {
      field: "visitor_cards",
      headerName: "Visitor ID Cards",
      type: "number",
      width: 150,
      sortable: false,
      renderCell: (value) => (
        <HorizontalStatusBadgeContainer>
          {value.map((card) => (
            <StatusBadge key={card.card_id} card={card} />
          ))}
        </HorizontalStatusBadgeContainer>
      ),
    },
    {
      field: "photos",
      headerName: "Photos",
      width: 100, // Adjust width as needed
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <PhotoCell value={params.value} />,
    },
  ],
  []
);

const filteredData = useMemo(() => {
  return visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(filterText.toLowerCase()) ||
      visitor.phone_number.includes(filterText)
  );
}, [filterText, visitors]);

const data = useMemo(() => filteredData, [filteredData]);

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function DataGridDemo({ visitors }) {
  const [filterText, setFilterText] = useState("");

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

{
  /* <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
          /> */
}
