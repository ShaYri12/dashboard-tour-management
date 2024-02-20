import React from 'react';
import { toast } from 'react-toastify';

const updateData = async (url, propertyName, propertyValue) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ [propertyName]: propertyValue }),
    });

    const result = await response.json();
    

    if (!response.ok) {
      toast.error(result.message || 'Failed to update.');
      return;
    }

    toast.success('Successfully Updated.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    toast.error('Error during updating.');
    console.error(err);
  }
};

export default updateData;
