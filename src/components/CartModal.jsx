// src/components/CartModal.jsx
import React, { useState } from 'react';
import { Modal, Select, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // <-- i18n
import { setActiveCart, createCartAsync } from '../store/cartSlice';

const { Option } = Select;

export function CartModal({ visible, onClose, onCartSelected }) {
	const dispatch = useDispatch();
	const { carts } = useSelector((state) => state.cart);
	const { t } = useTranslation(); // <-- i18n

	const [chosenCartId, setChosenCartId] = useState(null);
	const [newCartName, setNewCartName] = useState('');

	const handleOk = async () => {
		if (chosenCartId) {
			dispatch(setActiveCart(chosenCartId));
			onClose();
			onCartSelected(chosenCartId);
			return;
		}
		if (newCartName.trim()) {
			try {
				const newCart = await dispatch(createCartAsync(newCartName)).unwrap();
				dispatch(setActiveCart(newCart.id));
				onClose();
				onCartSelected(newCart.id);
			} catch (err) {
				message.error(t('common.cartCreateError', 'Ошибка при создании корзины'));
			}
			return;
		}
		message.warning(t('common.cartSelectWarning', 'Выберите корзину или введите название новой'));
	};

	const handleCancel = () => {
		onClose();
		setChosenCartId(null);
		setNewCartName('');
	};

	return (
		<Modal
			title={t('common.cartModalTitle', 'Выберите или создайте корзину')}
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText={t('common.cartModalOk', 'OK')}
			cancelText={t('common.cartModalCancel', 'Отмена')}
		>
			<p>{t('common.cartModalExisting', 'Существующие корзины:')}</p>
			<Select
				style={{ width: '100%' }}
				placeholder={t('common.cartModalPlaceholder', 'Выберите корзину')}
				allowClear
				value={chosenCartId || undefined}
				onChange={(val) => setChosenCartId(val)}
			>
				{carts.map((c) => (
					<Option key={c.id} value={c.id}>
						{c.name} (ID:{c.id})
					</Option>
				))}
			</Select>

			<p style={{ marginTop: 16 }}>{t('common.cartModalPrompt', 'Или введите название новой корзины:')}</p>
			<Input
				placeholder={t('common.cartModalNewCart', 'Новая корзина')}
				value={newCartName}
				onChange={(e) => setNewCartName(e.target.value)}
			/>
		</Modal>
	);
}
