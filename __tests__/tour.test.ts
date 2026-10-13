import { groupByCity, formatDate, getSeatLabel, Tour } from '../utils/tour';

const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Tour Nha Trang 2',
    city: 'Nha Trang',
    days: 3,
    price: 2000000,
    seats: 5,
    departure: '2026-12-01',
    image: 'https://example.com/1.jpg',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Tour Đà Lạt 1',
    city: 'Đà Lạt',
    days: 2,
    price: 1500000,
    seats: 0,
    departure: '2026-10-15',
    image: 'https://example.com/2.jpg',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Tour Đà Lạt 2',
    city: 'Đà Lạt',
    days: 4,
    price: 3000000,
    seats: 3,
    departure: '2026-11-20',
    image: 'https://example.com/3.jpg',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Tour Nha Trang 1',
    city: 'Nha Trang',
    days: 3,
    price: 2500000,
    seats: 4,
    departure: '2026-10-10',
    image: 'https://example.com/4.jpg',
    isFavorite: true,
  },
];

describe('tour utils', () => {
  test('groupByCity groups correctly, sorts cities A-Z and tours by departure ascending', () => {
    const groups = groupByCity(mockTours);

    expect(groups).toHaveLength(2);

    expect(groups[0].title).toBe('Đà Lạt');
    expect(groups[1].title).toBe('Nha Trang');

    expect(groups[0].data[0].departure).toBe('2026-10-15');
    expect(groups[0].data[1].departure).toBe('2026-11-20');

    expect(groups[1].data[0].departure).toBe('2026-10-10');
    expect(groups[1].data[1].departure).toBe('2026-12-01');
  });

  test('formatDate formats YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });

  test('getSeatLabel handles boundary values 0, 3, 4', () => {
    expect(getSeatLabel(0)).toBe('Hết chỗ');
    expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
    expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
  });
});
