from django.contrib import admin

from .models import User, Specialty, Doctor, Appointment

admin.site.register(User)
admin.site.register(Specialty)
admin.site.register(Doctor)
admin.site.register(Appointment)
