import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../config/apiConfig';

// Địa chỉ API Backend - sẽ được cập nhật động
// const API_BASE_URL = 'http://192.168.137.213:8000';

const api = axios.create({
  // baseURL sẽ được đặt trong interceptor
  headers: {
    'Content-Type': 'application/json',
  },
});

// Danh sách tài khoản cho demo
const demoAccounts = [
  {
    ma_sv: "102220120",
    mat_khau: "vinhphu123",
    ho_ten: "Lê Viết Vĩnh Phú",
    id_rfid: "33aaf20c",
    so_tien_hien_co: 180000.0
  },
  { ma_sv: "102220068", 
    mat_khau: "cntt123", 
    ho_ten: "Trần Quang Khải", 
    id_rfid: "930f8b91", 
    so_tien_hien_co: 18000000.0 
  }, 
  { 
    ma_sv: "102220141", 
    mat_khau: "cntt123", 
    ho_ten: "Trần Đăng Minh Đức", 
    id_rfid: "632ae3a7", 
    so_tien_hien_co: 247000.0 
  }, 
  { ma_sv: "102220349", 
    mat_khau: "cntt123", 
    ho_ten: "Siphanthong Xanakone", 
    id_rfid: "83f3982a", 
    so_tien_hien_co: 100000.0 
  } 
];

// Add request interceptor for debugging
api.interceptors.request.use(
  async (config) => {
    // Đặt baseURL một cách động cho mỗi request
    config.baseURL = await getApiUrl();
    console.log('API Request:', {
      url: config.baseURL + config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      config: error.config,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
    return Promise.reject(error);
  }
);

// Hàm đăng nhập mới sử dụng API
export const login = async (ma_sv: string, password: string) => {
  try {
    const response = await api.post('/api_login/', {
      ma_sv: ma_sv,
      password: password,
    });

    if (response.data && response.data.message === "Đăng nhập thành công.") {
      // API không trả về token, tạo một token giả để duy trì phiên đăng nhập
      const fakeToken = `api_token_${new Date().getTime()}`;
      
      const { user_info } = response.data;
      
      // Chuyển đổi dữ liệu người dùng từ API sang định dạng của ứng dụng
      const userData = {
        mssv: user_info.ma_sv.toString(),
        name: user_info.ho_ten,
        balance: user_info.so_du,
        // Các trường khác có thể không có trong phản hồi này
        id_rfid: user_info.id_rfid || null, 
      };

      return {
        token: fakeToken,
        user: userData,
      };
    } else {
      // Xử lý các trường hợp đăng nhập không thành công khác từ API
      throw new Error(response.data.message || 'Thông tin đăng nhập không chính xác.');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Lấy thông điệp lỗi cụ thể từ phản hồi của server nếu có
      throw new Error(error.response.data.detail || 'Lỗi máy chủ. Vui lòng thử lại sau.');
    }
    // Các lỗi mạng hoặc lỗi không xác định khác
    throw new Error('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra mạng của bạn.');
  }
};

// Hàm đăng ký giả lập
export const register = async (name: string, mssv: string, password: string) => {
  // Kiểm tra xem MSSV đã tồn tại chưa
  if (demoAccounts.some(acc => acc.ma_sv === mssv)) {
    throw new Error('MSSV đã tồn tại');
  }
  
  // Thêm tài khoản mới vào danh sách (chỉ lưu trong bộ nhớ, không lưu database)
  const newAccount = {
    ma_sv: mssv,
    mat_khau: password,
    ho_ten: name,
    id_rfid: `demo_${Math.random().toString(36).substring(2, 10)}`,
    so_tien_hien_co: 0.0
  };
  
  demoAccounts.push(newAccount);
  
  return {
    success: true,
    message: 'Đăng ký thành công'
  };
};

// API lấy thông tin sinh viên
export const getUserProfile = async (mssv: string = '102220120') => {
  try {
    const response = await api.get(`/api_users/sinhvien/${mssv}/`);
    
    // Chuyển đổi dữ liệu theo định dạng cần thiết
    return {
      mssv: response.data.ma_sv,
      name: response.data.ho_ten,
      balance: response.data.so_tien_hien_co,
      id_rfid: response.data.id_rfid
    };
  } catch (error) {
    // Sử dụng dữ liệu fake nếu API không hoạt động
    console.error('Error fetching profile, using demo data:', error);
    const account = demoAccounts.find(acc => acc.ma_sv === mssv);
    
    if (!account) {
      throw new Error('Không tìm thấy thông tin sinh viên');
    }
    
    return {
      mssv: account.ma_sv,
      name: account.ho_ten,
      balance: account.so_tien_hien_co,
      id_rfid: account.id_rfid
    };
  }
};

// API lấy lịch sử ra vào
export const getParkingHistory = async (mssv: string = '102220120') => {
  try {
    const response = await api.get(`/api_users/lichsuravao/by-ma-sv/${mssv}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history, using demo data:', error);
    // Trả về dữ liệu giả lập nếu API không hoạt động
    return [
      {
        ma_lich_su: 1,
        sinh_vien: {
          ma_sv: mssv,
          ho_ten: "Lê Viết Vĩnh Phú",
          id_rfid: "33aaf20c",
          so_tien_hien_co: 180000.0
        },
        bien_so_xe: "43GHX",
        thoi_gian_vao: "2025-05-08T02:49:02.068850Z",
        thoi_gian_ra: "2025-05-08T02:50:09.068854Z",
        trang_thai: "Đã ra"
      }
    ];
  }
};

// API nạp tiền
export const topUpBalance = async (mssv: string, amount: number, paymentMethod: string = "Chuyển khoản", transactionId: string, note: string = '') => {
  try {
    const response = await api.post('/api_nap_tien/', {
      sinh_vien_id: mssv,
      so_tien: amount,
      phuong_thuc: paymentMethod,
      ma_giao_dich: transactionId,
      ghi_chu: note
    });
    return response.data;
  } catch (error) {
    console.error('Error topping up balance:', error);
    throw error;
  }
};

export default api;