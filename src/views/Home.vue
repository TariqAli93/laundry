<template>
  <div style="padding-top: 30px;">
    <el-row :gutter="60">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 30px;">
        <el-card class="ui-card">
          <i class="el-icon-user"></i>
          <span class="card-name">المستخدمين</span>
          <b>{{ usersCount }}</b>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 30px;">
        <el-card class="ui-card">
          <i class="el-icon-collection"></i>
          <span class="card-name">التصنيفات</span>
          <b>{{ categoriesCount }}</b>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="ui-card">
          <i class="el-icon-s-goods"></i>
          <span class="card-name">المواد</span>
          <b>{{ itemsCount }}</b>
        </el-card>
      </el-col>
    </el-row>


    <el-row :gutter="60" style="margin-top: 60px">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom: 30px;">
        <el-card class="ui-card-white">
          <canvas id="homeChart1"></canvas>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 30px;">
        <el-card class="ui-card-white">
          <canvas id="homeChart2"></canvas>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="ui-card-white">
          <canvas id="homeChart3"></canvas>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import APIS from '../baseUrl';
import moment from 'moment';
import Chart from 'chart.js';

export default {
  data() {
    return {
      usersCount: '',
      categoriesCount: '',
      itemsCount: '',
      userInfo: JSON.parse(localStorage.getItem('loggedInUser')),
    }
  },
  mounted() {
    this.getUsersCount();
    this.getCategoriesCount();
    this.getItemsCount();

    let chart1 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgba(17,121,146,1)',
            borderColor: 'rgba(17,121,146,1)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    };
    this.createChart('homeChart1', chart1);
    this.createChart('homeChart2', chart1);
    this.createChart('homeChart3', chart1);
  },

  methods: {
    getUsersCount() {
      let self = this;
      self.axios.get(`${APIS.API_URL}/users/getUsers`, {
        headers: {
          Authorization: `bearer ${this.userInfo.token}`
        }
      }).then((response) => {
          this.usersCount = response.data.length;
      }).catch((err) => {
          if(err.response.status === 400) {
              this.notify('error', err.response.status, 'خطأ في ارسال البيانات');
          } else if(err.response.status === 401) {
              this.notify('error', err.response.status, 'تم انتهاء مدة الاتصال');
              this.$router.push({name: 'LoginPage'});
              localStorage.removeItem('loggedInUser');
          } else if(!err.response.status) {
              this.notify('error', '', 'لا يوجد اتصال بالانترنت');
          } else {
              this.notify('error', err.response.status, 'حدث خطاء ما');
              console.error(err.response);
          }
      });
    },

    getCategoriesCount() {
      let self = this;
      self.axios.get(`${APIS.API_URL}/category/getCategories`, {
        headers: {
          Authorization: `bearer ${this.userInfo.token}`
        }
      }).then((response) => {
          this.categoriesCount = response.data.length;
      }).catch((err) => {
          if(err.response.status === 400) {
              this.notify('error', err.response.status, 'خطأ في ارسال البيانات');
          } else if(err.response.status === 401) {
              this.notify('error', err.response.status, 'تم انتهاء مدة الاتصال');
              this.$router.push({name: 'LoginPage'});
              localStorage.removeItem('loggedInUser');
          } else if(!err.response.status) {
              this.notify('error', '', 'لا يوجد اتصال بالانترنت');
          } else {
              this.notify('error', err.response.status, 'حدث خطاء ما');
              console.error(err.response);
          }
      });
    },

    getItemsCount() {
      let self = this;
      self.axios.get(`${APIS.API_URL}/items/getItems`, {
        headers: {
          Authorization: `bearer ${this.userInfo.token}`
        }
      }).then((response) => {
          this.itemsCount = response.data.length;
      }).catch((err) => {
          console.error(err.response)
      });
    },

    createChart(el, data) {
      let ctx = document.getElementById(el);
      let chart = new Chart(ctx ,{
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: data,

        // Configuration options go here
        options: {}
      });
    }
  }
}
</script>

<style lang="scss">
  .ui-card-white {
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05) !important;
  }

  .ui-card {
    padding: 15px;
    background: rgb(80,195,163);
    background: linear-gradient(90deg, rgba(80,195,163,1) 0%, rgba(17,121,146,1) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 2px 43px -4px rgba(0,0,0,.19) !important;
    transform: translateY(-1px);
    border: none !important;


    i {
        position: absolute;
        font-size: calc(50px + (50 - 15) * ((100vw - 300px) / (1600 - 300)));
        right: 20px;
        color: white;
        transition: all ease-in-out 400ms;
        z-index: 1;
        opacity: 0.4;
    }

    span.card-name {
        display: block;
        font-size: calc(14px + (26 - 14) * ((100vw - 300px) / (1600 - 300)));
        text-align: center;
        font-weight: bolder;
        color: white;
        position: relative;
        z-index: 2;
    }

    b {
        font-size: 30px;
        text-align: center;
        display: block;
        color: white;
        position: relative;
        z-index: 2;
    }


    &:hover {
      box-shadow: 0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05) !important;
      transform: translateY(0px);
      i {
        opacity: 1;
      }
    }
  } 
</style>