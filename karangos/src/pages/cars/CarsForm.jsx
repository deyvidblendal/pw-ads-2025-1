import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import { useMask } from '@react-input/mask'

export default function CarsForm() {

  // Lista de cores em ordem alfabética (value e label iguais)
  const colors = [
    "Amarelo", "Azul", "Bege", "Branco", "Bronze", "Cinza", 
    "Dourado", "Laranja", "Marrom", "Prata", "Preto", "Rosa", 
    "Roxo", "Verde", "Vermelho", "Vinho"
  ].sort()

  // Lista de anos decrescente (do ano atual até 1951)
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - 1950 },
    (_, index) => currentYear - index
  )

  // Máscara para placa (aaa-9$99)
  const platesRef = useMask({
    mask: "***-$#$$",
    replacement: {
      '*': /[A-Z]/,        //SÓ ACEITA LETRA MAIÚSCULA
      '#': /[0-9A-J]/,     //SOMENTE DO 0-9, OU DO A ao J MAIÚSCULA
      '$': /[0-9]/         //SOMENTE DO 0-9
    },
    showMask: false
  })

  // Valores iniciais
  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: '',
    imported: false,
    plates: '',
    selling_price: '',
    selling_date: null
  }

  const navigate = useNavigate()
  const params = useParams()

  const [state, setState] = React.useState({
    car: { ...formDefaults },
    formModified: false
  })
  const {
    car,
    formModified
  } = state

  React.useEffect(() => {
    if(params.id) loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE + `/cars/${params.id}`
      )
      const result = await response.json()
      
      // Converte datas do formato ISO
      if(result.selling_date) result.selling_date = new Date(result.selling_date)
      
      setState({ ...state, car: result })
    }
    catch(error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message)
    }
    finally {
      feedbackWait(false)
    }
  }

  function handleFieldChange(event) {
    const carCopy = { ...car }
    const field = event.target.name
    const value = field === 'imported' 
      ? event.target.checked 
      : event.target.value
      
    carCopy[field] = value
    setState({ ...state, car: carCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    event.preventDefault()
    feedbackWait(true)
    try {
      const reqOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
      }

      if(params.id) {
        await fetch(
          import.meta.env.VITE_API_BASE + `/cars/${params.id}`,
          { ...reqOptions, method: 'PUT' }
        )
      }
      else {
        await fetch(
          import.meta.env.VITE_API_BASE + `/cars`,
          { ...reqOptions, method: 'POST' }
        )
      }

      feedbackNotify('Veículo salvo com sucesso.', 'success', 2500, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    }
    catch(error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  async function handleBackButtonClick() {
    if(
      formModified &&
      ! await feedbackConfirm('Há informações não salvas. Deseja realmente sair?')
    ) return

    navigate('..', { relative: 'path', replace: 'true' })
  }

  return <>
    <Typography variant="h1" gutterBottom>
      Cadastro de Veículos
    </Typography>

    <Box className="form-fields">
      <form onSubmit={handleFormSubmit}>

        <TextField 
          variant="outlined"
          name="brand"
          label="Marca"
          fullWidth
          required
          autoFocus
          value={car.brand}
          onChange={handleFieldChange}
        />

        <TextField 
          variant="outlined"
          name="model"
          label="Modelo"
          fullWidth
          required
          value={car.model}
          onChange={handleFieldChange}
        />

        <TextField
          variant="outlined" 
          name="color"
          label="Cor" 
          fullWidth
          required
          value={car.color}
          select
          onChange={handleFieldChange}
        >
          {colors.map(color => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          variant="outlined" 
          name="year_manufacture"
          label="Ano de fabricação" 
          fullWidth
          required
          value={car.year_manufacture}
          select
          onChange={handleFieldChange}
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>

        <div className="MuiFormControl-root">
          <FormControlLabel
            control={
              <Checkbox
                name="imported"
                checked={car.imported}
                onChange={handleFieldChange}
                color="primary"
              />
            }
            label="Veículo importado"
          />
        </div>

        <TextField
          inputRef={platesRef}
          name="plates"
          label="Placas"
          placeholder="SOMENTE LETRAS MAIÚSCULAS"
          required
          value={car.plates}
          onChange={handleFieldChange}
        />

        <TextField 
          variant="outlined"
          name="selling_price"
          label="Preço de venda (R$)"
          fullWidth
          type="number"
          inputProps={{ 
            step: "0.01", 
            min: "0" 
          }}
          value={car.selling_price}
          onChange={handleFieldChange}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker 
            label="Data de venda"
            value={car.selling_date}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true
              }
            }}
            onChange={ date => {
              const event = { target: { name: 'selling_date', value: date } }
              handleFieldChange(event)
            }}
          />
        </LocalizationProvider>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          mt: 2
        }}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            onClick={handleBackButtonClick}
          >
            Voltar
          </Button>
        </Box>

        <Box sx={{
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          mt: 2
        }}>
          { JSON.stringify(car, null, ' ') }
        </Box>

      </form>
    </Box>
  </>
}