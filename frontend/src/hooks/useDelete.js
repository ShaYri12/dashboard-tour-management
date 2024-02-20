import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

  const deleteData = async (url) => {
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete data.`);
      }

      const result = await res.json();
      toast.info(result.message);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    } catch (err) {
      toast.error(err.message);
    }
  };


export default deleteData;
