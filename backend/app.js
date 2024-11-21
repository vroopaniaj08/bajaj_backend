const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { fileURLToPath } = require('url');
const app = express()

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
dotenv.config()

app.use(cors())
app.use(express.json())

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})




app.get('/bfhl', (req, res) => {
    res.json({ "operation_code": 1 })
})

app.post('/bfhl', upload.single('file'), (req, res) => {
    let data;
    try {
        data = JSON.parse(req.body.data);
    } catch (error) {
        return res.status(400).json({ is_success: false, message: "Invalid data format" });
    }

    const file = req.file;
    const numbers = data.filter(item => !isNaN(item) && !isNaN(parseFloat(item)));
    const alphabets = data.filter(item => isNaN(item));
    const highest_lowercase = alphabets.sort().pop();
    const has_prime = numbers.some(num => isPrime(parseInt(num)));
    const file_details = file ? {
        is_valid: true,
        mime_type: file.mimetype,
        size_kb: file.size / 1024
    } : {
        is_valid: false,
        mime_type: null,
        size_kb: 0
    };

    res.json({
        is_success: true,
        user_id: "Apoorv_jain_21112024",
        email: "apoorvjain211139@acropolis.in",
        roll_number: "0827CS211034",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase: highest_lowercase,
        has_prime: has_prime,
        file_details: file_details
    });
})

const PORT = process.env.PORT || 7010
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;

}
app.use(express.static(path.join(__dirname, 'dist')));

console.log(path.join(__dirname, 'dist'))

// Set up a default route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
