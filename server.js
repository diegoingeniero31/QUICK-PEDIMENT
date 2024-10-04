const express = require('express');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse'); // Asumiendo que usas pdf-parse para extraer datos

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar multer para manejar archivos subidos
const upload = multer({ dest: 'uploads/' });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta POST para subir un PDF y extraer los datos
app.post('/extraer-parametros', upload.single('pdfInput'), async (req, res) => {
  try {
    // Leer el archivo PDF subido
    const dataBuffer = req.file;
    const data = await pdfParse(dataBuffer);

    // Aquí debes implementar la lógica para extraer los datos que necesitas del PDF
    // Ejemplo de datos extraídos
    const parametros = {
      Factura: "123456", // Sustituir por datos extraídos reales
      Pedimento: "789012",
      Fecha: "2024-10-04",
      Remesa: "REM12345",
      COVE: "COVE7890",
      Incoterm: "EXW",
      Peso: "1500",
      PesoBruto: "1600"
    };

    res.json(parametros); // Enviar los datos extraídos de vuelta al cliente
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).send('Error al procesar el archivo');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
