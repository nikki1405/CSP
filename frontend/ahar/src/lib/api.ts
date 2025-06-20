import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Add request/response interceptors for debugging
axios.interceptors.request.use(request => {
  console.log('API Request:', request.method?.toUpperCase(), request.url, request.data);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('API Response:', response.status, response.data);
  return response;
});

export type DonationStatus = 'available' | 'claimed' | 'expired' | 'completed';

export interface DonationData {
  id: string;
  food_type: string;
  quantity: string;
  description: string;
  pickup_address: string;
  expiry_time: string;
  donor_name: string;
  donor_id: string;
  donor_phone: string;
  status: DonationStatus;
  preferences?: {
    special_instructions?: string;
  };
}

export const donationApi = {
  async postFood(foodData: any) {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations/`, foodData);
      console.log('Post food success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Post food error:', error);
      throw error.response?.data || error.message;
    }
  },

  async deleteFood(id: string) {
    try {
      // First get current donation
      const getCurrentResponse = await axios.get(`${API_BASE_URL}/donations/${id}/`);
      const currentDonation = getCurrentResponse.data as DonationData;
      console.log('Current donation:', currentDonation);

      // Prepare update data with all required fields
      const updateData: Omit<DonationData, 'id'> = {
        food_type: currentDonation.food_type,
        quantity: currentDonation.quantity,
        description: currentDonation.description,
        pickup_address: currentDonation.pickup_address,
        expiry_time: currentDonation.expiry_time,
        donor_name: currentDonation.donor_name,
        donor_id: currentDonation.donor_id,
        donor_phone: currentDonation.donor_phone,
        status: 'expired'
      };

      console.log('Sending update:', updateData);

      // Send PUT request with all data
      const updateResponse = await axios.put(
        `${API_BASE_URL}/donations/${id}/`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', updateResponse);

      if (updateResponse.status === 200 || updateResponse.status === 204) {
        return true;
      }

      throw new Error('Failed to update donation status');
    } catch (error: any) {
      console.error('Delete food error:', error);

      if (error.response?.status === 404) {
        throw new Error('Donation not found');
      }

      if (error.response?.status === 400) {
        const errorDetails = error.response.data;
        console.log('Validation errors:', errorDetails);
        throw new Error(typeof errorDetails === 'object' 
          ? Object.values(errorDetails).flat().join(', ')
          : errorDetails?.detail || 'Invalid data');
      }

      if (error.response?.status === 405) {
        throw new Error('Operation not allowed. Please try again later.');
      }

      throw new Error(error.response?.data?.detail || 'Failed to update donation');
    }
  },

  async listDonations() {
    try {
      const response = await axios.get<DonationData[]>(`${API_BASE_URL}/donations/`);
      return response.data;
    } catch (error: any) {
      console.error('List donations error:', error);
      throw error.response?.data || error.message;
    }
  },

  async getDonation(id: string) {
    try {
      const response = await axios.get<DonationData>(`${API_BASE_URL}/donations/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error('Get donation error:', error);
      throw error.response?.data || error.message;
    }
  },

  async updateFood(id: string, foodData: Partial<DonationData>) {
    try {
      const getCurrentResponse = await axios.get<DonationData>(`${API_BASE_URL}/donations/${id}/`);
      const currentDonation = getCurrentResponse.data;

      // Merge current data with updates but keep status
      const updateData: Omit<DonationData, 'id'> = {
        ...currentDonation,
        ...foodData,
        status: currentDonation.status // Preserve current status
      };

      const response = await axios.put<DonationData>(`${API_BASE_URL}/donations/${id}/`, updateData);
      console.log('Update food success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update food error:', error);
      throw error.response?.data || error.message;
    }
  }
};
