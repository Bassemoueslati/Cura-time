from rest_framework import serializers
from .models import User, Doctor, Appointment, Specialty
from datetime import datetime
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'adresse', 'gender', 'user_role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Default to CLIENT when user_role is not provided (patient signup)
        role = validated_data.get('user_role', User.UserRole.CLIENT)

        user = User(
            email=validated_data['email'],
            user_role=role,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            adresse=validated_data.get('adresse', ''),
            gender=validated_data.get('gender', '')
        )
        user.set_password(validated_data['password'])

        if role == User.UserRole.ADMIN:
            user.is_superuser = True
            user.is_staff = True

        user.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = User
        fields = ['id', 'user_role', 'is_active', 'is_staff', 'date_joined', 'first_name', 'last_name', 'email', 'adresse', 'gender', 'password']
        read_only_fields = ['id', 'user_role', 'is_active', 'is_staff', 'date_joined']
        extra_kwargs = {
            # Email ne doit pas être requis pour les PATCH partiels
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'adresse': {'required': False},
            'gender': {'required': False},
        }

    def update(self, instance, validated_data):
        # Only update fields present in the request; ignore empty strings to avoid unintended wipes
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            if value in [None, '', 'null', 'None']:
                continue
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'  # All fields including availability

    def validate_availability(self, value):
        # Validate the availability format (keys are dates, values are lists of strings)
        if not isinstance(value, dict):
            raise serializers.ValidationError("Availability must be a dictionary.")

        for date_str, time_slots in value.items():
            try:
                datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                raise serializers.ValidationError(f"Invalid date format for {date_str}. Expected format: YYYY-MM-DD.")

            if not isinstance(time_slots, list):
                raise serializers.ValidationError(f"Time slots for {date_str} should be a list.")
            for time_slot in time_slots:
                if not isinstance(time_slot, str):
                    raise serializers.ValidationError(f"Each time slot for {date_str} should be a string.")

        return value


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name', 'description']


class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    client = UserSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'client', 'date_time', 'status']
        read_only_fields = ['client']

    def validate_date_time(self, value):
        """Ensure the appointment date and time is in the future."""
        if value < timezone.now():
            raise serializers.ValidationError("Appointment date and time must be in the future.")
        return value

    def create(self, validated_data):
        """Automatically associate the authenticated client with the appointment."""
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments with doctor ID"""
    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'date_time', 'status']
        read_only_fields = ['client']

    def validate_date_time(self, value):
        """Ensure the appointment date and time is in the future."""
        if value < timezone.now():
            raise serializers.ValidationError("Appointment date and time must be in the future.")
        return value

    def create(self, validated_data):
        """Automatically associate the authenticated client with the appointment."""
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status']


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
