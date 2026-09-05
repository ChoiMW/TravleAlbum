/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'tests', 'fixtures', 'images');

function getBase64(fileName) {
  const filePath = path.join(imgDir, fileName);
  const buffer = fs.readFileSync(filePath);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

const jejuSunset = getBase64('jeju_sunset.jpg');
const jejuOcean = getBase64('jeju_ocean.jpg');
const jejuCafe = getBase64('jeju_cafe.jpg');

const parisEiffel = getBase64('paris_eiffel.jpg');
const londonBridge = getBase64('london_bridge.jpg');
const parisLouvre = getBase64('paris_louvre.jpg');
const romeColosseum = getBase64('rome_colosseum.jpg');

const danangResort = getBase64('danang_resort.jpg');
const danangBanahills = getBase64('danang_banahills.jpg');
const kyotoCherry = getBase64('kyoto_cherry.jpg');

const demoData = `import { CoverData } from '@/types/cover';
import { TravelMoment } from '@/types/record';
import { TemplateType } from '@/context/TravelContext';

export interface DemoAlbum {
  id: 'jeju' | 'europe' | 'danang';
  name: string;
  badge: string;
  category: string;
  template: TemplateType;
  description: string;
  cover: CoverData;
  moments: TravelMoment[];
}

export const DEMO_ALBUMS: DemoAlbum[] = [
  {
    id: 'jeju',
    name: '제주 감성 힐링 여행',
    badge: '단기 여행 (2박 3일)',
    category: '힐링 · 나홀로 여행',
    template: 'minimal',
    description: '미니멀 에디토리얼 템플릿 · 바람과 파도 소리에 온전히 기댄 주말 기록',
    cover: {
      title: 'JEJU SLOW & BREEZE',
      subtitle: '바람과 파도 소리에 온전히 기대어 걷던 주말의 기록',
      location: 'Jeju · Aewol · Hyeopjae',
      date: '2026.05.15 — 2026.05.17',
      companions: 'SOLO TRAVELER',
      showCompanions: true,
      imageUrl: '${jejuSunset}'
    },
    moments: [
      {
        id: 'jeju-m1',
        images: ['${jejuOcean}'],
        text: '공항에서 렌터카를 받아 가장 먼저 달려온 서쪽 바다. 비양도가 손에 잡힐 듯 가까웠고, 은빛으로 반짝이는 윤슬을 멍하니 바라보는 것만으로 일상의 모든 피로가 스르르 녹아내렸다.',
        mood: '🌊',
        timestamp: '14:30',
        location: '협재 해변'
      },
      {
        id: 'jeju-m2',
        images: ['${jejuCafe}'],
        text: '삐걱이는 원목 마루 냄새와 책장 사이로 비치는 따스한 햇살. 핸드드립 커피 한 잔을 곁에 두고 오랜만에 좋아하는 소설을 두 시간 동안 읽었다. 이런 게 진짜 쉼이구나.',
        mood: '☕',
        timestamp: '11:20',
        location: '애월 돌담길 북카페'
      },
      {
        id: 'jeju-m3',
        images: [],
        text: '카메라는 가방에 집어넣고 맨발로 붉은 화산송이 길을 걸었다. 짙은 피톤치드 흙냄새와 바람에 사각거리는 나뭇잎 소리. 서울에서 안고 온 무거운 생각들이 이 깊은 숲속에서 조용히 흩어졌다.',
        mood: '🍃',
        timestamp: '16:00',
        location: '비자림 숲길 (천년의 숲)'
      },
      {
        id: 'jeju-m4',
        images: ['${jejuSunset}'],
        text: '제주를 떠나기 전 마지막으로 마주한 일몰. 바다 너머로 하늘이 붉은 보랏빛으로 타오르며 풍차의 실루엣을 감싸 안았다. 돌아가서도 이 빛깔을 오래도록 잊지 못할 것 같다.',
        mood: '🌅',
        timestamp: '19:40',
        location: '신창 풍차해안'
      }
    ]
  },
  {
    id: 'europe',
    name: '유럽 낭만 배낭여행',
    badge: '장기 여행 (14박 15일)',
    category: '대장정 · 친구와 함께',
    template: 'magazine',
    description: '시티 매거진 템플릿 · 런던, 파리, 로마를 누빈 청춘의 기록',
    cover: {
      title: 'EUROPEAN ODYSSEY',
      subtitle: '스물다섯 여름, 낭만과 예술의 도시를 누비며',
      location: 'London · Paris · Rome',
      date: '2026.07.10 — 2026.07.24',
      companions: 'MINSU & DOHYUN',
      showCompanions: true,
      imageUrl: '${parisEiffel}'
    },
    moments: [
      {
        id: 'eu-m1',
        images: ['${londonBridge}'],
        text: '시차 적응도 잊은 채 달려간 템스강변. 조명이 켜진 타워 브리지를 마주한 순간 우리가 진짜 영국에 왔음을 실감했다. 서늘한 밤바람마저 설렘으로 다가왔다.',
        mood: '🇬🇧',
        timestamp: '20:30',
        location: '런던 타워 브리지'
      },
      {
        id: 'eu-m2',
        images: ['${parisLouvre}', '${parisEiffel}'],
        text: '유로스타를 타고 도착한 파리. 루브르에서 모나리자를 보고 나와 튈르리 정원 분수대 앞 초록 의자에 누웠다. 갓 구운 바게트 샌드위치를 베어 물며 친구와 웃음을 터뜨렸다.',
        mood: '🥐',
        timestamp: '15:00',
        location: '파리 루브르 & 튈르리'
      },
      {
        id: 'eu-m3',
        images: [],
        text: '언덕 위에서 아코디언 악사가 연주하는 샹송을 들으며 종이컵에 담긴 저렴한 하우스 와인을 마셨다. 노을빛으로 물드는 파리 시내를 내려다보며 우리는 각자의 서른 살을 이야기했다.',
        mood: '🍷',
        timestamp: '18:30',
        location: '몽마르트르 언덕'
      },
      {
        id: 'eu-m4',
        images: ['${romeColosseum}', '${londonBridge}', '${parisLouvre}'],
        text: '기차를 타고 이탈리아로 넘어왔다. 2천 년 전 검투사들의 함성이 들려오는 듯한 거대한 콜로세움 돌기둥 앞에 서니, 역사의 장엄함 앞에 온몸에 전율이 흘렀다.',
        mood: '🏛️',
        timestamp: '10:40',
        location: '로마 콜로세움'
      },
      {
        id: 'eu-m5',
        images: ['${romeColosseum}', '${parisEiffel}', '${jejuSunset}', '${danangResort}', '${londonBridge}'],
        text: '다시 로마에 돌아올 수 있기를 바라며 오른손으로 왼쪽 어깨 너머로 동전을 던졌다. 14일간 걷고, 웃고, 길을 잃으며 함께 만든 청춘의 기록들. 안녕, 우리의 눈부셨던 유럽!',
        mood: '✨',
        timestamp: '21:15',
        location: '로마 트레비 분수'
      }
    ]
  },
  {
    id: 'danang',
    name: '다낭 가족 힐링 휴양',
    badge: '단기 여행 (3박 4일)',
    category: '휴양 · 가족 여행',
    template: 'diary',
    description: '소프트 다이어리 템플릿 · 온 가족이 함께 웃고 쉰 따뜻한 휴가',
    cover: {
      title: 'DANANG FAMILY VACATION',
      subtitle: '온 가족이 함께 웃고 쉬어간 다낭의 푸른 날들',
      location: 'Danang · My Khe · Hoi An',
      date: '2026.09.20 — 2026.09.23',
      companions: '엄마, 아빠, 유진, 그리고 나',
      showCompanions: true,
      imageUrl: '${danangResort}'
    },
    moments: [
      {
        id: 'dn-m1',
        images: ['${danangResort}', '${danangBanahills}'],
        text: '공항에서 리조트에 도착하자마자 창밖으로 펼쳐진 야자수와 끝없는 백사장! 부모님께서 소녀처럼 환하게 웃으시는 모습을 보니 오길 정말 잘했다는 생각이 들었다.',
        mood: '🌴',
        timestamp: '16:30',
        location: '미케비치 오션뷰 리조트'
      },
      {
        id: 'dn-m2',
        images: ['${danangBanahills}'],
        text: '구름을 뚫고 20분 넘게 올라가는 세계 최장 케이블카. 거대한 신의 두 손이 다리를 받치고 있는 골든 브릿지에서 찍은 가족사진은 이번 여행의 베스트 컷!',
        mood: '🚠',
        timestamp: '11:00',
        location: '바나힐 골든 브릿지'
      },
      {
        id: 'dn-m3',
        images: ['${kyotoCherry}', '${jejuCafe}', '${danangResort}'],
        text: '노란 벽돌 건물 사이로 오색찬란한 풍등이 밝혀진 밤거리. 나룻배에 앉아 촛불 켠 소원등을 강물에 띄우며 우리 가족의 영원한 건강과 행복을 빌었다.',
        mood: '🏮',
        timestamp: '19:30',
        location: '호이안 올드타운 투본강'
      },
      {
        id: 'dn-m4',
        images: [],
        text: '한시장 야시장에서 전날 한가득 사 온 달콤한 애플망고를 썬베드에 누워 시원하게 먹었다. 파도 소리를 자장가 삼아 낮잠을 청하며 보낸 마지막 날의 완벽한 여유.',
        mood: '🥭',
        timestamp: '10:00',
        location: '리조트 프라이빗 비치'
      }
    ]
  }
];
`;

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
fs.writeFileSync(path.join(dataDir, 'demoAlbums.ts'), demoData, 'utf-8');
console.log('Successfully generated src/data/demoAlbums.ts');
