<template>
  <div class="reports">
      <div class="search-wrapper">
        <el-form ref="searchForm" :model="searchForm" label-position="top">
          <el-row :gutter="30">
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
              <el-form-item label="بحث">
                  <el-col :span="12">
                    <el-button type="primary" style="width: 100%" icon="el-icon-search" @click="search($refs.searchForm)"> بحث</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button type="warning" style="width: 100%" icon="el-icon-refresh-right" @click="reset('searchForm')">تفريغ</el-button>
                  </el-col>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
              <el-form-item label="الى...">
                <el-date-picker style="width: 100%" type="datetime" v-model="searchForm.to" placeholder="التاريخ الى ..."></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
              <el-form-item label="من ...">
                <el-date-picker style="width: 100%" type="datetime" v-model="searchForm.from" placeholder="التاريخ من ..."></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
              <el-form-item label="رقم الهاتف ...">
                <el-input clearable v-model="searchForm.mobile" placeholder="رقم الهاتف..."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table-wrapper">
        <table class="el-table el-table__body" id="toExport">
            <thead>
                <tr>
                    <th>#</th>
                    <th>المحل</th>
                    <th>صاحب المحل</th>
                    <th>رقم المحل</th>
                    <th>صاحب الطلب</th>
                    <th>رقم صاحب الطلب</th>
                    <th>تاريخ الاستلام</th>
                    <th>تاريخ التسليم</th>
                    <th>الوصف</th>
                    <th>السعر</th>
                    <th>الحالة</th>
                </tr>
            </thead>
            <tbody>
                <tr class="el-table__row" v-for="order in filterOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.vendor.name }}</td>
                    <td>{{ order.vendor.user.username }}</td>
                    <td>{{ order.vendor.mobileNumber }}</td>
                    <td>{{ order.user.username }}</td>
                    <td>{{ order.user.mobileNumber }}</td>
                    <td>{{ formatDate(order.deleverDate) }}</td>
                    <td>{{ formatDate(order.deleverDate) }}</td>
                    <td>{{ order.descrition }}</td>
                    <td>{{ order.totalPrice }}</td>
                    <td>
                      <span v-if="order.isPrinted === 1" style="color: green;">مطبوع</span>
                      <span v-else style="color: red;">غير مطبوع</span>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
  </div>
</template>

<script>
import APIS from '../baseUrl';
import moment from 'moment';
import FileSaver from 'file-saverjs';
import TableExport from 'tableexport';
export default {
    data() {
        return {
            searchForm: {
              from: '',
              to: '',
              mobile: '',
            },
            orders: [],
            governorate: [
            {
              "name":'اربيل',
              "id": 1
            },
            {
              "name":'الانبار',
              "id": 2
            },
            {
              "name":'بابل',
              "id": 3
            },
            {
              "name":'بغداد',
              "id": 4
            },
            {
              "name":'البصرة',
              "id": 5
            },
            {
              "name":'دهوك',
              "id": 6
            },
            {
              "name":'القادسية',
              "id": 7
            },
            {
              "name":'ديالى',
              "id": 8
            },
            {
              "name":'ذي قار',
              "id": 9
            },
            {
              "name":'سليمانية',
              "id": 10
            },
            {
              "name":'صلاح الدين',
              "id": 11
            },
            {
              "name":'كركوك',
              "id": 12
            },
            {
              "name":'كربلاء',
              "id": 13
            },
            {
              "name":'المثنى',
              "id": 14
            },
            {
              "name":'ميسان',
              "id": 15
            },
            {
              "name":'النجف',
              "id": 16
            },
            {
              "name":'نينوى',
              "id": 17
            },
            {
              "name":'واسط',
              "id": 18
            }
          ],
        }
    },

    computed: {
      filterOrders: function() {
        return this.orders.filter(order => {
          return order.vendor.mobileNumber.match(this.searchForm.mobile)
        });
      }
    },
    mounted() {
      this.getOrders();
      this.exportXlsx('toExport');
    },

    methods: {
      // format date
      formatDate(date) {
          return moment(date).format('YYYY-MM-DD');
      },

      formatDateTime(date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
        // notify 
        notify(type, title = null, message, duration = 1500) {
            this.$notify({
                title: title,
                message: message,
                type: type,
                duration: duration
            });
        },
        // is valid mobile number
        isNumberValid(number) {
            let regEx = new RegExp("^([\+][0-9]{1,4}[0-9]{1,14})([x]?[0-9]{1,4}?)$");
            if(regEx.test(number)) {
                return true;
            }
            return false;
        },

        // start fullscreen loading
        startPageLoading(text, bgColor) {
            this.pageLoader = this.$loading({
                lock: true,
                text: text,
                spinner: 'el-icon-loading',
                background: bgColor
            });
        },

        // end fullscreen loading
        endPageLoading() {
            this.pageLoader.close();
        },

        // check if empty inputs
        isEmpty(input) {
            if(input == '' || input == null || input == undefined) {
                return true
            }

            return false;
        },

        getOrders() {
          let self = this;
          let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));

          self.startPageLoading();

          self.axios.get(`${APIS.API_URL}/orders/getOrders`, {
            headers: {
              Authorization: `bearer ${userInfo.token}`
            }
          }).then(response => {
              self.endPageLoading();
              self.orders = response.data;
          }).catch(err => {
            self.endPageLoading();
            console.error(err.response)
          });
        },

        search(event) {
          let self = this;
          let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
          let from = self.formatDate(self.$refs.searchForm.model.from);
          let to = self.formatDate(self.$refs.searchForm.model.to);
          let vendor = self.$refs.searchForm.model.vendor;

          if(self.isEmpty(self.searchForm.from) || self.isEmpty(self.searchForm.to)) {
            self.notify('error', '', 'لا يمكن ترك الحقول فارغة');
          } else {
            self.startPageLoading();

            self.axios.get(`${APIS.API_URL}/orders/getOrders?VendorUserId=77&FromDate=${from}&ToDate=${to}`, {
              headers: {
                Authorization: `bearer ${userInfo.token}`
              }
            }).then((response) => {
                self.endPageLoading();
                self.orders = response.data;
                console.log(response);
            }).catch((err) => {
                self.endPageLoading();
                console.error(err.response);
            });
          }
        },
        
        reset(form) {
          this.$refs[form].model.from = '';
          this.$refs[form].model.to = '';
          this.$refs[form].model.vendor = '';

          let self = this;
          let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));

          self.startPageLoading();

          self.axios.get(`${APIS.API_URL}/orders/getOrders`, {
            headers: {
              Authorization: `bearer ${userInfo.token}`
            }
          }).then(response => {
              self.endPageLoading();
              self.orders = response.data;
          }).catch(err => {
              self.endPageLoading();
              console.error(err.response)
          });
        },

        exportXlsx(el) {
          let table = document.getElementById(el);
          TableExport(table, {
            position: 'top',
            bootstrap: true
          });
        }
    }
}
</script>

<style lang="scss">
  #toExport .btn-toolbar {
    background: whitesmoke;
    padding: 20px;
    text-align: right;

    .btn {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #FFF;
      border: 1px solid #DCDFE6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
      
      &:not(:last-child) {
        margin-left: 10px;
      }
    }
  }
</style>