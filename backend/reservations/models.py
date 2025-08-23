from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('user_role', User.UserRole.ADMIN)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class UserRole(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        CLIENT = 'client', _('Client')
        DOCTOR = 'doctor', _('Doctor')

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    user_role = models.CharField(
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.CLIENT
    )
    adresse = models.TextField(blank=True)
    gender = models.CharField(max_length=10, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)

    specialization = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name='doctors')
    availability = models.JSONField(default=dict)

    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='doctors/', blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.specialization}"

    class Meta:
        ordering = ['last_name', 'first_name']
        verbose_name = "Doctor"
        verbose_name_plural = "Doctors"


class Appointment(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor_appointments')
    date_time = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('terminé', 'Terminé'),
            ('confirmé', 'Confirmé'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.email} - Dr. {self.doctor.last_name} on {self.date_time}"