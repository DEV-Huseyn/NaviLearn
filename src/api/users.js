import axios from 'axios'

// const API = 'https://6ae6fddc56b2ee1e5440078a.mockapi.io/users/users'

const usersAPI = axios.create({
  baseURL: 'dcn481.dcn.tj/Novilearn/api/user/users.php'
})

export default usersAPI