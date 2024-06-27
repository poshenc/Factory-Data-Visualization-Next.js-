import { ThemeProvider } from '@emotion/react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import React from 'react';
import muiTheme from '../../styles/mui-theme';
import styles from './Grid.module.scss';

interface Props {
  rows: object[]
  columns: GridColDef[]
  allowMultiple?: boolean,
  onRowSelectionModelChange?: (selectionModel: any) => void
}

export default function Grid(props: Props) {
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);

  const handleRowSelectionModelChange = (selection: any) => {
    let finalOutput: string | any[];
    if (selection.length > 1) {
      const selectionSet = new Set(selectionModel);
      const result = selection.filter((s: any) => !selectionSet.has(s));
      setSelectionModel(result);
      finalOutput = result;
    } else {
      setSelectionModel(selection);
      finalOutput = selection;
    }
    if (props.onRowSelectionModelChange) {
      const selectedRows = props.rows.filter((row: any) => finalOutput.includes(row.id))
      props.onRowSelectionModelChange(selectedRows);
    }
  };
  const handleMultipleRowSelectionModelChange = (selection: any) => {
    const selectionSet = new Set(selection);
    setSelectionModel(selection);

    if (props.onRowSelectionModelChange) {
      const selectedRows = props.rows.filter((row: any) => selectionSet.has(row.id))
      props.onRowSelectionModelChange(selectedRows);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <DataGrid
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          },
          "& .MuiDataGrid-columnHeader": {
            fontSize: "1.25rem",
            fontFamily: "NotoSansTC-Bold"
          },
          height: '100%'
        }}
        className={styles.cell}
        rows={props.rows}
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        rowSelectionModel={selectionModel}
        hideFooterSelectedRowCount
        onRowSelectionModelChange={props.allowMultiple ? handleMultipleRowSelectionModelChange : handleRowSelectionModelChange}
        disableRowSelectionOnClick
      />
    </ThemeProvider>
  );
}