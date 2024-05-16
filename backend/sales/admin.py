from django.contrib import admin


from sales.models import (
    CreditNote,
    CreditNoteItem,
    Invoice,
    InvoiceItem,
    Order,
    OrderItem,
    Quotation,
    QuotationItem,
)
# Register your models here.


class InvoiceItemInline(admin.StackedInline):
    model = InvoiceItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class InvoiceAdmin(admin.ModelAdmin):
    inlines = [
        InvoiceItemInline,
    ]
    readonly_fields = ["invoice_number"]


class OrderItemInline(admin.StackedInline):
    model = OrderItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class OrderAdmin(admin.ModelAdmin):
    inlines = [
        OrderItemInline,
    ]


class QuotationItemInline(admin.StackedInline):
    model = QuotationItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class QuotationAdmin(admin.ModelAdmin):
    inlines = [
        QuotationItemInline,
    ]


class CreditNoteItemInline(admin.StackedInline):
    model = CreditNoteItem
    classes = ["collapse"]
    extra = 0
    readonly_fields = ["price", "vat", "subtotal"]


class CreditNoteAdmin(admin.ModelAdmin):
    inlines = [
        CreditNoteItemInline,
    ]


admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Quotation, QuotationAdmin)
admin.site.register(CreditNote, CreditNoteAdmin)
