import {
  Component,
  inject,
  //signal,
  //OnInit,
  input,
  //computed,
  linkedSignal,
  effect,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
//import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
//import { Meta, Title } from '@angular/platform-browser';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { MetaTagsService } from '@shared/services/meta-tags.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();
  //$product = signal<Product | null>(null);
  productRs = rxResource({
    request: () => ({
      slug: this.slug(),
    }),
    loader: ({ request }) => {
      return this.productService.getOneBySlug(request.slug);
    },
  });

  $cover = linkedSignal({
    source: this.productRs.value,
    computation: (product, previousValue) => {
      if (product && product.images.length > 0) {
        return product.images[0];
      }
      return previousValue?.value;
    },
  });
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private metaTagsService = inject(MetaTagsService);

  constructor() {
    effect(() => {
      const product = this.productRs.value();
      if (product) {
        this.metaTagsService.updateMetaTags({
          title: product.title,
          description: product.description,
          image: product.images[0],
          url: `${environment.domain}/product/${product.slug}`,
        });
      }
    });
  }

  /* ngOnInit() {
    const slug = this.slug();
    if (slug) {
      this.productService.getOne({ product_slug: slug }).subscribe({
        next: product => {
          this.$product.set(product);
        },
      });
    }
  } */

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    //const product = this.$product();
    const product = this.productRs.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
