import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import axios from 'axios'

export default function Componente() {
  const [info, setInfo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE}/sobre/1`)
        // Armazena o conteúdo
        setInfo(response.data.info)
      } catch (error) {
        console.error("Erro ao buscar dados do 'sobre':", error)
    // Exibe erro
        setInfo(<Typography sx={{ color: 'red' }}>
          ERRO: não foi possível carregar as informações.
        </Typography>)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Typography variant="h1" sx={{ mb: 4 }}>
        Sobre o Projeto Karangos
      </Typography>
      
      <Box sx={{
        textAlign: 'justify',
        '& p': {
          lineHeight: '1.5',
          marginBottom: '16px'
        }
      }}>
        {}
        <div dangerouslySetInnerHTML={{ __html: info }} />
      </Box>
    </>
  )
}