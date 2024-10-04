const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para extraer parámetros de un texto con expresiones regulares
function extraerParametros(texto) {
    const parametros = {};

    parametros.Factura = extraerValor(texto, /Factura:\s*(.*)/i);
    parametros.Pedimento = extraerValor(texto, /PEDIMENTO:\s*(.*)/i);
    parametros.Fecha = extraerValor(texto, /FECHA:\s*(.*)/i);
    parametros.Remesa = extraerValor(texto, /REMESA:\s*(.*)/i);
    parametros.COVE = extraerValor(texto, /COVE:\s*(.*)/i);
    parametros.Incoterm = extraerValor(texto, /INCOTERM:\s*(.*)/i);
    parametros.Peso = extraerValor(texto, /Peso total:\s*(.*) KG/i);
    parametros.PesoBruto = extraerValor(texto, /PESO BRUTO:\s*(.*) KG/i);

    return parametros;
}

// Función para extraer un valor basado en una expresión regular
function extraerValor(texto, regex) {
    const match = texto.match(regex);
    return match ? match[1].trim() : 'N/A';
}

// Ruta POST para recibir el archivo PDF y extraer los parámetros
app.post('/extraer-parametros', upload.single('pdfInput'), (req, res) => {
    const filePath = req.file.path;

    // Leer el PDF y extraer el texto
    const dataBuffer = fs.readFileSync(filePath);
    pdf(dataBuffer).then(function(data) {
        const parametros = extraerParametros(data.text);
        res.json(parametros);  // Responde con los parámetros extraídos
        fs.unlink(filePath, (err) => { if (err) console.error('Error al eliminar archivo:', err); });
    }).catch(error => {
        console.error('Error al procesar el PDF:', error);
        res.status(500).json({ error: 'Error al procesar el PDF' });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
