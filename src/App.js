import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import MyPage from './component/MyPage'
import MainPage from './component/MainPage';
import SearchPage from './component/SearchPage';
import Review from './component/Review';
import SignUp from './component/SignUp';
import Bookmark from './component/Bookmark';
import { UserProvider } from './context/UserContext';
import Header from './component/Header';
import UpdateInfo from './component/UpdateInfo';

function App() {
  return (
  <UserProvider> {/*하위 구성요소들에게 사용자 데이터를 제공 */}
    <BrowserRouter>
        <Header/>
          <Routes>
              <Route path='/' element={<Login/>}></Route>
              <Route path='/SignUp' element={<SignUp/>}></Route>
              <Route path='/MainPage' element={<MainPage/>}></Route>
              <Route path='/MyPage/:userId' element={<MyPage/>}></Route>
              <Route path='/UpdateInfo/:userId' element={<UpdateInfo/>}></Route>
              <Route path='/Bookmark/:userId' element={<Bookmark/>}></Route>
              <Route path='/SearchPage' element={<SearchPage/>}></Route>
              <Route path='/Review/:title' element={<Review/>}></Route>
          </Routes>
      

        {/*Footer */}
        <div>
            
        </div>
    </BrowserRouter>
  </UserProvider>
  );
}

export default App;
