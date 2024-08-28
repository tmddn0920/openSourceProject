import './App.css';
import { Route, Routes } from 'react-router-dom';
import OAuth from 'views/Authentication/OAuth';
import SignIn from 'views/Authentication/SignIn';
import SignUp from 'views/Authentication/SignUp';
import Main from 'main/main';
import Searchlist from 'searchlist/searchlist';
import Searchlist2 from 'searchlist2/searchlist2';
import Product from 'product/product';
import Product2 from 'product2/product2';
import Product3 from 'product3/product3';
import Product4 from 'product4/product4';
import Product5 from 'product5/product5';
import Product6 from 'product6/product6';
import Product7 from 'product7/product7';
import Product8 from 'product8/product8';
import Product9 from 'product9/product9';
import Product10 from 'product10/product10';
import Product11 from 'product11/product11';
import Product12 from 'product12/product12';

function App() {



  return (
    <Routes>
      <Route path='/auth'>
        <Route path='sign-up' element={<SignUp />} />
        <Route path='sign-in' element={<SignIn />} />
        <Route path='oauth-response/:token/:expirationTime' element={<OAuth />} />
      </Route>
      <Route path='/main' element={<Main />} />
      <Route path='/searchlist' element={<Searchlist />} />
      <Route path='/searchlist2' element={<Searchlist2 />} />
      <Route path='/product' element={<Product />} />
      <Route path='/product2' element={<Product2 />} />
      <Route path='/product3' element={<Product3 />} />
      <Route path='/product4' element={<Product4 />} />
      <Route path='/product5' element={<Product5 />} />
      <Route path='/product6' element={<Product6 />} />
      <Route path='/product7' element={<Product7 />} />
      <Route path='/product8' element={<Product8 />} />
      <Route path='/product9' element={<Product9 />} />
      <Route path='/product10' element={<Product10 />} />
      <Route path='/product11' element={<Product11 />} />
      <Route path='/product12' element={<Product12 />} />
    </Routes>
  );
}

export default App;
