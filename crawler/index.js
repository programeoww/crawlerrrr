import * as cheerio from 'cheerio'
import requestPromise from 'request-promise'


const defaultSetting = {
  url: "https://zendatees.com/shop/",//product list url
  origin: "https://zendatees.com/",//target domain
  category: "Uncategorized",
  product_list_container_selector: ".products > .col",
  pagination_container_selector: ".nav-pagination a:not(:last-child)",
  //product detail site
  product_name_selector: ".product-main .product-title",
  product_short_description_selector: ".product-main .product-title",
  product_description_selector: ".woocommerce-Tabs-panel--description",
  product_image_selector: ".woocommerce-product-gallery__image img",
  serverSuck: false
}

const Crawler = (setting = {...setting, serverSuck: false}) => {
  const csvData = []
  const errorProduct = []

  const imgGetter = (element) => {
    const imgAttr = () => {
      if (element.attr('data-src')) {
        return 'data-src'
      } else {
        return 'src'
      }
    }


    if (element.attr(imgAttr()).includes(setting.origin) || element.attr(imgAttr()).includes('http')) {
      return element.attr(imgAttr())
    } else {
      return setting.origin + element.attr(imgAttr())
    }
  }
  
  const RemoveSpace = (string) => {
    //Đoạn này nó đang lỗi anh này
    return string.replace(/\"/gm, "'").replace(/\>(\s\s+)</gm, '').replace(/\n/gm, '').replace(/src="image/gm, 'data-src="image').replace(/data-src="http/gm,'src="http').trim()
  }

  const getProduct = (productLink, previewImg) => {
    return new Promise((resolve,reject) => {
      const url = productLink.includes(setting.origin) ? productLink : (setting.origin + productLink)

      requestPromise({
        uri: url,
        headers: {
          'Connection': 'keep-alive'
        },
      }, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const document = cheerio.load(html);
          if(document(setting.product_name_selector).text() === ""){
            console.log(productLink)
            errorProduct.push(productLink)
          }
          // document(setting.product_price_selector).text()
          try {
            const data = {
              name: document(setting.product_name_selector).text(),
              type: "simple",
              regular_price: "50",
              description: setting.product_description_selector && document(setting.product_description_selector).html() ? RemoveSpace(document(setting.product_description_selector).html()) : null,
              short_description: setting.product_short_description_selector && document(setting.product_short_description_selector).html() ? RemoveSpace(document(setting.product_short_description_selector).html()) : null,
              images: [
                // {
                //   src: previewImg
                // }
              ]
            };

            if(document(setting.product_thumbnail_selector)){
              document(setting.product_thumbnail_selector).each((index, element) => {
                data.images.push({src: imgGetter(document(element).find('img'))})
              })
            }
            resolve(csvData.push(data))

          } catch (error) {
            console.log(`Failed to get data: ${error}`)
          }
        }
      }).catch(error => {
        console.log(`Failed to fetch: Target server down!\nRetrying in 20s...\n${error}`)
        setTimeout(() => {
          getProduct(productLink)
        }, 20000);
      })
    })
  }

  return new Promise((resolve, reject) => {

    const promises = []

    requestPromise(setting.url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const document = cheerio.load(html);

        const pages = [setting.url]

        console.log('fetching all products...')

        if (document(setting.pagination_container_selector).length > 0) {
          document(setting.pagination_container_selector).each((index, element) => {
              const pageLink = document(element).attr('href')
              const url = pageLink.includes(setting.origin) ? pageLink : (setting.origin + pageLink)
              pages.push(url)
          })
        }

        FetchPage(pages).then(()=> {
          Promise.all(promises).then(()=>{
            // if(errorProduct.length > 0){
            //   let counter = 0
            //   do{
            //     getProduct(errorProduct[counter]).then(()=>{
            //       console.log("a")
            //       counter+=1
            //     })
            //   }while(counter < errorProduct.length)
            // }
            resolve(csvData)
          })
        })
        async function FetchPage(pageArray) {
          for (let index = 0; index < pageArray.length; index++) {
            const url = pageArray[index];
            await requestPromise(url, (error, response, html) => {
              const document = cheerio.load(html);
  
              // for (let index = 0; index < document(setting.product_list_container_selector).length; index++) {
              //   const element = document(setting.product_list_container_selector)[index];
              //   const productLink = document(element).find('a').attr('href')                
              //   promises.push(getProduct(productLink,imgGetter(document(element).find('img'))))
              // }
              document(setting.product_list_container_selector).each((index, element) => {
                const productLink = document(element).find('a').attr('href')                
                promises.push(getProduct(productLink,imgGetter(document(element).find('img'))))
              })
            })
          }
        }
      }
    })
  })
}


export default Crawler
