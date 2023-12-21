from django.contrib import admin
from .models import Customer, ContactPerson

# Register your models here.


class ContactPersonInline(admin.StackedInline):
    model = ContactPerson
    classes = ["collapse"]
    extra = 0


class CustomerAdmin(admin.ModelAdmin):
    inlines = [
        ContactPersonInline,
    ]
    # list_display = ('customer_')


# admin.site.register(ContactPerson)
admin.site.register(Customer, CustomerAdmin)
