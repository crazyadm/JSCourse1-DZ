//описание класса товара 
class Tovar {
    name = ''
    kolvo= 1
    cost= 0
    imgsrc=''

    constructor (name,cost,imgsrc) {
        this.name = name
        this.cost = cost
        this.imgsrc = './img/'+imgsrc
        this.CreatTovarCart()
    }


//Метод создания карточки товара для верстки
    CreatTovarCart () {
        const { name, kolvo, cost,imgsrc} = this

        const block = document.createElement('div')
        block.classList.add('tovar')
    
        block.innerHTML = `
        <h3><span>${name}</span></h3>
        <img src="${imgsrc}" alt="" class="tovar-img">
        <p>Цена: <span>${cost}</span></p>
        `
        block.appendChild(this.getAddBtn()) // отдельно создание кнопки Купить в карточке товара
 
        return block
 
    }

    //Метод добавления в карточку товара  кнопки Купить
    getAddBtn () {
        const btn = document.createElement('button')
        btn.classList.add('btn')
        btn.innerText = 'Купить'

        //функция добавления товара в корзину
        btn.addEventListener('click', () => {
            const CartInstance = new Cart()
            CartInstance.add(this)
            console.log(CartInstance)
          })

        return btn
      }

      inc () {
        this.kolvo++
      }
    
      dec () {
        this.kolvo--
      }

      //метод формирования HTML для позиции в корзине
      CreateCartItem () {
        const { cost, name, kolvo } = this
    
        const block = document.createElement('div')
        block.classList.add('cart-item')
    
        block.innerHTML = `
           <p class="cart-item-name"> ${name}</p>
           <p class="cart-item-ccc">Цена: ${cost}</p> 
           <p class="cart-item-znak">X</p> 
           <p class="cart-item-ccc">Кол-во: ${kolvo}</p>
           <p class="cart-item-znak">=</p> 
           <p class="cart-item-ccc">Сумма: ${cost*kolvo}</p>
        `

          
        block.appendChild(this.getMinusBtn())
        block.appendChild(this.getPlusBtn())
        block.appendChild(this.getRemoveBtn())
          

          return block
      }

      getMinusBtn () {
        const btn = document.createElement('button')
        btn.classList.add('cart-btn-for-item')
        btn.innerText = '-'
    
        btn.addEventListener('click', () => {
          const CartInstance = new Cart()
          CartInstance.remove(this)
        })
    
        return btn
      }
      
      getPlusBtn () {
        const btn = document.createElement('button')
        btn.classList.add('cart-btn-for-item')
        btn.innerText = '+'
    
        btn.addEventListener('click', () => {
          const CartInstance = new Cart()
          CartInstance.add(this)
        })
    
        return btn
      }
      
      getRemoveBtn () {
        const btn = document.createElement('button')
        btn.classList.add('cart-btn-for-item')
        btn.innerText = 'X'
    
        btn.addEventListener('click', () => {
          const CartInstance = new Cart()
          CartInstance.delete(this)
        })
    
        return btn
      }

}

//Класс для инициализации перечня и в каталоге товаров и в корзине
class Catalog {
    items = []
  
    constructor (items = []) {
      this.items = items
    }
  
    findTovar (tovar) {
      return this.items.filter(item => item.name === tovar.name)[0]
    }
  
    add (item) {
      const exist = this.findTovar(item)
      if (exist) {
        exist.inc()
      } else {
        this.items.push(item)
      }
      this.render()
    }
  
    remove (item) {
      const exist = this.findTovar(item)
      if (exist.kolvo > 1) {
        exist.dec()
      } else {
        this.items = this.items.filter(tovar => item.name !== tovar.name)
      }
      this.render()
    }
     //добавлен метод для удаления позиции из корзины
    delete(item) {
         const exist = this.findTovar(item)
         exist.kolvo = 1
         this.items = this.items.filter(tovar => item.name !== tovar.name)
         this.render()
     }
  
    render () {
    }
  }

  //Класс товара для каталога
  class CatalogTov extends Catalog {
    constructor () {
      super()
    }
  
    render () {
      const placeToRender = document.querySelector('.tovar-list')
      placeToRender.innerHTML = ''
  
      if (placeToRender) {
        this.items.forEach(tovar => {
          const block = tovar.CreatTovarCart()
          placeToRender.appendChild(block)
        })
      }
    }
  }

  //Класс для товара в корзине

  class Cart extends Catalog{
    constructor () {
        if (Cart._instance) {
          return Cart._instance
        }
        super()
        this.init()
        Cart._instance = this
      }
      // Инициализация и формирование HTML кнопки корзины в Header
      init () {
        const block = document.createElement('div')
        block.classList.add('cart')
    
        const btn = document.createElement('div')
        btn.classList.add('cart-btn')
        btn.innerHTML = `<img src="./img/basket.png" alt="" height = "16px" width="16px">
        <p class="cart-btn-sum"></p>`
        btn.addEventListener('click', () => {
          this.toggle()
        })

        const list = document.createElement('div')
        list.classList.add('cart__list')
    
        block.appendChild(btn)
        block.appendChild(list)
    
        const placeToRender = document.querySelector('header')
        if (placeToRender) {
          placeToRender.appendChild(block)
        }
    
        this.render()
      }

      toggle () {
        const list = document.querySelector('.cart__list')
        list.classList.toggle('shown')
      }

      //метод формирования HTML при пустой корзине
      getEmptyBlock () {
        const block = document.createElement('div')
        block.classList.add('cart__empty')
        block.innerText = 'Корзина пуста!'
        return block
      }

      //метод формирования HTML в корзине и в кнопке Корзина
      render () {
        //Формирование HTML в модальном окне списка товаров в корзине  
        const placeCartRender = document.querySelector('.cart__list')
        placeCartRender.innerHTML = ''
        //Формирование HTML подсчет суммы в кнопке корзине
        const placeBtnCartRender = document.querySelector('.cart-btn-sum')
        placeBtnCartRender.innerText = ''
    
        if (!this.items.length) {
          placeCartRender.appendChild(this.getEmptyBlock())
        } else {
          this.items.forEach(tovar => {
            placeCartRender.appendChild(tovar.CreateCartItem())
          })
            placeCartRender.appendChild(this.getSumBlock())
            placeCartRender.appendChild(this.buyButton())
        }
        placeBtnCartRender.appendChild(this.getSumBlock())
      }

      getSumBlock () {
        const sum = this.items.reduce((sum, tovar) => {
             return sum + tovar.cost * tovar.kolvo
        }, 0)
    
        const block = document.createElement('div')
        block.innerHTML = `В корзине товаров на сумму <span> ${sum}</span> `
    
        return block
      }

      buyButton () {
          const block = document.createElement('button')
          block.classList.add('cart-btn-buy')
          block.innerText = `Оформить заказ`

          block.addEventListener('click', () => {
             //По кнопке Оформить заказ очистить корзину
            this.items.forEach(tovar=>{tovar.kolvo=1}) 
            this.items = []
            this.render()
          })
          return block
      }

  }


const TovarList = new CatalogTov()
TovarList.add(new Tovar('Nikon', 100, '1-1.webp'))
TovarList.add(new Tovar('Canon', 120, '2-1.webp'))
TovarList.add(new Tovar('Fuji', 234, '3-1.webp'))
TovarList.add(new Tovar('Sony', 310, '4-1.webp'))

const CartList = new Cart()


TovarList.render()