/* 
1 页面被打开的时候 onShow
  0 onShow 不同于onLoad 无法在形参上接收 option 参数
  0.5 判断缓存中有没有token
    1 没有 直接跳转到授权页面
    2 有 直接往下进行
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据
*/
// pages/order/index.js
import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // orders: [
    //   {
    //     order_id: 1104,
    //     order_number: "HMDD20190812000000001104",
    //     order_price: 13618,
    //     create_time: 1565616985,
    //   },
    //   {
    //     order_id: 1105,
    //     order_number: "HMDD20190812000000001105",
    //     order_price: 13619,
    //     create_time: 1565348879,
    //   },
    //   {
    //     order_id: 1106,
    //     order_number: "HMDD20190812000000001106",
    //     order_price: 13620,
    //     create_time: 1565347865,
    //   },
    //   {
    //     order_id: 1107,
    //     order_number: "HMDD20190812000000001107",
    //     order_price: 13621,
    //     create_time: 1565347820,
    //   },
    //   {
    //     order_id: 1108,
    //     order_number: "HMDD20190812000000001108",
    //     order_price: 13622,
    //     create_time: 1565347381,
    //   },
    // ],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待付款",
        isActive: false,
      },
      {
        id: 2,
        value: "待发货",
        isActive: false,
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false,
      },
    ],
    orderList:[]
  },
  onShow(option) {
    // const token = wx.getStorageSync("token");
    // if (!token) {
    //   wx.navigateTo({
    //     url: "/pages/auth/index",
    //   });
    //   return;
    // }

    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    console.log(pages);

    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    console.log(currentPage);

    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // 4 激活选中页面标题 当 type=1 index=0
    this.changeTitleByIndex(type - 1);
    this.getOrder(type);
  },
  //获取订单列表的方法
  // async getOrders(type) {
  //   const res = await request({ url: "/my/orders/all", data: { type } });
  //   this.setData({
  //     orders: res.orders,
  //   });
  // },
  async getOrder(type) {
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    const num = parseInt(type)
    const res = await request({
      url: "/my/orders/all",
      header: { Authorization: token },
      data: { type: num }
    })
    console.log(res);
    this.setData({
      orderList: res.orders.map(item=>{
        return {...item,create_time:new Date(item.create_time*1000).toLocaleString().replace(/\//g,"-")}
      })
    })
  },

  // 根据标题索引来激活选中  标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3 赋值到data中
    this.setData({
      tabs,
      // orders: this.data.orders.map((v) => ({
      //   ...v,
      //   create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
      // })),
    });
  },

  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    //2 重新发送请求 type=1 index=0
    this.getOrder(index + 1);
    this.setData({
      currentIndex:index
    })
  },
});
