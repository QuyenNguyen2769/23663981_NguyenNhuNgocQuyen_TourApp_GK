export interface Tour {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
}

export interface TourGroup {
  title: string;
  data: Tour[];
}

export const groupByCity = (tours: Tour[]): TourGroup[] => {
  const map = new Map<string, Tour[]>();

  for (const tour of tours) {
    if (!map.has(tour.city)) {
      map.set(tour.city, []);
    }
    map.get(tour.city)!.push(tour);
  }

  const groups: TourGroup[] = Array.from(map.entries()).map(([title, data]) => ({
    title,
    data: [...data].sort((a, b) => a.departure.localeCompare(b.departure)),
  }));

  groups.sort((a, b) => a.title.localeCompare(b.title, 'vi'));

  return groups;
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

export const getSeatLabel = (seats: number): string => {
  if (seats <= 0) {
    return 'Hết chỗ';
  }
  if (seats <= 3) {
    return `Chỉ còn ${seats} chỗ`;
  }
  return `Còn ${seats} chỗ`;
};
