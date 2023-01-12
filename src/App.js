import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context/Context';

import Orders from './pages/Orders';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

export const URL = 'https://62f60032a3bce3eed7b70694.mockapi.io';

function App() {
	const [items, setItems] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [cartOpened, setCartOpened] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const [cartResponse, favoritesResponse, itemResponse] = await Promise.all([
					axios.get(`${URL}/cart`),
					axios.get(`${URL}/favorites`),
					axios.get(`${URL}/items`),
				]);

				setIsLoading(false);
				setCartItems(cartResponse.data);
				setFavorites(favoritesResponse.data);
				setItems(itemResponse.data);
			} catch (error) {
				alert('Error');
				console.error(error);
			}
		}
		fetchData();
	}, []);

	const onAddToCart = async (obj) => {
		try {
			const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
			if (findItem) {
				setCartItems((prev) =>
					prev.filter((item) => Number(item.parentId) !== Number(obj.id)),
				);
				await axios.delete(`${URL}/cart/${findItem.id}`);
			} else {
				setCartItems((prev) => [...prev, obj]);
				const { data } = await axios.post(`${URL}/cart`, obj);
				setCartItems((prev) =>
					prev.map((item) =>
						item.parentId === data.parentId ? { ...item, id: data.id } : item,
					),
				);
			}
		} catch (error) {
			alert('Error');
			console.error(error);
		}
	};

	const onAddToFavorite = async (obj) => {
		try {
			if (favorites.find((favObj) => Number(obj.id) === Number(favObj.id))) {
				axios.delete(`${URL}/favorites/${obj.id}`);
				setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
			} else {
				const { data } = await axios.post(`${URL}/favorites`, obj);
				setFavorites((prev) => [...prev, data]);
			}
		} catch (error) {
			alert("Can't add to favorites!");
			console.error(error);
		}
	};

	const onRemoveItem = (id) => {
		try {
			axios.delete(`${URL}/cart/${id}`);
			setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
		} catch (error) {
			alert('Error');
			console.error(error);
		}
	};

	const onChangeSearchInput = (event) => {
		setSearchValue(event.target.value);
	};

	const isItemAdded = (id) => {
		return cartItems.some((obj) => Number(obj.parentId) === Number(id));
	};

	return (
		<AppContext.Provider
			value={{
				items,
				cartItems,
				favorites,
				isItemAdded,
				onAddToFavorite,
				onAddToCart,
				setCartOpened,
				setCartItems,
			}}
		>
			<div className='wrapper clear'>
				<Drawer
					onClose={() => setCartOpened(false)}
					items={cartItems}
					onRemove={onRemoveItem}
					opened={cartOpened}
				/>

				<Header onClickCart={() => setCartOpened(true)} />

				<Routes>
					<Route
						path=''
						element={
							<Home
								items={items}
								cartItems={cartItems}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								onChangeSearchInput={onChangeSearchInput}
								onAddToFavorite={onAddToFavorite}
								onAddToCart={onAddToCart}
								isLoading={isLoading}
							/>
						}
					/>
					<Route path='/favorites' element={<Favorites />} />
					<Route path='/orders' element={<Orders />} />
				</Routes>
			</div>
		</AppContext.Provider>
	);
}

export default App;
