
import { Routes, BrowserRouter, Route } from "react-router"
import InterviewForm from './Components/questions/questions'
import Temp from "./Components/temp/temp"
function App() {

 
  return (
    <BrowserRouter basename="/question-generator">
      <Routes>
        <Route path='/' element={<InterviewForm />}></Route>
        <Route path="/temp" element={<Temp/>}></Route>
      </Routes>

    </BrowserRouter>

  )
}

export default App
