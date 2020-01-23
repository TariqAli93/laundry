<template>
  <div class="login-form">
    <el-form :model="loginForm" label-position="top" @submit.prevent="login()">
        <el-form-item label="رقم الهاتف">
            <el-input placeholder="رقم الهاتف" v-model="loginForm.mobile">
                <i class="el-icon-user-solid" slot="prefix"></i>
            </el-input>
        </el-form-item>

        <el-form-item label="كلمة المرور">
            <el-input placeholder="كلمة المرور" v-model="loginForm.password" show-password>
                <i class="el-icon-lock" slot="prefix"></i>        
            </el-input>
        </el-form-item>

        <el-button type="primary" native-type="submit" icon="el-icon-right" @click.prevent="login()" :loading="loginButtonLoading">تسجيل الدخول</el-button>
    </el-form>
  </div>
</template>

<script>
import BASE_URL from '../baseUrl';
export default {
    name: 'LoginComponent',
    data() {
        return {
            loginForm: {
                mobile: '',
                password: '',
            },
            loginButtonLoading: false,
            pageLoader: '',
        }
    },
    created() {
        if(localStorage.getItem('loggedInUser') !== null) {
            this.changePage('/', 'home');
        } else {
            return false;
        }
    },
    mounted() {},
    methods: {
        // check if number have +964
        isNumberValid(number) {
            let regEx = new RegExp("^([\+][0-9]{1,4}[0-9]{1,14})([x]?[0-9]{1,4}?)$");
            if(regEx.test(number)) {
                return true;
            }
            return false;
        },

        // check if empty inputs
        isEmpty(input) {
            if(input == '' || input == null || input == undefined) {
                return true
            }

            return false;
        },

        // check if have access role
        isHaveAccess(roles) {
            var accessed = false;
            roles.filter(role => {
                accessed = role.includes('SuperAdmin');
            });

            return accessed;
        },

        // save user in localStorage
        saveUser(object) {
            let user = JSON.stringify(object);
            localStorage.setItem('loggedInUser', user);
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

        // confirm box
        async confirm(type, title = null, message) {
            let states = '';
            await this.$confirm(message, title, { type: type })
            .then((state) => {
                states = state
            }).catch((e) => {
                states = e;
            });

            return states === 'confirm' ? true : false;
        },

        // decode jwt
        decode(token) {
            var base64Url = token.split(".")[1];
            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                .split("")
                .map(function(c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );
            return JSON.parse(jsonPayload);
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

        // navigate to anthor page
        changePage(router, name) {
            if(this.$router.currentRoute.path === router) {
                return false;
            }
            this.$router.push({name: name});
        },
        
        // login proccess
        async login() {
            let self = this;
            let user = {
                mobileNumber: this.loginForm.mobile,
                password: this.loginForm.password
            };
            this.loginButtonLoading = true;
            this.startPageLoading('جاري معالجة البيانات','rgba(0,0,0,0.20)');

            if(this.isEmpty(user.mobileNumber)) {
                this.notify('warning','', 'لا يمكن ترك رقم الهاتف فارغ');
                this.loginButtonLoading = false;
                this.endPageLoading();
            } else if(this.isEmpty(user.password)) {
                this.notify('warning','', 'لا يمكن ترك كلمة المرور فارغة');
                this.loginButtonLoading = false;
                this.endPageLoading();
            } else if(!this.isNumberValid(user.mobileNumber) ) {
                this.notify('warning','رقم الهاتف غير صحيح', 'يجب ان يكون رقم الهاتف مسبوق بـ +964', 3500);
                this.loginButtonLoading = false;
                this.endPageLoading();
            } else {
                await self.axios.post(`${BASE_URL.API_URL}/account/loginAdmin`, user, { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}})
                .then((result) => {
                    let userInfo = this.decode(result.data.jwt);
                    let username = userInfo.username;
                    this.notify('success', 'تم تسجيل الدخول', 'مرحبا بك ' + username, 3500);
                    this.loginButtonLoading = false;
                    this.endPageLoading();
                    let storedObject = {
                        id: userInfo.id,
                        mobile: userInfo.mobileNo,
                        username: userInfo.username,
                        roles: userInfo.role,
                        token: result.data.jwt
                    };
                    this.saveUser(storedObject);
                    this.changePage('/', 'home');
                }).catch(e => {
                    this.notify('error', '', 'حدث خطاء في تسجيل الدخول');
                    this.loginButtonLoading = false;
                    this.endPageLoading();
                    console.error(e.response)
                });
            }
        }
    }
}
</script>

<style lang="scss">
    .login-form {
        background: white;
        max-width: 100%;
        display: block;
        border-radius: 15px;
    }
</style>