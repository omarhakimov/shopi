import {Link} from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Header = (props) => {
  const {totalPrice} = useCart();

  return (
      <header className="d-flex justify-between align-center p-40">
      <Link to="/">
        <div className="headerleft d-flex align-center">
          <img style={{width:"40px", height:"40px", background:"#fcc", borderRadius:"30px"}}  src="/img/logo.png" alt="logo" />
          <div> 
            <h3 className="text-uppercase">React Shoes Store</h3> 
            <p className="opacity-5">Магазин лучших кроссовок</p>
          </div>
        </div>
      </Link>
      <ul className="d-flex">
        <li onClick={props.onClickCart} className="mr-30 cu-p">
          <img width={18} height={18} src="/img/cart.svg" alt="cart"/>
          <span >{totalPrice} руб.</span>
        </li>
        <li className="mr-20 cu-p">
          <Link to="/favorites">
            <img className="mr-20 cu-p" width={18} height={18} src="/img/heart.svg" alt="user"/>
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <img width={18} height={18} src="/img/user.svg" alt="user"/>
          </Link>
        </li>
      </ul> 
    </header>
  )
}

export default Header;