<template>
  <div id="mainApp">
    <el-container>
      <el-aside v-if="isLoggedIn">
        <el-menu :collapse="isCollapsedMenu" :router="true" background-color="#117992" text-color="white" active-text-color="whitesmoke">
          <div class="sidemenu-header">
            <i class="el-icon-menu"></i>
            <span v-show="isCollapsedMenu == true ? false : true">اوتجي</span>
          </div>
          <el-menu-item route="/" index="1">
            <i class="el-icon-s-home"></i>
            <span slot="title">الرئيسية</span>
          </el-menu-item>

          <el-menu-item route="/users" index="2">
            <i class="el-icon-user"></i>
            <span slot="title">المستخدمين</span>
          </el-menu-item>

          <el-menu-item route="/categories" index="3">
            <i class="el-icon-collection"></i>
            <span slot="title">التصنيفات</span>
          </el-menu-item>

          <el-menu-item route="/items" index="4">
            <i class="el-icon-goods"></i>
            <span slot="title">المواد</span>
          </el-menu-item>

          <el-menu-item route="/support" index="5">
            <i class="el-icon-chat-line-square"></i>
            <span slot="title">الدعم الفني</span>
          </el-menu-item>
          
          <el-menu-item route="/reports" index="6">
            <i class="el-icon-document"></i>
            <span slot="title">التقارير</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="blocked-container">
        <el-header class="header" v-if="isLoggedIn">
          <el-button class="toggleMenu" :class="{'toggleMenu-rotate': isCollapsedMenu}" @click="toggleCollapse()">
            <span class="toggleMenu-line"></span>
            <span class="toggleMenu-line"></span>
            <span class="toggleMenu-line"></span>
          </el-button>

          <el-menu mode="horizontal">
             <el-submenu index="1">
              <template slot="title"><span>{{ username() }}</span> <i class="el-icon-user-solid"></i></template>
              <el-menu-item @click="logout()" index="1-1">
                تسجيل الخروج
              </el-menu-item>
              
              <el-menu-item @click="updateUserPasswordModel = true;" index="1-2">
                تعديل كلمة المرور
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-header>

        <el-main :class="{'padding-custom': mainElementClass}">
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="تعديل كلمة المرور" :visible.sync="updateUserPasswordModel">
        <el-form :model="updateUserPasswordForm" label-position="top">
            <el-row :gutter="30">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="كلمة المرور القديمة">
                        <el-input v-model="updateUserPasswordForm.old" type="password" show-password></el-input>
                    </el-form-item>
                </el-col>


                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="كلمة المرور الجديدة">
                        <el-input v-model="updateUserPasswordForm.new" type="password" show-password></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button type="primary"@click="updatePassword(updateUserPasswordForm)" icon="el-icon-edit">تعديل</el-button>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import APIS from './baseUrl';
export default {
  data() {
    return {
      isLoggedIn: false,
      isCollapsedMenu: true,
      beforeCreate: '',
      beforeUpdate: '',
      mainElementClass: false,
      activeIndex: null,
      updateUserPasswordModel: false,
      updateUserPasswordForm: {
          new: '',
          old: '',
      },
    }
  },

  created() {
    this.beforeCreate = setInterval(() => {
      if(localStorage.getItem('loggedInUser') !== null) {
        this.isLoggedIn = true;
        this.mainElementClass = true;
      }
    }, 300);
  },
  mounted() {
    this.beforeUpdate = setInterval(() => {
      this.loggedIn();
    }, 300);
    this.activeIndex = this.$route.path;
  },
  methods: {
    // check if login
    loggedIn() {
      let router = this.$router.currentRoute.path;
      let loggedInUser = localStorage.getItem('loggedInUser');
      

      if(router === '/login') {
        return false;
        this.mainElementClass = false;
      }

      else {
        if(loggedInUser !== null) {
          this.isLoggedIn = true;
          this.mainElementClass = true;
        }

        else {
          this.isLoggedIn = false;
          this.mainElementClass = false;
          this.$router.push({name: 'LoginPage'});
        }
      }
    },

    // logout
    logout() {
      this.$router.push({name: 'LoginPage'});
      localStorage.removeItem('loggedInUser');
      this.isLoggedIn = false;
      this.mainElementClass = false;
    },

    // toggle collapse menu
    toggleCollapse() {
      if(this.isCollapsedMenu == true) {
        this.isCollapsedMenu = false;
      } else {
        this.isCollapsedMenu = true;
      }
    },

    notify(type, title = null, message, duration = 1500) {
        this.$notify({
            title: title,
            message: message,
            type: type,
            duration: duration
        });
    },

    updatePassword(form) {
      let password = {
        old: form.old,
        new: form.new
      };
      let userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
      let uID = userInfo.id;

      if(password.new === '' || password.new.length < 1 || password.new === undefined || password.new === null) {
        this.notify('error', '','لا يمكن ان تكون كلمة المرور الجديدة فارغة', 4000);
      } else if(password.old === '' || password.old.length < 1 || password.old === undefined || password.old === null) {
        this.notify('error', '','يرجى كتابة كلمة المرور القديمة', 4000);
      } else if(password.new === password.old) {
        this.notify('error', '','كلمة المرور الجديدة مشابهة لكلمة المرور القديمة', 4000);
      } else {
        this.axios.put(`${APIS.API_URL}/users/changePassword`, {
          id: uID,
          password: password.old,
          newPassword: password.new
        }, {
          headers: {
              Authorization: 'bearer ' + userInfo.token,
              "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.notify('success','','تم تحديث كلمة المرور بنجاح');
          this.logout();
          this.updateUserPasswordModel = false;
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

    username: () => {
      let info = JSON.parse(localStorage.getItem('loggedInUser'));
      let name = info.username;
      return name;
    }
  },
}
</script>

<style lang="scss">
  .el-dialog {
    @media (max-width: 767px) {
      width: 80% !important;
    }
  }
  #mainApp {
    min-height: 100vh;

    .pagination-wrapper {
      padding: 10px;
      background: whitesmoke;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: max-content;
      margin: 0 auto;
      margin-top: 30px;
      border: 1px solid rgba(black, .20);
    }

    .el-table {
      border: none !important;
    }
    .el-table td,
    .el-table th,
    .el-table tr {
      text-align: right;
      background: transparent !important;
    }

    .el-table tr {
      border: none !important;
    }

    .el-table th {
      padding: 10px;
    }
    .el-table td {
      padding: 10px;
    }

    .el-table thead {
      background: whitesmoke;
      color: #106f86;
    }

    .el-dialog__headerbtn {
      right: unset !important;
      left: 20px !important;
    }

    .blocked-container {
      display: block;
    }

    .el-main {
      &.padding-custom {
          padding: 30px !important;
        }
    }

    

    .el-container {
      min-height: 100vh;
      height: 100%;

      .el-aside {
        width: fit-content !important;
        box-shadow: -2px 0px 10px 0 rgba(black , .20);

        .sidemenu-header {
            height: 60px;
            background: #106f86;
            box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 27px;
            color: white;

            i {
              margin-left: 10px;
              font-size: 33px;
            }
        }

        .el-menu {
            margin: 0;
            padding: 0;
            width: 220px;
            height: 100%;
        }

        .el-menu--collapse {
            margin: 0;
            padding: 0;
            width: 75px;
            height: 100%;

            .el-menu-item {
              span {
                visibility: hidden;
                opacity: 0;
                transition: all ease-in-out 400ms;
              }
            }
        }

        .el-menu-item {
          border-right: 3px solid transparent;
          transition: all ease-in-out 350ms;

          &.is-active {
            background-color: rgb(14, 97,117) !important;
            border-right-color: white;
          }

          i {
            color: white;
            margin-right: unset !important;
            margin-left: 10px;
          }

          span {
            visibility: visible;
            opacity: 1;
          }
        }
      }

      .header {
        background: #106F86;
        box-shadow: 0 2px 10px 0 rgba(black , .20);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .toggleMenu {
          background: transparent;
          display: block;
          padding: 10px;
          border: none;
          transform: rotate(-90deg);

          &-rotate {
            transform: rotate(0deg);
          }

          .toggleMenu-line {
            display: block;
            width: 30px;
            background: white;
            height: 3px;
            border-radius: 10px;
            

            &:not(:last-child) {
              margin-bottom: 5px;
            }
          }
        }

        .el-menu {
          background: transparent ;
          color: white;

          .el-submenu {
            .el-submenu__title {
                color: white;
                background: transparent;

                i {
                  color: white;
                }
            }
          }
        }
      }
    }
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected span {
    margin-right: 20px;
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
    right: 40px;
  }

  .el-select .el-tag {
    margin: 2px 6px 2px 6px !important;
  }
</style>