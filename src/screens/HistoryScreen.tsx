import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator, Divider } from 'react-native-paper';
import { getParkingHistory } from '../api/api';

interface ParkingRecord {
  id: string;
  entry_time: string;
  exit_time?: string;
  fee?: number;
  location: string;
  status: string;
}

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<ParkingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getParkingHistory();
      setHistory(response.history || []);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử gửi xe. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'Chưa tính phí';
    return `${amount.toLocaleString('vi-VN')} đ`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#2196F3'; // Đang gửi - xanh dương
      case 'completed':
        return '#4CAF50'; // Đã hoàn thành - xanh lá
      default:
        return '#9E9E9E'; // Mặc định - xám
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Đang gửi xe';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const renderHistoryItem = ({ item }: { item: ParkingRecord }) => (
    <Card style={styles.historyCard}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Title style={styles.locationText}>{item.location}</Title>
          <Text style={[
            styles.statusText, 
            { color: getStatusColor(item.status) }
          ]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian vào:</Text>
          <Text style={styles.detailValue}>{formatDate(item.entry_time)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian ra:</Text>
          <Text style={styles.detailValue}>{formatDate(item.exit_time)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phí gửi xe:</Text>
          <Text style={[
            styles.detailValue, 
            styles.feeText
          ]}>
            {formatCurrency(item.fee)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading && !refreshing) {
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
        keyExtractor={(item) => item.id}
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30
  },
  historyCard: {
    marginBottom: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    flex: 1,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  detailValue: {
    fontWeight: '500',
    fontSize: 14,
  },
  feeText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#666',
  }
});

export default HistoryScreen;
