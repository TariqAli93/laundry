<template>
  <div>
    <el-row style="margin-bottom: 30px;">
      <el-col :span="2" style="text-align: left">
        <el-tooltip placement="bottom" content="العودة" :visible-arrow="false">
          <el-button circle icon="el-icon-back" @click="$router.go(-1)"></el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="22"><h1 style="margin: 0;">صاحب المحل : {{ username }}</h1></el-col>
    </el-row>

    <el-dialog title="تعديل المحل" :visible.sync="updateModal">
      <el-form :model="updateVendorForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="رقم الهاتف">
              <el-input v-model="updateVendorForm.mobileNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="اسم المحل">
              <el-input v-model="updateVendorForm.name"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="المنطقة">
              <el-input v-model="updateVendorForm.district"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="المحافظة">
              <el-select v-model="updateVendorForm.government">
                <el-option v-for="gove in governorate" :key="gove.id" :label="gove.name" :value="gove.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="الاستلام من المنزل">
              <el-select v-model="updateVendorForm.homeRecieve" style="width: 100%">
                <el-option label="تفعيل" value="1"></el-option>
                <el-option label="الغاء التفعيل" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-button type="primary" icon="el-icon-plus" @click="update()"> حفظ التعديلات</el-button>
      </el-form>
    </el-dialog>
    <el-table :data="vendor" style="width: 100%">
      <el-table-column label="اسم المحل" prop="name"></el-table-column>
      <el-table-column label="اسم صاحب المحل" prop="user.username"></el-table-column>
      <el-table-column label="رقم المحل" prop="mobileNumber"></el-table-column>
      <el-table-column label="رقم صاحب المحل" prop="user.mobileNumber"></el-table-column>
      <el-table-column label="تاريخ الاضافة">{{ createAt }}</el-table-column>
      <el-table-column label="المحافظة" prop="government"></el-table-column>
      <el-table-column label="المنطقة" prop="district"></el-table-column>

      <el-table-column align="right" label="العمليات">
        <template slot-scope="scope">
          <el-button @click="updateModal = true; setDefaultInputVal()" type="warning" size="mini" icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import APIS from '../../baseUrl';
import moment from 'moment';

export default {
    data() {
        return {
            vendor: [],
            username: '',
            updateModal: false,
            updateVendorForm: {
              name: '',
              mobileNumber: '',
              government: '',
              district: '',
              homeRecieve: '',
            },
            createAt: '',
            vendorId: '',
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
    mounted() {
      this.startPageLoading();
      this.getVendorByUserId();
    },
    methods: {
      // format date
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD');
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
      getVendorByUserId() {
        let self   = this,
            info   = JSON.parse(localStorage.getItem('loggedInUser')),
            token  = info.token,
            userId = this.$route.params.id;
        
        self.axios.get(`${APIS.API_URL}/vendor/getVendorByUserId?userId=${userId}`, {
          headers: {
              Authorization: 'bearer ' + token
          }
        }).then((response) => {
            self.username = response.data.user.username;
            self.createAt = self.formatDate(response.data.createdAt);
            self.vendorId = response.data.id;
            self.vendor.push(response.data);
            console.log(response);
            self.endPageLoading();
        }).catch((err) => {
            self.endPageLoading();
            console.error(err.response);
        });
      },

      setDefaultInputVal() {
        let self   = this,
            info   = JSON.parse(localStorage.getItem('loggedInUser')),
            token  = info.token,
            userId = this.$route.params.id;
        self.startPageLoading();
        
        self.axios.get(`${APIS.API_URL}/vendor/getVendorByUserId?userId=${userId}`, {
          headers: {
              Authorization: 'bearer ' + token
          }
        }).then((response) => {
            self.updateVendorForm.name = response.data.name
            self.updateVendorForm.mobileNumber = response.data.mobileNumber
            self.updateVendorForm.district = response.data.district
            self.updateVendorForm.governorate = response.data.governorate
            self.updateVendorForm.homeRecieve = response.data.homeRecieve

            self.endPageLoading();
        }).catch((err) => {
            self.endPageLoading();
            console.error(err.response)
        });
      },

      update() {
          let self   = this,
            info   = JSON.parse(localStorage.getItem('loggedInUser')),
            token  = info.token,
            userId = this.$route.params.id,
            object = {
              id: self.vendorId,
              name: self.updateVendorForm.name,
              mobileNumber: self.updateVendorForm.mobileNumber,
              government: self.updateVendorForm.government,
              district: self.updateVendorForm.district,
              homeRecieve: self.updateVendorForm.homeRecieve
            };

          if(self.isEmpty(self.updateVendorForm.name)) {
            self.notify('error','','لا يمكن ترك الاسم فارغ')
          }
          else if(self.isEmpty(self.updateVendorForm.mobileNumber)) {
            self.notify('error','','لا يمكن ترك رقم الهاتف فارغ')
          }
          else if(self.isEmpty(self.updateVendorForm.government)) {
            self.notify('error','','يرجا اختيار المحافظة')
          }
          else if(self.isEmpty(self.updateVendorForm.district)) {
            self.notify('error','','يرجا كتابة اسم المنطة')
          }
          else if(self.isEmpty(self.updateVendorForm.homeRecieve)) {
            self.notify('error','','يرجا تفعيل او الغاء تفعيل الاستلام من المنزل')
          }
          else {
            self.startPageLoading();
            self.axios.put(`${APIS.API_URL}/vendor/updateVendor`, object, {
                headers: {
                  Authorization: `bearer ${token}`
                }
            }).then(response => {
                self.notify('success', '','تم التحديث بنجاح');
                self.updateModal = false;
                self.vendor = [];
                self.getVendorByUserId();
                self.endPageLoading();
            }).catch(error => {
                self.endPageLoading();
                console.error(error.response);
            });
        }
      }
    }
}
</script>

<style>

</style>