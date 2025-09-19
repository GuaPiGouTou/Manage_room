import { createStore } from 'vuex'
const store = createStore({

  state: {
    // 房源基本信息
    baseInfo: {
      locationName: '',
      longitude: 0,
      latitude: 0,
      wechat: '',
      phone: '',
      title: '',
      location: '',
      area: '',
      count: 0,
	  room:[]
    },
    // 房间信息数组
    rooms: [],
    // 当前编辑的房间索引
    currentRoomIndex: 0
  },
  mutations: {
    // 更新基本信息
    UPDATE_BASE_INFO(state, payload) {
      state.baseInfo = { ...state.baseInfo, ...payload }
      // 同步到本地存储
      uni.setStorageSync('baseInfo', state.baseInfo)
    },
    
    // 初始化房间数据
    INIT_ROOMS(state, count) {
      const newRooms = []
      for (let i = 0; i < count; i++) {
        // 如果已有数据，保留原有数据
        if (state.rooms[i]) {
          newRooms.push(state.rooms[i])
        } else {
          newRooms.push({
            RoomNumber: '',
            RoomAddress: '',
            RoomArea: null,
            RoomType: '',
            RoomFurniture: [],
            RoomVideo: [],
            RoomPayment: {
              monthly: '',
              quarterly: '',
              yearly: ''
            }
          })
        }
      }
      state.rooms = newRooms
	  console.log("INIT_ROOMS")
      // 同步到本地存储
      uni.setStorageSync('rooms', state.rooms)
    },
    
    // 更新房间信息
    UPDATE_ROOM(state,  {index, data} ) {
      state.rooms[index] = { ...data }
      // 同步到本地存储
      uni.setStorageSync('rooms', state.rooms)
    },
    
    // 设置当前房间索引
    SET_CURRENT_ROOM_INDEX(state, index) {
      state.currentRoomIndex = index
    },
    
    // 从本地存储加载数据
    LOAD_FROM_STORAGE(state) {
      const baseInfo = uni.getStorageSync('baseInfo')
      if (baseInfo) {
        state.baseInfo = baseInfo
      }
      
      const rooms = uni.getStorageSync('rooms')
      if (rooms) {
        state.rooms = rooms
      }
    },
    
    // 清空所有数据
    CLEAR_ALL_DATA(state) {
      state.baseInfo = {
        locationName: '',
        longitude: 0,
        latitude: 0,
        wechat: '',
        phone: '',
        title: '',
        location: '',
        area: '',
        count: 0
      }
      state.rooms = []
      state.currentRoomIndex = 0
      
      uni.removeStorageSync('baseInfo')
      uni.removeStorageSync('rooms')
    }
  },
  actions: {
    // 初始化房间
    initRooms({ commit, state }) {
      commit('INIT_ROOMS', state.baseInfo.count)
    },
    
    // 保存基本信息
    saveBaseInfo({ commit }, data) {
      commit('UPDATE_BASE_INFO', data)
    },
    
    // 保存房间信息
    saveRoomInfo({ commit }, { index, data }) {
      commit('UPDATE_ROOM', { index, data })
    },
    
    // 加载存储数据
    loadStorageData({ commit }) {
      commit('LOAD_FROM_STORAGE')
    },
    
    // 清空数据
    clearData({ commit }) {
      commit('CLEAR_ALL_DATA')
    }
  },
  getters: {
    // 获取当前房间信息
    currentRoom: (state) => {
      return state.rooms[state.currentRoomIndex] || {}
    },
    
    // 获取所有房间信息
    allRooms: (state) => {
      return state.rooms
    },
    
    // 获取基本信息
    baseInfo: (state) => {
      return state.baseInfo
    },
    
    // 检查是否所有房间都已填写
    isAllRoomsCompleted: (state) => {
      return state.rooms.every(room => 
        room.roomNumber && room.roomType && room.videos.length > 0
      )
    }
  }
})

export default store

