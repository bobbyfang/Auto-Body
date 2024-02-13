from django.contrib import admin

from .models import Supplier, SupplierContactPerson
# Register your models here.


class ContactPersonInline(admin.StackedInline):
    model = SupplierContactPerson
    classes = ["collapse"]
    extra = 0


class SupplierAdmin(admin.ModelAdmin):
    inlines = [
        ContactPersonInline,
    ]


admin.site.register(Supplier, SupplierAdmin)
