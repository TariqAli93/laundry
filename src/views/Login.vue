<template>
  <div class="login-page">
      <div class="left-side">
          <LoginComponent />
      </div>

      <div class="right-side">
          <h1>لوحة تحكم</h1>
          <h5>نظام اوتجي</h5>
      </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent.vue';
export default {
    name: 'login',
    components: {
        LoginComponent
    }
}
</script>

<style lang="scss">
    @media screen and (min-width: 768px){
        .login-page {
            display: flex;
            flex-direction: row;
            justify-items: center;
            align-items: center;
            background: #117992;
            width: 100vw;
            height: 100vh;
            max-width: 100%;
            max-height: 100%;

            div {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                &.right-side {
                    width: calc(100% - 425px);

                    h1 {
                        font-size: 5em;
                        margin: 0;
                        padding: 0;
                        color: white;
                        display: block;
                        width: 100%;
                        text-align: center;
                    }

                    h5 {
                        font-size: 2em;
                        margin: 0;
                        padding: 0;
                        color: white;
                        display: block;
                        width: 100%;
                        text-align: center;
                    }
                }

                &.left-side {
                    width: 425px;
                    height: 95%;
                    margin-right: 15px;

                    .login-form {
                        height: 100%;
                        box-shadow: -2px 0px 10px 0 rgba(0, 0, 0, 0.07);

                        .el-form--label-top .el-form-item__label {
                            display: block;
                            text-align: right;
                            width: 100%;
                        }

                        .el-button {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 767px) {
        .login-page {
            display: flex;
            flex-direction: column-reverse;
            height: 100vh;
            align-items: center;
            justify-content: center;
            padding: 0px 30px;
            background: #117992;

            div {
                h1 {
                    font-size: 45px;
                    text-align: center;
                    color: white;
                    padding: 0;
                    margin: 0;
                }

                h5 {
                    font-size: 25px;
                    text-align: center;
                    color: white;
                    padding: 0;
                    margin: 0;
                    margin-bottom: 10px;
                }
                &.left-side {
                    width: 100%;

                    .login-form {
                        height: 100%;
                        padding: 20px;
                        box-shadow: -2px 0px 10px 0 rgba(0, 0, 0, 0.07);

                        .el-form--label-top .el-form-item__label {
                            display: block;
                            text-align: right;
                            width: 100%;
                        }

                        .el-button {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
</style>