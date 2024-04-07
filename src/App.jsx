import styled from 'styled-components';
import grid from './img/grid.svg';
import Palettes from './components/Palettes';
import Palette from './components/Palette';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <AppStyled bg = {'#3c40c6'} grid = {grid}>
        <div className="grid"></div>
        <Routes>
          <Route path="/" element={<Palettes/>} />
          <Route path="/palette/:id" element={<Palette/>} />
        </Routes>
      </AppStyled>
    </BrowserRouter>
  )
}

const AppStyled = styled.div`
  min-height: 100vh;
  background-color: ${props => props.bg};
  position: relative;

  .grid{
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.grid});
    background-repeat: repeat;
    z-index: 0;
  }
`;

export default App;
