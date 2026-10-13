import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TourItem from '../components/TourItem';
import { Tour } from '../utils/tour';

const mockTour: Tour = {
  id: '101',
  name: 'Đà Lạt mộng mơ',
  city: 'Đà Lạt',
  days: 3,
  price: 2590000,
  seats: 5,
  departure: '2026-11-05',
  image: 'https://example.com/image.jpg',
  isFavorite: false,
};

describe('TourItem Component', () => {
  test('compact layout does not display city, while non-compact displays city', async () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const { queryByText, rerender } = await render(
      <TourItem
        tour={mockTour}
        compact={true}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(queryByText('Đà Lạt')).toBeNull();

    await rerender(
      <TourItem
        tour={mockTour}
        compact={false}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(queryByText('Đà Lạt')).not.toBeNull();
  });

  test('pressing fav-btn calls onToggleFavorite once with (id, true) and not onPress; pressing tour name calls onPress with tour', async () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByTestId, getByText } = await render(
      <TourItem
        tour={mockTour}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    fireEvent.press(getByTestId('fav-btn'));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith('101', true);
    expect(onPress).not.toHaveBeenCalled();

    fireEvent.press(getByText('Đà Lạt mộng mơ'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(mockTour);
  });
});
