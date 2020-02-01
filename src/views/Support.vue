<template>
  <div>
      <h1>رسائل الدعم الفني</h1>

      <el-divider></el-divider>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" v-for="m in messages" :key="m.id" style="margin-bottom: 20px">
            <el-card shadow="hover">
                <div class="card-content">
                    <p>{{ subStr(m.message) }}</p>
                </div>
                <el-divider></el-divider>
                <div class="card-footer">
                    <el-button-group style="display: flex; align-items: center; justify-content: center; flex-direction: row-reverse;">
                        <el-button type="info" icon="el-icon-tickets" @click="content = m.message; messageModal = true;"> عرض الرسالة</el-button>
                        <el-button type="primary" icon="el-icon-info" @click="username = m.user.username; userMobile = m.user.mobileNumber; infoModal = true;">المعلومات</el-button>
                    </el-button-group>
                </div>
            </el-card>
        </el-col>
    </el-row>

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

    <el-dialog title="عرض الرسالة" :visible.sync="messageModal">
        <div class="message-content">
            <p>{{ content }}</p>
        </div>
    </el-dialog>
    
    <el-dialog title="عرض المعلومات" :visible.sync="infoModal">
        <div class="info-content">
            <h1 style="display: block; text-align: center; font-size: 45px; margin: 0 auto; color: #3e6ec5; font-weight: bolder">الاسم : {{ username }}</h1>
        </div>
        <el-divider></el-divider>
        <div class="info-footer">
            <h3 style="display: block; text-align: center; font-size: 35px; margin: 0 auto; color: #3e6ec5; font-weight: bolder">رقم الهاتف : <a :href="'tel: ' + userMobile" style="text-decoration: none;">{{ userMobile }}</a></h3>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import APIS from '../baseUrl';
import moment from 'moment';

export default {
    data() {
        return {
            messages: [],
            content: '',
            messageModal: false,
            infoModal: false,
            username: '',
            userMobile: '',
            pagination: {
                total: 100,
                page_size: 6,
                current_page: 1,
                next_text: 'التالي',
                prev_text: 'السابق',
                start: 1,
                end: 100,
                data: [],
            },
        }
    },
    mounted() {
        this.getMessages();
        this.startPageLoading();
    },

    methods: {
        // format date
      formatDate(date) {
          return moment(date).format('YYYY-MM-DD');
      },

      subStr(str) {
          return str.substring(0, 20) + ' ...'
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

        trimed_data(data) {
            this.pagination.start = (this.pagination.current_page - 1) * this.pagination.page_size;
            this.pagination.end = this.pagination.start + this.pagination.page_size;
            this.pagination.data = data.reverse().slice(this.pagination.start, this.pagination.end) || [];

            return this.pagination.data;
        },

        getMessages() {
            let self = this;
            let info = JSON.parse(localStorage.getItem('loggedInUser'));
            let token = info.token;
            self.startPageLoading();
            self.axios.get(`${APIS.API_URL}/support/getSupportRequests`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            }).then((result) => {
                this.pagination.total = result.data.length;
                this.messages = this.trimed_data(result.data.reverse());
                this.endPageLoading();
            }).catch((err) => {
                console.error(err.response);
            });
        },

        paginationCurrentChange(e) {
            this.pagination.current_page = e;
            this.getMessages();
        },
    },
}
</script>

<style>
</style>