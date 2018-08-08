/**
 * Created by Kotori on 2017/8/7.
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    viewDirection:'',
  },
 //  getters: {
	//   viewDirection: state => state.viewDirection,
	// }
})

export default store
