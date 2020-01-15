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
            <i class="el-icon-user-solid"></i>
            <span slot="title">المستخدمين</span>
          </el-menu-item>

          <el-menu-item route="/categories" index="3">
            <i class="el-icon-collection"></i>
            <span slot="title">التصنيفات</span>
          </el-menu-item>

          <el-menu-item index="4">
            <i class="el-icon-s-goods"></i>
            <span slot="title">المواد</span>
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
              <template slot="title"><i class="el-icon-user"></i></template>
              <el-menu-item @click="logout()" index="1-1">
                تسجيل الخروج
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-header>

        <el-main :class="{'padding-custom': mainElementClass}">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      isCollapsedMenu: true,
      beforeCreate: '',
      beforeUpdate: '',
      mainElementClass: false,
      activeIndex: null,
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
    // this.fetchIng();
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
      // this.$router.push({name: 'LoginPage'});
      localStorage.removeItem('loggedInUser');
      this.isLoggedIn = false;
    },

    // toggle collapse menu
    toggleCollapse() {
      if(this.isCollapsedMenu == true) {
        this.isCollapsedMenu = false;
      } else {
        this.isCollapsedMenu = true;
      }
    },

    // fetching data and notify
    fetchIng() {
      setInterval(() => {
        this.$notify({
          title: 'done',
          message: 'done done',
          type: 'success'
        });
      }, 2000);
    }
  },
}
</script>

<style lang="scss">
  #mainApp {
    min-height: 100vh;

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
        }
        .el-menu-item {
          border-right: 3px solid transparent;

          &.is-active {
            background-color: rgb(14, 97,117) !important;
            border-right-color: white;
          }
          i {
            color: white;
          }
        }
      }

      .header {
        background: white;
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
            background: black;
            height: 3px;
            border-radius: 10px;
            

            &:not(:last-child) {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
</style>