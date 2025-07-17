import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import MyPage from './component/MyPage'
import MainPage from './component/MainPage';
import SearchPage from './component/SearchPage';
import Review from './component/Review';
import SignUp from './component/SignUp';

function App() {
  return (
    <BrowserRouter>
        <div>

            <Routes>
                <Route path='/' element={<Login/>}></Route>
                <Route path='/SignUp' element={<SignUp/>}></Route>
                <Route path='/MainPage' element={<MainPage/>}></Route>
                <Route path='/MyPage/:userId' element={<MyPage/>}></Route>
                <Route path='/SearchPage' element={<SearchPage/>}></Route>
                <Route path='/Review/:title' element={<Review/>}></Route>
            </Routes>
        </div>

        {/*Footer */}
        <div>
            
        </div>
    </BrowserRouter>
  );
}

export default App;
