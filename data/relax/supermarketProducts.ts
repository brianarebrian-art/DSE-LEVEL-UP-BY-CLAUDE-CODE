// 呼吸空間 · 虛擬超市商品數據
//
// 純減壓瀏覽用途：冇貨幣、冇購買、冇結帳、冇庫存，亦冇任何學習指標。
// 全部係虛構通用商品，唔對應任何真實品牌或零售商（憲章 §4 零版權侵犯）。
//
// ⚠️ `price` / `unit` 兩欄保留作日後彈性，但【介面一律唔展示】——
//    2026-08-04 決策：呢度係減壓區，唔應該出現任何金額或價格比較。
//
// 共 242 件商品 · 17 個分類 · 零評分零評論數（憲章 §8 不虛構數據）

export type CategoryId =
  | 'fresh'      // 新鮮蔬果
  | 'meat'       // 肉類海鮮
  | 'frozen'     // 冷凍食品
  | 'pantry'     // 糧油雜貨
  | 'instant'    // 即食麵/飯/粉麵
  | 'snacks'     // 零食糖果
  | 'drinks'     // 飲品
  | 'dairy'      // 乳製品/蛋/麵包
  | 'sauce'      // 調味醬料
  | 'canned'     // 罐頭/醃製/湯
  | 'personal'   // 個人護理
  | 'household'  // 家居清潔/日用品
  | 'fashion'   // 潮物服飾
  | 'beauty'    // 美妝護膚
  | 'tech'      // 電子潮物
  | 'toys'      // 玩具收藏
  | 'pet';       // 寵物用品

export interface Product {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  price: number;
  unit: string;
  tag?: string;
  emoji: string;
  origin?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// ============================================================
// 分類定義
// ============================================================

export const categories: Category[] = [
  { id: 'fresh',     name: '新鮮蔬果',     icon: 'Carrot',   color: '#4ADE80', description: '虛擬新鮮，零卡路里' },
  { id: 'meat',      name: '肉類海鮮',     icon: 'Beef',     color: '#F87171', description: '虛擬蛋白質，唔使解凍' },
  { id: 'frozen',    name: '冷凍食品',     icon: 'Snowflake',color: '#38BDF8', description: '虛擬冰櫃，永遠新鮮' },
  { id: 'pantry',    name: '糧油雜貨',     icon: 'Wheat',    color: '#FBBF24', description: '虛擬存貨，唔會過期' },
  { id: 'instant',   name: '即食麵飯粉麵', icon: 'Soup',     color: '#FB923C', description: '虛擬宵夜，即沖即食' },
  { id: 'snacks',    name: '零食糖果',     icon: 'Candy',    color: '#F472B6', description: '虛擬甜味，唔會蛀牙' },
  { id: 'drinks',    name: '飲品',         icon: 'Coffee',   color: '#60A5FA', description: '虛擬冰涼，唔會瀨尿' },
  { id: 'dairy',     name: '乳製品蛋麵包', icon: 'Milk',     color: '#FDE047', description: '虛擬鈣質，唔會乳糖不耐' },
  { id: 'sauce',     name: '調味醬料',     icon: 'Flame',    color: '#EF4444', description: '虛擬辣味，唔會辣到喊' },
  { id: 'canned',    name: '罐頭醃製湯',   icon: 'Container',color: '#A78BFA', description: '虛擬儲備，末日都唔驚' },
  { id: 'personal',  name: '個人護理',     icon: 'Sparkles', color: '#C084FC', description: '虛擬護膚，一鍵靚晒' },
  { id: 'household', name: '家居清潔',     icon: 'Home',     color: '#34D399', description: '虛擬乾淨，唔使自己抹' },
  { id: 'fashion',   name: '潮物服飾',     icon: 'Shirt',    color: '#FF006E', description: '虛擬潮牌，零排隊零炒價' },
  { id: 'beauty',    name: '美妝護膚',     icon: 'Sparkles', color: '#F472B6', description: '虛擬靚靚，唔使卸妝' },
  { id: 'tech',      name: '電子潮物',     icon: 'Smartphone',color:'#60A5FA', description: '虛擬科技，唔使充電' },
  { id: 'toys',      name: '玩具收藏',     icon: 'Gift',     color: '#A78BFA', description: '虛擬收藏，唔佔空間' },
  { id: 'pet',       name: '寵物用品',     icon: 'Cat',      color: '#818CF8', description: '虛擬主子，唔使鏟屎' },
];

// ============================================================
// 商品清單（242 件）
// ============================================================

export const products: Product[] = [
  // ============================================================
  // 1. 新鮮蔬果 (12件)
  // ============================================================
  { id: 'fr_01', category: 'fresh', name: '美國西北車厘子', description: '虛擬爆汁，唔使吐核', price: 35.8, unit: '磅', tag: '人氣之選', emoji: '🍒', origin: '美國' },
  { id: 'fr_02', category: 'fresh', name: '大裝紅蘋果', description: '虛擬爽甜，每日一個醫生遠離我', price: 20.9, unit: '3個', emoji: '🍎', origin: '紐西蘭' },
  { id: 'fr_03', category: 'fresh', name: '澳洲臍橙', description: '虛擬維C，溫書提神', price: 19.0, unit: '5個裝', emoji: '🍊', origin: '澳洲' },
  { id: 'fr_04', category: 'fresh', name: '泰國金枕頭榴槤', description: '虛擬濃香，屋企人聞唔到', price: 24.9, unit: '磅', tag: '鎮店之寶', emoji: '🥭', origin: '泰國' },
  { id: 'fr_05', category: 'fresh', name: '韓國蕃薯', description: '虛擬粗糧，健康之選', price: 39.9, unit: '500g×2包', emoji: '🍠', origin: '韓國' },
  { id: 'fr_06', category: 'fresh', name: '甜粟米棒', description: '虛擬香甜，煲劇必備', price: 10.0, unit: '2支裝', emoji: '🌽' },
  { id: 'fr_07', category: 'fresh', name: '秘魯波子提子', description: '虛擬爆脆，一口一粒', price: 48.0, unit: '24mm+ 裝', tag: '新品上架', emoji: '🍇', origin: '秘魯' },
  { id: 'fr_08', category: 'fresh', name: '日本蜜瓜', description: '虛擬貴價，零負擔享受', price: 128.0, unit: '個', emoji: '🍈', origin: '日本' },
  { id: 'fr_09', category: 'fresh', name: '有機菠菜', description: '虛擬大力水手，溫書有力', price: 15.9, unit: '包', emoji: '🥬' },
  { id: 'fr_10', category: 'fresh', name: '荷蘭温室小番茄', description: '虛擬鮮甜，做功課零食', price: 18.5, unit: '盒', emoji: '🍅', origin: '荷蘭' },
  { id: 'fr_11', category: 'fresh', name: '牛油果', description: '虛擬好脂肪，腦袋靈光', price: 22.0, unit: '2個', emoji: '🥑' },
  { id: 'fr_12', category: 'fresh', name: '香蕉', description: '虛擬能量，考前必食', price: 12.9, unit: '串', emoji: '🍌' },

  // ============================================================
  // 2. 肉類海鮮 (12件)
  // ============================================================
  { id: 'mt_01', category: 'meat', name: '醃味雞中翼', description: '虛擬嫩滑，氣炸鍋一叮即食', price: 38.0, unit: '包', tag: '人氣之選', emoji: '🍗' },
  { id: 'mt_02', category: 'meat', name: '一口牛扒', description: '虛擬和牛級享受，零膽固醇', price: 80.0, unit: '200g', emoji: '🥩' },
  { id: 'mt_03', category: 'meat', name: '蘇格蘭牛五花', description: '虛擬油花，打邊爐首選', price: 80.0, unit: '300g', tag: '優惠套裝', emoji: '🥓', origin: '蘇格蘭' },
  { id: 'mt_04', category: 'meat', name: '印尼急凍白蝦', description: '虛擬鮮甜，8隻大滿足', price: 59.0, unit: '300g 8隻裝', emoji: '🦐', origin: '印尼' },
  { id: 'mt_05', category: 'meat', name: '挪威急凍鯖魚柳', description: '虛擬Omega-3，補腦佳品', price: 25.0, unit: '2包', emoji: '🐟', origin: '挪威' },
  { id: 'mt_06', category: 'meat', name: '水牛城雞翼槌', description: '虛擬辣勁，追劇良伴', price: 49.9, unit: '500g', emoji: '🍖' },
  { id: 'mt_07', category: 'meat', name: '泰國冰鮮雞件', description: '虛擬空運，新鮮抵港', price: 45.0, unit: '包', tag: '空運直送', emoji: '🐔', origin: '泰國' },
  { id: 'mt_08', category: 'meat', name: '大西洋紅魚柳', description: '虛擬深海魚，可持續捕撈', price: 35.0, unit: '包', emoji: '🐠', origin: '大西洋' },
  { id: 'mt_09', category: 'meat', name: '日本鮮雞蛋', description: '虛擬橙黃蛋黃，溏心必備', price: 30.0, unit: '10隻裝', tag: '人氣之選', emoji: '🥚', origin: '日本' },
  { id: 'mt_10', category: 'meat', name: '美國牛肉漢堡扒', description: '虛擬厚切，Juicy爆汁', price: 55.0, unit: '2片', emoji: '🍔', origin: '美國' },
  { id: 'mt_11', category: 'meat', name: '西班牙黑毛豬五花', description: '虛擬橡果香，燒肉之選', price: 68.0, unit: '300g', emoji: '🐷', origin: '西班牙' },
  { id: 'mt_12', category: 'meat', name: '加拿大龍蝦尾', description: '虛擬豪華，考後獎勵自己', price: 128.0, unit: '2隻', tag: '奢華之選', emoji: '🦞', origin: '加拿大' },

  // ============================================================
  // 3. 冷凍食品 (10件)
  // ============================================================
  { id: 'fz_01', category: 'frozen', name: '急凍點心（蝦餃燒賣）', description: '虛擬茶樓風味，屋企歎', price: 39.5, unit: '3包', tag: '人氣之選', emoji: '🥟' },
  { id: 'fz_02', category: 'frozen', name: '韓式急凍點心', description: '虛擬韓風，創新口味', price: 8.0, unit: '包', emoji: '🥡' },
  { id: 'fz_03', category: 'frozen', name: '甜筒雪糕', description: '虛擬冰涼，溫書降溫', price: 52.0, unit: '4支裝×2盒', emoji: '🍦' },
  { id: 'fz_04', category: 'frozen', name: '瑞士家庭裝雪糕', description: '虛擬大桶，全家分享', price: 48.0, unit: '450-500ml', emoji: '🍨' },
  { id: 'fz_05', category: 'frozen', name: '珍寶仿蟹肉棒', description: '虛擬火鍋料，打邊爐必備', price: 28.0, unit: '包', emoji: '🦀' },
  { id: 'fz_06', category: 'frozen', name: '急凍薄餅（芝士煙肉）', description: '虛擬焗爐一叮，宵夜救星', price: 35.0, unit: '個', emoji: '🍕' },
  { id: 'fz_07', category: 'frozen', name: '急凍薯條', description: '虛擬香脆，氣炸鍋神器', price: 22.0, unit: '1kg', emoji: '🍟' },
  { id: 'fz_08', category: 'frozen', name: '急凍水餃（韭菜豬肉）', description: '虛擬媽媽味道，深夜慰藉', price: 32.0, unit: '包', emoji: '🥟' },
  { id: 'fz_09', category: 'frozen', name: '急凍魚蛋', description: '虛擬街頭風味，咖喱必備', price: 18.0, unit: '包', emoji: '🍡' },
  { id: 'fz_10', category: 'frozen', name: '急凍芒果糯米糍', description: '虛擬日式甜品，一口幸福', price: 25.0, unit: '盒', tag: '甜品控', emoji: '🥭' },

  // ============================================================
  // 4. 糧油雜貨 (12件)
  // ============================================================
  { id: 'pn_01', category: 'pantry', name: '頂級泰國茉莉香米', description: '虛擬香軟，一碗治愈', price: 69.9, unit: '8kg', tag: '人氣之選', emoji: '🍚', origin: '泰國' },
  { id: 'pn_02', category: 'pantry', name: '絲苗靚米', description: '虛擬日常，百吃不厭', price: 69.9, unit: '8kg', emoji: '🌾' },
  { id: 'pn_03', category: 'pantry', name: '花生油', description: '虛擬純正，煮餸靈魂', price: 48.0, unit: '瓶', emoji: '🥜' },
  { id: 'pn_04', category: 'pantry', name: '鷹粟粉', description: '虛擬勾芡，廚房必備', price: 12.0, unit: '227g', emoji: '🌽' },
  { id: 'pn_05', category: 'pantry', name: '有機原蔗糖', description: '虛擬天然，甜品首選', price: 25.0, unit: '350g', emoji: '🧂' },
  { id: 'pn_06', category: 'pantry', name: '五紅混合即食麥片', description: '虛擬養生，早餐之選', price: 19.9, unit: '480-600g', tag: '健康之選', emoji: '🥣' },
  { id: 'pn_07', category: 'pantry', name: '五黑混合即食麥片', description: '虛擬黑營養，護髮之選', price: 19.9, unit: '480-600g', emoji: '🌑' },
  { id: 'pn_08', category: 'pantry', name: '燕麥飯', description: '虛擬粗糧，健康升級', price: 19.9, unit: '包', emoji: '🍙' },
  { id: 'pn_09', category: 'pantry', name: '濃香麻油', description: '虛擬香氣，一滴提味', price: 12.0, unit: '130g', emoji: '🍶' },
  { id: 'pn_10', category: 'pantry', name: '日式燒肉汁', description: '虛擬日式，燒肉靈魂', price: 28.0, unit: '210g', emoji: '🥢', origin: '日本' },
  { id: 'pn_11', category: 'pantry', name: '意大利橄欖油', description: '虛擬地中海風情，沙律必備', price: 55.0, unit: '500ml', emoji: '🫒', origin: '意大利' },
  { id: 'pn_12', category: 'pantry', name: '有機藜麥', description: '虛擬超級食物，營養滿分', price: 38.0, unit: '500g', tag: '有機', emoji: '🌱' },

  // ============================================================
  // 5. 即食麵/飯/粉麵 (10件)
  // ============================================================
  { id: 'in_01', category: 'instant', name: '經典杯麵', description: '虛擬經典，3分鐘搞定', price: 26.0, unit: '4杯', tag: '人氣之選', emoji: '🍜' },
  { id: 'in_02', category: 'instant', name: '麻油杯麵', description: '虛擬麻油香，童年回憶', price: 26.0, unit: '4杯', emoji: '🍜' },
  { id: 'in_03', category: 'instant', name: '麻油即食麵', description: '虛擬袋裝，煮麵之選', price: 18.0, unit: '5包裝', emoji: '🍜' },
  { id: 'in_04', category: 'instant', name: '韓式辣味拉麵', description: '虛擬辣勁，挑戰味蕾', price: 32.0, unit: '5包裝', tag: '辣迷必備', emoji: '🌶️', origin: '韓國' },
  { id: 'in_05', category: 'instant', name: '日式豚骨拉麵', description: '虛擬名店，屋企歎', price: 88.0, unit: '5包裝', tag: '奢華之選', emoji: '🍜', origin: '日本' },
  { id: 'in_06', category: 'instant', name: '泰式即食麵', description: '虛擬泰式，冬蔭功風味', price: 15.0, unit: '5包裝', emoji: '🍲', origin: '泰國' },
  { id: 'in_07', category: 'instant', name: '意大利粉', description: '虛擬意式，Al Dente口感', price: 22.0, unit: '500g', emoji: '🍝', origin: '意大利' },
  { id: 'in_08', category: 'instant', name: '即食飯（日式咖喱）', description: '虛擬微波，2分鐘開餐', price: 18.0, unit: '盒', emoji: '🍛' },
  { id: 'in_09', category: 'instant', name: '越南河粉', description: '虛擬清爽，湯清味鮮', price: 25.0, unit: '包', emoji: '🍜', origin: '越南' },
  { id: 'in_10', category: 'instant', name: '日本烏冬', description: '虛擬彈牙，湯炒兩宜', price: 20.0, unit: '2包裝', emoji: '🍜', origin: '日本' },

  // ============================================================
  // 6. 零食糖果 (12件)
  // ============================================================
  { id: 'sn_01', category: 'snacks', name: '日式薯片', description: '虛擬薄脆，追劇神器', price: 24.0, unit: '3筒', tag: '人氣之選', emoji: '🥔', origin: '日本' },
  { id: 'sn_02', category: 'snacks', name: '日式餅乾棒', description: '虛擬餅乾條，沙律/番茄味', price: 55.8, unit: '4袋', emoji: '🥨', origin: '日本' },
  { id: 'sn_03', category: 'snacks', name: '夾心威化餅', description: '虛擬經典，花生/芝士味', price: 46.8, unit: '4包', emoji: '🍪' },
  { id: 'sn_04', category: 'snacks', name: '牛油曲奇', description: '虛擬鬆化，送禮自用', price: 179.7, unit: '4罐', tag: '送禮之選', emoji: '🍪' },
  { id: 'sn_05', category: 'snacks', name: '精選什錦餅乾', description: '虛擬懷舊，茶點必備', price: 45.9, unit: '4包', emoji: '🍪' },
  { id: 'sn_06', category: 'snacks', name: '黑加侖子軟糖', description: '虛擬酸甜，童年味道', price: 10.5, unit: '包', emoji: '🍬' },
  { id: 'sn_07', category: 'snacks', name: '瑞士黑朱古力', description: '虛擬絲滑，壓力救星', price: 38.0, unit: '盒', tag: '人氣之選', emoji: '🍫', origin: '瑞士' },
  { id: 'sn_08', category: 'snacks', name: '榛子朱古力', description: '虛擬榛子香，一粒滿足', price: 45.0, unit: '盒', emoji: '🍫' },
  { id: 'sn_09', category: 'snacks', name: '夾心三角酥', description: '虛擬精緻，流沙/紅豆蛋黃', price: 46.8, unit: '4盒', emoji: '🥮' },
  { id: 'sn_10', category: 'snacks', name: '彩糖花生朱古力', description: '虛擬繽紛，一口一粒', price: 15.0, unit: '包', emoji: '🍬' },
  { id: 'sn_11', category: 'snacks', name: '魷魚絲', description: '虛擬鹹香，煲劇良伴', price: 22.0, unit: '包', emoji: '🦑' },
  { id: 'sn_12', category: 'snacks', name: '海苔', description: '虛擬脆口，健康零食', price: 18.0, unit: '包', emoji: '🍘', origin: '韓國' },

  // ============================================================
  // 7. 飲品 (12件)
  // ============================================================
  { id: 'dr_01', category: 'drinks', name: '檸檬茶', description: '虛擬茶餐廳風味，解渴之選', price: 8.0, unit: '盒', emoji: '🧃' },
  { id: 'dr_02', category: 'drinks', name: '朱古力牛奶', description: '虛擬童年，甜到入心', price: 47.0, unit: '6×250ml', tag: '人氣之選', emoji: '🥛' },
  { id: 'dr_03', category: 'drinks', name: '純豆漿', description: '虛擬經典，日日飲都得', price: 52.0, unit: '9×250ml', emoji: '🥛' },
  { id: 'dr_04', category: 'drinks', name: '高鈣低脂牛奶', description: '虛擬補鈣，溫書長高', price: 5.0, unit: '盒', emoji: '🥛' },
  { id: 'dr_05', category: 'drinks', name: '鮮牛奶', description: '虛擬鮮香，早餐必備', price: 22.0, unit: '盒', emoji: '🥛' },
  { id: 'dr_06', category: 'drinks', name: '原味奶茶', description: '虛擬茶餐廳，即沖即飲', price: 34.9, unit: '20包', emoji: '🧋' },
  { id: 'dr_07', category: 'drinks', name: '英國早餐紅茶', description: '虛擬英式，優雅下午茶', price: 28.0, unit: '盒', emoji: '🫖', origin: '英國' },
  { id: 'dr_08', category: 'drinks', name: '伯爵紅茶', description: '虛擬佛手柑香，貴族享受', price: 28.0, unit: '盒', emoji: '🫖', origin: '英國' },
  { id: 'dr_09', category: 'drinks', name: '可樂汽水', description: '虛擬經典，暢快無比', price: 32.0, unit: '4×500ml', tag: '人氣之選', emoji: '🥤' },
  { id: 'dr_10', category: 'drinks', name: '希臘乳酪飲品', description: '虛擬濃稠，蛋白質之選', price: 89.0, unit: '杯', emoji: '🥛' },
  { id: 'dr_11', category: 'drinks', name: '韓國香蕉牛奶', description: '虛擬韓風，打卡必備', price: 12.0, unit: '盒', emoji: '🍌', origin: '韓國' },
  { id: 'dr_12', category: 'drinks', name: '日本抹茶拿鐵', description: '虛擬和風，溫書提神', price: 35.0, unit: '盒', emoji: '🍵', origin: '日本' },

  // ============================================================
  // 8. 乳製品/蛋/麵包 (10件)
  // ============================================================
  { id: 'da_01', category: 'dairy', name: '營養方包', description: '虛擬營養，早餐首選', price: 12.0, unit: '條', emoji: '🍞' },
  { id: 'da_02', category: 'dairy', name: '排包', description: '虛擬鬆軟，多士首選', price: 10.0, unit: '條', emoji: '🍞' },
  { id: 'da_03', category: 'dairy', name: '丹麥牛油曲奇', description: '虛擬牛油香，節日必備', price: 68.0, unit: '罐', tag: '送禮之選', emoji: '🍪', origin: '丹麥' },
  { id: 'da_04', category: 'dairy', name: '芝士片', description: '虛擬拉絲，三文治必備', price: 22.0, unit: '包', emoji: '🧀' },
  { id: 'da_05', category: 'dairy', name: '牛油', description: '虛擬紐西蘭，烘焙靈魂', price: 35.0, unit: '塊', emoji: '🧈', origin: '紐西蘭' },
  { id: 'da_06', category: 'dairy', name: '日本北海道牛乳', description: '虛擬濃郁，咖啡絕配', price: 28.0, unit: '盒', tag: '人氣之選', emoji: '🥛', origin: '日本' },
  { id: 'da_07', category: 'dairy', name: '希臘式乳酪（原味）', description: '虛擬濃稠，健康之選', price: 25.0, unit: '杯', emoji: '🥣' },
  { id: 'da_08', category: 'dairy', name: '日本布丁', description: '虛擬嫩滑，甜品控最愛', price: 15.0, unit: '個', emoji: '🍮', origin: '日本' },
  { id: 'da_09', category: 'dairy', name: '法式牛角包', description: '虛擬酥皮，早餐儀式感', price: 28.0, unit: '4個', emoji: '🥐' },
  { id: 'da_10', category: 'dairy', name: '瑞士卷（草莓味）', description: '虛擬鬆軟，下午茶之選', price: 22.0, unit: '條', emoji: '🍰' },

  // ============================================================
  // 9. 調味醬料 (10件)
  // ============================================================
  { id: 'sa_01', category: 'sauce', name: '清雞湯', description: '虛擬鮮甜，煮餸打底', price: 15.0, unit: '1L', emoji: '🍲' },
  { id: 'sa_02', category: 'sauce', name: '蠔油', description: '虛擬經典，炒菜靈魂', price: 18.0, unit: '瓶', tag: '人氣之選', emoji: '🦪' },
  { id: 'sa_03', category: 'sauce', name: '生抽豉油', description: '虛擬鮮味，點蘸必備', price: 12.0, unit: '瓶', emoji: '🍶' },
  { id: 'sa_04', category: 'sauce', name: '蒜蓉辣椒醬', description: '虛擬辣勁，萬能配搭', price: 25.0, unit: '瓶', emoji: '🌶️' },
  { id: 'sa_05', category: 'sauce', name: '芝麻醬', description: '虛擬濃香，火鍋必備', price: 20.0, unit: '瓶', emoji: '🥜' },
  { id: 'sa_06', category: 'sauce', name: '沙律醬（日式）', description: '虛擬清爽，沙律靈魂', price: 22.0, unit: '瓶', emoji: '🥗' },
  { id: 'sa_07', category: 'sauce', name: '韓式辣醬', description: '虛擬韓風，拌飯神器', price: 28.0, unit: '盒', emoji: '🌶️', origin: '韓國' },
  { id: 'sa_08', category: 'sauce', name: '意大利青醬', description: '虛擬羅勒香，意粉絕配', price: 32.0, unit: '瓶', emoji: '🌿', origin: '意大利' },
  { id: 'sa_09', category: 'sauce', name: '黑胡椒醬', description: '虛擬辛香，牛扒必備', price: 18.0, unit: '瓶', emoji: '🧂' },
  { id: 'sa_10', category: 'sauce', name: '蜜糖芥末醬', description: '虛擬甜辣，炸物絕配', price: 22.0, unit: '瓶', emoji: '🍯' },

  // ============================================================
  // 10. 罐頭/醃製/湯 (10件)
  // ============================================================
  { id: 'cn_01', category: 'canned', name: '火腿豬肉罐頭', description: '虛擬經典，餐蛋麵靈魂', price: 22.0, unit: '340g', tag: '人氣之選', emoji: '🥫' },
  { id: 'cn_02', category: 'canned', name: '午餐肉', description: '虛擬厚切，煎蛋三明治', price: 25.0, unit: '340g', emoji: '🥫' },
  { id: 'cn_03', category: 'canned', name: '粟米蓉', description: '虛擬濃湯，3分鐘開餐', price: 12.0, unit: '罐', emoji: '🌽' },
  { id: 'cn_04', category: 'canned', name: '罐頭吞拿魚', description: '虛擬鮮味，沙律三文治', price: 15.0, unit: '罐', emoji: '🐟' },
  { id: 'cn_05', category: 'canned', name: '罐頭蘑菇湯', description: '虛擬濃郁，西湯經典', price: 12.0, unit: '罐', emoji: '🍄' },
  { id: 'cn_06', category: 'canned', name: '羅宋湯', description: '虛擬酸甜，開胃之選', price: 15.0, unit: '罐', emoji: '🥫' },
  { id: 'cn_07', category: 'canned', name: '醃製酸瓜', description: '虛擬爽脆，漢堡必備', price: 18.0, unit: '瓶', emoji: '🥒' },
  { id: 'cn_08', category: 'canned', name: '橄欖', description: '虛擬地中海，小食配酒', price: 22.0, unit: '瓶', emoji: '🫒' },
  { id: 'cn_09', category: 'canned', name: '豆豉鯪魚', description: '虛擬港式，送飯神器', price: 20.0, unit: '罐', tag: '港式經典', emoji: '🐟' },
  { id: 'cn_10', category: 'canned', name: '罐頭水果（雜果）', description: '虛擬甜蜜，甜品打底', price: 12.0, unit: '罐', emoji: '🍑' },

  // ============================================================
  // 11. 個人護理 (12件)
  // ============================================================
  { id: 'pr_01', category: 'personal', name: '潤膚沐浴乳', description: '虛擬滋潤，1公升大滿足', price: 35.0, unit: '1L', tag: '人氣之選', emoji: '🧴' },
  { id: 'pr_02', category: 'personal', name: '漱口水', description: '虛擬清新，綠茶味', price: 10.0, unit: '250ml', emoji: '🦷' },
  { id: 'pr_03', category: 'personal', name: '清爽透氣護墊', description: '虛擬乾爽，特長孖裝', price: 34.0, unit: '40片', emoji: '🩷' },
  { id: 'pr_04', category: 'personal', name: '安睡褲', description: '虛擬安心，瞓覺無憂', price: 7.9, unit: '2片', emoji: '🩷' },
  { id: 'pr_05', category: 'personal', name: '消毒濕紙巾', description: '虛擬潔淨，隨身必備', price: 28.0, unit: '包', emoji: '🧻' },
  { id: 'pr_06', category: 'personal', name: '潤唇膏', description: '虛擬滋潤，乾燥救星', price: 18.0, unit: '支', emoji: '💄' },
  { id: 'pr_07', category: 'personal', name: '洗面奶（溫和型）', description: '虛擬潔淨，溫書唔怕面油', price: 45.0, unit: '支', emoji: '🧼' },
  { id: 'pr_08', category: 'personal', name: '防曬乳（SPF50+）', description: '虛擬防護，出門必備', price: 68.0, unit: '支', emoji: '☀️' },
  { id: 'pr_09', category: 'personal', name: '護手霜', description: '虛擬滋潤，寫字唔怕乾', price: 25.0, unit: '支', emoji: '🖐️' },
  { id: 'pr_10', category: 'personal', name: '牙線棒', description: '虛擬清潔，牙縫無殘渣', price: 15.0, unit: '盒', emoji: '🦷' },
  { id: 'pr_11', category: 'personal', name: '爽身粉', description: '虛擬清爽，夏日必備', price: 22.0, unit: '罐', emoji: '🌸' },
  { id: 'pr_12', category: 'personal', name: '卸妝水', description: '虛擬溫和，一拭即淨', price: 55.0, unit: '瓶', emoji: '💧' },

  // ============================================================
  // 12. 家居清潔/日用品 (10件)
  // ============================================================
  { id: 'hh_01', category: 'household', name: '極致綿柔衛生紙', description: '虛擬4層，10+2卷裝', price: 59.9, unit: '2條', tag: '人氣之選', emoji: '🧻' },
  { id: 'hh_02', category: 'household', name: '抽取式面紙', description: '虛擬柔軟，鼻敏感友善', price: 25.0, unit: '3包裝', emoji: '🧻' },
  { id: 'hh_03', category: 'household', name: '濃縮衣物柔順劑', description: '虛擬清香，衣物柔軟', price: 18.0, unit: '880ml', emoji: '🧺' },
  { id: 'hh_04', category: 'household', name: '三重功效洗潔精', description: '虛擬去油，1公升耐用', price: 19.9, unit: '1L', emoji: '🧽' },
  { id: 'hh_05', category: 'household', name: '家用消毒濕紙巾', description: '虛擬消毒，84-100片裝', price: 33.3, unit: '3件$100', emoji: '🧻' },
  { id: 'hh_06', category: 'household', name: '洗衣珠', description: '虛擬方便，一粒搞定', price: 45.0, unit: '20粒', tag: '新品上架', emoji: '🫧' },
  { id: 'hh_07', category: 'household', name: '廚房紙巾', description: '虛擬吸水，煮餸必備', price: 22.0, unit: '卷', emoji: '🧻' },
  { id: 'hh_08', category: 'household', name: '垃圾袋（加厚）', description: '虛擬耐用，唔怕穿底', price: 15.0, unit: '卷', emoji: '🗑️' },
  { id: 'hh_09', category: 'household', name: '吸塵機濾芯', description: '虛擬潔淨，空氣清新', price: 38.0, unit: '個', emoji: '🌬️' },
  { id: 'hh_10', category: 'household', name: '地板清潔劑', description: '虛擬光亮，家居煥然一新', price: 28.0, unit: '瓶', emoji: '🧹' },

  // ============================================================
  // 13. 寵物用品 (10件)
  // ============================================================
  { id: 'pt_01', category: 'pet', name: '貓罐頭（吞拿魚味）', description: '虛擬鮮味，主子最愛', price: 8.0, unit: '罐', tag: '人氣之選', emoji: '🐱' },
  { id: 'pt_02', category: 'pet', name: '貓乾糧（成貓配方）', description: '虛擬營養，毛髮亮麗', price: 128.0, unit: '1.5kg', emoji: '🐱' },
  { id: 'pt_03', category: 'pet', name: '貓零食（雞肉條）', description: '虛擬獎勵，訓練必備', price: 25.0, unit: '包', emoji: '🐱' },
  { id: 'pt_04', category: 'pet', name: '貓砂（豆腐砂）', description: '虛擬除臭，沖廁即溶', price: 45.0, unit: '6L', emoji: '🐱' },
  { id: 'pt_05', category: 'pet', name: '狗罐頭（牛肉味）', description: '虛擬鮮肉，狗狗開心', price: 10.0, unit: '罐', emoji: '🐶' },
  { id: 'pt_06', category: 'pet', name: '狗乾糧（大型犬）', description: '虛擬關節護理，大狗專用', price: 158.0, unit: '3kg', emoji: '🐶' },
  { id: 'pt_07', category: 'pet', name: '狗零食（潔齒骨）', description: '虛擬潔牙，口氣清新', price: 35.0, unit: '包', emoji: '🐶' },
  { id: 'pt_08', category: 'pet', name: '狗玩具（橡膠球）', description: '虛擬耐咬，放電神器', price: 28.0, unit: '個', emoji: '🎾' },
  { id: 'pt_09', category: 'pet', name: '寵物濕紙巾', description: '虛擬溫和，抹腳抹面', price: 18.0, unit: '包', emoji: '🧻' },
  { id: 'pt_10', category: 'pet', name: '寵物洗毛液', description: '虛擬溫和，毛髮柔順', price: 55.0, unit: '瓶', emoji: '🛁' },

  // ============================================================
  // 14. 潮物服飾 (25件) — Gen Z/Alpha 最愛
  // ============================================================
  { id: 'fa_01', category: 'fashion', name: '經典全白波鞋', description: '虛擬街頭王者，唔使驚變黃', price: 899, unit: '對', tag: '人氣之選', emoji: '👟' },
  { id: 'fa_02', category: 'fashion', name: '復古籃球波鞋', description: '虛擬經典配色，校園回憶殺', price: 1299, unit: '對', tag: '潮人必備', emoji: '👟' },
  { id: 'fa_03', category: 'fashion', name: '厚底涼鞋', description: '虛擬舒適，行路似按摩', price: 450, unit: '對', emoji: '🩴' },
  { id: 'fa_04', category: 'fashion', name: '毛毛拖鞋', description: '虛擬暖笠笠，冬日靈魂', price: 380, unit: '對', emoji: '🧦' },
  { id: 'fa_05', category: 'fashion', name: '洞洞鞋', description: '虛擬透氣，DIY鞋花任配', price: 280, unit: '對', emoji: '🩴' },
  { id: 'fa_06', category: 'fashion', name: '超輕跑鞋', description: '虛擬踩屎感，行路帶風', price: 680, unit: '對', emoji: '👟' },
  { id: 'fa_07', category: 'fashion', name: 'Oversized 白Tee', description: '虛擬寬鬆，遮肉神器', price: 89, unit: '件', emoji: '👕' },
  { id: 'fa_08', category: 'fashion', name: '短版衛衣', description: '虛擬顯腰，Y2K靈魂單品', price: 199, unit: '件', emoji: '👚' },
  { id: 'fa_09', category: 'fashion', name: '工裝闊腳褲', description: '虛擬型格，多袋實用', price: 259, unit: '條', emoji: '👖' },
  { id: 'fa_10', category: 'fashion', name: '羽絨外套', description: '虛擬保暖，輕到似無穿', price: 599, unit: '件', tag: '冬季必備', emoji: '🧥' },
  { id: 'fa_11', category: 'fashion', name: '運動瑜伽褲', description: '虛擬提臀，舒適到唔想除', price: 320, unit: '條', emoji: '🧘' },
  { id: 'fa_12', category: 'fashion', name: '設計師手袋', description: '虛擬經典，永恆不過時', price: 25000, unit: '個', tag: '奢華之選', emoji: '👜' },
  { id: 'fa_13', category: 'fashion', name: '漁夫帽', description: '虛擬遮陽，懶人必備', price: 128, unit: '頂', emoji: '🧢' },
  { id: 'fa_14', category: 'fashion', name: '設計師太陽眼鏡', description: '虛擬型格，遮黑眼圈神器', price: 1580, unit: '副', emoji: '🕶️' },
  { id: 'fa_15', category: 'fashion', name: '銀飾項鏈', description: '虛擬精緻，疊戴更有層次', price: 299, unit: '條', emoji: '💎' },
  { id: 'fa_16', category: 'fashion', name: '情侶對戒', description: '虛擬承諾，單身都買得', price: 199, unit: '隻', emoji: '💍' },
  { id: 'fa_17', category: 'fashion', name: '髮夾套裝', description: '虛擬可愛，夾住碎髮', price: 38, unit: '套', emoji: '✨' },
  { id: 'fa_18', category: 'fashion', name: '絲質枕頭套', description: '虛擬護髮，瞓醒頭髮不亂', price: 168, unit: '個', emoji: '🛏️' },
  { id: 'fa_19', category: 'fashion', name: '設計師皮帶', description: '虛擬低調，提升整體質感', price: 880, unit: '條', emoji: '👔' },
  { id: 'fa_20', category: 'fashion', name: '長版風衣', description: '虛擬氣場，行路有風', price: 450, unit: '件', emoji: '🧥' },
  { id: 'fa_21', category: 'fashion', name: '針織開襟衫', description: '虛擬溫柔，文青必備', price: 220, unit: '件', emoji: '🧶' },
  { id: 'fa_22', category: 'fashion', name: '運動短襪套裝', description: '虛擬吸汗，波鞋最佳拍檔', price: 58, unit: '3對', emoji: '🧦' },
  { id: 'fa_23', category: 'fashion', name: '帆布背包', description: '虛擬耐用，學生黨最愛', price: 180, unit: '個', emoji: '🎒' },
  { id: 'fa_24', category: 'fashion', name: '腰包', description: '虛擬方便，解放雙手', price: 220, unit: '個', emoji: '👝' },
  { id: 'fa_25', category: 'fashion', name: '格仔襯衫', description: '虛擬經典，程序員/文青通用', price: 150, unit: '件', emoji: '👔' },

  // ============================================================
  // 15. 美妝護膚 (25件) — Gen Z/Alpha 最愛
  // ============================================================
  { id: 'be_01', category: 'beauty', name: '溫和潔面乳', description: '虛擬洗走壓力，唔繃緊', price: 88, unit: '支', tag: '人氣之選', emoji: '🧴' },
  { id: 'be_02', category: 'beauty', name: '高效防曬乳', description: '虛擬防護，溫書都要靚', price: 128, unit: '支', emoji: '☀️' },
  { id: 'be_03', category: 'beauty', name: '保濕精華液', description: '虛擬補水，熬夜急救', price: 68, unit: '支', emoji: '💧' },
  { id: 'be_04', category: 'beauty', name: '睡眠唇膜', description: '虛擬修護，第二日嘴唇嫩嘟嘟', price: 98, unit: '罐', tag: '睡前儀式', emoji: '💋' },
  { id: 'be_05', category: 'beauty', name: '胜肽護唇膏', description: '虛擬滋潤，素顏都有氣色', price: 78, unit: '支', emoji: '💄' },
  { id: 'be_06', category: 'beauty', name: '液態腮紅', description: '虛擬好氣色，自然到似天生', price: 118, unit: '支', tag: '化妝新手', emoji: '🌸' },
  { id: 'be_07', category: 'beauty', name: '雲朵胭脂', description: '虛擬粉嫩，點少少就夠', price: 138, unit: '罐', emoji: '☁️' },
  { id: 'be_08', category: 'beauty', name: '纖長睫毛膏', description: '虛擬電眼，溫書都精神', price: 68, unit: '支', emoji: '👁️' },
  { id: 'be_09', category: 'beauty', name: '多功能妝前乳', description: '虛擬打底，底妝更貼服', price: 58, unit: '支', emoji: '✨' },
  { id: 'be_10', category: 'beauty', name: '保濕面膜', description: '虛擬急救，15分鐘煥然一新', price: 45, unit: '片', emoji: '🎭' },
  { id: 'be_11', category: 'beauty', name: '修護面霜', description: '虛擬屏障，敏感肌救星', price: 158, unit: '罐', emoji: '🧴' },
  { id: 'be_12', category: 'beauty', name: '香氛身體乳', description: '虛擬奶香，皮膚滑到似豆腐', price: 128, unit: '罐', tag: '人氣之選', emoji: '🥥' },
  { id: 'be_13', category: 'beauty', name: '淡香水', description: '虛擬偽體香，低調又迷人', price: 388, unit: '瓶', emoji: '🌺' },
  { id: 'be_14', category: 'beauty', name: '男士淡香水', description: '虛擬型男，清新海洋調', price: 420, unit: '瓶', emoji: '🌊' },
  { id: 'be_15', category: 'beauty', name: '玉石按摩滾輪', description: '虛擬去水腫，溫書按一按', price: 68, unit: '支', emoji: '💆' },
  { id: 'be_16', category: 'beauty', name: '刮痧板', description: '虛擬通淋巴，面部線條UP', price: 48, unit: '塊', emoji: '🪨' },
  { id: 'be_17', category: 'beauty', name: 'LED光療面膜儀', description: '虛擬美容院，居家護膚', price: 680, unit: '部', tag: '科技美容', emoji: '💡' },
  { id: 'be_18', category: 'beauty', name: '免洗洗手液', description: '虛擬清香，隨身必備', price: 35, unit: '支', emoji: '🧼' },
  { id: 'be_19', category: 'beauty', name: '乾洗髮噴霧', description: '虛擬清爽，懶洗頭救星', price: 58, unit: '支', emoji: '💨' },
  { id: 'be_20', category: 'beauty', name: '護髮精油', description: '虛擬柔順，髮尾唔開叉', price: 88, unit: '瓶', emoji: '💇' },
  { id: 'be_21', category: 'beauty', name: '修眉刀套裝', description: '虛擬精準，雜毛bye bye', price: 28, unit: '套', emoji: '🔪' },
  { id: 'be_22', category: 'beauty', name: '假睫毛', description: '虛擬電眼，貼上即刻有神', price: 38, unit: '對', emoji: '👁️' },
  { id: 'be_23', category: 'beauty', name: '化妝掃套裝', description: '虛擬專業，掃掃都好軟', price: 128, unit: '套', emoji: '🖌️' },
  { id: 'be_24', category: 'beauty', name: '指甲貼紙', description: '虛擬美甲，五分鐘搞掂', price: 25, unit: '套', emoji: '💅' },
  { id: 'be_25', category: 'beauty', name: '膠原蛋白粉', description: '虛擬內服，皮膚彈彈', price: 168, unit: '罐', emoji: '✨' },

  // ============================================================
  // 16. 電子潮物 (25件) — Gen Z/Alpha 最愛
  // ============================================================
  { id: 'te_01', category: 'tech', name: '降噪耳機', description: '虛擬寧靜，隔絕溫書噪音', price: 1899, unit: '對', tag: '人氣之選', emoji: '🎧' },
  { id: 'te_02', category: 'tech', name: '頭戴式耳機', description: '虛擬低音轟炸，音樂會級享受', price: 2299, unit: '對', emoji: '🎧' },
  { id: 'te_03', category: 'tech', name: '運動耳機', description: '虛擬穩固，跑步唔會跌', price: 899, unit: '對', emoji: '🎵' },
  { id: 'te_04', category: 'tech', name: '智能手錶', description: '虛擬健康監測，溫書都要動', price: 1599, unit: '隻', emoji: '⌚' },
  { id: 'te_05', category: 'tech', name: '智能戒指', description: '虛擬睡眠追蹤，輕到無感覺', price: 1200, unit: '隻', tag: '科技新貴', emoji: '💍' },
  { id: 'te_06', category: 'tech', name: '磁吸充電器', description: '虛擬一貼即充，唔使插線', price: 198, unit: '個', emoji: '🔋' },
  { id: 'te_07', category: 'tech', name: '大容量充電寶', description: '虛擬續航，出門唔驚冇電', price: 128, unit: '個', emoji: '🔌' },
  { id: 'te_08', category: 'tech', name: '設計師手機殼', description: '虛擬保護，靚到似飾品', price: 280, unit: '個', emoji: '📱' },
  { id: 'te_09', category: 'tech', name: '手機氣囊支架', description: '虛擬方便，單手操作無難度', price: 38, unit: '個', emoji: '📲' },
  { id: 'te_10', category: 'tech', name: '環形補光燈', description: '虛擬美顏，網課/自拍必備', price: 68, unit: '個', emoji: '💡' },
  { id: 'te_11', category: 'tech', name: '掌上遊戲機', description: '虛擬任玩，溫書間隙放鬆', price: 1899, unit: '部', tag: '人氣之選', emoji: '🎮' },
  { id: 'te_12', category: 'tech', name: '家用遊戲主機', description: '虛擬4K畫質，沉浸式體驗', price: 2899, unit: '部', emoji: '🕹️' },
  { id: 'te_13', category: 'tech', name: '便攜遊戲機', description: '虛擬隨身，搭車必備', price: 2200, unit: '部', emoji: '🎮' },
  { id: 'te_14', category: 'tech', name: '遊戲手掣', description: '虛擬手感，操作更精準', price: 380, unit: '個', emoji: '🎮' },
  { id: 'te_15', category: 'tech', name: '平板電腦', description: '虛擬大屏，溫書/追劇兩用', price: 3299, unit: '部', emoji: '📱' },
  { id: 'te_16', category: 'tech', name: '觸控筆', description: '虛擬書寫，做筆記似真紙', price: 680, unit: '支', emoji: '✏️' },
  { id: 'te_17', category: 'tech', name: '藍牙喇叭', description: '虛擬環迴立體聲，房間變影院', price: 299, unit: '個', emoji: '🔊' },
  { id: 'te_18', category: 'tech', name: '無線鍵盤', description: '虛擬靜音，圖書館溫書必備', price: 180, unit: '個', emoji: '⌨️' },
  { id: 'te_19', category: 'tech', name: '無線滑鼠', description: '虛擬靜音，唔會騷擾隔籬', price: 88, unit: '個', emoji: '🖱️' },
  { id: 'te_20', category: 'tech', name: '筆記型電腦支架', description: '虛擬護頸，溫書姿勢更正確', price: 128, unit: '個', emoji: '💻' },
  { id: 'te_21', category: 'tech', name: '螢幕掛燈', description: '虛擬護眼，深夜溫書唔怕累', price: 168, unit: '個', emoji: '💡' },
  { id: 'te_22', category: 'tech', name: '智能插座', description: '虛擬遙控，手機控制開關', price: 58, unit: '個', emoji: '🔌' },
  { id: 'te_23', category: 'tech', name: '無線充電座', description: '虛擬隨放隨充，桌面更整齊', price: 98, unit: '個', emoji: '🔋' },
  { id: 'te_24', category: 'tech', name: '行動硬碟', description: '虛擬備份，溫書資料唔會丟', price: 380, unit: '個', emoji: '💾' },
  { id: 'te_25', category: 'tech', name: 'USB-C 擴展器', description: '虛擬多接口，一個頂五個', price: 128, unit: '個', emoji: '🔌' },

  // ============================================================
  // 17. 玩具收藏 (25件) — Gen Z/Alpha 最愛
  // ============================================================
  { id: 'to_01', category: 'toys', name: '毛絨龍公仔', description: '虛擬柔軟，攬住瞓好安心', price: 280, unit: '隻', tag: '人氣之選', emoji: '🐉' },
  { id: 'to_02', category: 'toys', name: '圓滾滾毛公仔', description: '虛擬軟綿綿，壓力全消', price: 180, unit: '隻', emoji: '🧸' },
  { id: 'to_03', category: 'toys', name: 'DIY填充公仔', description: '虛擬親手整，獨一無二', price: 220, unit: '套', emoji: '🧸' },
  { id: 'to_04', category: 'toys', name: '魔法世界積木', description: '虛擬拼砌，重溫童年魔法', price: 380, unit: '盒', emoji: '🧱' },
  { id: 'to_05', category: 'toys', name: '像素世界積木', description: '虛擬創造，建自己嘅世界', price: 280, unit: '盒', emoji: '🧱' },
  { id: 'to_06', category: 'toys', name: '太空戰士積木', description: '虛擬星戰，收藏級精品', price: 450, unit: '盒', emoji: '🚀' },
  { id: 'to_07', category: 'toys', name: '神秘盲盒', description: '虛擬驚喜，拆盒一刻最刺激', price: 58, unit: '個', tag: '人氣之選', emoji: '🎁' },
  { id: 'to_08', category: 'toys', name: '小天使盲盒', description: '虛擬可愛，收集全套', price: 48, unit: '個', emoji: '👼' },
  { id: 'to_09', category: 'toys', name: '卡通角色公仔', description: '虛擬人氣，治癒系代表', price: 68, unit: '隻', emoji: '🐱' },
  { id: 'to_10', category: 'toys', name: '虛擬偶像周邊', description: '虛擬應援，粉絲必備', price: 88, unit: '件', emoji: '🎤' },
  { id: 'to_11', category: 'toys', name: '動漫角色模型', description: '虛擬精緻，擺書枱靚晒', price: 128, unit: '個', emoji: '⚔️' },
  { id: 'to_12', category: 'toys', name: 'Q版公仔擺設', description: '虛擬萌爆，書枱小夥伴', price: 58, unit: '個', emoji: '🎎' },
  { id: 'to_13', category: 'toys', name: '運動員收藏卡', description: '虛擬抽卡，收集明星簽名', price: 38, unit: '包', tag: '收藏熱潮', emoji: '🃏' },
  { id: 'to_14', category: 'toys', name: 'Q版人偶', description: '虛擬大頭，擺滿書架', price: 68, unit: '個', emoji: '🧸' },
  { id: 'to_15', category: 'toys', name: '桌上遊戲（快出牌）', description: '虛擬歡樂，朋友聚會必備', price: 28, unit: '盒', emoji: '🃏' },
  { id: 'to_16', category: 'toys', name: '爆笑桌遊', description: '虛擬笑到肚痛，派對神器', price: 88, unit: '盒', emoji: '😹' },
  { id: 'to_17', category: 'toys', name: '兒童滑板車', description: '虛擬放電，戶外必備', price: 280, unit: '部', emoji: '🛴' },
  { id: 'to_18', category: 'toys', name: '入門滑板', description: '虛擬型格，街頭文化', price: 320, unit: '塊', emoji: '🛹' },
  { id: 'to_19', category: 'toys', name: '軟彈槍', description: '虛擬對戰，室內放電', price: 128, unit: '支', emoji: '🔫' },
  { id: 'to_20', category: 'toys', name: '史萊姆套裝', description: '虛擬解壓，搓搓好治癒', price: 38, unit: '套', emoji: '🧪' },
  { id: 'to_21', category: 'toys', name: '繪圖手帳', description: '虛擬記錄，生活更有儀式感', price: 58, unit: '本', emoji: '📔' },
  { id: 'to_22', category: 'toys', name: '彩色和紙膠帶', description: '虛擬裝飾，手帳必備', price: 18, unit: '卷', emoji: '🎀' },
  { id: 'to_23', category: 'toys', name: '專業麥克筆', description: '虛擬顯色，畫畫/溫書標記', price: 128, unit: '套', emoji: '🖍️' },
  { id: 'to_24', category: 'toys', name: '輕黏土套裝', description: '虛擬創作，捏出自己世界', price: 48, unit: '套', emoji: '🏺' },
  { id: 'to_25', category: 'toys', name: '圖畫小說', description: '虛擬輕鬆閱讀，圖多字少', price: 68, unit: '本', emoji: '📚' },

];

// ============================================================
// 輔助函數
// ============================================================

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return products.filter((p) => p.category === categoryId);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getFeaturedProducts(count: number = 8): Product[] {
  // 確定性挑選：SSG 預渲染同客戶端必須一致，故【不可】用 Math.random() 洗牌。
  return products.filter((p) => p.tag).slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
