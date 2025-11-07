"""
JWT Authentication for DisasterWatch
"""
import jwt
import json
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
        
        if not token:
            return None
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # Return a simple object with user info since we're using CustomUser
            user_info = type('User', (), {
                'id': payload.get('user_id'),
                'username': payload.get('username')
            })()
            return (user_info, token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except (jwt.DecodeError, KeyError):
            raise AuthenticationFailed('Invalid token')


def generate_jwt_token(user):
    """Generate JWT token for CustomUser"""
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token
