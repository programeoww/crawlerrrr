import { default as WCAPI} from '@woocommerce/woocommerce-rest-api';
import Crawler from './crawler/index.js';

const { default: WooCommerceRestApi } = WCAPI;

const WooCommerce = new WooCommerceRestApi({
    url: "https://findmemedia.online/demo/nhathongminh/",
    consumerKey: "ck_51df61d9a79b50aefbdfd134cbb0fffe07679aca",
    consumerSecret: "cs_07d8a55b55bef6bc5321c0bd67546b34f0c808d1",
    version: "wc/v3",
  });
  
//   // WooCommerce.get("products/attributes")
//   //   .then((response) => {
//   //     console.log(response.data);
//   //   })
//   //   .catch((error) => {
//   //     console.log(error.response.data);
//   //   });
  
//   WooCommerce.get("products/categories")
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.log(error.response.data);
//     });

const defaultSetting = {
  url: "https://nangluongtlt.com/cua-hang/",//product list url
  origin: "https://nangluongtlt.com/",//target domain
  category: "Uncategorized",
  product_list_container_selector: ".products > .col",
  pagination_container_selector: ".nav-pagination li:not(:last-child) a",
  //product detail site
  product_name_selector: ".product-main .product-title",
  product_short_description_selector: ".product-main .product-short-description",
  product_description_selector: ".product-footer .product-page-accordian > div > div",
  product_image_selector: ".woocommerce-product-gallery__image img",
  product_thumbnail_selector: ".woocommerce-product-gallery__image",
  product_price_selector: ".product-main .woocommerce-Price-amount",
  serverSuck: true
}

Crawler(defaultSetting).then(data => {
  a()
  async function a() {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const res = await WooCommerce.post("products", element)
      console.log(res.statusText)
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
//         console.log(res.statusText)
//       }
//     }
//   })
//   .catch((error) => {
//     console.log(error.response.data);
//   });
