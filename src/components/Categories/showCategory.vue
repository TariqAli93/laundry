<template>
    <div class="categories">
      <div class="table-wrapper">
          <el-row style="margin-bottom: 30px">
              <el-col :span="2">
                  <el-tooltip placement="bottom" content="العودة" show-arrow="nerver">
                      <el-button @click="$router.go(-1)" icon="el-icon-back" style="margin-right: 40px" circle></el-button>
                  </el-tooltip>
              </el-col>
              <el-col :span="22">
                  <el-button @click="updateModal = true; getUserCategories(updatedCategories, cateData)" type="primary" icon="el-icon-edit"> تعديل التصنيفات</el-button>
              </el-col>
          </el-row>
          
          <el-dialog title="تحديث المواد" :visible.sync="updateItemModal">
            <el-form :model="updateItemsForm" label-position="top">
                <el-form-item label="السعر">
                    <el-input v-model="updateItemsForm.updateItemPrice"></el-input>
                </el-form-item>

                <el-button icon="el-icon-plus" type="primary" style="margin-top: 30px;" @click="itemUpdate()"> حفظ التعديلات</el-button>
            </el-form>
        </el-dialog>
        
        <el-dialog title="تعديل التصنيفات" :visible.sync="updateModal">
            <el-row style="margin-bottom: 30px;">
                <el-col :span="24">
                    <el-select v-model="selectCate" multiple style="width: 100%">
                        <el-option v-for="cates in updatedCategories" :key="cates.id" :label="cates.name" :value="cates.id"></el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-button @click="update(userId)" type="primary" icon="el-iocn-plus"> حفظ المتصنيفات</el-button>
        </el-dialog>

        <el-dialog title="المواد" :visible.sync="itemModal" @close="items = []; itemTableLoading = true;">
            <table class="el-table el-table__body" v-loading="itemTableLoading">
                <thead>
                    <tr>
                        <th>اسم المادة</th>
                        <th>تاريخ الاضافة</th>
                        <th>الوصف</th>
                        <th>السعر</th>
                        <th>العمليات</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="el-table__row" v-for="(item, index) in items" :key="item.id">
                    <td>{{ item.item.name }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ item.item.description }}</td>
                    <td>{{ item.price }} <b v-if="item.price.length < 8">دينار عراقي</b> </td>
                    <td>
                        <el-tooltip placement="bottom" content="تعديل" effect="light" :visible-arrow="false">
                            <el-button size="mini" @click="updateItemModal = true; updateItemsForm.updateItemId = item.id;" type="warning" icon="el-icon-edit"></el-button>
                        </el-tooltip>

                        <el-tooltip placement="bottom" content="حذف" effect="light" :visible-arrow="false">
                            <el-button size="mini" @click="itemRemove(item.id, index);" type="danger" icon="el-icon-delete"></el-button>
                        </el-tooltip>
                    </td>
                    </tr>
                </tbody>
            </table>
        </el-dialog>

          <div v-if="cateData.length < 1" style="display: flex; align-items: center; justify-content: center; background: whitesmoke; padding: 10px 0px; width: 100%">لا توجد بيانات</div>
          <table v-if="cateData" class="el-table el-table__body">
              <thead>
                  <tr>
                      <th>اسم التصنيف</th>
                      <th>تاريخ الاضافة</th>
                      <th>الوصف</th>
                      <th>الصورة</th>
                      <th>العمليات</th>
                  </tr>
              </thead>
              <tbody>
                  <tr class="el-table__row" v-for="(cates, index) in cateData" :key="cates.id">
                      <td>{{ cates.category.name }}</td>
                      <td>{{ formatDate(cates.category.createdAt) }}</td>
                      <td>{{ cates.category.description }}</td>
                      <td>
                          <el-image style="width: 100px;height: 100px;display: flex;align-items: center;justify-content: center; background: whitesmoke" :src="images + cates.category.imageUri" :preview-src-list="imageslist">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                          </el-image>
                      </td>
                      <td>
                          <el-tooltip placement="bottom" content="عرض المواد" effect="light" :visible-arrow="false">
                              <el-button @click="getUserItem(cates.category.id); itemModal = true; tempId = cates.category.id" type="info" icon="el-icon-s-goods"></el-button>
                          </el-tooltip>
                          <el-tooltip placement="bottom" content="حذف" effect="light" :visible-arrow="false">
                            <el-button @click="remove(cates.id, index)" type="danger" icon="el-icon-delete"></el-button>
                          </el-tooltip>
                      </td>
                  </tr>
              </tbody>
          </table>

          
      </div>
  </div>
</template>

<script>
import APIS from '../../baseUrl'
import moment from "moment";
export default {
    data() {
        return {
            search: '',
            selectCate: [],
            cateData: [],
            updatedCategories: [],
            createModal: false,
            updateModal: false,
            buttonLoading: false,
            images: APIS.IMAGES_URL,
            imageslist: [],
            userId: '',
            tempId: '',
            userName: '',
            items: [],
            itemModal: false,
            itemTableLoading: true,
            updateItemModal: false,
            updateItemsForm: {
                updateItemPrice: '',
                updateItemId: '',
            }
        }
    },
    mounted() {
        this.userId = this.$route.params.id;
        this.startPageLoading();
        this.getCategories();
        this.getUserById();
        this.getAllCategories();
    },
    computed: {},
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
        
        // remove categories
        remove(id, i) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;

            this.$confirm('هل انت متاكد من حذف هذا التصنيف', 'Warning',{
                type: 'warning'
            }).then(() => {
                self.axios.delete(`${APIS.API_URL}/category/deleteUserCategory?id=${id}`, {
                    headers: {
                        Authorization: 'bearer ' + token 
                    }
                }).then(() => {
                    this.cateData.splice(i, 1);
                    this.notify('success','','تم الحذف بنجاح');
                    this.getAllCategories();
                    this.getUserCategories(this.updatedCategories, this.cateData);
                    this.endPageLoading();
                }).catch((e) => {
                    this.notify('error' , '','تم الغاء الاجراء');
                    this.endPageLoading();
                    console.error(e.response);
                });
            }).catch(() => {
                this.notify('error' , '','تم الغاء الاجراء');
            })
        },
        
        // update categories
        update(id) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            const object = {'userId': this.userId, 'categories': this.selectCate};
            self.axios.put(`${APIS.API_URL}/category/updateUserCategories`, object, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then(response => {
                this.getCategories();
                this.notify('success', '','تم التحديث بنجاح');
                this.updateModal = false;
                this.selectCate = [];
                this.getAllCategories();
                this.getUserCategories(this.updatedCategories, this.cateData);
            }).catch(err => {
                console.error(err.response);
                this.notify('error', err.response.status, err.response.statusText);
            });
        },
        
        // get all categories
        getCategories() {
            let self = this,
                jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
                token = jsonInfo.token;
            
            self.axios.get(`${APIS.API_URL}/category/getUserCategories?userId=${this.userId}`, {
                headers: {
                    authorization: 'bearer ' + token
                }
            }).then((response) => {
                let rd = response.data;
                this.cateData = rd;
                this.endPageLoading();
            }).catch(e => {
                console.error(e.response);
                this.endPageLoading();
            });
        },

        // get user by id
        getUserById() {
            let self = this,
                jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
                token = jsonInfo.token;
            this.startPageLoading();

            self.axios.get(`${APIS.API_URL}/users/getUserInfo?userId=${this.userId}`, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                this.userName = result.data.username;
                this.endPageLoading();
            }).catch(e => {
                this.notify("error", e.response.status, e.response.statusText, 3500);
                this.endPageLoading();
                setTimeout(() => {
                    this.$router.push({name: 'categories'});
                }, 3500)
            })
        },

        // get all categories
        getAllCategories() {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.startPageLoading();
            self.axios.get(`${APIS.API_URL}/category/getCategories`, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                let rd = result.data;
                this.updatedCategories = rd;
            }).catch((err) => {
                console.error(err.response);
            });
        },

        // get categories from user
        getUserCategories(cate1 = null, cate2 = null) {
            let allCate = cate1;
            let userCate = cate2;
            let index = '';
            for(let i =0; i < userCate.length; i++) {
                index = allCate.findIndex(obj => obj.id === userCate[i].categoryId);
                this.updatedCategories.splice(index, 1);
            }
        },

        // get items from users
        getUserItem(categoryId = null) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;

            self.axios.get(`${APIS.API_URL}/items/getUserItems?UserId=${self.userId}&CategoryId=${categoryId}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            }).then(response => {
                self.items = response.data
                self.itemTableLoading = false;
                console.log(response);
            }).catch(error => {
                self.itemTableLoading = false;
                console.error(error.response);
            });
        },

        // update item
        itemUpdate() {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            self.startPageLoading();

            self.axios.put(`${APIS.API_URL}/items/updateUserItem`, {
                id: Number(self.updateItemsForm.updateItemId),
                price: self.updateItemsForm.updateItemPrice
            } , {
                headers: {
                    Authorization: `bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                self.getUserItem(self.tempId);
                self.notify('success','','تم التحديث بنجاح');
                self.endPageLoading();
                self.updateItemModal = false;
            }).catch(error => {
                self.notify('error', error.response.status, error.response.statusText);
                console.error(error.response);
                self.endPageLoading();
            });

        },

        itemRemove(id, i) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;

            self.$confirm('هل انت متاكد من حذف هذه المادة', 'Warning',{
                type: 'warning'
            }).then(() => {
                self.axios.delete(`${APIS.API_URL}/items/deleteUserItem?id=${id}`, {
                    headers: {
                        Authorization: 'bearer ' + token 
                    }
                }).then(() => {
                    self.items.splice(i, 1);
                    self.notify('success','','تم الحذف بنجاح');
                    self.endPageLoading();
                }).catch((e) => {
                    self.notify('error' , e.response.status, e.response.statusText);
                    self.endPageLoading();
                    console.error(e.response);
                });
            }).catch(() => {
                self.notify('error' , '','تم الغاء الاجراء');
            })
        }
    }
}
</script>
<style>

</style>