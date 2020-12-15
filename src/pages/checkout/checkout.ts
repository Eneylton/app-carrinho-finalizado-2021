import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { ServiceProvider } from '../../providers/service/service';


@IonicPage({})
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
   
  total:any;
  nome:string = "";
  id:any;
  valor:any;
  produtos_id:any;
  qtd:any;
  items: Array<any> = [];
  produtos: any = [];
  qtd_produto:number=0;

  constructor(public navCtrl: NavController, 
              private serve: ServiceProvider,
              public alertCtrl: AlertController,
              public navParams: NavParams, public cart: CartProvider) {
  }


  ngOnInit(): void {

    this.total = this.cart.total;
  
    this.cart.items.forEach(item => {
        this.nome = item.nome;
        this.valor  = Number(item.valor);
    });

    this.listarProdutos();

  }

  listarProdutos() {

    let body = {

      crud: 'listar-produtos-atualizar'
    }

    this.serve.postData(body, 'produtos.php').subscribe((data: any) => {

      for (let i = 0; i < data.result.length; i++) {
        
        this.produtos.push({

          id: data.result[i]["id"],
          estoque: data.result[i]["estoque"]

        })

        this.qtd_produto = data.result[i]["estoque"];

      }

    })


  }


  finalizar(){
    this.cart.items.forEach(item => {
      let body2 = {
       
        produtos_id: item.id,
        estoque:  Number(this.qtd_produto) - Number(item.qtd),
        crud: 'atualizar-produtos'
      };
  
      this.serve.postData(body2, 'produtos.php').subscribe(data => {
  
      });

    let body = {
    
      produtos_id:  item.id,
      nome:  item.nome,
      qtd:  item.qtd,
      valor: Number(item.valor),
      crud: 'add-item'
    };

    this.serve.postData(body, 'produtos.php').subscribe(data => {

    });
    
  })
  this.showInsertOk();
  }


  
  showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Seu pedido foi enviado com sucesso !!!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Sucesso',
          handler: () => {
            
            this.navCtrl.setRoot('HomePage')
          }
        }
      ]
    });
    alert.present();
  }



}
