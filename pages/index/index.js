//Page Object
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航 数组
    catesList: [],
    //楼层数据
    floorList: [],
    product_list_url: [],
    query_url: [],
  },
  //页面开始加载 就会触发
  onLoad: function (options) {
    //1 发送异步请求获取轮播图数据
    // wx.request({
    //   url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message,
    //     });
    //   },
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList() {
    request({
      url: "/home/swiperdata",
    }).then((result) => {
      this.setData({
        swiperList: result,
      });
    });
  },
  //获取分类导航数据
  getCateList() {
    request({
      url: "/home/catitems",
    }).then((result) => {
      this.setData({
        catesList: result,
      });
    });
  },
  //获取 楼层数据
  // getFloorList() {
  //   request({
  //     url: "/home/floordata",
  //   }).then((result) => {
  //     // const { product_list_url, query_url } = this.data;
  //     // if (result.length != 0) {
  //     //   result.forEach((v, i) => {
  //     //     if (result.length - 1 >= i) {
  //     //       v.product_list.forEach((value, index) => {
  //     //         product_list_url.push(value.navigator_url);
  //     //       });
  //     //     }
  //     //   });
  //     // }
  //     // console.log(JSON.stringify(product_list_url));

  //     // JSON.stringify(product_list_url).forEach((v, i) => {
  //     //   console.log(v);

  //     //   query_url.push(v.split("?")[1]);
  //     // });

  //     this.setData({
  //       floorList: result,
  //     });
  //   });
  // },
  async getFloorList(){
    const floor = await request({
      url: '/home/floordata'
    })
    const new_floor=floor.map(item=>{
      return {...item,product_list:item.product_list.map(item1=>{
        return  {...item1,navigator_url:item1.navigator_url.replace('?','/index?')}
      })}
    })
    this.setData({
      floorList:new_floor
    })
  },
});
