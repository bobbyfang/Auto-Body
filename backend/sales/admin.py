from django.contrib import admin


from sales.models import Invoice, InvoiceItem, Order, OrderItem, Quotation, QuotationItem
# Register your models here.


class InvoiceItemInline(admin.StackedInline):
    model = InvoiceItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class InvoiceAdmin(admin.ModelAdmin):
    inlines = [InvoiceItemInline,]


class OrderItemInline(admin.StackedInline):
    model = OrderItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline,]


class QuotationItemInline(admin.StackedInline):
    model = QuotationItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class QuotationAdmin(admin.ModelAdmin):
    inlines = [QuotationItemInline,]


admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Quotation, QuotationAdmin)
