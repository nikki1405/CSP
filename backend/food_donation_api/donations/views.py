from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from food_donation_api.firebase_config import db
from .serializers import FoodDonationSerializer
import uuid
import logging

logger = logging.getLogger(__name__)

class FoodDonationViewSet(viewsets.ViewSet):
    """
    API endpoint for managing food donations.
    
    list:
    Get a list of all available food donations
    
    create:
    Create a new food donation
    
    retrieve:
    Get details of a specific food donation
    """
    def create(self, request):
        """Create a new food donation listing"""
        logger.info(f"Received food donation creation request with data: {request.data}")
        
        serializer = FoodDonationSerializer(data=request.data)
        if serializer.is_valid():
            logger.info("Data validation successful")
            
            # Generate a unique ID for the donation
            donation_id = str(uuid.uuid4())
            
            # Add timestamps
            donation_data = {
                **serializer.validated_data,
                'id': donation_id,
                'created_at': timezone.now(),
                'status': 'available'
            }
            
            try:
                # Save to Firestore
                doc_ref = db.collection('food_donations').document(donation_id)
                doc_ref.set(donation_data)
                logger.info(f"Food donation created with ID: {donation_id}")
                return Response(donation_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error saving to Firestore: {str(e)}")
                return Response(
                    {"error": "Failed to save donation"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        logger.error(f"Validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        """List all available food donations"""
        try:
            # Query Firestore for available donations
            docs = db.collection('food_donations').where('status', '==', 'available').stream()
            
            donations = []
            for doc in docs:
                donation_data = doc.to_dict()
                donations.append(donation_data)
            
            logger.info(f"Retrieved {len(donations)} available donations")
            return Response(donations)
        except Exception as e:
            logger.error(f"Error retrieving donations: {str(e)}")
            return Response(
                {"error": "Failed to retrieve donations"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        """Get a specific food donation by ID"""
        try:
            doc_ref = db.collection('food_donations').document(pk)
            doc = doc_ref.get()
            
            if doc.exists:
                logger.info(f"Retrieved donation with ID: {pk}")
                return Response(doc.to_dict())
            
            logger.warning(f"Donation not found with ID: {pk}")
            return Response(
                {"error": "Donation not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error retrieving donation: {str(e)}")
            return Response(
                {"error": "Failed to retrieve donation"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def claim(self, request, pk=None):
        """Claim a food donation (for NGOs)"""
        doc_ref = db.collection('food_donations').document(pk)
        doc = doc_ref.get()
        
        if not doc.exists:
            return Response({"error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
            
        donation_data = doc.to_dict()
        if donation_data['status'] != 'available':
            return Response(
                {"error": f"Donation cannot be claimed. Current status: {donation_data['status']}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ngo_id = request.data.get('ngo_id')
        if not ngo_id:
            return Response({"error": "ngo_id is required in request body"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the donation status and add claiming NGO details
        update_data = {
            'status': 'claimed',
            'claimed_by': ngo_id,
            'claimed_at': timezone.now().isoformat(),
        }
        
        doc_ref.update(update_data)
        
        updated_doc = doc_ref.get()
        return Response(updated_doc.to_dict())

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a donation as completed after pickup"""
        doc_ref = db.collection('food_donations').document(pk)
        doc = doc_ref.get()
        
        if not doc.exists:
            return Response({"error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
            
        donation_data = doc.to_dict()
        if donation_data['status'] != 'claimed':
            return Response(
                {"error": "Only claimed donations can be marked as completed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the donation status
        update_data = {
            'status': 'completed',
            'completed_at': timezone.now(),
            'feedback': request.data.get('feedback', '')
        }
        
        doc_ref.update(update_data)
        
        return Response({**donation_data, **update_data})

    def update(self, request, pk=None):
        """Update a food donation listing"""
        serializer = FoodDonationSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            doc_ref = db.collection('food_donations').document(pk)
            doc = doc_ref.get()
            
            if not doc.exists:
                return Response({"error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Update the document
            doc_ref.update(serializer.validated_data)
            
            # Get the updated document
            updated_doc = doc_ref.get()
            return Response(updated_doc.to_dict())
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def my_claims(self, request):
        """List all donations claimed by the current NGO (status='claimed' and claimed_by=ngo_id)"""
        ngo_id = request.query_params.get('ngo_id')
        if not ngo_id:
            return Response({"error": "ngo_id is required as a query parameter"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Use positional arguments for .where() for compatibility
            docs = db.collection('food_donations')\
                .where('status', '==', 'claimed')\
                .where('claimed_by', '==', ngo_id).stream()
            donations = [doc.to_dict() for doc in docs]
            logger.info(f"Retrieved {len(donations)} claimed donations for NGO {ngo_id}")
            return Response(donations)
        except Exception as e:
            logger.error(f"Error retrieving claimed donations: {str(e)}")
            return Response({"error": "Failed to retrieve claimed donations"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
