from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('products/', views.ProductListView.as_view(), name='products'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('cart/', views.cart_detail, name='cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/item/<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('cart/item/<int:item_id>/remove/', views.remove_cart_item, name='remove-cart-item'),
    path('orders/', views.create_order, name='create-order'),
    path('orders/<int:order_id>/', views.order_detail, name='order-detail'),
]
