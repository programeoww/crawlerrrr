import { default as WCAPI} from '@woocommerce/woocommerce-rest-api';
import Crawler from './crawler/index.js';

const { default: WooCommerceRestApi } = WCAPI;

// const WooCommerce = new WooCommerceRestApi({
  //   url: "https://findmemedia.online/demo/nhathongminh/",
  //   consumerKey: "ck_51df61d9a79b50aefbdfd134cbb0fffe07679aca",
  //   consumerSecret: "cs_07d8a55b55bef6bc5321c0bd67546b34f0c808d1",
  //   version: "wc/v3",
  // });
  

  const WooCommerce = new WooCommerceRestApi({
    url: "http://127.1.1.22",
    consumerKey: "ck_fc4f0bfc4aa50c4b5f8c4c71de92bcf10928d090",
    consumerSecret: "cs_ac5462a431ffa286578a3de7be63f021e506ba01",
    version: "wc/v3",
  });
  
// * BUG PROTECTOR V1

// *                          _
// *                       _ooOoo_
// *                      o8888888o
// *                      88" . "88
// *                      (| -_- |)
// *                      O\  =  /O
// *                   ____/`---'\____
// *                 .'  \\|     |// *`.
// *                /  \\|||  :  |||// *\
// *               /  _||||| -:- |||||_  \
// *               |   | \\\  -  /'| |   |
// *               | \_|  `\`---'// *|_/ |
// *               \  .-\__ `-. -'__/-.  /
// *             ___`. .'  /--.--\  `. .'___
// *          ."" '<  `.___\_<|>_/___.' _> \"".
// *         | | :  `- \`. ;`. _/; .'/ /  .' ; |
// *         \  \ `-.   \_\_`. _.'_/_/  -' _.' /
// *===========`-.`___`-.__\ \___  /__.-'_.'_.-'================
// *                       `=--=-'               


// * thêm setting nếu trang web có structure khác

const defaultSetting = {
  url: "https://zendatees.com/shop/",//product list url
  origin: "https://zendatees.com/",//target domain
  // category: "Uncategorized",
  // product_list_container_selector: ".products > .col",
  // pagination_container_selector: ".nav-pagination li:not(:last-child) a",
  // //product detail site
  // product_name_selector: ".product-main .product-title",
  // product_short_description_selector: ".product-main .product-short-description",
  // product_description_selector: ".product-footer .product-page-accordian > div > div",
  // product_image_selector: ".woocommerce-product-gallery__image img",
  // product_thumbnail_selector: ".woocommerce-product-gallery__image",
  // product_price_selector: ".product-main .woocommerce-Price-amount",
  // serverSuck: true
}

Crawler(defaultSetting).then(data => {
  a()
  async function a() {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const res = await WooCommerce.post("products", element)
      console.log(res.statusText + index + 1)
    }
  }
  console.log(data.length)
})

// WooCommerce.get("products",{
//   per_page: 100
// })
//   .then((response) => {
//     const data = response.data
//     a()
//     async function a() {
//       for (let index = 0; index < data.length; index++) {
//         const element = data[index];
//         const res = await WooCommerce.delete("products/" + element.id, {force: true})
//         console.log(`Removed ${index}`)
//       }
//     }
//   })
//   .catch((error) => {
//     console.log(error.response.data);
//   });
