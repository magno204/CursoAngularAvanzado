import {
  Component,
  inject,
  //signal,
  //OnInit,
  //OnChanges,
  input,
  resource,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
//import { Category } from '@shared/models/category.model';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug = input<string>();

  //products = signal<Product[]>([]);

  /* $categories = toSignal(this.categoryService.getAll(), {
    initialValue: [],
  }); */

  categoriesResource = resource({
    loader: () => this.categoryService.getAllPromise(),
  });

  productsResource = rxResource({
    request: () => ({ category_slug: this.slug() }),
    loader: ({ request }) => this.productService.getProducts(request),
  });

  /* ngOnInit() {
    this.getCategories();
  } */

  /* ngOnChanges() {
    this.getProducts();
  } */

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  /* private getProducts() {
    this.productService.getProducts({ category_slug: this.slug() }).subscribe({
      next: products => {
        this.products.set(products);
      },
      error: () => {
        console.error('Error al obtener productos');
      },
    });
  } */

  resetCategories() {
    this.categoriesResource.set([]);
  }

  reloadCategories() {
    this.categoriesResource.reload();
  }

  /* private getCategories() {
    this.categoryService.getAll().subscribe({
      next: data => {
        this.categories.set(data);
      },
      error: () => {
        console.error('Error al obtener categorías');
      },
    });
  } */

  reloadProducts() {
    this.productsResource.reload();
  }
}
