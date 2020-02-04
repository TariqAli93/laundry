<template>
  <div>
      <!-- create new user -->
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
                                    <el-option v-for="option in createForm.urlOption" :key="option.value" :label="option.label" :value="option.value" v-if="loggedInUserInfo().includes(option.role)"></el-option>
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

    <!-- edit privilege -->
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

    <!-- update user -->
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

    <!-- add categories -->
    <div>
        <el-dialog title="اضافة تصنيفات" :visible.sync="categoiresModal" @close="selectedUser = '';categoriesSelect = []">
            <el-row style="width: 100%">
                <label>اختر التصنيف</label>
                <el-col :span="24">
                    <el-select
                        style="width: 100%"
                        v-model="categoriesSelect"
                        @change="getCategoriesArray"
                        multiple
                        placeholder="قم بأختيار التصنيف">
                        <el-option
                        v-for="category in categories"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-button type="primary" style="margin-top: 30px;" @click="saveUserCatefories();" icon="el-icon-plus">حفظ التعديلات</el-button>
        </el-dialog>
    </div>

    <!-- add item to category -->
    <el-dialog title="ربط المادة بالتصنيف" :visible.sync="itemsModal">
        <el-form :model="addItemTocategory" label-position="top" style="width: 100%">
            <el-form-item label="اختر التصنيف" style="width: 100%">
                <el-select style="width: 100%" v-model="addItemTocategory.categoryId" placeholder="قم باختيار التصنيف">
                    <el-option
                    v-for="category in addItemTocategory.categories"
                    :key="category.id"
                    :label="category.category.name"
                    :value="category.categoryId">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="اختر المادة" style="width: 100%">
                <el-select style="width: 100%" v-model="addItemTocategory.itemId" placeholder="قم باختيار المادة">
                    <el-option
                    v-for="item in addItemTocategory.items"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="السعر" style="width: 100%">
                <el-input v-model="addItemTocategory.price" placeholder="سعر المادة"></el-input>
            </el-form-item>

            <el-button @click="addItemCategory()" type="primary" icon="el-icon-plus">حفظ المادة</el-button>
        </el-form>
    </el-dialog>


    <el-dialog title="اضافة محل" :visible.sync="addVendorModal">
        <el-form :model="addVendor" label-position="top">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="رقم الهاتف">
                        <el-input v-model="addVendor.mobileNumber" placeholder="رقم الهاتف" tabindex="2"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="اسم المحل">
                        <el-input v-model="addVendor.name" placeholder="اسم المحل" tabindex="1"></el-input>
                    </el-form-item>
                </el-col>
                
                <el-col :span="12">
                    <el-form-item label="المنطقة">
                        <el-input v-model="addVendor.district" placeholder="المنطقة" tabindex="4"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="المحافظة">
                        <el-select v-model="addVendor.government" placeholder="يرجا اختيار المحافظة" tabindex="3">
                            <el-option v-for="gove in governorate" :key="gove.id" :value="gove.name" :label="gove.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="الاستلام من المنزل">
                        <el-select v-model="addVendor.homeRecieve" placeholder="الاستلام من المنزل" style="width: 100%" tabindex="5">
                            <el-option value="1" label="تفعيل"></el-option>
                            <el-option value="0" label="الغاء تفعيل"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-button style="margin-top: 30px" type="primary" icon="el-icon-plus" :loading="buttonLoading" @click="doAddVendor();" tabindex="6"> حفظ المحل</el-button>
        </el-form>
    </el-dialog>

    <el-dialog title="استرجاع كلمة المرور" :visible.sync="resetUserPasswordModel">
        <el-form :model="resetUserPasswordForm" label-position="top">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="كلمة المرور">
                        <el-input v-model="resetUserPasswordForm.new" type="password" show-password></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button type="primary" @click="resetPassword(resetUserPasswordForm)" icon="el-icon-edit">استرجاع</el-button>
        </el-form>
    </el-dialog>

    <!-- add user button and search -->
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

    <!-- user table -->
    <table class="el-table el-table__body" style="table-layout: auto; width: 100%">
        <thead>
            <tr>
                <th scope="row">#</th>
                <th>اسم المستخدم</th>
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
                <td>{{data.id}}</td>
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
                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin')" placement="bottom" content="تعديل" effect="light" :visible-arrow="false">
                            <el-button type="primary" @click="editModal = true; getUserInfo(data); userId = data.id" icon="el-icon-edit"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin') || loggedInUserInfo().includes('Admin')" placement="bottom" content="اضافة / عرض التصنيف" effect="light" :visible-arrow="false">
                            <el-button v-if="data.rolesString.includes(3)" type="info" icon="el-icon-collection-tag" @click="selectedUser = data.id; checkCategories(data.id)"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin') || loggedInUserInfo().includes('Admin')" placement="bottom" content="استرجاع كلمة المرور" effect="light" :visible-arrow="false">
                            <el-button type="warning" icon="el-icon-lock" @click="selectedUser = data.id; resetUserPasswordModel = true"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin') || loggedInUserInfo().includes('Admin')" placement="bottom" content="اضافة المواد" effect="light" :visible-arrow="false">
                            <el-button @click="itemsModal = true; addItemTocategory.userId = data.id; getUserCategories(data.id);" v-if="data.rolesString.includes(3)" type="success" icon="el-icon-goods"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin')" placement="bottom" content="تعديل الصلاحيات" effect="light" :visible-arrow="false">
                            <el-button @click="updatePrivilegeModal = true; userId = data.id; getRoleById(data.userRole)" type="info" icon="el-icon-set-up"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin') || loggedInUserInfo().includes('Admin')" placement="bottom" content="اضافة / تعديل المحل" effect="light" :visible-arrow="false">
                            <el-button v-if="data.rolesString.includes(3)" type="primary" @click="selectedUser = data.id; checkVendor(data.id);" icon="el-icon-s-shop"></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="loggedInUserInfo().includes('SuperAdmin')" placement="bottom" content="حذف" effect="light" :visible-arrow="false">
                            <el-button type="danger" @click="remove(data.id, index)" icon="el-icon-delete"></el-button>
                        </el-tooltip>
                    </el-row>
                </td>
            </tr>
        </tbody>
    </table>

    <el-pagination 
    style="padding-top: 30px; display: flex; align-items: center; justify-content: center;" 
    background 
    layout='prev, pager, next, jumper, ->, total' 
    :total="pagination.total" 
    :page-size="pagination.page_size" 
    :pager-count="5"
    :current-page="pagination.current_page" 
    :next-text="pagination.next_text" 
    :prev-text="pagination.prev_text"
    @current-change="paginationCurrentChange($event)">
    </el-pagination>
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
        resetUserPasswordModel: false,
        resetUserPasswordForm: {
            new: ''
        },
        pagination: {
            total: 100,
            page_size: 5,
            current_page: 1,
            next_text: 'التالي',
            prev_text: 'السابق',
            start: 1,
            end: 100,
            data: [],
        },
        search: '',
        isUserActive: false,
        editModal: false,
        createUser: false,
        userId: '',
        isSuperAdminChecked: false,
        isAdminChecked: false,
        isVendorChecked: false,
        updatePrivilegeModal: false,
        buttonLoading: false,
        categories: [],
        categoriesSelect: [],
        loggedInRoles: '',
        addItemTocategory: {
            items: '',
            itemId: [],
            categories: [],
            categoryId: '',
            price: '',
            userId: ''
        },
        itemsModal: false,
        selectedItems: '',
        selectedCategories: [],
        selectedUser: '',
        categoiresModal: false,
        isUserHavCategories: 88,
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
                    label: 'SuperAdmin',
                    role: 'SuperAdmin'
                },
                {
                    value: '2',
                    label: 'Admin',
                    role: 'SuperAdmin'
                },
                {
                    value: '3',
                    label: 'Vendor',
                    role: 'Admin'
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
        addVendorModal: false,
        addVendor: {
            name: '',
            mobileNumber: '',
            government: '',
            district: '',
            homeRecieve: '',
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
      }
    },
    mounted() {
        this.getUsers();
        this.getAllCategories();
        this.getAllitems();
    },
    computed: {
        filteredUsers: function() {
            return this.tableData.filter((user) => {
                return user.mobileNumber.toLowerCase().match(this.search.toLowerCase()) || 
                user.username.toLowerCase().match(this.search.toLowerCase()) || 
                user.government.toLowerCase().match(this.search.toLowerCase()) || 
                user.district.toLowerCase().match(this.search.toLowerCase());
            });
        },
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

        resetPassword(form) {
            let password = {
                new: form.new
            };
            let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let uID = userInfo.id;

            if(password.new === '' || password.new.length < 1 || password.new === undefined || password.new === null) {
            this.notify('error', '','لا يمكن ان تكون كلمة المرور الجديدة فارغة', 4000);
            } else {
            this.axios.put(`${APIS.API_URL}/users/resetPassword`, {
                id: this.selectedUser,
                password: password.new,
            },{
                headers: {
                    Authorization: 'bearer ' + userInfo.token,
                    "Content-Type": "application/json"
                }
                }).then(response => {
                    this.notify('success','','تم تحديث كلمة المرور بنجاح');
                    this.getUsers();
                    this.resetUserPasswordModel = false;
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
                });
            }
        },

        // get user info for update modal
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
                    district: result.data.district,
                    government: result.data.government
                };

                this.editForm = {
                    username: this.updateUserInfo.username,
                    mobileNumber: this.updateUserInfo.mobileNumber,
                    editAccountGover: this.updateUserInfo.government,
                    district: this.updateUserInfo.district
                };
                this.isUserActive = result.data.isActive === 1 ? true : false;
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
        trimed_data(data) {
            this.pagination.start = (this.pagination.current_page - 1) * this.pagination.page_size;
            this.pagination.end = this.pagination.start + this.pagination.page_size;
            this.pagination.data = data.reverse().slice(this.pagination.start, this.pagination.end) || [];

            return this.pagination.data;
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
                this.pagination.total = result.data.length;
                this.tableData = this.trimed_data(result.data);
                this.endPageLoading();
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
                
                this.endPageLoading();
            });
        },

        paginationCurrentChange(e) {
            this.pagination.current_page = e;
            this.getUsers();
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
                        } else if(err.response.status === 400) {
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
                        // this.createUser = false;
                        this.buttonLoading = false;
                    }).catch((err) => {
                        if(err.response.data === '-20007') {
                            this.notify("error", '','رقم الهاتف موجود مسبقا');
                            this.buttonLoading = false;
                        } else if(err.response.status === '-20013') {
                            this.notify('error', '', 'لا يمكنك اضافة هذا النوع من المستخدمين');
                            this.buttonLoading = false;
                        } else if(err.response.status === 400) {
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
                    this.buttonLoading = false;
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
                    this.getUsers();
                    this.notify('success', '','تم حذف المستخدم بنجاح ');
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
            }).catch(() => {
                this.notify('error','','تم الغاء الاجراء');
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
            }).catch((err) => {
                this.buttonLoading = false;
                this.updatePrivilegeModal = false;
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
                this.categories = result.data;
                this.endPageLoading();
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
                this.endPageLoading();
            });
        },
        // get selected category
        getCategoriesArray(e) {
            this.selectedCategories = e;
        },

        getUserCategories(id) {
            let self = this,
                jsonInfo = JSON.parse(localStorage.getItem('loggedInUser')),
                token = jsonInfo.token;
            
            self.axios.get(`${APIS.API_URL}/category/getUserCategories?userId=${id}`, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((response) => {
                this.addItemTocategory.categories = response.data;
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
            });
        },

        // save the categories to selected user
        saveUserCatefories() {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            let object = {};
            if(this.isEmpty(this.categoriesSelect) || this.isEmpty(this.selectedUser)) {
                self.notify('error','','يرجا اختيار التصنيفات و المستخدم');
            } else {
                object = {
                    userId: this.selectedUser,
                    categories: this.selectedCategories 
                }

                self.axios.post(`${APIS.API_URL}/category/addUserCategories`, object, {
                    headers: {
                        Authorization: 'bearer ' + token
                    }
                }).then((result) => {
                    this.categoiresModal = false;
                    this.notify('success', '','تم اضافة التصنيفات بنجاح');
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
                    this.notify("error", e.response.status, e.response.statusText);
                });
            }
        },

        // check user categories
        checkCategories(id) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.startPageLoading();

            self.axios.get(`${APIS.API_URL}/category/getUserCategories?userId=${id}`, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then(response => {
                if(response.data.length > 0) {
                    this.categoiresModal = false;
                    this.endPageLoading();
                    this.$router.push({path: `user/categories/${this.selectedUser}`, params: this.selectedUser});
                } else {
                    this.endPageLoading();
                    this.categoiresModal = true;
                }
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
            });
        },

        getAllitems() {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;

            self.axios.get(`${APIS.API_URL}/items/getItems`, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then(response => {
                this.addItemTocategory.items = response.data;
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
            });
        },

        addItemCategory() {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            let obj = {
                userId: this.addItemTocategory.userId,
                categoryId: this.addItemTocategory.categoryId,
                itemId: this.addItemTocategory.itemId,
                price: this.addItemTocategory.price
            }

            self.axios.post(`${APIS.API_URL}/items/addUserItems`, obj, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then(response => {
                this.itemsModal = false;
                this.notify('success', '','تم اضافة المادة بنجاح');
            }).catch(err => {
                if(e.response.data === '-20012') {
                    this.notify("error", e.response.status, 'هذه المادة تم اضافتها مسبقا');
                } else if(err.response.status === 400) {
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

        checkVendor(id) {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            this.startPageLoading();

            self.axios.get(`${APIS.API_URL}/vendor/getVendorByUserId?userId=${id}`, {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then(response => {
                if(response.data) {
                    this.addVendorModal = false;
                    this.endPageLoading();
                    this.$router.push({path: `user/vendor/${this.selectedUser}`, params: this.selectedUser});
                } else {
                    this.endPageLoading();
                    this.addVendorModal = true;
                }
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
            });
        },

        doAddVendor() {
            let self = this;
            let jsonInfo = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = jsonInfo.token;
            let object = {
                userId: self.selectedUser,
                name: self.addVendor.name,
                mobileNumber: self.addVendor.mobileNumber,
                government: self.addVendor.government,
                district: self.addVendor.district,
                homeRecieve: Number(self.addVendor.homeRecieve)
            };

            self.buttonLoading = true;

            if(this.isEmpty(self.addVendor.name)) {
                this.notify('error', '','لا يمكن ترك الاسم فارغ');
                this.buttonLoading = false;
            } else if(this.isEmpty(self.addVendor.mobileNumber)) {
                this.notify('error', '' , 'لا يمكن ترك رقم الهاتف فارغ');
                this.buttonLoading = false;
            } else if(this.isNumberValid(self.addVendor.mobileNumber) == false) {
                this.notify('error', '','الرقم غير صحيح يجب ان يكون مسبوق بــ +964');
                this.buttonLoading = false;
            } else if(this.isEmpty(self.addVendor.district)) {
                this.notify('error', '' , 'يرجا كتابة اسم المنطقة');
                this.buttonLoading = false;
            } else if(this.isEmpty(self.addVendor.government)) {
                this.notify('error', '' , 'يرجا اختيار المحافظة');
                this.buttonLoading = false;
            } else {
                self.axios.post(`${APIS.API_URL}/vendor/addVendor`, object , {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                }).then(response => {
                    self.notify('success', '','تم اضافة المحل بنجاح');
                    self.addVendorModal = false;
                    self.getUsers();
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
                });
            }
        },

        loggedInUserInfo: () => {
            let info = JSON.parse(localStorage.getItem('loggedInUser')),
                roles = info.roles.join(",");
            return roles;
        },
    }
}
</script>

<style lang="scss">
    .el-select .el-tag__close.el-icon-close {
        right: 5px !important;
    }
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