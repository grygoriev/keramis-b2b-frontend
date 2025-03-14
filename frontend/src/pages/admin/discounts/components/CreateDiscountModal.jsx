// src/pages/admin/discounts/components/CreateDiscountModal.jsx
import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, InputNumber, message } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

/**
 * Модалка создания скидки.
 * Пропсы:
 *  - open (bool) - открыта ли
 *  - onClose (func) - закрыть без действий
 *  - onCreate (func) - вызвать при подтверждении; аргумент = {client_group, price_group, discount_percent}
 *  - freePairs - [{ client_group, price_group }, ...] - свободные пары
 *  - clientGroups - [{id, name}, ...]
 *  - priceGroups - [{id, name, code}, ...]
 */
export function CreateDiscountModal({
										open,
										onClose,
										onCreate,
										freePairs,
										clientGroups,
										priceGroups,
									}) {
	const { t } = useTranslation();

	const [selectedClientGroup, setSelectedClientGroup] = useState(null);
	const [selectedPriceGroup, setSelectedPriceGroup] = useState(null);
	const [discountPercent, setDiscountPercent] = useState(0); // 0..100

	useEffect(() => {
	  if (open) {
	    setSelectedClientGroup(null);
	    setSelectedPriceGroup(null);
	    setDiscountPercent(0);
	  }
	}, [open]);

	// Фильтрация допустимых priceGroups
	const validPriceGroupIds = useMemo(() => {
		if (!selectedClientGroup) {
			// если группа клиента не выбрана, берём все price_group, встречающиеся в freePairs
			const setPG = new Set(freePairs.map((p) => p.price_group));
			return [...setPG];
		} else {
			const sub = freePairs.filter((p) => p.client_group === selectedClientGroup);
			return sub.map((p) => p.price_group);
		}
	}, [freePairs, selectedClientGroup]);

	// Аналогично фильтруем clientGroups
	const validClientGroupIds = useMemo(() => {
		if (!selectedPriceGroup) {
			const setCG = new Set(freePairs.map((p) => p.client_group));
			return [...setCG];
		} else {
			const sub = freePairs.filter((p) => p.price_group === selectedPriceGroup);
			return sub.map((p) => p.client_group);
		}
	}, [freePairs, selectedPriceGroup]);

	// Проверка 0..100
	const isDiscountValid = discountPercent >= 0 && discountPercent <= 100;
	// Можно ли нажать OK
	const canCreate = selectedClientGroup && selectedPriceGroup && isDiscountValid;

	const handleOk = () => {
		// на всякий случай проверка
		const pair = freePairs.find(
			(p) =>
				p.client_group === selectedClientGroup &&
				p.price_group === selectedPriceGroup
		);
		if (!pair) {
			message.error(t('discounts.duplicatePair', 'Такая пара уже существует!'));
			return;
		}
		if (!isDiscountValid) {
			message.error(t('discounts.discountError', 'Скидка должна быть от 0 до 100'));
			return;
		}
		onCreate({
			client_group: selectedClientGroup,
			price_group: selectedPriceGroup,
			discount_percent: discountPercent,
		});
	};

	return (
		<Modal
			title={t('discounts.createNewModalTitle', 'Создать скидку')}
			open={open}
			onCancel={onClose}
			onOk={handleOk}
			okButtonProps={{ disabled: !canCreate }}
			destroyOnClose
		>
			<div style={{ marginBottom: 12 }}>
				<label style={{ display: 'block', marginBottom: 4 }}>
					{t('discounts.clientGroup', 'Группа клиента')}
				</label>
				<Select
					style={{ width: '100%' }}
					value={selectedClientGroup}
					onChange={setSelectedClientGroup}
					placeholder={t('discounts.selectClientGroup', 'Выберите группу клиента')}
					allowClear
				>
					{clientGroups
						.filter((cg) => validClientGroupIds.includes(cg.id))
						.map((cg) => (
							<Option key={cg.id} value={cg.id}>
								{cg.name}
							</Option>
						))}
				</Select>
			</div>

			<div style={{ marginBottom: 12 }}>
				<label style={{ display: 'block', marginBottom: 4 }}>
					{t('discounts.priceGroup', 'Ценовая группа')}
				</label>
				<Select
					style={{ width: '100%' }}
					value={selectedPriceGroup}
					onChange={setSelectedPriceGroup}
					placeholder={t('discounts.selectPriceGroup', 'Выберите ценовую группу')}
					allowClear
				>
					{priceGroups
						.filter((pg) => validPriceGroupIds.includes(pg.id))
						.map((pg) => (
							<Option key={pg.id} value={pg.id}>
								{pg.name} ({pg.code})
							</Option>
						))}
				</Select>
			</div>

			<div>
				<label style={{ display: 'block', marginBottom: 4 }}>
					{t('discounts.discountPercent', 'Скидка (%)')}
				</label>
				<InputNumber
					min={0}
					max={100}
					style={{ width: '100%' }}
					value={discountPercent}
					onChange={(val) => setDiscountPercent(val)}
				/>
			</div>
		</Modal>
	);
}
