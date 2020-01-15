<template>
  <div>
       <div>
        <el-dialog title="انشاء مستخدم جديد" :visible.sync="createUser">
            <el-form :model="createForm" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="كلمة المرور">
                                <el-input type="password" tabindex="2" show-password v-model="createForm.password" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="اسم المستخدم">
                                <el-input v-model="createForm.username" tabindex="1" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="نوع الحساب">
                                <el-select v-model="createForm.accountType" tabindex="4" style="width: 100%">
                                    <el-option v-for="option in createForm.urlOption" :key="option.value" :label="option.label" :value="option.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="رقم الهاتف">
                                <el-input v-model="createForm.mobileNumber" tabindex="3" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="المنطقة">
                                <el-input v-model="createForm.district" tabindex="6" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="المحافظة">
                                <el-select v-model="createForm.accountGover" tabindex="5" style="width: 100%">
                                    <el-option v-for="gover in governorate" :key="gover.id" :label="gover.name" :value="gover.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-button type="primary" icon="el-icon-plus" :loading="buttonLoading" @click="create(createForm)">اضافة المستخدم</el-button>
            </el-form>
        </el-dialog>
    </div>

    <div>
        <el-dialog title="تعديل الصلاحيات" :visible.sync="updatePrivilegeModal" @close="isAdminChecked = false; isSuperAdminChecked = false; isVendorChecked = false;">
            <el-form label-position="top">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-checkbox v-model="isSuperAdminChecked" value="1" label="SuperAdmin" border></el-checkbox>
                    </el-col>

                    <el-col :span="8">
                        <el-checkbox v-model="isAdminChecked" value="2" label="Admin" border></el-checkbox>
                    </el-col>

                    <el-col :span="8">
                        <el-checkbox v-model="isVendorChecked" value="3" label="Vendor" border></el-checkbox>
                    </el-col>
                </el-row>

                <div style="margin-top: 40px; display: flex;">
                    <el-button type="primary" icon="el-icon-plus" @click="changePrivilege(userId)">حفظ التعديلات</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>

    <div>
        <el-dialog title="تعديل المستخدم" :visible.sync="editModal" @close="isUserActive = false;">
            <el-form :model="editForm" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="اسم المستخدم">
                                <el-input v-model="editForm.username" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="رقم الهاتف">
                                <el-input v-model="editForm.mobileNumber" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="المحافظة">
                                <el-select v-model="editForm.editAccountGover" tabindex="5" style="width: 100%">
                                    <el-option v-for="egover in governorate" :key="egover.id" :label="egover.name" :value="egover.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-form-item label="المنطقة">
                                <el-input v-model="editForm.district" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="الحالة">
                            <el-switch v-model="isUserActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-button type="primary" :loading="buttonLoading" @click="update(editForm, userId)" icon="el-icon-plus">حفظ التعديلات</el-button>
            </el-form>
        </el-dialog>
    </div>

    <div class="adduser" style="margin-bottom: 30px">
        <el-row>
            <el-col :span="12">
                <el-input type="text" v-model="search" size="large" placeholder=" البحث في المستخدمين (حسب الاسم او رقم الهاتف او المحافظة او المنطقة)" />
            </el-col>
            <el-col :span="12">
                <el-button type="primary" icon="el-icon-plus" @click="createUser = true;">اضافة مستخدم جديد</el-button>
            </el-col>
        </el-row>
    </div>

    <table class="el-table el-table__body">
        <thead>
            <tr>
                <th scope="row">اسم المستخدم</th>
                <th>رقم الهاتف</th>
                <th>الصلاحيات</th>
                <th>تاريخ الانظمام</th>
                <th>المحافظة</th>
                <th>المنطقة</th>
                <th>الحالة</th>
                <th>العمليات</th>
            </tr>
        </thead>
        <tbody>
            <tr class="el-table__row" v-for="(data, index) in filteredUsers" :key="data.id">
                <td>{{data.username}}</td>
                <td>{{data.mobileNumber}}</td>
                <td>
                    <span v-for="role in data.userRole" :key="role.id">
                        <div>
                            <span v-if="role.roleId === 1">SuperAdmin</span>
                            <span v-if="role.roleId === 2">Admin</span>
                            <span v-if="role.roleId === 3">Vendor</span>
                            <span v-if="role.roleId === 4">User</span>
                        </div>
                    </span>
                </td>
                <td>{{formatDate(data.createdAt)}}</td>
                <td>{{data.government}}</td>
                <td>{{data.district}}</td>
                <td>
                    <span>
                        <span style="color: red;" v-if="data.isActive === 0">غير مفعل</span>
                        <span style="color: green;" v-else>مفعل</span>
                    </span>
                </td>
                <td>
                    <el-row class="custom-button-row">
                        <el-button type="primary" @click="editModal = true; getUserInfo(data); userId = data.id" icon="el-icon-edit"></el-button>
                        <el-button @click="updatePrivilegeModal = true; privilegRoles = data.userRole; userId = data.id; getRoleById(privilegRoles)" type="info" icon="el-icon-set-up"></el-button>
                        <el-button type="danger" @click="remove(data.id, index)" icon="el-icon-delete"></el-button>
                    </el-row>
                </td>
            </tr>
        </tbody>
    </table>

  </div>
</template>

<script>
import APIS from '../../baseUrl'
import moment from "moment";
export default {
    name: 'UserTable',
    data() {
      return {
        tableData: [],
        search: '',
        editModal: false,
        createUser: false,
        updateIsActive: false,
        userId: '',
        isSuperAdminChecked: false,
        isAdminChecked: false,
        isVendorChecked: false,
        privilegRoles: '',
        updatePrivilegeModal: false,
        buttonLoading: false,
        editForm: {
            username: '',
            mobileNumber: '',
            government: '',
            district: '',
            editAccountGover: ''
        },
        createForm: {
            accountType: '',
            accountGover: '',
            username: '',
            password: '',
            mobileNumber: '',
            district: '',
            urlOption: [
                {
                    value: '1',
                    label: 'SuperAdmin'
                },
                {
                    value: '2',
                    label: 'Admin'
                },
                {
                    value: '3',
                    label: 'Vendor'
                },
            ],
        },
        updateUserInfo: {
            id: '',
            username: '',
            mobileNumber: '',
            government: '',
            district: '',
        },
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
        isUserActive: false,
      }
    },
    mounted() {
        this.getUsers();
    },
    computed: {
        filteredUsers: function() {
            return this.tableData.filter((user) => {
                return user.mobileNumber.toLowerCase().match(this.search.toLowerCase()) || 
                user.username.toLowerCase().match(this.search.toLowerCase()) || 
                user.government.toLowerCase().match(this.search.toLowerCase()) || 
                user.district.toLowerCase().match(this.search.toLowerCase());
            });
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

        // get roles by id
        getRoleById(role) {
            let rows = [];
            for(let row of role) {
                rows.push(row.roleId)
            }
            if(rows.includes(1)) {
                this.isSuperAdminChecked = true;
            }
            if(rows.includes(2)) {
                this.isAdminChecked = true;
            }
            if(rows.includes(3)) {
                this.isVendorChecked = true;
            }
        },

        // get user info
        getUserInfo(data) {
            let id = data.id;
            let self = this;
            let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            self.axios.get(`${APIS.API_URL}/users/getUserInfo?userId=${id}`, {
                headers: {
                    Authorization: 'bearer ' + userInfo.token
                }
            }).then((result) => {
                this.updateUserInfo = {
                    id: result.data.id,
                    username: result.data.username,
                    isActive: result.data.isActive,
                    mobileNumber: result.data.mobileNumber,
                    district: result.data.district
                };

                this.editForm = {
                    username: this.updateUserInfo.username,
                    mobileNumber: this.updateUserInfo.mobileNumber,
                    editAccountGover: this.updateUserInfo.government,
                    district: this.updateUserInfo.district
                };
                this.isUserActive = result.data.isActive === 1 ? true : false;
            }).catch((err) => {
                if(err.response.status == 401) {
                    this.notify("error","","تم فصل الاتصال");
                    this.editModal = false;
                } else if(err.response.status == 404) {
                    this.notify("error","","عذرا لم يتم العثور على الطلب");
                    this.editModal = false;
                } else if(err.response.status == 400) {
                    this.notify("error","","حدث خطاء في ارسال البيانات");
                    this.editModal = false;
                } else {
                    this.notify("error","","حدث خطاء ما");
                    this.editModal = false;
                }
            });
        },

        // get all users
        getUsers() {
            let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            this.startPageLoading();
            this.axios.get(`${APIS.API_URL}/users/getUsers`, {
                headers: {
                    Authorization: 'bearer ' + userInfo.token
                }
            }).then((result) => {
                this.tableData = result.data.reverse();
                this.endPageLoading();
            }).catch((err) => {
                if(err.response === 401) {
                    this.notify('error','','لا توجد صلاحيات كافية');
                } else if(err.response === 400) {
                    this.notify('error','','حدثت مشكلة في ارسال البيانات');
                } else if(err.response === 404) {
                    this.notify('error','','حدثت مشكلة في الحصول على الطلب');
                } else {
                    this.notify('error','','حدثت مشكلة في الاتصال');
                }
                
                this.endPageLoading();
            });
        },

        // create new account
        create(formdata) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.buttonLoading = true;

            let registerdInfo = {
                username: formdata.username,
                mobileNumber: formdata.mobileNumber,
                userTypeId: Number(formdata.accountType),
                password: formdata.password,
                government: formdata.accountGover,
                district: formdata.district,
                isActive: 1
            };

            if(this.isEmpty(formdata.username)) {
                this.notify('error', '','لا يمكن ترك اسم المستخدم فارغ');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.password)) {
                this.notify('error', '','لا يمكن ترك الباسورد فارغ');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.mobileNumber)) {
                this.notify('error', '','لا يمكن ترك رقم الهاتف فارغ');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.accountGover)) {
                this.notify('error', '','يرجا اختيار المحافظة');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.district)) {
                this.notify('error', '','يرجا كتابة اسم المنطقة');
                this.buttonLoading = false;
            } else if(this.isNumberValid(formdata.mobileNumber) == false) {
                this.notify('error', '','الرقم غير صحيح ! يجب ان يكون مسبوق بـ +964');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.accountType)) {
                this.notify('error', '','يرجا اختيار نوع الحساب');
                this.buttonLoading = false;
            } else {
                if(formdata.accountType === "3") {
                    self.axios.post(`${APIS.API_URL}/account/registerVendor`, registerdInfo , {
                        headers: {
                            Authorization: 'bearer ' + token
                        }
                    }).then((result) => {
                        this.getUsers();
                        this.notify('success', '','تم اضافة المستخدم بنجاح');
                        this.createUser = false;
                        this.buttonLoading = false;
                    }).catch((err) => {
                        if(err.response.data === '-20007') {
                            this.notify("error", '','رقم الهاتف موجود مسبقا');
                            this.buttonLoading = false;
                        } else if(err.response.status === '-20013') {
                            this.notify('error', '', 'لا يمكنك اضافة هذا النوع من المستخدمين');
                            this.buttonLoading = false;
                        }
                        console.log(err.response);
                        this.buttonLoading = false;
                    });
                } else {
                    self.axios.post(`${APIS.API_URL}/account/registerAdmin`, registerdInfo , {
                        headers: {
                            Authorization: 'bearer ' + token
                        }
                    }).then((result) => {
                        this.getUsers();
                        this.notify('success', '','تم اضافة المستخدم بنجاح');
                        this.createUser = false;
                        this.buttonLoading = false;
                    }).catch((err) => {
                        if(err.response.data === '-20007') {
                            this.notify("error", '','رقم الهاتف موجود مسبقا');
                            this.buttonLoading = false;
                        } else if(err.response.status === '-20013') {
                            this.notify('error', '', 'لا يمكنك اضافة هذا النوع من المستخدمين');
                            this.buttonLoading = false;
                        }
                        console.log(err.response);
                        this.buttonLoading = false;
                    });
                }
            }
        },

        // update user by id
        update(formdata, id) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            let updatedUser = {
                id: id,
                username: formdata.username,
                mobileNumber: formdata.mobileNumber,
                district: formdata.district,
                government: formdata.editAccountGover,
                isActive: this.isUserActive == true ? 1 : 0
            };
            this.buttonLoading = true;
            if(this.isEmpty(formdata.username)) {
                this.notify('error', '','لا يمكن ترك اسم المستخدم فارغ');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.mobileNumber)) {
                this.notify('error', '' , 'لا يمكن ترك رقم الهاتف فارغ');
                this.buttonLoading = false;
            } else if(this.isNumberValid(formdata.mobileNumber) == false) {
                this.notify('error', '','الرقم غير صحيح يجب ان يكون مسبوق بــ +964');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.district)) {
                this.notify('error', '' , 'يرجا كتابة اسم المنطقة');
                this.buttonLoading = false;
            } else if(this.isEmpty(formdata.editAccountGover)) {
                this.notify('error', '' , 'يرجا اختيار المحافظة');
                this.buttonLoading = false;
            } else {
                self.axios.put(`${APIS.API_URL}/users/updateUserInfo`, updatedUser, {
                    headers: {
                        Authorization: 'bearer ' + token
                    }
                }).then((result) => {
                    this.notify('success', '', 'تم تعديل المستخدم بنجاح');
                    this.getUsers();
                    this.editModal = false;
                    this.buttonLoading = false;
                }).catch((e) => {
                    this.notify('error', '', 'حدث خطأ في تعديل البيانات');
                    this.buttonLoading = false;
                    console.error(e);
                })
            }
        },

        // delete user by id
        remove(id, index) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.$confirm('هل انت متاكد من حذف هذا المستخدم', 'Warning',{
                type: 'warning'
            }).then(() => {
                self.axios.delete(`${APIS.API_URL}/users/deleteUser?id=${id}`, {
                    headers: {
                        Authorization: 'bearer ' + token
                    }
                }).then((result) => {
                    this.tableData.splice(index, 1);
                    this.notify('success', '','تم حذف المستخدم بنجاح ');
                }).catch((e) => {
                    console.log(e.response);
                });
            }).catch(() => {
                console.log(false);
            });
        },

        // change user privilege
        changePrivilege(id) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            let obj = {
                id: id,
                isPrvdRole: this.isVendorChecked == true ? 1 : 0,
                isAdmnRole: this.isAdminChecked == true ? 1 : 0,
                isSupAdmnRole: this.isSuperAdminChecked == true ? 1 : 0
            };
            this.buttonLoading = true;

            self.axios.put(`${APIS.API_URL}/users/privilege`, obj ,{
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                this.notify('success', '','تم تعديل المستخدم بنجاح ');
                this.getUsers();
                this.buttonLoading = false;
                this.updatePrivilegeModal = false;
                console.log(result);
            }).catch((e) => {
                this.notify('error', '', 'حدث خطأ في تعديل البيانات');
                this.buttonLoading = false;
                this.updatePrivilegeModal = false;
                console.error(e.response);
            });
        }
    },
}
</script>

<style lang="scss">
    .el-button+.el-button {
        margin-left: unset !important;
        margin-right: 15px;
    }

    .el-checkbox.is-bordered+.el-checkbox.is-bordered {
        margin-left: 0px !important;
        margin-right: 0px !important;
    }

    .el-checkbox.is-bordered {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .custom-button-row {
        .el-button {
            padding: 10px !important;
        }
    }

    .el-row {
        .el-button + .el-button {
            margin-left: unset !important;
            margin-right: 4px;
        }
    }

    .roles-array {
        span {
            font-size: 12px;
            font-weight: bold;

            &:not(:last-child) {
                margin-right: 5px;

                &:after {
                    content: ","
                }
            }
        }
    }
</style>