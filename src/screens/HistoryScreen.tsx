import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Card, Paragraph, Divider, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { getParkingHistory } from '../api/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Định nghĩa kiểu dữ liệu cho mục lịch sử
interface HistoryItem {
  ma_lich_su: number;
  sinh_vien: {
    ma_sv: string;
    ho_ten: string;
    id_rfid: string;
    so_tien_hien_co: number;
  };
  bien_so_xe: string;
  thoi_gian_vao: string;
  thoi_gian_ra: string;
  trang_thai: string;
}

const HistoryScreen: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      if (user?.mssv) {
        const data = await getParkingHistory(user.mssv);
        setHistory(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  // Format thời gian để hiển thị
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, 'HH:mm:ss - dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateTimeString || 'N/A';
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    return (
      <Card style={styles.historyCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text style={styles.licensePlate}>{item.bien_so_xe}</Text>
            <Text style={[
              styles.status,
              item.trang_thai === 'Đã ra' ? styles.statusOut : styles.statusIn
            ]}>
              {item.trang_thai}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Thời gian vào:</Text>
            <Text style={styles.value}>{formatDateTime(item.thoi_gian_vao)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Thời gian ra:</Text>
            <Text style={styles.value}>
              {item.thoi_gian_ra ? formatDateTime(item.thoi_gian_ra) : 'Chưa ra'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6ea9" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.ma_lich_su.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có lịch sử gửi xe</Text>
            <Paragraph style={styles.emptyDescription}>
              Lịch sử gửi xe của bạn sẽ xuất hiện ở đây sau khi bạn sử dụng dịch vụ
            </Paragraph>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a6ea9',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  licensePlate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusIn: {
    backgroundColor: '#e6f7ff',
    color: '#1890ff',
  },
  statusOut: {
    backgroundColor: '#f6ffed',
    color: '#52c41a',
  },
  divider: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 95,
    fontSize: 14,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#999',
  },
});

export default HistoryScreen;
