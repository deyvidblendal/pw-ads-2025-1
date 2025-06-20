import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { feedbackWait, feedbackConfirm, feedbackNotify } from '../../ui/Feedback'

export default function CarsList() {

  const columns = [
    { 
      field: 'id', 
      headerName: 'Cód.', 
      width: 90 
    },
    {
      field: 'brand_model', // Nova coluna combinada
      headerName: 'Marca/Modelo',
      width: 250,
      renderCell: params => (
        <div>
          <strong>{params.row.brand}</strong> - {params.row.model}
        </div>
      )
    },
    {
      field: 'color',
      headerName: 'Cor',
      width: 120
    },
    {
      field: 'year_manufacture',
      headerName: 'Ano Fab.',
      width: 100
    },
    {
      field: 'imported',
      headerName: 'Importado?',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: params => (
        params.value ? 'SIM' : ''
      )
    },
    {
      field: 'plates',
      headerName: 'Placas',
      width: 120
    },
    {
      field: 'selling_price',
      headerName: 'Preço Venda',
      width: 150,
      renderCell: params => (
        params.value ? 
          params.value.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }) 
          : ''
      )
    },
    {
      field: 'selling_date',
      headerName: 'Data Venda',
      width: 150,
      valueFormatter: value => {
        if(value) {
          const date = new Date(value)
          return date.toLocaleDateString('pt-BR')
        }
        else return ''
      }
    },
    {
      field: '_actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: params => {
        return <>
          <Link to={'./' + params.id}>
            <IconButton aria-label="editar">
              <EditIcon />
            </IconButton>
          </Link>
          
          <IconButton aria-label="excluir" 
            onClick={() => handleDeleteButtonClick(params.id)}>
            <DeleteForeverIcon color="error" />
          </IconButton>
        </>
      }
    } 
  ];

  const [state, setState] = React.useState({
    cars: []
  })
  const {
    cars
  } = state

  // Carrega dados da API de carros
  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch('https://api.faustocintra.com.br/cars')
      const data = await response.json()

      setState({ ...state, cars: data })
    }
    catch(error) {
      console.error(error)
      feedbackNotify(error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  async function handleDeleteButtonClick(id) {
    if(await feedbackConfirm('Deseja realmente excluir este carro?')) {
      feedbackWait(true)
      try {
        await fetch(`https://api.faustocintra.com.br/cars/${id}`,
          { method: 'DELETE' }
        )
        loadData()
        feedbackNotify('Carro excluído com sucesso.')
      }
      catch(error) {
        console.error(error)
        feedbackNotify('ERRO: ' + error.message, 'error')
      }
      finally {
        feedbackWait(false)
      }
    }
  }

  return <>
    <Typography variant="h1" gutterBottom>
      Listagem de carros
    </Typography>

    <Box sx={{
      display: 'flex',
      justifyContent: 'right',
      mb: 2
    }}>
      <Link to={'./new'}>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          startIcon={ <AddCircleIcon /> }
        >
          Novo carro
        </Button>
      </Link>
    </Box>

    <Paper sx={{ height: 400, width: '100%' }} elevation={10}>
      <DataGrid
        rows={cars}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Paper>
  </>
}