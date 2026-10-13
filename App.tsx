import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Tour, groupByCity, formatDate } from './utils/tour';
import TourItem from './components/TourItem';

const API_URL = 'https://6acdc919f338359cf1c25220.mockapi.io/api/v1/tours';

function MainScreen() {
  const [searchText, setSearchText] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTours = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Tour[] = await res.json();
      setTours(data);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
      if (Platform.OS === 'web') {
        window.alert('Không thể tải dữ liệu');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTours();
  };

  const filteredSections = useMemo(() => {
    const trimmed = searchText.trim().toLowerCase();
    const filteredTours = trimmed
      ? tours.filter((tour) => tour.name.toLowerCase().includes(trimmed))
      : tours;
    const groups = groupByCity(filteredTours);
    return groups.filter((group) => group.data.length > 0);
  }, [tours, searchText]);

  const favoriteTours = tours.filter((item) => item.isFavorite);

  const handlePressTour = (tour: Tour) => {
    const message = `Tên tour: ${tour.name}\nNgày khởi hành: ${formatDate(tour.departure)}\nSố ngày: ${tour.days} ngày\nGiá: ${tour.price.toLocaleString('vi-VN')} ₫`;
    Alert.alert(tour.name, message);
    if (Platform.OS === 'web') {
      window.alert(`${tour.name}\n\n${message}`);
    }
  };

  const handleToggleFavorite = async (id: string, next: boolean) => {
    setTours((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: next } : item))
    );

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: next }),
      });

      if (!res.ok) {
        throw new Error();
      }
    } catch {
      setTours((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFavorite: !next } : item))
      );
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích');
      if (Platform.OS === 'web') {
        window.alert('Không thể cập nhật trạng thái yêu thích');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tour Việt</Text>
          <Text style={styles.studentInfo}>23663981 – Nguyễn Như Ngọc Quyên</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tour theo tên..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#888"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <SectionList
            sections={filteredSections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
              <View style={styles.favoriteSection}>
                <Text style={styles.favoriteTitle}>
                  Tour yêu thích ({favoriteTours.length})
                </Text>
                {favoriteTours.length === 0 ? (
                  <Text style={styles.emptyFavoriteText}>
                    Chưa có tour yêu thích
                  </Text>
                ) : (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={favoriteTours}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                    renderItem={({ item }) => (
                      <TourItem
                        tour={item}
                        compact={true}
                        onPress={handlePressTour}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    )}
                    contentContainerStyle={styles.favoriteList}
                  />
                )}
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Không tìm thấy tour phù hợp
                </Text>
              </View>
            }
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {title} · {data.length} tour
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TourItem
                tour={item}
                onPress={handlePressTour}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <MainScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  studentInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  favoriteSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emptyFavoriteText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  favoriteList: {
    paddingHorizontal: 10,
  },
  separator: {
    width: 10,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  sectionHeader: {
    backgroundColor: '#e8edf3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7de',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
