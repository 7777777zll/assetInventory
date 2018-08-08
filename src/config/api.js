/**
 * Created by Kotori on 2017/5/16.
 * Modify by Athrunsky on 2017//8/2
 */

import axios from 'axios'

// let base = '/api'
// let base = 'http://36.110.7.34:8000/api'
let base = 'api'
export const Task = {
  TaskList: (params) => {
    return axios.get(`${base}/getInventoryTaskList`,params).then(res => res.data)
  },
  TaskDetail: (params) => {
    return axios.get(`${base}/getInventoryTask`,params).then(res => res.data)
  },
  updateTask: (params) => {
    return axios.get(`${base}/updateInventoryTask`,params).then(res => res.data)
  },
  synclists: () => {
    return axios.get('http://172.16.9.83:8081/api/db/synclists').then(res => res.data)
  },
  synctask: () => {
    return axios.get('http://172.16.9.83:8081/api/db/synctask').then(res => res.data)
  },
  submitTask: (params) => {
    return axios.get(`${base}/submitInventoryTask`,params).then(res => res.data)
  },
}
export const Inventory = {
  // inventoryList: (params) => {
  //   return axios.get(`${base}/getInventoryListList`,params).then(res => res.data)
  // },
  getListById: (params) => {
    return axios.get(`${base}/getInventoryListById`,params).then(res => res.data)
  },
  findInventoryList: (params) => {
    return axios.get(`${base}/findInventoryListByTerm`,params).then(res => res.data)
  },
  // 盘盈
  insertInventory: (params) => {
    return axios.post(`${base}/insertInventoryList`,params.params).then(res => res.data)
  },
  deleteInventory: (params) => {
    return axios.get(`${base}/deleteInventoryList`,params).then(res => res.data)
  },
  findForRfid: (params) => {
    return axios.get(`${base}/findForRfid`,params).then(res => res.data)
  },
  // 资产差异添加
  insertDifference: (params) => {
    console.log(params)
    return axios.post(`${base}/insertInventoryAssetDifference`,params.params).then(res => res.data)
  },
  updateList: (params) => {
    return axios.post(`${base}/updateInventoryList`,params.params).then(res => res.data)
  },
  findDepartment: (params) => {
    return axios.get(`${base}/findDepartment`,params).then(res => res.data)
  },
  findLocation: (params) => {
    return axios.get(`${base}/findLocation`,params).then(res => res.data)
  },
  findByAsset: (params) => {
    return axios.get(`${base}/findInventoryListByAssetNumberAndTaskId`,params).then(res => res.data)
  },
  inventoryList: (params) => {
    return axios.get(`${base}/findInventoryListByStatusAndTerm`,params).then(res => res.data)
  },
}

