from rest_framework import serializers

class FoodDonationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    donor_id = serializers.CharField()
    food_type = serializers.CharField()
    quantity = serializers.CharField()
    pickup_address = serializers.CharField()
    expiry_time = serializers.DateTimeField()
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(default='available')
    donor_name = serializers.CharField()
    donor_phone = serializers.CharField()
    preferences = serializers.DictField(required=False)
    
    def validate_status(self, value):
        valid_statuses = ['available', 'claimed', 'expired', 'completed']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of {valid_statuses}")
        return value
