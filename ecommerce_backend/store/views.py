import uuid
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import (CategorySerializer, ProductSerializer, CartSerializer,
                           CartItemSerializer, OrderSerializer, OrderCreateSerializer)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        featured = self.request.query_params.get('featured')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if featured:
            queryset = queryset.filter(is_featured=True)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'


def get_or_create_cart(request):
    session_key = request.COOKIES.get('cart_session') or request.headers.get('X-Cart-Session')
    if not session_key:
        session_key = str(uuid.uuid4())
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart, session_key


@api_view(['GET'])
def cart_detail(request):
    cart, session_key = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    response = Response({**serializer.data, 'session_key': session_key})
    response.set_cookie('cart_session', session_key, max_age=86400*30)
    return response


@api_view(['POST'])
def add_to_cart(request):
    cart, session_key = get_or_create_cart(request)
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()

    serializer = CartSerializer(cart)
    response = Response({**serializer.data, 'session_key': session_key})
    response.set_cookie('cart_session', session_key, max_age=86400*30)
    return response


@api_view(['PUT'])
def update_cart_item(request, item_id):
    cart, session_key = get_or_create_cart(request)
    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=404)

    quantity = int(request.data.get('quantity', 1))
    if quantity <= 0:
        item.delete()
    else:
        item.quantity = quantity
        item.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['DELETE'])
def remove_cart_item(request, item_id):
    cart, session_key = get_or_create_cart(request)
    CartItem.objects.filter(id=item_id, cart=cart).delete()
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
def create_order(request):
    cart, session_key = get_or_create_cart(request)

    if not cart.items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    order = serializer.save(total_amount=cart.total)

    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_name=cart_item.product.name,
            price=cart_item.product.effective_price,
            quantity=cart_item.quantity,
        )

    cart.items.all().delete()

    return Response(OrderSerializer(order).data, status=201)


@api_view(['GET'])
def order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    return Response(OrderSerializer(order).data)
