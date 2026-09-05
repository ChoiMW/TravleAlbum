/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'tests', 'fixtures', 'images');

function getBase64(fileName) {
  const filePath = path.join(imgDir, fileName);
  const buffer = fs.readFileSync(filePath);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

const presets = [
  {
    id: 'jeju-ocean',
    title: '협재 에메랄드 바다',
    location: '제주 협재해변',
    category: 'ocean',
    categoryLabel: '바다·휴양',
    tag: '#제주 #에메랄드 #바다',
    file: 'jeju_ocean.jpg'
  },
  {
    id: 'danang-resort',
    title: '미케비치 오션뷰 풀빌라',
    location: '베트남 다낭',
    category: 'ocean',
    categoryLabel: '바다·휴양',
    tag: '#다낭 #휴양 #오션뷰',
    file: 'danang_resort.jpg'
  },
  {
    id: 'jeju-sunset',
    title: '신창 풍차 노을 일몰',
    location: '제주 신창풍차해안',
    category: 'ocean',
    categoryLabel: '바다·휴양',
    tag: '#노을 #풍차 #일몰감성',
    file: 'jeju_sunset.jpg'
  },
  {
    id: 'paris-eiffel',
    title: '파리 에펠탑 야경',
    location: '프랑스 파리',
    category: 'city',
    categoryLabel: '도시·명소',
    tag: '#파리 #에펠탑 #낭만야경',
    file: 'paris_eiffel.jpg'
  },
  {
    id: 'london-bridge',
    title: '런던 타워 브리지 야경',
    location: '영국 런던 템스강',
    category: 'city',
    categoryLabel: '도시·명소',
    tag: '#런던 #타워브리지 #유럽여행',
    file: 'london_bridge.jpg'
  },
  {
    id: 'rome-colosseum',
    title: '로마 고대 콜로세움',
    location: '이탈리아 로마',
    category: 'city',
    categoryLabel: '도시·명소',
    tag: '#로마 #콜로세움 #역사유적',
    file: 'rome_colosseum.jpg'
  },
  {
    id: 'ny-times-square',
    title: '뉴욕 타임스퀘어',
    location: '미국 뉴욕 맨해튼',
    category: 'city',
    categoryLabel: '도시·명소',
    tag: '#뉴욕 #타임스퀘어 #화려한도시',
    file: 'ny_times_square.jpg'
  },
  {
    id: 'kyoto-bamboo',
    title: '아라시야마 대나무숲',
    location: '일본 교토',
    category: 'nature',
    categoryLabel: '자연·숲',
    tag: '#교토 #대나무숲 #초록빛힐링',
    file: 'kyoto_bamboo.jpg'
  },
  {
    id: 'kyoto-cherry',
    title: '교토 만개한 벚꽃길',
    location: '일본 교토 카모강',
    category: 'nature',
    categoryLabel: '자연·숲',
    tag: '#교토 #벚꽃 #봄날의기억',
    file: 'kyoto_cherry.jpg'
  },
  {
    id: 'ny-central-park',
    title: '뉴욕 센트럴 파크 가을',
    location: '미국 뉴욕',
    category: 'nature',
    categoryLabel: '자연·숲',
    tag: '#센트럴파크 #도심속휴식 #가을',
    file: 'ny_central_park.jpg'
  },
  {
    id: 'jeju-cafe',
    title: '애월 돌담길 북카페',
    location: '제주 애월',
    category: 'cafe',
    categoryLabel: '카페·문화',
    tag: '#제주 #돌담카페 #독서와커피',
    file: 'jeju_cafe.jpg'
  },
  {
    id: 'paris-louvre',
    title: '루브르 유리 피라미드',
    location: '프랑스 파리',
    category: 'cafe',
    categoryLabel: '카페·문화',
    tag: '#파리 #루브르 #예술과역사',
    file: 'paris_louvre.jpg'
  },
  {
    id: 'danang-banahills',
    title: '바나힐 골든 브릿지',
    location: '베트남 다낭 바나힐',
    category: 'cafe',
    categoryLabel: '카페·문화',
    tag: '#다낭 #골든브릿지 #케이블카',
    file: 'danang_banahills.jpg'
  }
];

const items = presets.map(p => {
  const b64 = getBase64(p.file);
  return `  {
    id: '${p.id}',
    title: '${p.title}',
    location: '${p.location}',
    category: '${p.category}',
    categoryLabel: '${p.categoryLabel}',
    tag: '${p.tag}',
    imageUrl: '${b64}'
  }`;
}).join(',\n');

const content = `export interface PresetImage {
  id: string;
  title: string;
  location: string;
  category: 'ocean' | 'city' | 'nature' | 'cafe';
  categoryLabel: string;
  tag: string;
  imageUrl: string;
}

export const PRESET_CATEGORIES = [
  { id: 'all', label: '전체 보기', emoji: '✨' },
  { id: 'ocean', label: '바다·휴양', emoji: '🏖️' },
  { id: 'city', label: '도시·명소', emoji: '🏙️' },
  { id: 'nature', label: '자연·숲', emoji: '🌿' },
  { id: 'cafe', label: '카페·문화', emoji: '☕' },
] as const;

export type PresetCategoryId = typeof PRESET_CATEGORIES[number]['id'];

export const PRESET_IMAGES: PresetImage[] = [
${items}
];
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'presetImages.ts');
fs.writeFileSync(outputPath, content, 'utf8');
console.log('Successfully generated src/data/presetImages.ts');
