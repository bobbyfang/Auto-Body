from django.contrib import admin

from .models import (
    InventoryQuote,
    InventoryQuoteItem,
    PriceLevel,
    Product,
    ProductLocation,
    ProductPrice,
    ProductSupplierItem,
    PurchaseOrder,
    PurchaseOrderItem,
)
# Register your models here.


class ProductPriceInline(admin.StackedInline):
    model = ProductPrice
    classes = ["collapse"]


class ProductLocationInline(admin.StackedInline):
    model = ProductLocation
    classes = ["collapse"]


class ProductSupplierItemInline(admin.StackedInline):
    model = ProductSupplierItem
    classes = ["collapse"]


class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductPriceInline, ProductSupplierItemInline, ProductLocationInline]
    list_display = ["product_number", "description"]


class PriceLevelAdmin(admin.ModelAdmin):
    list_display = ["level_name", "markdown_percentage"]
    ordering = ["level_name"]


class InventoryQuoteItemInline(admin.StackedInline):
    model = InventoryQuoteItem
    extra = 0


class InventoryQuoteAdmin(admin.ModelAdmin):
    inlines = [InventoryQuoteItemInline]


class PurchaseOrderItemInline(admin.StackedInline):
    model = PurchaseOrderItem
    extra = 0
    readonly_fields = ["subtotal"]


class PurchaseOrderAdmin(admin.ModelAdmin):
    inlines = [PurchaseOrderItemInline]


admin.site.register(Product, ProductAdmin)
admin.site.register(PriceLevel, PriceLevelAdmin)
admin.site.register(InventoryQuote, InventoryQuoteAdmin)
admin.site.register(PurchaseOrder, PurchaseOrderAdmin)
