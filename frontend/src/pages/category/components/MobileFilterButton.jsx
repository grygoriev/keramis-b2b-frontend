// src/pages/category/components/MobileFilterButton.jsx
import { useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { CategoryFilters } from './category-filters/CategoryFilters';     // тот же компонент!

export function MobileFilterButton(props) {
	const [open, setOpen] = useState(false);
	const toggle = () => setOpen(!open);

	return (
		<>
			<Button icon={<FilterOutlined />} onClick={toggle} />
			<Drawer
				title="Фільтри"
				placement="left"
				width={280}
				onClose={toggle}
				open={open}
			>
				<CategoryFilters {...props} onAfterChange={toggle} />
			</Drawer>
		</>
	);
}
