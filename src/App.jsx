
import './App.css'
import CreateRouter from './routes/index.jsx'
import routes from './routes/routes'

function App() {
  console.log('working')

  return (
    <>
      {CreateRouter(routes)}
    </>
  )
}

export default App
