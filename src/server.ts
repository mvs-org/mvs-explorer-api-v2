import app from './app'

const PORT = (process.env.PORT) ? process.env.PORT : 80

app.listen(PORT, () => {
    console.log('Metaverse Explorer API server v2 listening on port ' + PORT)
})
