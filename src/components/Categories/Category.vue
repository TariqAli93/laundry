<template>
  <div class="categories">
      <div class="table-wrapper">
          <el-row style="margin-bottom: 30px">
              <el-col :span="12">
                  <input v-model="search" type="search" class="el-input__inner" placeholder="بحث ....">
              </el-col>

              <el-col :span="12">
                  <el-button type="primary" icon="el-icon-plus" @click="createModal= true;">اضافة تصنيف جديد</el-button>
              </el-col>
          </el-row>
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
                      <td>{{ cates.name }}</td>
                      <td>{{ formatDate(cates.createdAt) }}</td>
                      <td>{{ cates.description }}</td>
                      <td>
                          <el-image style="width: 100px;height: 100px;display: flex;align-items: center;justify-content: center; background: whitesmoke" :src="images + cates.imageUri" :preview-src-list="imageslist">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                          </el-image>
                      </td>
                      <td>
                          <el-button @click="updateModal = true; uid = cates.id; beforeUpdate(uid)" type="warning" icon="el-icon-edit"></el-button>
                          <el-button @click="remove(cates.id, index)" type="danger" icon="el-icon-delete"></el-button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      
      <!-- dialog create  -->
      <el-dialog :visible.sync="createModal" title="انشاء تصنيف">
          <form enctype="multipart/form-data" method="POST" novalidate id="createCates" @submit.prevent="create()">
            <el-row>
                <el-col :span="24">
                    <label>اسم التصنيف</label>
                    <input v-model="cname" type="text" class="el-input__inner" />
                </el-col>
            </el-row>
            <div class="space" style="margin-bottom: 10px"></div>
            <el-row>    
                <el-col :span="24">
                    <label>وصف التصنيف</label>
                    <input v-model="cdesc" type="text" class="el-input__inner">
                </el-col>
            </el-row>
            <div class="dropbox" id="createCateImage" style="margin-top: 20px">
                <i class="el-icon-upload"></i>
                <input type="file" multiple :name="cimage"  @change="filesChange($event.target.files, $event);" accept="image/*" class="input-file">
            </div>

            <el-button style="margin-top: 30px" :loading="buttonLoading" native-type="submit" type="primary" icon="el-icon-plus">حفظ التصنيف</el-button>
        </form>
      </el-dialog>

      <!-- dialog update  -->
      <el-dialog :visible.sync="updateModal" title="تحديث تصنيف">
          <form enctype="multipart/form-data" method="POST" novalidate id="createCates" @submit.prevent="update(uid)">
            <el-row>
                <el-col :span="24">
                    <label>اسم التصنيف</label>
                    <input v-model="uname" type="text" class="el-input__inner" />
                </el-col>
            </el-row>
            <div class="space" style="margin-bottom: 10px"></div>
            <el-row>    
                <el-col :span="24">
                    <label>وصف التصنيف</label>
                    <input v-model="udesc" type="text" class="el-input__inner">
                </el-col>
            </el-row>
            <div class="dropbox" id="updateCateImage" style="margin-top: 20px">
                <i class="el-icon-upload"></i>
                <input type="file" multiple :name="uimage"  @change="updateFilesChange($event.target.files, $event);" accept="image/*" class="input-file">
            </div>

            <el-button style="margin-top: 30px" :loading="buttonLoading" native-type="submit" type="primary" icon="el-icon-edit"> حفظ التعديل</el-button>
        </form>
      </el-dialog>
  </div>
</template>

<script>
import APIS from '../../baseUrl';
import moment from 'moment';
export default {
    name: 'Category',
    data() {
        return {
            search: '',
            s: '',
            cateData: [],
            createModal: false,
            updateModal: false,
            buttonLoading: false,
            cname: '',
            cimage: '',
            cdesc: '',
            uname: '',
            uimage: '',
            udesc: '',
            uid: '',
            images: APIS.IMAGES_URL,
            imageslist: []
        }
    },
    mounted() {
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

        // save files
        filesChange(files, e) {
            this.cimage = files;
            let dropbox = document.getElementById('createCateImage');
            let reader = new FileReader();
            reader.onload = function(e) {
                dropbox.style.backgroundImage = "url("+ e.target.result +")";
            }
            reader.readAsDataURL(this.cimage[0]);
        },

        // save files
        updateFilesChange(files) {
            this.uimage = files;
            let dropbox = document.getElementById('updateCateImage');
            let reader = new FileReader();
            reader.onload = function(e) {
                dropbox.style.backgroundImage = "url("+ e.target.result +")";
            }
            reader.readAsDataURL(this.uimage[0]);
        },

        // create categories
        create() {
            let formdata = new FormData();
            formdata.append('Name',this.cname);
            formdata.append('Description', this.cdesc);
            formdata.append('Image', this.cimage[0]);

            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.buttonLoading = true;

            if(this.isEmpty(this.cname)) {
                this.notify('error', '', 'اسم التصنيف مطلوب');
                this.buttonLoading = false;
            } else if(this.isEmpty(this.cdesc)) {
                this.notify('error', '','وصف التصنيف مطلوب');
                this.buttonLoading = false;
            } else if(this.isEmpty(this.cimage)) {
                this.notify('warning', '','يرجا اختيار صورة');
                this.buttonLoading = false;
            } else {
                this.startPageLoading();
                self.axios.post(`${APIS.API_URL}/category/addCategory`, formdata, {
                    headers: {
                        Authorization: 'bearer ' + token,
                        "Content-Type":"multipart/form-data"
                    }
                }).then((result) => {
                    this.getAllCategories();
                    this.createModal = false;
                    this.buttonLoading = false;
                    this.endPageLoading();
                    this.notify('success', '','تم اضافة التصنيف بنجاح');
                }).catch((err) => {
                    this.endPageLoading();
                    this.buttonLoading = false;
                    this.notify('error', err.response.status, 'حدث خطاء ما');
                    console.error(err.response);
                });   
            }
        },
        
        // get categore information
        beforeUpdate(id) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;

            self.axios.get(`${APIS.API_URL}/category/getCategory?id=${id}`, {
                headers: {
                    Authorization: 'bearer ' + token,
                    "Content-Type":"multipart/form-data"
                }
            }).then((result) => {
                this.uname = result.data.name;
                this.udesc = result.data.description;
            }).catch((err) => {
                console.error(err.response);
            })
        },

        update(id) {
            let formdata = new FormData();
            formdata.append('Id',id);
            formdata.append('Name',this.uname);
            formdata.append('Description', this.udesc);
            formdata.append('Image', this.uimage[0]);

            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.buttonLoading = true;

            if(this.isEmpty(this.uname)) {
                this.notify('error', '', 'اسم التصنيف مطلوب');
                this.buttonLoading = false;
            } else if(this.isEmpty(this.udesc)) {
                this.notify('error', '','وصف التصنيف مطلوب');
                this.buttonLoading = false;
            } else if(this.isEmpty(this.uimage)) {
                this.notify('warning', '','يرجا اختيار صورة');
                this.buttonLoading = false;
            } else {
                this.startPageLoading();
                self.axios.put(`${APIS.API_URL}/category/updateCategory`, formdata, {
                    headers: {
                        Authorization: 'bearer ' + token,
                        "Content-Type":"multipart/form-data"
                    }
                }).then((result) => {
                    this.getAllCategories();
                    this.updateModal = false;
                    this.buttonLoading = false;
                    this.endPageLoading();
                    this.notify('success', '','تم تحديث التصنيف بنجاح');
                }).catch((err) => {
                    this.endPageLoading();
                    this.buttonLoading = false;
                    this.notify('error', err.response.status, 'حدث خطاء ما');
                    console.error(err.response);
                });   
            }
        },
        
        // remove categories
        remove(id, i) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;

            this.$confirm('هل انت متاكد من حذف هذا التصنيف', 'Warning',{
                type: 'warning'
            }).then(() => {
                self.axios.delete(`${APIS.API_URL}/category/deleteCategory?id=${id}`, {
                    headers: {
                        Authorization: 'bearer ' + token 
                    }
                }).then(() => {
                    this.cateData.splice(i, 1);
                    this.notify('success','','تم الحذف بنجاح');
                }).catch((e) => {
                    this.notify('error' , '','تم الغاء الاجراء');
                    console.error(e.response);
                });
            }).catch(() => {
                this.notify('error' , '','تم الغاء الاجراء');
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
                this.cateData = result.data;
                for(let i = 0; i < result.data.length; i++) {
                    this.imageslist.push(this.images + result.data[i].imageUri);
                }
                this.endPageLoading();
            }).catch((err) => {
                console.error(err.response);
                this.endPageLoading();
            });
        },
    },
    
}
</script>

<style lang="scss">
.dropbox {
    outline: 4px dashed #d4d4d4;
    outline-offset: -10px;
    background: #f3f3f3;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    color: black;
    padding: 10px 10px;
    min-height: 200px;
    position: relative;
    cursor: pointer;
    border-radius: 5px;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: #c2c2c2;
    outline-color: white;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .dropbox i {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 40px;
      color: #c5c5c5;
      transform: translate(-50%, -50%);
  }

  .dropbox:hover i {
      color: white;
  }
</style>