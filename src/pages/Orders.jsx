import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '../components/Card';
import { URL } from '../App';

function Orders() {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(`${URL}/orders`);
				setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
				setIsLoading(false);
			} catch (error) {
				alert('Error');
				console.error(error);
			}
		})();
	}, []);

	return (
		<div className='content p-40'>
			<div className='d-flex justify-between align-center mb-40'>
				<h1>My orders</h1>
			</div>
			<div className='d-flex flex-wrap'>
				{(isLoading ? [...Array(10)] : orders).map((item, index) => (
					<Card key={index} loading={isLoading} {...item} />
				))}
			</div>
		</div>
	);
}

export default Orders;
