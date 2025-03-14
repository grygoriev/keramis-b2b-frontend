// src/components/CartModal.jsx
import React, { useState } from 'react';
import { Modal, Select, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';

// Импортируем хуки RTK Query
import {
	useGetCartsQuery,
	useCreateCartMutation,
} from '../services/cartApi';

const { Option } = Select;

/**
 * CartModal:
 *   - Показывает список существующих корзин (из RTK Query).
 *   - Позволяет выбрать существующую корзину или ввести новую.
 *   - Вызывает onCartSelected(cartId) при подтверждении выбора/создания.
 *
 * Пропсы:
 *   visible (bool): открыта ли модалка
 *   onClose (func): закрыть модалку без действий
 *   onCartSelected (func): колбэк, получает выбранный/созданный cartId
 */
export function CartModal({ visible, onClose, onCartSelected }) {
	const { t } = useTranslation();

	// 1) Грузим список корзин
	const { data: carts, isLoading, error } = useGetCartsQuery('ru'); // или другой язык
	// 2) Мутация для создания корзины
	const [createCart, { isLoading: isCreating }] = useCreateCartMutation();

	// Локальные поля
	const [chosenCartId, setChosenCartId] = useState(null);
	const [newCartName, setNewCartName] = useState('');

	// Обработка OK
	const handleOk = async () => {
		// Если пользователь выбрал существующую корзину
		if (chosenCartId) {
			onClose();
			onCartSelected(chosenCartId);
			return;
		}

		// Если пользователь ввёл название новой корзины
		if (newCartName.trim()) {
			try {
				// Создаём
				const newCart = await createCart(newCartName).unwrap();
				// Предположим, бэкенд вернёт {id, name, items:[]}
				onClose();
				onCartSelected(newCart.id);
			} catch (err) {
				console.error(err);
				message.error(t('common.cartCreateError', 'Ошибка при создании корзины'));
			}
			return;
		}

		// Иначе ни существующая, ни новая не выбрана
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
			confirmLoading={isCreating}
			destroyOnClose
		>
			{/* Если нужно показать loading/error можно тут,
          но обычно Modal не закрывается, значит можно выводить спин или ошибку */}
			{isLoading && <div>Loading carts...</div>}
			{error && <div style={{ color: 'red' }}>{String(error)}</div>}

			<p>{t('common.cartModalExisting', 'Существующие корзины:')}</p>
			<Select
				style={{ width: '100%' }}
				placeholder={t('common.cartModalPlaceholder', 'Выберите корзину')}
				allowClear
				value={chosenCartId || undefined}
				onChange={(val) => {
					setChosenCartId(val);
					setNewCartName('');
				}}
				disabled={isLoading || !carts}
			>
				{(carts || []).map((c) => (
					<Option key={c.id} value={c.id}>
						{c.name} (ID:{c.id})
					</Option>
				))}
			</Select>

			<p style={{ marginTop: 16 }}>
				{t('common.cartModalPrompt', 'Или введите название новой корзины:')}
			</p>
			<Input
				placeholder={t('common.cartModalNewCart', 'Новая корзина')}
				value={newCartName}
				onChange={(e) => {
					setNewCartName(e.target.value);
					setChosenCartId(null);
				}}
				disabled={isLoading}
			/>
		</Modal>
	);
}
