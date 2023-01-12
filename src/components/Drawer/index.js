import axios from 'axios';
import { useState } from 'react';

import Info from '../Info';
import { useCart } from '../../hooks/useCart';

import { URL } from '../../App';
import styles from './Drawer.module.scss';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Drawer = ({ onClose, onRemove, items = [], opened }) => {
	const { cartItems, setCartItems, totalPrice } = useCart();
	const [orderId, setOrderId] = useState(null);
	const [isOrderComplete, setIsOrderCompleted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onClickOrder = async () => {
		try {
			setIsLoading(true);
			const { data } = await axios.post(`${URL}/orders`, {
				items: cartItems,
			});
			setOrderId(data.id);
			setIsOrderCompleted(true);
			setCartItems([]);

			for (let i = 0; i < cartItems.length; i++) {
				const item = cartItems[i];
				await axios.delete(`${URL}/cart/${item.id}`);
				await delay(1000);
			}
		} catch (error) {
			alert("Can't place an order (");
		}
		setIsLoading(false);
	};

	return (
		<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
			<div className={styles.drawer}>
				<h2 className='d-flex justify-between mb-30'>
					Cart{' '}
					<img onClick={onClose} className='cu-p' src='img/btn-remove.svg' alt='Close' />
				</h2>

				{items.length > 0 ? (
					<div className='d-flex flex-column flex'>
						<div className='items flex'>
							{items.map((obj) => (
								<div key={obj.id} className='cartItem d-flex align-center mb-20'>
									<div
										style={{ backgroundImage: `url(${obj.imageUrl})` }}
										className='cartItemImg'
									></div>

									<div className='mr-20 flex'>
										<p className='mb-5'>{obj.title}</p>
										<b>{obj.price} NTD</b>
									</div>
									<img
										onClick={() => onRemove(obj.id)}
										className='removeBtn'
										src='img/btn-remove.svg'
										alt='Remove'
									/>
								</div>
							))}
						</div>
						<div className='cartTotalBlock'>
							<ul>
								<li>
									<span>Total:</span>
									<div></div>
									<b>{totalPrice} NTD </b>
								</li>
								<li>
									<span>Tax 5%:</span>
									<div></div>
									<b>{(totalPrice / 100) * 5} NTD </b>
								</li>
							</ul>
							<button
								disabled={isLoading}
								onClick={onClickOrder}
								className='greenButton'
							>
								Place an order <img src='img/arrow.svg' alt='Arrow' />
							</button>
						</div>
					</div>
				) : (
					<Info
						title={isOrderComplete ? 'Order placed!' : 'Cart is empty'}
						description={
							isOrderComplete
								? `Your order #${orderId} will be prepared and delivered soon.`
								: 'Choose at least one item to place an order.'
						}
						image={isOrderComplete ? 'img/complete-order.jpg ' : 'img/empty-cart.jpg '}
					/>
				)}
			</div>
		</div>
	);
};

export default Drawer;
