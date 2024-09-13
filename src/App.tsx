import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1); // Page starts from 1 for this API
  const rowsPerPage = 5; // Adjust as needed

  // Fetch the data for the current page
  useEffect(() => {
    fetchPageData(page);
  }, [page]);

  const fetchPageData = async (page: number) => {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`);
    const json = await response.json();
    setData(json.data); // Assuming `json.data` contains the artwork list
    setTotalRecords(json.pagination.total);  // Assuming `json.pagination.total` has the total records
  };

  // Handle page change
  const onPageChange = (event: { first: number; page: number }) => {
    setPage(event.page + 1); // Increment by 1 since the API is 1-based index
  };

  // Handle row selection, ensure selection persists across pages
  const onRowSelect = (event: DataTableSelectionChangeEvent) => {
    const updatedSelection = [...selectedRows];
    event.value.forEach((item: Artwork) => {
      if (!updatedSelection.some(selected => selected.id === item.id)) {
        updatedSelection.push(item);
      }
    });
    setSelectedRows(updatedSelection);
  };

  // Custom selection panel component to show selected rows
  const CustomSelectionPanel: React.FC<{ selectedRows: Artwork[] }> = ({ selectedRows }) => (
    <div className="selection-panel">
      <h4>Selected Artworks</h4>
      <ul>
        {selectedRows.map(row => (
          <li key={row.id}>{row.title} by {row.artist_title}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="datatable-container">
      {/* Custom row selection panel */}
      <CustomSelectionPanel selectedRows={selectedRows} />

      {/* PrimeReact DataTable */}
      <DataTable
        value={data}
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        lazy
        selection={selectedRows}
        onSelectionChange={onRowSelect}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        <Column field="id" header="ID"></Column>
        <Column field="title" header="Artwork Title"></Column>
        <Column field="artist_title" header="Artist"></Column>
        <Column field="date_display" header="Date"></Column>
      </DataTable>

      {/* Pagination component */}
      <Paginator
        first={(page - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default App;
