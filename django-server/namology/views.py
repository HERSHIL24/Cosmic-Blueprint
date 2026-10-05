from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from cosmic_core.proxy import proxy_to_node


class NamologyAnalyzeView(APIView):
    """
    POST /api/namology/analyze/
    Analyze a name — phonetic Rashi matching, vibrational analysis, and recommendations.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        if not name:
            return Response({'error': 'name is required'}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'name': name,
            'userId': str(request.user.id) if request.user.is_authenticated else None,
        }
        data, status_code = proxy_to_node('/api/namology/analyze', method='POST', data=payload)
        return Response(data, status=status_code)


class NamologyCorrectView(APIView):
    """
    POST /api/namology/correct/
    Suggest name corrections to match a target numerology number.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        target_number = request.data.get('targetNumber')
        if not name or not target_number:
            return Response(
                {'error': 'name and targetNumber are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        payload = {'name': name, 'targetNumber': int(target_number)}
        data, status_code = proxy_to_node('/api/namology/correct', method='POST', data=payload)
        return Response(data, status=status_code)


class NamologyHistoryView(APIView):
    """
    GET /api/namology/history/
    Get name analysis history for the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user.id)
        data, status_code = proxy_to_node(f'/api/namology/history/{user_id}', method='GET')
        return Response(data, status=status_code)
