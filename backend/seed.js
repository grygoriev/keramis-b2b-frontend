require('dotenv').config();
const mongoose = require('mongoose');

// Импортируем наши модели
const Feature = require('./models/feature.model');
const FeatureValue = require('./models/featureValue.model');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const ProductFeature = require('./models/productFeature.model');
const ProductImage = require('./models/productImage.model');
const Banner = require('./models/banner.model');             // <-- новые
const ClientGroup = require('./models/clientGroup.model');   // <-- новые

async function seed() {
	try {
		// 1) Подключаемся к MongoDB
		await mongoose.connect(process.env.DB_CONNECTION_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("MongoDB connected.");

		// (Опционально) очистим коллекции:
		await Feature.deleteMany({});
		await FeatureValue.deleteMany({});
		await Category.deleteMany({});
		await Product.deleteMany({});
		await ProductFeature.deleteMany({});
		await ProductImage.deleteMany({});
		await Banner.deleteMany({});         // очищаем баннеры
		await ClientGroup.deleteMany({});    // очищаем группы клиентов

		// 2) Создаём Client Groups
		const cg1 = new ClientGroup({ name: "Special Group" });
		const cg2 = new ClientGroup({ name: "Internet Shops" });
		const cg3 = new ClientGroup({ name: "Vip clients" });
		const cg4 = new ClientGroup({ name: "Test Group" });
		await cg1.save();
		await cg2.save();
		await cg3.save();
		await cg4.save();

		// 3) Создаём Features (product_list, color, brand, surface) - как пример
		const feat1 = new Feature({
			code: "product_list",
			name: "Список товаров",
			status: false,
			multiple: true
		});
		const feat2 = new Feature({
			code: "color",
			name: "Цвет",
			status: true,
			multiple: false
		});
		const feat3 = new Feature({
			code: "brand",
			name: "Производитель",
			status: true,
			multiple: false
		});
		const feat4 = new Feature({
			code: "surface",
			name: "Поверхность",
			status: true,
			multiple: false
		});
		await feat1.save();
		await feat2.save();
		await feat3.save();
		await feat4.save();

		// Создаем FeatureValue (new, sale, promo, Белый, Серый, Коричневый, Черный, Rea, Paradyz, Матовая, Глянцевая)
		async function createFv(featureDoc, val) {
			const fv = new FeatureValue({
				featureId: featureDoc._id,
				value: val
			});
			await fv.save();
			return fv;
		}

		// product_list => [ "new", "sale", "promo" ]
		const fv_list_new = await createFv(feat1, "new");
		const fv_list_sale = await createFv(feat1, "sale");
		const fv_list_promo = await createFv(feat1, "promo");
		// color => [ "Белый", "Серый", "Коричневый", "Черный" ]
		const fv_color_white = await createFv(feat2, "Белый");
		const fv_color_grey = await createFv(feat2, "Серый");
		const fv_color_brown = await createFv(feat2, "Коричневый");
		const fv_color_black = await createFv(feat2, "Черный");
		// brand => [ "Rea", "Paradyz" ]
		const fv_brand_rea = await createFv(feat3, "Rea");
		const fv_brand_paradyz = await createFv(feat3, "Paradyz");
		// surface => [ "Матовая", "Глянцевая" ]
		const fv_surface_mat = await createFv(feat4, "Матовая");
		const fv_surface_gloss = await createFv(feat4, "Глянцевая");

		// 4) Создаем 2 категории: "Плитка" (slug=plitka), "Сантехника" (slug=santekhnika)
		const catPlitka = new Category({
			name: "Плитка",
			slug: "plitka",
			icon: "tile",
			status: true
		});
		const catSantech = new Category({
			name: "Сантехника",
			slug: "santekhnika",
			icon: "sanit",
			status: true
		});
		await catPlitka.save();
		await catSantech.save();

		// 5) Товары (3 + 3)
		// ... (примерно как раньше)
		const p1 = new Product({
			sku_id: "00-00225614",
			name: "плитка Paradyz Afternoon 29,5x59,5 grys poler rect",
			price: 1103.86,
			url: "plitka_paradyz_afternoon_29_5x59_5_grys_poler_rect",
			categoryId: catPlitka._id,
			status: "active"
		});
		await p1.save();

		const p2 = new Product({
			sku_id: "00-00225616",
			name: "плитка Paradyz Afternoon 29,5x59,5 brown struktura A rect",
			price: 1206.12,
			url: "plitka_paradyz_afternoon_29_5x59_5_brown_struktura_a",
			categoryId: catPlitka._id,
			status: "active"
		});
		await p2.save();

		const p3 = new Product({
			sku_id: "00-00225612",
			name: "плитка Paradyz Afternoon 29,5x59,5 silver struktura rect",
			price: 1206.12,
			url: "plitka_paradyz_afternoon_29_5x59_5_silver_struktura_rect",
			categoryId: catPlitka._id,
			status: "active"
		});
		await p3.save();

		const p4 = new Product({
			sku_id: "00-00182545",
			name: "умывальник Rea Royal 60 35,5x61,5 black mat (REA-U0442)",
			price: 10212.00,
			url: "umyvalnik_rea_royal_60_35_5x61_5_black_mat_rea_u0442_",
			categoryId: catSantech._id,
			status: "active"
		});
		await p4.save();

		const p5 = new Product({
			sku_id: "00-00223808",
			name: "умывальник Rea Royal 36x62,5 granit shiny (REA-U8596)",
			price: 7636.00,
			url: "umyvalnik_rea_royal_36x62_5_granit_rea_u8596_",
			categoryId: catSantech._id,
			status: "active"
		});
		await p5.save();

		const p6 = new Product({
			sku_id: "00-00181769",
			name: "умывальник Rea Royal 60 35,3x61,6 белый (REA-U0441)",
			price: 5934.00,
			url: "umyvalnik_rea_royal_7811a_60_34x62_belyy_rea_u0441_",
			categoryId: catSantech._id,
			status: "active"
		});
		await p6.save();

		// 6) ProductFeature (как раньше)
		async function createPF(productDoc, featureValDoc) {
			const ProductFeature = require('./models/productFeature.model');
			const pf = new ProductFeature({
				productId: productDoc._id,
				featureId: featureValDoc.featureId,
				featureValueId: featureValDoc._id
			});
			await pf.save();
		}
		// Плитка => p1,p2,p3 => product_list=[promo], brand=Paradyz, color=...
		await createPF(p1, fv_list_promo);
		await createPF(p1, fv_brand_paradyz);
		await createPF(p1, fv_color_grey);

		await createPF(p2, fv_list_promo);
		await createPF(p2, fv_brand_paradyz);
		await createPF(p2, fv_color_brown);

		await createPF(p3, fv_list_promo);
		await createPF(p3, fv_brand_paradyz);
		await createPF(p3, fv_color_grey);

		// Сантехника => p4 => color=Черный, brand=Rea, product_list=[new, sale], surface=Матовая
		await createPF(p4, fv_list_new);
		await createPF(p4, fv_list_sale);
		await createPF(p4, fv_brand_rea);
		await createPF(p4, fv_color_black);
		await createPF(p4, fv_surface_mat);

		await createPF(p5, fv_list_new);
		await createPF(p5, fv_list_sale);
		await createPF(p5, fv_brand_rea);
		await createPF(p5, fv_color_grey);
		await createPF(p5, fv_surface_mat);

		await createPF(p6, fv_list_new);
		await createPF(p6, fv_list_sale);
		await createPF(p6, fv_brand_rea);
		await createPF(p6, fv_color_white);
		await createPF(p6, fv_surface_gloss);

		// 7) ProductImage
		async function createImage(productDoc, imagePath, isMain, sortOrder) {
			const pi = new ProductImage({
				productId: productDoc._id,
				imagePath,
				isMain,
				sortOrder
			});
			await pi.save();
		}
		// p1 => main=products/06/00/6/92608.970.jpg
		await createImage(p1, "products/06/00/6/92608.970.jpg", true, 0);
		await createImage(p1, "products/06/00/6/92609.970.jpg", false, 1);
		// p2 => ...
		await createImage(p2, "products/05/00/5/80353.750.jpg", true, 0);
		await createImage(p2, "products/05/00/5/80352.750.jpg", false, 1);
		// p3 => ...
		await createImage(p3, "products/04/00/4/80351.750.jpg", true, 0);
		await createImage(p3, "products/04/00/4/80350.750.jpg", false, 1);

		// p4 => ...
		await createImage(p4, "products/01/00/1/73968.970.jpg", true, 0);
		await createImage(p4, "products/01/00/1/73969.970.jpg", false, 1);
		await createImage(p4, "products/01/00/1/73970.970.jpg", false, 2);
		// p5 => ...
		await createImage(p5, "products/03/00/3/72697.970.jpg", true, 0);
		await createImage(p5, "products/03/00/3/72698.970.jpg", false, 1);
		await createImage(p5, "products/03/00/3/72700.970.jpg", false, 2);
		await createImage(p5, "products/03/00/3/72701.970.jpg", false, 3);
		// p6 => ...
		await createImage(p6, "products/02/00/2/73826.970.jpg", true, 0);
		await createImage(p6, "products/02/00/2/73821.970.jpg", false, 1);
		await createImage(p6, "products/02/00/2/73822.970.jpg", false, 2);
		await createImage(p6, "products/02/00/2/73823.970.jpg", false, 3);
		await createImage(p6, "products/02/00/2/73824.970.jpg", false, 4);
		await createImage(p6, "products/02/00/2/73825.970.jpg", false, 5);
		await createImage(p6, "products/02/00/2/73827.970.jpg", false, 6);

		// 8) Создаём 3 баннера:
		// ID: 1 => Акция 1 ...
		// sort_order=10 => "Акция 1"
		// start_date= 2025-02-17, end_date=2025-03-31
		// imagePath= "banners/promo_674727c5302d8934271423.jpg"

		const banner1 = new Banner({
			title: "Акция 1",
			imagePath: "banners/promo_674727c5302d8934271423.jpg",
			link_url: "http://localhost:5173/category/plitka",
			description: "Супер акция",
			sort_order: 10,
			start_date: new Date("2025-02-17"),
			end_date: new Date("2025-03-31")
		});
		await banner1.save();

		const banner2 = new Banner({
			title: "Акция 2",
			imagePath: "banners/promo_67b5d3226cd74586767693.jpg",
			link_url: "http://localhost:5173/category/plitka",
			description: "Супер акция 2",
			sort_order: 20,
			start_date: new Date("2025-02-10"),
			end_date: new Date("2025-03-31")
		});
		await banner2.save();

		const banner3 = new Banner({
			title: "Акция 3",
			imagePath: "banners/promo_6669aab0c54da944255028.jpg",
			link_url: "http://localhost:5173/category/plitka",
			description: "Супер акция 3",
			sort_order: 30,
			start_date: new Date("2025-02-03"),
			end_date: new Date("2025-03-31")
		});
		await banner3.save();

		console.log("Seeding done!");
		process.exit(0);
	} catch (err) {
		console.error("Error in seed script:", err);
		process.exit(1);
	}
}

seed();
