from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'status', 'total_amount', 'created_at']
    list_filter = ['status']
    inlines = [OrderItemInline]
