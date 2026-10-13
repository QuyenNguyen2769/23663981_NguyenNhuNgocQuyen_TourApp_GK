import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { formatDate, getSeatLabel } from '../utils/tour';

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

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem = ({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}: TourItemProps) => {
  const formattedPrice = `${tour.price.toLocaleString('vi-VN')} ₫`;
  const isSeatLow = tour.seats <= 3;

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={() => onPress(tour)}
      activeOpacity={0.8}
    >
      <View style={[styles.imageWrapper, compact && styles.imageWrapperCompact]}>
        <Image
          source={{ uri: tour.image }}
          style={[styles.image, compact && styles.imageCompact]}
          resizeMode="cover"
        />
        {compact && (
          <TouchableOpacity
            testID="fav-btn"
            style={styles.favBtnCompact}
            onPress={(e: any) => {
              e?.stopPropagation?.();
              onToggleFavorite(tour.id, !tour.isFavorite);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.favIcon, tour.isFavorite && styles.favActive]}>
              {tour.isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.infoContainer, compact && styles.infoCompact]}>
        <Text
          style={[styles.name, compact && styles.nameCompact]}
          numberOfLines={compact ? 1 : 2}
        >
          {tour.name}
        </Text>

        {!compact && (
          <>
            <Text style={styles.city}>{tour.city}</Text>
            <Text style={styles.dateDays}>
              📅 {formatDate(tour.departure)} · {tour.days} ngày
            </Text>
          </>
        )}

        <Text style={styles.price}>{formattedPrice}</Text>

        {!compact && (
          <Text style={[styles.seatLabel, isSeatLow && styles.seatLow]}>
            {getSeatLabel(tour.seats)}
          </Text>
        )}
      </View>

      {!compact && (
        <TouchableOpacity
          testID="fav-btn"
          style={styles.favBtn}
          onPress={(e: any) => {
            e?.stopPropagation?.();
            onToggleFavorite(tour.id, !tour.isFavorite);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.favIcon, tour.isFavorite && styles.favActive]}>
            {tour.isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default memo(TourItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardCompact: {
    flexDirection: 'column',
    width: 160,
    marginHorizontal: 6,
    marginVertical: 4,
    padding: 8,
    alignItems: 'stretch',
  },
  imageWrapper: {
    position: 'relative',
  },
  imageWrapperCompact: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e1e4e8',
  },
  imageCompact: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  infoCompact: {
    marginLeft: 0,
    marginTop: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  nameCompact: {
    fontSize: 13,
    marginBottom: 4,
  },
  city: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 2,
  },
  dateDays: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  seatLabel: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '500',
  },
  seatLow: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  favBtn: {
    padding: 8,
    marginLeft: 4,
  },
  favBtnCompact: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    fontSize: 18,
    color: '#9ca3af',
  },
  favActive: {
    color: '#ef4444',
  },
});
