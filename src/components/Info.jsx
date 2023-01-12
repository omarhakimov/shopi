import AppContext from "../context/Context";
import { useContext } from "react";

const Info = ({image, title, description}) => {
    const {setCartOpened} = useContext(AppContext);

  return (
    <div className="emptyCart d-flex align-center justify-center flex-column flex">
        <img className="mb-20" width="120px"src={image} alt="empty"/>
        <h2>{title}</h2>
        <p className="opacity-6">{description}</p>
        <button onClick={() => {setCartOpened(false)}} className="greenButton">
            <img src="/img/arrow.svg" alt="arrow" />
             Вернуться назад
        </button>
    </div>
  )
}

export default Info;
