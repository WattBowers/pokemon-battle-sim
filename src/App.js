import axios from 'axios';
import Header from './Header';
import BattleConsole from './BattleConsole';
import './css/App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <BattleConsole />
    </div>
  );
}

export default App;
