import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getApiUrl, setApiUrl } from '../config/apiConfig';

interface ServerConfigModalProps {
  visible: boolean;
  onClose: () => void;
}

const ServerConfigModal: React.FC<ServerConfigModalProps> = ({ visible, onClose }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (visible) {
      getApiUrl().then(currentUrl => {
        setUrl(currentUrl);
      });
    }
  }, [visible]);

  const handleSave = () => {
    if (!url || !url.startsWith('http')) {
      Alert.alert('Lỗi', 'Vui lòng nhập một địa chỉ URL hợp lệ (bắt đầu bằng http:// hoặc https://)');
      return;
    }
    setApiUrl(url);
    Alert.alert('Thành công', 'Đã lưu địa chỉ máy chủ.');
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Cấu hình Máy chủ</Text>
          <Text style={styles.label}>Địa chỉ URL của API:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUrl}
            value={url}
            placeholder="http://192.168.1.100:8000"
            keyboardType="url"
            autoCapitalize="none"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
              <Text style={styles.textStyle}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
              <Text style={styles.textStyle}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    marginLeft: 10,
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#888',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ServerConfigModal; 