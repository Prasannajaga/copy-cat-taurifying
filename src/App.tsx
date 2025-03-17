
import "./App.css"; 
import FloatingWindow from './components/floatingWindow';

interface ClipboardItem {
  text: string;
  source: string;
  type ?: string,
  active?:boolean
} 

function App() {
 
  return (
    <>
      <FloatingWindow></FloatingWindow>
    </>
  )
}

export default App;
