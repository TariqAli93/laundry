<template>
  <div class="items">
      <!-- create modal -->
      <div>
        <el-dialog title="انشاء مادة جديدة" :visible.sync="createModal">
            <el-form :model="createItem" label-position="top">
              <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">
                            <el-form-item label="اسم المادة">
                                <el-input type="text" tabindex="1" v-model="createItem.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">
                            <el-form-item label="وصف المادة">
                                <el-input type="textarea" rows="5" tabindex="1" v-model="createItem.description" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
              </el-row>

              <el-button type="primary" @click="create()" icon="el-icon-plus">حفظ المادة</el-button>
            </el-form>
        </el-dialog>
      </div>

      <!-- update modal -->
      <div>
        <el-dialog title="تحديث مادة جديدة" :visible.sync="updateModal">
            <el-form :model="updateItem" label-position="top">
              <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">
                            <el-form-item label="اسم المادة">
                                <el-input type="text" tabindex="1" v-model="updateItem.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">
                            <el-form-item label="وصف المادة">
                                <el-input type="textarea" rows="5" tabindex="1" v-model="updateItem.description" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
              </el-row>

              <el-button type="primary" @click="update(updateItem.id)" icon="el-icon-plus">حفظ المادة</el-button>
            </el-form>
        </el-dialog>
      </div>
      <!-- new item button -->
      <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="12">
          <input v-model="search" type="search" class="el-input__inner" placeholder="بحث ....">
        </el-col>

        <el-col :span="12">
          <el-button @click="createModal = true;" type="primary" icon="el-icon-plus">اضافة مادة جديدة</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <div class="table-view">
        <table class="el-table el-table__body">
            <thead>
                <tr>
                    <th>اسم المادة</th>
                    <th>تاريخ الاضافة</th>
                    <th>الوصف</th>
                    <th>العمليات</th>
                </tr>
            </thead>
            <tbody>
                <tr class="el-table__row" v-for="(item, index) in filterdItem" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ formatDate(item.createdAt) }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin')" placement="bottom" content="تعديل" effect="light" :visible-arrow="false">
                        <el-button @click="updateItem.id = item.id; updateModal = true; updateItem.name = item.name; updateItem.description = item.description" type="warning" icon="el-icon-edit"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin')" placement="bottom" content="حذف" effect="light" :visible-arrow="false">
                        <el-button @click="remove(item.id, index);" type="danger" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                  </td>
                </tr>
            </tbody>
        </table>
      </div>
  </div>
</template>

<script>
import APIS from "../../baseUrl";
import moment from 'moment';
export default {
    name: 'ItemsComponent',
    data() {
      return {
        items: [],

        search: '',

        createModal: false,
        createItem: {
          name: '',
          description: ''
        },

        updateModal: false,
        updateItem: {
          id: '',
          name: '',
          description: ''
        },

        userItemModal: false,
        userItem: {
          userId: '',
          categoreId: '',
          categoryId: '',
          itemId: '',
          price: '',
        }
      }
    },
    mounted() {
        this.getItems();
    },
    computed: {
      filterdItem: function() {
        return this.items.filter(item => {
          return item.name.toLowerCase().match(this.search.toLowerCase());
        })
      }
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

      // create 
      create() {
        let self = this,
            jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
            token = jsonInfo.token,
            data = {
              name: self.createItem.name,
              description: self.createItem.description
            };
        self.startPageLoading();

        if(self.isEmpty(self.createItem.name) || self.isEmpty(self.createItem.description)) {
          self.notify('error', '','لايمكن ترك اي من الحقول فارغ');
        } else {
          self.axios.post(`${APIS.API_URL}/items/additem`, data, {
            headers: {
              Authorization: 'bearer ' + token
            }
          }).then(response => {
            this.createModal = false;
            this.getItems();
            this.notify('success', '','تم الاضافة بنجاح');
            self.endPageLoading();
          }).catch(err => {
            self.endPageLoading();
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
        }
      },
      // update
      update(id) {
        let self = this,
            jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
            token = jsonInfo.token,
            data = {
              id: id,
              name: self.updateItem.name,
              description: self.updateItem.description
            };
        self.startPageLoading();
        if(this.isEmpty(this.updateItem.name) || this.isEmpty(this.updateItem.description)) {
          self.notify('error', '','لايمكن ترك اي من الحقول فارغ');
        } else {
          self.axios.put(`${APIS.API_URL}/items/updateitem`, data, {
            headers: {
              Authorization: 'bearer ' + token
            }
          }).then(response => {
            this.notify('success', '','تم التحديث بنجاح');
            this.updateModal = false;
            this.getItems();
            self.endPageLoading();
          }).catch(err => {
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
            self.endPageLoading();
          });
        }
      },
      // read
      getItems() {
        let self = this,
            jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
            token = jsonInfo.token;
        self.startPageLoading();
        self.axios.get(`${APIS.API_URL}/items/getItems`, {
          headers: {
            Authorization: 'bearer ' + token,
          }
        }).then((response) => {
          self.items = response.data;
          self.endPageLoading();
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
          self.endPageLoading();
        });
      },
      // delete
      remove(id, index) {
        let self = this,
            jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
            token = jsonInfo.token;
        this.$confirm('هل انت واثق من حذف هذا العنصر ؟', 'حذف', {
          type: 'warning'
        }).then(() => {
          self.axios.delete(`${APIS.API_URL}/items/deleteitem?id=${id}`,{
            headers: {
              Authorization: 'bearer ' + token
            }
          }).then(response => {
            this.items.splice(index, 1);
            this.notify('success','','تم الحذف بنجاح');
          }).catch(err => {
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
          })
        }).catch((e) => {
          this.notify('error',e,'تم الغاء الاجراء');
        });
      },

      loggedInUserInfo: () => {
          let info = JSON.parse(localStorage.getItem('loggedInUser')),
              roles = info.roles.join(",");
          return roles;
      }
    }
}
</script>

<style>

</style>