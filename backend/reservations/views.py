from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotAuthenticated
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import User, Doctor, Appointment, Specialty
from .serializers import UserSerializer, DoctorSerializer, AppointmentSerializer, AppointmentCreateSerializer, SpecializationSerializer, ForgotPasswordSerializer, VerifyCodeSerializer, AppointmentStatusSerializer, UserUpdateSerializer
from .permissions import IsAdmin, IsClient, IsDoctor
import random
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings


login_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['email', 'password'],
    properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
    },
    example={
        "email": "client@example.com",
        "password": "String"
    }
)

register_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['email', 'password'],  # user_role optional for patient
    properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
        'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='First name'),
        'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Last name'),
        'adresse': openapi.Schema(type=openapi.TYPE_STRING, description='Address'),
        'gender': openapi.Schema(type=openapi.TYPE_STRING, description='Gender'),
        'user_role': openapi.Schema(
            type=openapi.TYPE_STRING,
            description='Role of the user (admin or client). Defaults to client when omitted.',
            default='client',
            enum=['admin', 'client']
        ),
    },
    example={
        'email': 'client@example.com',
        'password': 'StrongPassword123',
        'first_name': 'Client',
        'last_name': 'Example',
        'adresse': '123 Example Street',
        'gender': 'M'
        # user_role omitted -> defaults to client
    }
)
# ---------------------------
# Authentication and Register
# ---------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=register_schema,
        responses={
            201: openapi.Response("User registered successfully", UserSerializer),
            400: "Bad Request",
            500: "Internal Server Error",
        }
    )
    def post(self, request):
        print(f"📝 RegisterView - Données reçues: {request.data}")

        try:
            serializer = UserSerializer(data=request.data)
            print(f"📝 RegisterView - Serializer créé")

            if serializer.is_valid():
                print(f"📝 RegisterView - Données valides")
                user = serializer.save()
                print(f"📝 RegisterView - Utilisateur créé: {user.email}")
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
            else:
                print(f"❌ RegisterView - Erreurs de validation: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"❌ RegisterView - Exception: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': 'Erreur interne du serveur', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ClientLoginView(APIView):
    @swagger_auto_schema(
        request_body=login_schema,
        responses={
            200: openapi.Response("Login success", openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )),
            401: "Invalid credentials"
        }
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if user and user.user_role == 'client':
            refresh = RefreshToken.for_user(user)
            return Response({
                'user_id': user.id,
                'user_role': user.user_role,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'adresse': user.adresse,
                'date_joined': user.date_joined,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=401)

class AdminLoginView(APIView):
    @swagger_auto_schema(
        request_body=login_schema,
        responses={
            200: openapi.Response("Login success", openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )),
            401: "Invalid credentials"
        }
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if user and user.user_role == 'admin':
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_role': user.user_role,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            })
        return Response({'error': 'Invalid credentials'}, status=401)
class DoctorLoginView(APIView):
    @swagger_auto_schema(
        request_body=login_schema,
        responses={
            200: openapi.Response("Login success", openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                    'doctor_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )),
            401: "Invalid credentials"
        }
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user and user.user_role == 'doctor':
            # Block login if account is inactive
            if not user.is_active:
                return Response({'error': 'Compte inactif, contactez l\'administrateur'}, status=403)

            try:
                doctor = Doctor.objects.get(email=user.email)
            except Doctor.DoesNotExist:
                return Response({"error": "No doctor profile associated with this user."}, status=404)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'doctor_id': doctor.id,
                'user_id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'user_role': user.user_role,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'adresse': user.adresse,
                'date_joined': user.date_joined,
            })
        return Response({'error': 'Invalid credentials or not a doctor'}, status=401)
class DoctorAppointmentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        try:
            doctor = Doctor.objects.get(email=self.request.user.email)
            return Appointment.objects.filter(doctor=doctor)
        except Doctor.DoesNotExist:
            return Appointment.objects.none()

# -------------------
# Client Functionality
# -------------------
class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [IsClient]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        # Ensure user only updates their own profile
        return self.request.user

class DoctorListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DoctorDetailView(generics.RetrieveAPIView):
    # Make doctor details public so patients and guests can view profiles
    permission_classes = [AllowAny]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AppointmentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentCreateSerializer

    def perform_create(self, serializer):
        if getattr(self, 'swagger_fake_view', False):
            return Appointment.objects.none()
        if self.request.user.is_authenticated:
            serializer.save(client=self.request.user)
        else:
            raise NotAuthenticated("User must be authenticated to create an appointment.")

class ClientAppointmentListView(generics.ListAPIView):
    permission_classes = [IsClient]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Appointment.objects.none()
        return Appointment.objects.filter(client=self.request.user)

class AppointmentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Appointment.objects.none()
        user = self.request.user
        if user.is_superuser:
            return Appointment.objects.all()
        else:
            return Appointment.objects.filter(client=user)

class DoctorsBySpecialtyView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        specialty_id = self.kwargs['specialty_id']  # utilisez bien le nom en minuscule
        return Doctor.objects.filter(specialization_id=specialty_id)


# --------------------
# Admin Functionality
# --------------------
class DoctorCreateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DoctorUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class ClientAppointmentUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Appointment.objects.none()
        return Appointment.objects.filter(client=self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        serializer = super().get_serializer(*args, **kwargs)
        if 'status' in serializer.fields:
            serializer.fields.pop('status')
        return serializer

class AdminAppointmentStatusUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentStatusSerializer

    def get_queryset(self):
        return Appointment.objects.all()

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        serializer = super().get_serializer(*args, **kwargs)
        allowed_fields = ['status']
        for field in list(serializer.fields):
            if field not in allowed_fields:
                serializer.fields.pop(field)
        return serializer

class AdminAppointmentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Appointment.objects.none()
        return Appointment.objects.all()

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        from django.db.models import Count
        from django.utils import timezone
        from datetime import date

        # Compter les statistiques
        total_doctors = Doctor.objects.count()
        total_patients = User.objects.filter(user_role='client').count()
        total_appointments = Appointment.objects.count()
        total_specialties = Specialty.objects.count()

        # Rendez-vous d'aujourd'hui
        today = date.today()
        # Utiliser le champ correct 'date_time' avec lookup '__date'
        today_appointments = Appointment.objects.filter(date_time__date=today).count()

        # Rendez-vous en attente
        pending_appointments = Appointment.objects.filter(status='pending').count()

        # Rendez-vous terminés
        completed_appointments = Appointment.objects.filter(status='terminé').count()

        # Utilisateurs actifs (connectés dans les 30 derniers jours)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        active_users = User.objects.filter(last_login__gte=thirty_days_ago).count()

        # Données mensuelles des rendez-vous (6 derniers mois)
        from datetime import datetime, timedelta
        import calendar

        monthly_appointments = []
        for i in range(6):
            month_date = datetime.now() - timedelta(days=30*i)
            month_name = calendar.month_name[month_date.month][:3]  # Jan, Feb, etc.
            month_count = Appointment.objects.filter(
                date_time__year=month_date.year,
                date_time__month=month_date.month
            ).count()
            monthly_appointments.insert(0, {
                'month': month_name,
                'count': month_count
            })

        # Statistiques par spécialité
        specialty_stats = []
        specialties = Specialty.objects.all()
        for specialty in specialties:
            doctors_count = Doctor.objects.filter(specialization=specialty).count()
            if doctors_count > 0:
                specialty_stats.append({
                    'specialty': specialty.name,
                    'count': doctors_count
                })

        return Response({
            'totalDoctors': total_doctors,
            'totalPatients': total_patients,
            'totalAppointments': total_appointments,
            'totalSpecialties': total_specialties,
            'todayAppointments': today_appointments,
            'pendingAppointments': pending_appointments,
            'completedAppointments': completed_appointments,
            'activeUsers': active_users,
            'monthlyAppointments': monthly_appointments,
            'specialtyStats': specialty_stats
        })

class AdminDashboardActivitiesView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        # Récupérer les dernières activités (derniers rendez-vous créés)
        recent_appointments = Appointment.objects.select_related('client', 'doctor').order_by('-created_at')[:10]

        activities = []
        for appointment in recent_appointments:
            activities.append({
                'id': appointment.id,
                'type': 'appointment_created',
                'message': f"Nouveau RDV: {appointment.client.first_name} {appointment.client.last_name} avec Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}",
                'date': appointment.created_at,
                'status': appointment.status
            })

        return Response({
            'results': activities
        })

class AdminDoctorsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        # Récupérer tous les médecins avec leurs spécialisations
        doctors = Doctor.objects.all().order_by('first_name', 'last_name')
        print(f"DEBUG: Nombre de médecins trouvés: {doctors.count()}")

        doctors_data = []
        for doctor in doctors:
            try:
                doctor_data = {
                    'id': doctor.id,
                    'first_name': doctor.first_name,
                    'last_name': doctor.last_name,
                    'email': doctor.email,
                    'phone': doctor.phone,
                    'specialization': doctor.specialization.name if doctor.specialization else 'Non spécifié',
                    'is_active': doctor.user.is_active if doctor.user else True,
                    'date_joined': doctor.user.date_joined.isoformat() if doctor.user and doctor.user.date_joined else None,
                    'consultation_fee': doctor.consultation_fee,
                    'bio': doctor.bio
                }
                doctors_data.append(doctor_data)
                print(f"DEBUG: Ajouté Dr. {doctor.first_name} {doctor.last_name}")
            except Exception as e:
                print(f"DEBUG: Erreur avec Dr. {doctor.first_name} {doctor.last_name}: {e}")

        print(f"DEBUG: Nombre de médecins retournés: {len(doctors_data)}")
        return Response(doctors_data)

class AdminDoctorToggleStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)

            # Basculer le statut actif/inactif
            if doctor.user:
                doctor.user.is_active = not doctor.user.is_active
                doctor.user.save()

                status = "activé" if doctor.user.is_active else "désactivé"
                return Response({
                    'message': f'Médecin {status} avec succès',
                    'is_active': doctor.user.is_active
                })
            else:
                return Response({'error': 'Utilisateur associé non trouvé'}, status=404)

        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)

    def post(self, request):
        """Ajouter un nouveau médecin"""
        try:
            data = request.data

            # Vérifier les champs obligatoires
            required_fields = ['first_name', 'last_name', 'email', 'password', 'specialization']
            for field in required_fields:
                if not data.get(field):
                    return Response({'error': f'Le champ {field} est obligatoire'}, status=400)

            # Vérifier si l'email existe déjà
            if User.objects.filter(email=data['email']).exists():
                return Response({'error': 'Un utilisateur avec cet email existe déjà'}, status=400)

            # Récupérer la spécialité
            try:
                specialty = Specialty.objects.get(name=data['specialization'])
            except Specialty.DoesNotExist:
                return Response({'error': 'Spécialité non trouvée'}, status=400)

            # Créer l'utilisateur
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                user_role='doctor'
            )

            # Créer le médecin
            doctor = Doctor.objects.create(
                user=user,
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                phone=data.get('phone', ''),
                specialization=specialty,
                consultation_fee=data.get('consultation_fee', 0),
                bio=data.get('bio', '')
            )

            return Response({
                'message': 'Médecin créé avec succès',
                'doctor': {
                    'id': doctor.id,
                    'first_name': doctor.first_name,
                    'last_name': doctor.last_name,
                    'email': doctor.email,
                    'specialization': doctor.specialization.name,
                    'phone': doctor.phone,
                    'consultation_fee': doctor.consultation_fee,
                    'bio': doctor.bio,
                    'is_active': user.is_active
                }
            }, status=201)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def put(self, request, doctor_id):
        """Modifier un médecin existant"""
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            data = request.data

            # Vérifier les champs obligatoires
            required_fields = ['first_name', 'last_name', 'email', 'specialization']
            for field in required_fields:
                if not data.get(field):
                    return Response({'error': f'Le champ {field} est obligatoire'}, status=400)

            # Vérifier si l'email existe déjà (sauf pour ce médecin)
            if User.objects.filter(email=data['email']).exclude(id=doctor.user.id if doctor.user else None).exists():
                return Response({'error': 'Un utilisateur avec cet email existe déjà'}, status=400)

            # Récupérer la spécialité
            try:
                specialty = Specialty.objects.get(name=data['specialization'])
            except Specialty.DoesNotExist:
                return Response({'error': 'Spécialité non trouvée'}, status=400)

            # Mettre à jour l'utilisateur si il existe
            if doctor.user:
                doctor.user.first_name = data['first_name']
                doctor.user.last_name = data['last_name']
                doctor.user.email = data['email']
                doctor.user.save()

            # Mettre à jour le médecin
            doctor.first_name = data['first_name']
            doctor.last_name = data['last_name']
            doctor.email = data['email']
            doctor.phone = data.get('phone', doctor.phone)
            doctor.specialization = specialty
            doctor.consultation_fee = data.get('consultation_fee', doctor.consultation_fee)
            doctor.bio = data.get('bio', doctor.bio)
            doctor.save()

            return Response({
                'message': 'Médecin modifié avec succès',
                'doctor': {
                    'id': doctor.id,
                    'first_name': doctor.first_name,
                    'last_name': doctor.last_name,
                    'email': doctor.email,
                    'specialization': doctor.specialization.name,
                    'phone': doctor.phone,
                    'consultation_fee': doctor.consultation_fee,
                    'bio': doctor.bio,
                    'is_active': doctor.user.is_active if doctor.user else True
                }
            })

        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class AdminSpecialtiesListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        # Récupérer toutes les spécialités
        specialties = Specialty.objects.all().order_by('name')

        specialties_data = []
        for specialty in specialties:
            # Compter le nombre de médecins par spécialité (utiliser l'ID, pas le nom)
            doctors_count = Doctor.objects.filter(specialization=specialty).count()

            specialties_data.append({
                'id': specialty.id,
                'name': specialty.name,
                'doctors_count': doctors_count
            })

        return Response(specialties_data)

    def post(self, request):
        # Créer une nouvelle spécialité
        name = request.data.get('name')
        if not name:
            return Response({'error': 'Le nom de la spécialité est requis'}, status=400)

        # Vérifier si la spécialité existe déjà
        if Specialty.objects.filter(name=name).exists():
            return Response({'error': 'Cette spécialité existe déjà'}, status=400)

        specialty = Specialty.objects.create(name=name)
        return Response({
            'id': specialty.id,
            'name': specialty.name,
            'doctors_count': 0
        }, status=201)

class AdminSpecialtyDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, specialty_id):
        try:
            specialty = Specialty.objects.get(id=specialty_id)

            # Vérifier s'il y a des médecins avec cette spécialité
            doctors_count = Doctor.objects.filter(specialization=specialty).count()
            if doctors_count > 0:
                return Response({
                    'error': f'Impossible de supprimer cette spécialité. {doctors_count} médecin(s) l\'utilisent encore.'
                }, status=400)

            specialty.delete()
            return Response({'message': 'Spécialité supprimée avec succès'})

        except Specialty.DoesNotExist:
            return Response({'error': 'Spécialité non trouvée'}, status=404)

class DoctorDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        from django.db.models import Count
        from django.utils import timezone
        from datetime import date, timedelta

        # Récupérer le médecin connecté
        try:
            doctor = Doctor.objects.get(email=request.user.email)
        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)

        # Compter les statistiques du médecin
        total_patients = Appointment.objects.filter(doctor=doctor).values('client').distinct().count()

        # Rendez-vous d'aujourd'hui
        today = date.today()
        # Utiliser le champ correct 'date_time' avec lookup '__date'
        today_appointments = Appointment.objects.filter(doctor=doctor, date_time__date=today).count()

        # Rendez-vous de cette semaine
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        week_appointments = Appointment.objects.filter(
            doctor=doctor,
            # Utiliser 'date_time__date__range' pour comparer seulement les dates
            date_time__date__range=[week_start, week_end]
        ).count()

        # Rendez-vous terminés
        completed_appointments = Appointment.objects.filter(
            doctor=doctor,
            status='terminé'
        ).count()

        return Response({
            'totalPatients': total_patients,
            'todayAppointments': today_appointments,
            'weekAppointments': week_appointments,
            'completedAppointments': completed_appointments
        })

class DoctorRecentAppointmentsView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        # Récupérer le médecin connecté
        try:
            doctor = Doctor.objects.get(email=request.user.email)
        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)

        # Récupérer les derniers rendez-vous du médecin
        recent_appointments = Appointment.objects.filter(doctor=doctor).select_related('client').order_by('-created_at')[:10]

        appointments_data = []
        for appointment in recent_appointments:
            appointments_data.append({
                'id': appointment.id,
                'client_name': f"{appointment.client.first_name} {appointment.client.last_name}",
                'date_time': appointment.date_time,
                'status': appointment.status,
                'created_at': appointment.created_at
            })

        return Response({
            'results': appointments_data
        })

class SpecialtyListCreateView(generics.ListCreateAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecializationSerializer
    # Allow listing for anyone; restrict creation to admin
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

class SpecialtyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsAdmin]

class ForgotPasswordAPIView(APIView):
    @swagger_auto_schema(request_body=ForgotPasswordSerializer)
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)

            # Restrict to patients only
            if user.user_role != 'client':
                return Response({"error": "Cette fonctionnalité est réservée aux patients."}, status=status.HTTP_403_FORBIDDEN)

            verification_code = random.randint(1000, 9999)
            support_email = getattr(settings, 'SUPPORT_EMAIL', settings.EMAIL_HOST_USER)
            cache.set(f'verification_code_{email}', verification_code, timeout=300)

            send_mail(
                subject='Code de vérification pour réinitialisation',
                message=f'Votre code de vérification est {verification_code}. Il est valable 5 minutes.',
                from_email='bassemoueslati59@gmail.com',
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({"message": "Code de vérification envoyé à votre email."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Aucun utilisateur avec cet email."}, status=status.HTTP_404_NOT_FOUND)

class VerifyCodeAPIView(APIView):
    @swagger_auto_schema(request_body=VerifyCodeSerializer)
    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']

        cached_code = cache.get(f'verification_code_{email}')
        if not cached_code:
            return Response({"error": "Le code a expiré ou est invalide."}, status=status.HTTP_400_BAD_REQUEST)

        if str(cached_code) != str(code):
            return Response({"error": "Code de vérification invalide."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            # Restrict reset to patients only
            if user.user_role != 'client':
                return Response({"error": "La réinitialisation est réservée aux patients."}, status=status.HTTP_403_FORBIDDEN)
            user.set_password(new_password)
            user.save()
            cache.delete(f'verification_code_{email}')
            return Response({"message": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)

class AdminDoctorsCountView(APIView):
    """Vue simple pour compter les médecins - pour debug"""
    permission_classes = [AllowAny]  # Temporaire pour debug

    def get(self, request):
        doctors_count = Doctor.objects.count()
        users_count = User.objects.filter(user_role='doctor').count()
        specialties_count = Specialty.objects.count()

        return Response({
            'doctors_in_db': doctors_count,
            'doctor_users': users_count,
            'specialties': specialties_count,
            'message': f'Il y a {doctors_count} médecins dans la base de données'
        })

class AdminSpecialtiesForFormsView(APIView):
    """Vue pour récupérer les spécialités pour les formulaires"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        specialties = Specialty.objects.all().order_by('name')
        specialties_data = []

        for specialty in specialties:
            specialties_data.append({
                'id': specialty.id,
                'name': specialty.name
            })

        return Response({
            'specialties': specialties_data,
            'count': len(specialties_data)
        })

class SupportContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        subject = request.data.get('subject', 'Support CuraTime')
        category = request.data.get('category', 'general')
        message = request.data.get('message', '')
        from_email = request.data.get('email', None)

        if not message:
            return Response({'error': 'Le message est requis.'}, status=status.HTTP_400_BAD_REQUEST)

        support_email = getattr(settings, 'SUPPORT_EMAIL', settings.EMAIL_HOST_USER)
        body = f"Catégorie: {category}\nExpéditeur: {from_email or 'anonyme'}\n\n{message}"
        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[support_email],
                fail_silently=False,
            )
            return Response({'message': 'Message envoyé au support.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        from django.utils import timezone
        from django.db.models import Count
        try:
            doctor = Doctor.objects.get(email=request.user.email)
        except Doctor.DoesNotExist:
            return Response({'error': 'Profil médecin introuvable'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.localdate()
        start_week = today - timezone.timedelta(days=today.weekday())
        end_week = start_week + timezone.timedelta(days=6)

        # Total distinct patients
        total_patients = User.objects.filter(
            client_appointments__doctor=doctor
        ).distinct().count()

        # Today appointments
        today_appointments = Appointment.objects.filter(
            doctor=doctor,
            date_time__date=today
        ).count()

        # Week appointments
        week_appointments = Appointment.objects.filter(
            doctor=doctor,
            date_time__date__gte=start_week,
            date_time__date__lte=end_week
        ).count()

        # Completed appointments
        completed_appointments = Appointment.objects.filter(
            doctor=doctor,
            status='terminé'
        ).count()

        return Response({
            'totalPatients': total_patients,
            'todayAppointments': today_appointments,
            'weekAppointments': week_appointments,
            'completedAppointments': completed_appointments,
        })

class DoctorRecentAppointmentsView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            doctor = Doctor.objects.get(email=request.user.email)
        except Doctor.DoesNotExist:
            return Response({'results': []})

        qs = Appointment.objects.filter(doctor=doctor).order_by('-date_time')[:10]
        results = []
        for a in qs:
            results.append({
                'patient_name': f"{a.client.first_name} {a.client.last_name}".strip() or a.client.email,
                'time': a.date_time.astimezone().strftime('%H:%M'),
                'reason': 'Consultation',
                'status': a.status,
                'date': a.date_time.astimezone().strftime('%Y-%m-%d'),
            })
        return Response({'results': results})

class DoctorMeView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        try:
            doctor = Doctor.objects.get(email=request.user.email)
            return Response({
                'user': UserUpdateSerializer(request.user).data,
                'doctor': DoctorSerializer(doctor).data
            })
        except Doctor.DoesNotExist:
            return Response({'error': 'Profil médecin introuvable'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        # Update either user fields or doctor's own fields (including availability) safely
        try:
            doctor = Doctor.objects.get(email=request.user.email)
        except Doctor.DoesNotExist:
            return Response({'error': 'Profil médecin introuvable'}, status=status.HTTP_404_NOT_FOUND)

        # Extract only allowed user fields for the user serializer, ignore others like 'availability'
        allowed_user_fields = ['first_name', 'last_name', 'email', 'password', 'adresse', 'gender']
        user_data = {k: v for k, v in request.data.items() if k in allowed_user_fields}

        availability = request.data.get('availability', None)

        if availability is not None:
            # Accept either a dict { "YYYY-MM-DD": ["HH:MM", ...] } or a list of items { date, times|slots }
            if isinstance(availability, list):
                transformed = {}
                for item in availability:
                    date_str = item.get('date') if isinstance(item, dict) else None
                    times = (item.get('times') if isinstance(item, dict) else None) or (item.get('slots') if isinstance(item, dict) else None) or []
                    if not date_str or not isinstance(times, list):
                        return Response({'error': "Chaque élément doit contenir 'date' et 'times' (liste)."}, status=status.HTTP_400_BAD_REQUEST)
                    # Validate date format
                    try:
                        from datetime import datetime as _dt
                        _dt.strptime(date_str, "%Y-%m-%d")
                    except Exception:
                        return Response({'error': f"Date invalide: {date_str}. Format attendu YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
                    # Validate times format
                    if not all(isinstance(t, str) and len(t) >= 4 for t in times):
                        return Response({'error': f"Créneaux invalides pour {date_str}. Utilisez 'HH:MM'."}, status=status.HTTP_400_BAD_REQUEST)
                    transformed[date_str] = times
                availability = transformed
            elif not isinstance(availability, dict):
                return Response({'error': "availability doit être un objet JSON ou une liste d'objets {date, times}."}, status=status.HTTP_400_BAD_REQUEST)

            for date_str, times in availability.items():
                if not isinstance(times, list) or not all(isinstance(t, str) and len(t) >= 4 for t in times):
                    return Response({'error': f"Format invalide pour {date_str}"}, status=status.HTTP_400_BAD_REQUEST)
            doctor.availability = availability

        # Update doctor simple fields if provided (handle decimals safely)
        for field in ['phone', 'address', 'city', 'state', 'zip_code', 'bio']:
            if field in request.data:
                setattr(doctor, field, request.data[field])

        # Handle consultation_fee specifically (may be '', null, or a number)
        if 'consultation_fee' in request.data:
            val = request.data.get('consultation_fee')
            if val in [None, '', 'null', 'None']:
                doctor.consultation_fee = None
            else:
                try:
                    from decimal import Decimal
                    doctor.consultation_fee = Decimal(str(val))
                except Exception:
                    return Response({'error': "consultation_fee doit être un nombre décimal."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and save user only if user fields are provided
        if user_data:
            user_serializer = UserUpdateSerializer(request.user, data=user_data, partial=True)
            if not user_serializer.is_valid():
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            user_serializer.save()
            user_payload = user_serializer.data
        else:
            # No user updates requested, but keep a consistent response
            user_payload = UserUpdateSerializer(request.user).data

        # Guard: force consultation_fee to None when empty string sneaks in
        if doctor.consultation_fee in ["", " "]:
            doctor.consultation_fee = None

        doctor.save()
        return Response({
            'message': 'Profil mis à jour',
            'user': user_payload,
            'doctor': DoctorSerializer(doctor).data
        })