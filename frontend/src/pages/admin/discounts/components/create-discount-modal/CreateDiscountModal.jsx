// src/pages/admin/discounts/components/create-discount-modal/CreateDiscountModal.jsx
import { useEffect, useMemo, useState } from 'react';
import { Modal, Drawer, Select, InputNumber, Button, Grid, message } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './CreateDiscountModal.module.css';          // ⬅ CSS-module

const { Option } = Select;
const { useBreakpoint } = Grid;

export function CreateDiscountModal({
										open,
										onClose,
										onCreate,
										freePairs,
										clientGroups,
										priceGroups,
									}) {
	const { t }     = useTranslation();
	const bp        = useBreakpoint();          // sm = 576 px
	const mobile    = !bp.sm;

	/* ───── локальный state ───── */
	const [cg, setCG] = useState(null);         // client_group
	const [pg, setPG] = useState(null);         // price_group
	const [dp, setDP] = useState(0);            // discount_percent

	/* сбрасываем форму при каждом открытии */
	useEffect(() => {
		if (open) { setCG(null); setPG(null); setDP(0); }
	}, [open]);

	/* допустимые комбинации */
	const validPG = useMemo(() => (
		cg ? freePairs.filter(p => p.client_group === cg).map(p => p.price_group)
			: [...new Set(freePairs.map(p => p.price_group))]
	), [freePairs, cg]);

	const validCG = useMemo(() => (
		pg ? freePairs.filter(p => p.price_group === pg).map(p => p.client_group)
			: [...new Set(freePairs.map(p => p.client_group))]
	), [freePairs, pg]);

	const canCreate = cg && pg && dp >= 0 && dp <= 100;

	const handleOk = () => {
		// проверка «пара уже занята»
		const busy = !freePairs.find(p => p.client_group === cg && p.price_group === pg);
		if (busy) {
			message.error(t('discounts.duplicatePair', 'Такая пара уже существует'));
			return;
		}
		onCreate({ client_group: cg, price_group: pg, discount_percent: dp });
	};

	/* ───── сама форма (одна для Modal + Drawer) ───── */
	const Form = () => (
		<>
			<label className={styles.label}>{t('discounts.clientGroup')}</label>
			<Select
				className={styles.field}
				value={cg}
				onChange={setCG}
				placeholder={t('discounts.selectClientGroup')}
				allowClear
			>
				{clientGroups.filter(g => validCG.includes(g.id)).map(g =>
					<Option key={g.id} value={g.id}>{g.name}</Option>
				)}
			</Select>

			<label className={styles.label}>{t('discounts.priceGroup')}</label>
			<Select
				className={styles.field}
				value={pg}
				onChange={setPG}
				placeholder={t('discounts.selectPriceGroup')}
				allowClear
			>
				{priceGroups.filter(p => validPG.includes(p.id)).map(p =>
					<Option key={p.id} value={p.id}>{p.name} ({p.code})</Option>
				)}
			</Select>

			<label className={styles.label}>{t('discounts.discountPercent')}</label>
			<InputNumber
				min={0} max={100}
				className={styles.field}
				value={dp}
				onChange={setDP}
			/>
		</>
	);

	/* ───── десктоп (Modal) ───── */
	if (!mobile) {
		return (
			<Modal
				title={t('discounts.createNewModalTitle', 'Создать скидку')}
				open={open}
				onCancel={onClose}
				onOk={handleOk}
				okButtonProps={{ disabled: !canCreate }}
				width={420}
				destroyOnClose
			>
				<Form />
			</Modal>
		);
	}

	/* ───── мобильный (Drawer внизу) ───── */
	return (
		<Drawer
			placement="bottom"
			height="90%"
			open={open}
			onClose={onClose}
			destroyOnClose
			bodyStyle={{ padding: '16px 16px 96px 16px', overflowY: 'auto' }}
		>
			<h3 style={{ marginTop: 0 }}>{t('discounts.createNewModalTitle', 'Создать скидку')}</h3>
			<Form />

			{/* плавающий футер с кнопками */}
			<div className={styles.drawerFooter}>
				<Button block onClick={onClose}>
					{t('common.cancel', 'Отмена')}
				</Button>
				<Button
					type="primary"
					block
					disabled={!canCreate}
					onClick={handleOk}
				>
					{t('common.create', 'Создать')}
				</Button>
			</div>
		</Drawer>
	);
}
